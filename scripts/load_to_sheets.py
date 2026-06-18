"""Push the pipeline CSV to the master Google Sheet, formatted.

Maps the CSV to the presentation columns (models.SHEET_COLUMNS), resolves each
page's image to a clickable HYPERLINK from the Drive folder, writes the whole
table in one batched update, then applies formatting (format_sheet).

  python scripts/load_to_sheets.py --in data/merged.csv
"""
from __future__ import annotations

import argparse
import csv
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import config
import format_sheet
import google_io
import models


def _image_formula(page: str, links: dict) -> str:
    for name, link in links.items():
        if Path(name).stem == page or name.startswith(page):
            safe = link.replace('"', "%22")
            return f'=HYPERLINK("{safe}","view")'
    return ""


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="inp", default=str(config.MERGED_CSV))
    args = ap.parse_args()

    if not config.GOOGLE_SHEET_ID:
        sys.exit("Set GOOGLE_SHEET_ID in .env (run setup_google.py).")

    with Path(args.inp).open() as f:
        rows = list(csv.DictReader(f))
    if not rows:
        sys.exit(f"No rows in {args.inp}. Run diff.py first.")

    links = {}
    if config.GOOGLE_DRIVE_FOLDER_ID:
        try:
            links = google_io.folder_image_links(config.GOOGLE_DRIVE_FOLDER_ID)
        except Exception as exc:
            print(f"(warn) couldn't list Drive folder for image links: {exc}")

    header = models.SHEET_COLUMNS
    values = [header]
    for r in rows:
        page = r.get("page", r.get("page_ref", ""))
        img = _image_formula(page, links)
        values.append([(img if c == "image" else str(r.get(c, ""))) for c in header])

    ws = google_io.open_worksheet()
    ws.clear()
    ws.update(values=values, range_name="A1", value_input_option="USER_ENTERED")
    format_sheet.format_inventory(ws, n_rows=len(values))
    print(f"Wrote {len(values) - 1} rows to '{config.GOOGLE_WORKSHEET}' and formatted it.")


if __name__ == "__main__":
    main()
