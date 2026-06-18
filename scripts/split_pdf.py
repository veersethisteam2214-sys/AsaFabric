"""Split a multi-page PDF (e.g. a scanned book) into one image per page.

Vision models read best one page per request (no cross-entry number bleed), so
this rasterizes each PDF page to a high-res image that drops straight into the
rest of the pipeline (extract.py / review_app.py).

    python scripts/split_pdf.py scanned_book.pdf           # -> photos/page_001.png ...
    python scripts/split_pdf.py book.pdf --out photos --dpi 300
    python scripts/split_pdf.py more.pdf --start 51        # continue numbering from 51

PNG (lossless) is the default and best for handwriting — JPEG compression
artifacts can cost you accuracy. Use --dpi 300-400 for crisp handwriting.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import config


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("pdf", help="path to the multi-page PDF")
    ap.add_argument("--out", default=str(config.PHOTOS_DIR), help="output folder (default: photos/)")
    ap.add_argument("--dpi", type=int, default=300, help="render resolution (300-400 recommended)")
    ap.add_argument("--prefix", default="page_")
    ap.add_argument("--format", default="png", choices=["png", "jpg"])
    ap.add_argument("--start", type=int, default=1, help="number to start page numbering from")
    args = ap.parse_args()

    import fitz  # PyMuPDF — pip install pymupdf

    pdf_path = Path(args.pdf)
    if not pdf_path.exists():
        sys.exit(f"PDF not found: {pdf_path}")

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(pdf_path)
    n = doc.page_count
    width = max(3, len(str(args.start + n - 1)))
    print(f"{pdf_path.name}: {n} page(s) -> {out}/ at {args.dpi} DPI ({args.format})")
    for i, page in enumerate(doc):
        num = args.start + i
        pix = page.get_pixmap(dpi=args.dpi)
        name = f"{args.prefix}{num:0{width}d}.{args.format}"
        pix.save(out / name)
        print(f"  {name}  ({pix.width}x{pix.height}px)")
    doc.close()
    print(f"Done — {n} page image(s). Next: `python scripts/extract.py` or `streamlit run scripts/review_app.py`.")


if __name__ == "__main__":
    main()
