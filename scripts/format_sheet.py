"""Apply 'proper' formatting to the master inventory worksheet.

Freeze + style the header, set column widths, turn `verified`/`needs_review`
into checkboxes, amber-highlight rows flagged for review, and enable a basic
filter (so you can filter/sort by `page`). Idempotent enough to re-run.

    python scripts/format_sheet.py
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import config
import google_io
import models

COLS = models.SHEET_COLUMNS


def _col(name: str) -> int:
    return COLS.index(name)


def _col_letter(i: int) -> str:
    s, i = "", i + 1
    while i:
        i, r = divmod(i - 1, 26)
        s = chr(65 + r) + s
    return s


def format_inventory(ws=None, n_rows: int | None = None) -> None:
    if ws is None:
        ws = google_io.open_worksheet()
    sheet_id = ws.id
    ncols = len(COLS)
    if n_rows is None:
        n_rows = len(ws.get_all_values()) or 1
    last = max(n_rows, 2)

    review_c, verified_c = _col("needs_review"), _col("verified")

    requests = [
        # freeze the header row
        {"updateSheetProperties": {
            "properties": {"sheetId": sheet_id, "gridProperties": {"frozenRowCount": 1}},
            "fields": "gridProperties.frozenRowCount"}},
        # bold white header on dark fill, centered
        {"repeatCell": {
            "range": {"sheetId": sheet_id, "startRowIndex": 0, "endRowIndex": 1},
            "cell": {"userEnteredFormat": {
                "backgroundColor": {"red": 0.12, "green": 0.14, "blue": 0.18},
                "horizontalAlignment": "CENTER",
                "textFormat": {"bold": True, "foregroundColor": {"red": 1, "green": 1, "blue": 1}}}},
            "fields": "userEnteredFormat(backgroundColor,horizontalAlignment,textFormat)"}},
        # checkboxes for needs_review and verified
        {"setDataValidation": {
            "range": {"sheetId": sheet_id, "startRowIndex": 1, "endRowIndex": last,
                      "startColumnIndex": review_c, "endColumnIndex": review_c + 1},
            "rule": {"condition": {"type": "BOOLEAN"}}}},
        {"setDataValidation": {
            "range": {"sheetId": sheet_id, "startRowIndex": 1, "endRowIndex": last,
                      "startColumnIndex": verified_c, "endColumnIndex": verified_c + 1},
            "rule": {"condition": {"type": "BOOLEAN"}}}},
        # basic filter across the whole table (filter/sort by page, etc.)
        {"setBasicFilter": {"filter": {"range": {
            "sheetId": sheet_id, "startRowIndex": 0, "endRowIndex": last,
            "startColumnIndex": 0, "endColumnIndex": ncols}}}},
        # amber-highlight any row flagged needs_review = TRUE
        {"addConditionalFormatRule": {"index": 0, "rule": {
            "ranges": [{"sheetId": sheet_id, "startRowIndex": 1, "endRowIndex": last,
                        "startColumnIndex": 0, "endColumnIndex": ncols}],
            "booleanRule": {
                "condition": {"type": "CUSTOM_FORMULA",
                              "values": [{"userEnteredValue": f"=${_col_letter(review_c)}2=TRUE"}]},
                "format": {"backgroundColor": {"red": 1.0, "green": 0.95, "blue": 0.80}}}}}},
    ]

    widths = {"page": 90, "image": 60, "fabric_name": 260, "yardage": 80,
              "notes": 220, "confidence": 90, "needs_review": 110, "verified": 80}
    for name, px in widths.items():
        i = _col(name)
        requests.append({"updateDimensionProperties": {
            "range": {"sheetId": sheet_id, "dimension": "COLUMNS", "startIndex": i, "endIndex": i + 1},
            "properties": {"pixelSize": px}, "fields": "pixelSize"}})

    ws.spreadsheet.batch_update({"requests": requests})


def main() -> None:
    format_inventory()
    print("Formatted the inventory worksheet.")


if __name__ == "__main__":
    main()
