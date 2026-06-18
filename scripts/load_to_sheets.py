"""Phase 1, step 4: push a CSV (merged or deduped) to a Google Sheet.

Setup once:
  1. Create a Google Cloud service account, enable the Sheets API, download its
     JSON key to ./service-account.json (gitignored).
  2. Create the target Sheet, put its id in GOOGLE_SHEET_ID (.env).
  3. SHARE the Sheet with the service-account email (…@….iam.gserviceaccount.com).

Writes the whole table in ONE batched update (never cell-by-cell — the Sheets
API caps ~300 writes/min).

  python scripts/load_to_sheets.py --in data/deduped.csv
"""
from __future__ import annotations

import argparse
import csv
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import config


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="inp", default=str(config.DEDUPED_CSV))
    ap.add_argument("--worksheet", default=config.GOOGLE_WORKSHEET)
    args = ap.parse_args()

    if not config.GOOGLE_SHEET_ID:
        sys.exit("Set GOOGLE_SHEET_ID in .env and share the Sheet with the service-account email.")

    import gspread  # pip install gspread

    with Path(args.inp).open() as f:
        rows = list(csv.reader(f))
    if not rows:
        sys.exit(f"No rows in {args.inp}.")

    gc = gspread.service_account(filename=config.GOOGLE_SA_JSON)
    sh = gc.open_by_key(config.GOOGLE_SHEET_ID)
    try:
        ws = sh.worksheet(args.worksheet)
    except gspread.WorksheetNotFound:
        ws = sh.add_worksheet(title=args.worksheet, rows=max(1000, len(rows) + 50), cols=20)

    ws.clear()
    # gspread v6: update(values, range_name). Confirm signature for your installed
    # version if this errors (older versions take range_name first).
    ws.update(values=rows, range_name="A1")
    print(f"Wrote {len(rows) - 1} data rows to worksheet '{args.worksheet}'.")


if __name__ == "__main__":
    main()
