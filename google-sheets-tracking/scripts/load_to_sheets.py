"""Push the assembled CSV to the master Google Sheet, then format it.

Writes exactly the presentation columns (models.SHEET_COLUMNS), in order, with
USER_ENTERED so HYPERLINK formulas (the `image` column) and numbers parse. The
CSV is produced by the page-reading step (assembled with image links + flags).

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


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="inp", default=str(config.MERGED_CSV))
    args = ap.parse_args()

    if not config.GOOGLE_SHEET_ID:
        sys.exit("Set GOOGLE_SHEET_ID in .env (run setup_google.py).")

    with Path(args.inp).open() as f:
        rows = list(csv.DictReader(f))
    if not rows:
        sys.exit(f"No rows in {args.inp}.")

    header = models.SHEET_COLUMNS
    values = [header] + [[str(r.get(c, "")) for c in header] for r in rows]

    ws = google_io.open_worksheet()
    ws.clear()
    ws.update(values=values, range_name="A1", value_input_option="USER_ENTERED")
    format_sheet.format_inventory(ws, n_rows=len(values))
    print(f"Wrote {len(values) - 1} rows to '{config.GOOGLE_WORKSHEET}' and formatted it.")


if __name__ == "__main__":
    main()
