"""Make the master inventory worksheet clean and organized.

Freeze + style the header, set sensible column widths, number-format the
yards/pcs columns, turn needs_review / verified into checkboxes, amber-highlight
rows flagged for review, and enable a basic filter (so you can filter/sort by
page, design, etc). Idempotent enough to re-run.

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
NUMERIC = ["total_yards", "total_pcs", "page_total_yards", "page_total_pcs"]
CHECKBOX = ["needs_review", "verified"]
WIDTHS = {
    "page": 72, "source": 100, "image": 56, "date": 86, "buyer": 110, "item": 150, "ref": 70,
    "design_no": 90, "color_nos": 120, "total_yards": 92, "total_pcs": 78,
    "page_total_yards": 104, "page_total_pcs": 100, "needs_review": 110,
    "verified": 78, "notes": 300,
}


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
    sid = ws.id
    ncols = len(COLS)
    if n_rows is None:
        n_rows = len(ws.get_all_values()) or 1
    last = max(n_rows, 2)

    review_c = _col("needs_review")

    reqs = [
        {"updateSheetProperties": {
            "properties": {"sheetId": sid, "gridProperties": {"frozenRowCount": 1, "frozenColumnCount": 1}},
            "fields": "gridProperties.frozenRowCount,gridProperties.frozenColumnCount"}},
        {"repeatCell": {
            "range": {"sheetId": sid, "startRowIndex": 0, "endRowIndex": 1},
            "cell": {"userEnteredFormat": {
                "backgroundColor": {"red": 0.11, "green": 0.13, "blue": 0.17},
                "horizontalAlignment": "CENTER", "verticalAlignment": "MIDDLE",
                "wrapStrategy": "WRAP",
                "textFormat": {"bold": True, "foregroundColor": {"red": 1, "green": 1, "blue": 1}}}},
            "fields": "userEnteredFormat(backgroundColor,horizontalAlignment,verticalAlignment,wrapStrategy,textFormat)"}},
        {"setBasicFilter": {"filter": {"range": {
            "sheetId": sid, "startRowIndex": 0, "endRowIndex": last,
            "startColumnIndex": 0, "endColumnIndex": ncols}}}},
        {"addConditionalFormatRule": {"index": 0, "rule": {
            "ranges": [{"sheetId": sid, "startRowIndex": 1, "endRowIndex": last,
                        "startColumnIndex": 0, "endColumnIndex": ncols}],
            "booleanRule": {
                "condition": {"type": "CUSTOM_FORMULA",
                              "values": [{"userEnteredValue": f"=${_col_letter(review_c)}2=TRUE"}]},
                "format": {"backgroundColor": {"red": 1.0, "green": 0.94, "blue": 0.78}}}}}},
    ]

    for name in CHECKBOX:
        c = _col(name)
        reqs.append({"setDataValidation": {
            "range": {"sheetId": sid, "startRowIndex": 1, "endRowIndex": last,
                      "startColumnIndex": c, "endColumnIndex": c + 1},
            "rule": {"condition": {"type": "BOOLEAN"}}}})

    for name in NUMERIC:
        c = _col(name)
        reqs.append({"repeatCell": {
            "range": {"sheetId": sid, "startRowIndex": 1, "endRowIndex": last,
                      "startColumnIndex": c, "endColumnIndex": c + 1},
            "cell": {"userEnteredFormat": {"numberFormat": {"type": "NUMBER", "pattern": "#,##0.##"}}},
            "fields": "userEnteredFormat.numberFormat"}})

    for name, px in WIDTHS.items():
        c = _col(name)
        reqs.append({"updateDimensionProperties": {
            "range": {"sheetId": sid, "dimension": "COLUMNS", "startIndex": c, "endIndex": c + 1},
            "properties": {"pixelSize": px}, "fields": "pixelSize"}})

    ws.spreadsheet.batch_update({"requests": reqs})


def main() -> None:
    format_inventory()
    print("Formatted the inventory worksheet.")


if __name__ == "__main__":
    main()
