"""Bulk-read the per-page PDFs via Gemini -> data/raw/<stem>.gemini.json.

Resumable (skips pages already read) and throttled for the Gemini free-tier
rate limit. This is the local/bulk equivalent of the in-sheet 'Scan' button;
run it once to populate, then build_workbook.py assembles the Sheet.

    python scripts/scan_gemini.py
"""
from __future__ import annotations

import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import config
import gemini

SRC = config.ROOT / "drive_upload"


def main() -> None:
    if not config.GEMINI_API_KEY:
        sys.exit("Set GEMINI_API_KEY in .env.")
    config.RAW_DIR.mkdir(parents=True, exist_ok=True)
    pdfs = sorted(SRC.glob("Page *.pdf"))
    if not pdfs:
        sys.exit(f"No 'Page NN.pdf' files in {SRC}.")

    done = 0
    for p in pdfs:
        out = config.RAW_DIR / f"{p.stem}.gemini.json"
        if out.exists():
            print(f"skip {p.stem} (done)")
            continue
        try:
            data = gemini.read_pdf(p)
            out.write_text(json.dumps(data, ensure_ascii=False, indent=2))
            rows = data.get("rows", [])
            low = sum(1 for r in rows if str(r.get("confidence", "")).lower() == "low")
            print(f"{p.stem}: {len(rows)} rows ({low} low-confidence)")
            done += 1
        except Exception as exc:
            print(f"ERROR {p.stem}: {exc}")
        time.sleep(4)  # throttle for free-tier RPM
    print(f"\nRead {done} new page(s). JSON in {config.RAW_DIR}.")


if __name__ == "__main__":
    main()
