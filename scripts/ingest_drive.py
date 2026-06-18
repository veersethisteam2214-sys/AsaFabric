"""Pull source files from the Drive folder into local photos/ for processing.

You drop the book into the Drive folder (a PDF, or page photos). This downloads
them: PDFs are split into per-page images, image files are copied as-is. The
robot only READS Drive (no upload), so Drive stays the source of truth and the
page images that the pipeline reads live locally in photos/.

    python scripts/ingest_drive.py            # pull everything new
    python scripts/ingest_drive.py --dpi 400  # higher-res PDF rendering
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import config
import google_io


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dpi", type=int, default=300)
    args = ap.parse_args()

    if not config.GOOGLE_DRIVE_FOLDER_ID:
        sys.exit("Set GOOGLE_DRIVE_FOLDER_ID in .env (run setup_google.py).")

    files = google_io.list_folder_files(config.GOOGLE_DRIVE_FOLDER_ID)
    if not files:
        sys.exit("Drive folder is empty — upload the book PDF or page photos first.")

    config.PHOTOS_DIR.mkdir(parents=True, exist_ok=True)
    pdfs = [f for f in files if f["name"].lower().endswith(".pdf") or f["mimeType"] == "application/pdf"]
    imgs = [f for f in files if f["mimeType"].startswith("image/")]
    print(f"Drive folder: {len(pdfs)} PDF(s), {len(imgs)} image(s).")

    pulled = 0
    for f in imgs:
        dest = config.PHOTOS_DIR / f["name"]
        if dest.exists():
            print(f"  skip {dest.name} (already local)")
            continue
        google_io.download_file(f["id"], dest)
        pulled += 1
        print(f"  image -> {dest.name}")

    if pdfs:
        import fitz  # PyMuPDF

        tmp = config.ROOT / "data" / "pdf_tmp"
        tmp.mkdir(parents=True, exist_ok=True)
        for f in pdfs:
            local = tmp / f["name"]
            google_io.download_file(f["id"], local)
            doc = fitz.open(local)
            stem = Path(f["name"]).stem.replace(" ", "_")
            width = max(3, len(str(doc.page_count)))
            for i, page in enumerate(doc, start=1):
                name = f"{stem}_p{i:0{width}d}.png"
                dest = config.PHOTOS_DIR / name
                if dest.exists():
                    continue
                page.get_pixmap(dpi=args.dpi).save(dest)
                pulled += 1
                print(f"  {f['name']} p{i} -> {name}")
            doc.close()

    print(f"\nPulled {pulled} new page image(s) into {config.PHOTOS_DIR}.")
    print("Next: I read each page (Claude) -> diff.py -> load_to_sheets.py.")


if __name__ == "__main__":
    main()
