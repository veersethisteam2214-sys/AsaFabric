"""Rebuild the ASAFabric Google Sheet into a clean page-tab workbook.

Final workbook shape:
  Control Panel, Master List, Page 01 ... Page 32

This builder intentionally ignores the old Gemini/raw extraction files. The
source of truth is hand-checked JSON in data/manual/Page NN.json. Missing pages
still get a clean page tab so the Control Panel can show what remains.

    python scripts/build_workbook.py
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent))
import config
import google_io


PAGE_NUMBERS = range(1, 33)
VERIFIED_PAGES = set(range(1, 6))
OWNER_RANGES = [
    (1, 12, "Shaan"),
    (13, 24, "Veer"),
    (25, 32, "Krish"),
]
MANUAL_DIR = config.ROOT / "data" / "manual"
GOOGLE_WRITE_PAUSE_SECS = 2.2
GOOGLE_QUOTA_SLEEP_SECS = 65
SUMMARY_HEADER_ROW = 3
SUMMARY_START_ROW = SUMMARY_HEADER_ROW + 1

CONTROL_HEADERS = [
    "Page",
    "Owner",
    "PDF in Drive",
    "PDF",
    "Page Tab",
    "Status",
    "Lines",
    "Needs Check",
    "OK",
    "Notes",
]

MASTER_HEADERS = [
    "Fabric ID",
    "Page",
    "Owner",
    "Design",
    "Item",
    "Date",
    "Written Yards",
    "Written Pieces",
    "Roll Sum",
    "Roll Count",
    "Sold Yards",
    "Sold Pieces",
    "Available Yards",
    "Available Pieces",
    "Needs Check",
    "OK",
    "PDF",
    "Page Tab",
    "Source Range",
    "Line Note",
    "Master Note",
]

PAGE_SUMMARY_HEADERS = [
    "Fabric ID",
    "Design",
    "Written Yards",
    "Written Pcs",
    "Roll Sum",
    "Roll Count",
    "Available Yards",
    "Available Pcs",
    "OK?",
    "Line Note",
    "Needs Check",
]

PAGE_ROLL_HEADERS = [
    "Fabric ID",
    "Design",
    "Roll #",
    "Yards",
    "Sold?",
    "Sold Date",
    "Customer / Invoice",
    "Available Yards",
    "Roll Note",
]

PAGE_HEADER_WIDTH = len(PAGE_SUMMARY_HEADERS)


def page_name(page: int) -> str:
    return f"Page {page:02d}"


def page_owner(page: int) -> str:
    for start, end, owner in OWNER_RANGES:
        if start <= page <= end:
            return owner
    return ""


def load_manual_page(page: int) -> tuple[dict[str, Any], str]:
    path = MANUAL_DIR / f"{page_name(page)}.json"
    if not path.exists():
        return {
            "page": page,
            "date": "",
            "buyer": "",
            "item": "",
            "ref": "",
            "notes": "Not transcribed yet.",
            "fabrics": [],
        }, ""
    data = json.loads(path.read_text())
    data.setdefault("page", page)
    data.setdefault("fabrics", [])
    return data, path.name


def drive_pdf_links() -> dict[str, str]:
    out: dict[str, str] = {}
    if not config.GOOGLE_DRIVE_FOLDER_ID:
        return out
    for item in google_io.list_folder_files(config.GOOGLE_DRIVE_FOLDER_ID, "pdf"):
        name = item.get("name", "")
        out[name] = item.get("webViewLink") or f"https://drive.google.com/file/d/{item['id']}/view"
    return out


def hyperlink(url: str, label: str) -> str:
    if not url:
        return label
    return f'=HYPERLINK("{url.replace(chr(34), chr(34)*2)}","{label.replace(chr(34), chr(34)*2)}")'


def tab_link(sheet_id: int, label: str) -> str:
    return f'=HYPERLINK("#gid={sheet_id}","{label}")'


def a1_col(idx: int) -> str:
    idx += 1
    out = ""
    while idx:
        idx, rem = divmod(idx - 1, 26)
        out = chr(65 + rem) + out
    return out


def sheet_ref(sheet_title: str, row: int, col: int) -> str:
    return f"'{sheet_title}'!{a1_col(col)}{row}"


def safe_number(value: Any) -> Any:
    if value is None:
        return ""
    if isinstance(value, (int, float)):
        return value
    text = str(value).strip()
    if not text:
        return ""
    normalized = text.replace(",", "")
    if re.fullmatch(r"-?\d+(\.\d+)?", normalized):
        return float(normalized) if "." in normalized else int(normalized)
    return text


def literal_text(value: Any) -> str:
    text = str(value or "").strip()
    return f"'{text}" if text else ""


def fabric_needs_review(fabric: dict[str, Any], grid: list[list[Any]]) -> bool:
    if str(fabric.get("needs_review", "")).strip().lower() in {"1", "true", "yes", "y"}:
        return True
    if any(any(cell == "" for cell in row) for row in grid):
        return True
    if fabric.get("notes"):
        return True

    rolls = flatten_rolls(grid)
    if any(not isinstance(cell, (int, float)) for cell in rolls):
        return True

    total_amount = safe_number(fabric.get("total_amount"))
    if isinstance(total_amount, (int, float)) and abs(sum(rolls) - total_amount) > 0.01:
        return True

    piece_count = safe_number(fabric.get("piece_count"))
    if isinstance(piece_count, (int, float)) and len(rolls) != int(piece_count):
        return True

    return False


def value_or_formula(value: Any, fallback_formula: str) -> Any:
    if value is None or value == "":
        return fallback_formula
    if isinstance(value, (int, float)):
        return value
    text = str(value).strip()
    if not text:
        return fallback_formula
    return text


def normalize_grid(raw_grid: Any) -> list[list[Any]]:
    if not raw_grid:
        return [[]]
    grid = []
    for row in raw_grid:
        if isinstance(row, list):
            grid.append([safe_number(cell) for cell in row])
        else:
            grid.append([safe_number(row)])
    return grid or [[]]


def flatten_rolls(grid: list[list[Any]]) -> list[Any]:
    rolls: list[Any] = []
    for row in grid:
        for cell in row:
            if isinstance(cell, (int, float)) or str(cell).strip():
                rolls.append(cell)
    return rolls


def roll_key(fabric_id: str, roll_no: int) -> str:
    return f"{fabric_id}|{roll_no}"


def as_bool(value: Any) -> bool:
    return str(value).strip().upper() == "TRUE"


def read_existing_page_state(spreadsheet, title: str) -> tuple[dict[str, dict[str, bool]], dict[str, dict[str, Any]]]:
    """Keep fabric review/approval and roll sales state when rebuilding a page tab."""
    import gspread

    try:
        ws = spreadsheet.worksheet(title)
    except gspread.WorksheetNotFound:
        return {}, {}

    values = google_retry(f"reading existing roll sales from {title}", ws.get_all_values)
    summary_header_idx = None
    roll_header_idx = None
    summary_headers: list[str] = []
    roll_headers: list[str] = []
    for idx, row in enumerate(values):
        if row and row[0] == "Fabric ID" and "Roll #" in row:
            roll_header_idx = idx
            roll_headers = row
        elif row and row[0] == "Fabric ID" and ("Review" in row or "Approved" in row or "OK?" in row or "OK" in row):
            summary_header_idx = idx
            summary_headers = row

    def header_index(headers: list[str], *names: str) -> int | None:
        for name in names:
            if name in headers:
                return headers.index(name)
        return None

    fabric_state: dict[str, dict[str, bool]] = {}
    if summary_header_idx is not None:
        ok_idx = header_index(summary_headers, "OK?", "OK", "Approved")
        for row in values[summary_header_idx + 1 :]:
            if not row or not row[0] or row[0] == "Roll Ledger":
                break
            if not str(row[0]).startswith("P"):
                continue
            fabric_state[str(row[0])] = {
                "ok": as_bool(row[ok_idx]) if ok_idx is not None and len(row) > ok_idx else False,
            }

    roll_state: dict[str, dict[str, Any]] = {}
    if roll_header_idx is None:
        return fabric_state, roll_state

    roll_no_idx = header_index(roll_headers, "Roll #")
    sold_idx = header_index(roll_headers, "Sold?")
    sold_date_idx = header_index(roll_headers, "Sold Date")
    customer_idx = header_index(roll_headers, "Customer / Invoice")
    notes_idx = header_index(roll_headers, "Roll Note", "Notes")
    for row in values[roll_header_idx + 1 :]:
        if roll_no_idx is None or len(row) <= roll_no_idx or not row[0] or not row[roll_no_idx]:
            continue
        try:
            roll_no = int(str(row[roll_no_idx]).strip())
        except ValueError:
            continue
        roll_state[roll_key(row[0], roll_no)] = {
            "sold": as_bool(row[sold_idx]) if sold_idx is not None and len(row) > sold_idx else False,
            "sold_date": row[sold_date_idx] if sold_date_idx is not None and len(row) > sold_date_idx else "",
            "customer": row[customer_idx] if customer_idx is not None and len(row) > customer_idx else "",
            "notes": row[notes_idx] if notes_idx is not None and len(row) > notes_idx else "",
        }
    return fabric_state, roll_state


def get_or_create_ws(spreadsheet, title: str, rows: int, cols: int):
    import gspread

    try:
        ws = spreadsheet.worksheet(title)
    except gspread.WorksheetNotFound:
        ws = spreadsheet.add_worksheet(title=title, rows=rows, cols=cols)
    if ws.row_count < rows or ws.col_count != cols:
        google_retry(
            f"resizing {title}",
            lambda: ws.resize(rows=max(ws.row_count, rows), cols=cols),
        )
    google_retry(f"clearing {title}", ws.clear)
    return ws


def google_retry(label: str, func):
    last_exc = None
    for attempt in range(3):
        try:
            return func()
        except Exception as exc:  # gspread wraps API errors differently by version
            last_exc = exc
            if "Quota exceeded" not in str(exc) and "[429]" not in str(exc):
                raise
            wait = GOOGLE_QUOTA_SLEEP_SECS * (attempt + 1)
            print(f"Google quota while {label}; sleeping {wait}s before retry...")
            time.sleep(wait)
    raise last_exc


def reset_sheet_values(ws, values: list[list[Any]]) -> None:
    if values:
        google_retry(
            f"updating {ws.title}",
            lambda: ws.update(values=values, range_name="A1", value_input_option="USER_ENTERED"),
        )


def build_page_values(
    page: int,
    data: dict[str, Any],
    pdf_link: str,
    existing_fabrics: dict[str, dict[str, bool]] | None = None,
    existing_sales: dict[str, dict[str, Any]] | None = None,
) -> tuple[list[list[Any]], list[dict[str, Any]], dict[str, int]]:
    title = page_name(page)
    pdf_formula = hyperlink(pdf_link, f"{title}.pdf")
    owner = page_owner(page)
    existing_fabrics = existing_fabrics or {}
    existing_sales = existing_sales or {}
    page_date = literal_text(data.get("date", ""))
    needs_update = page not in VERIFIED_PAGES
    master_rows: list[dict[str, Any]] = []

    fabrics = data.get("fabrics") or []
    summary_start_row = SUMMARY_START_ROW
    summary_end_row = summary_start_row + max(len(fabrics), 1) - 1
    ledger_label_row = summary_end_row + 2
    ledger_header_row = ledger_label_row + 1
    ledger_start_row = ledger_header_row + 1
    roll_count = 0
    for fabric in fabrics:
        roll_count += len(flatten_rolls(normalize_grid(fabric.get("grid"))))
    ledger_end_row = ledger_start_row + max(roll_count, 1) - 1
    page_pcs = data.get("page_total_pcs", "")
    page_yards = data.get("page_total_yards", "")
    written_total = ""
    if page_pcs != "" or page_yards != "":
        written_total = f"{page_pcs} pcs / {page_yards} yds"
    master_note = str(data.get("notes") or "")

    values: list[list[Any]] = [
        [
            f"{title} - NEED UPDATING" if needs_update else title,
            pdf_formula,
            "Owner",
            owner,
            "Date",
            page_date,
            "Item",
            data.get("item", ""),
            "Written Total",
            written_total,
            "",
        ],
        [
            "Master Note",
            master_note if not needs_update else f"NEED UPDATING - roll-level verification pending. {master_note}".strip(),
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
        ],
    ]

    values.append(PAGE_SUMMARY_HEADERS)

    if not fabrics:
        values.extend(
            [
                ["No verified fabric lines yet.", "", "", "", "", "", "", "", False, "Use this tab as the manual page template.", True],
                [],
                ["Roll Ledger"],
                PAGE_ROLL_HEADERS,
                ["", "", "", "", False, "", "", "", ""],
            ]
        )
        return values, master_rows, {
            "summary_start_row": summary_start_row,
            "summary_end_row": summary_end_row,
            "ledger_label_row": ledger_label_row,
            "ledger_header_row": ledger_header_row,
            "ledger_start_row": ledger_start_row,
            "ledger_end_row": ledger_start_row,
        }

    ledger_fabric_range = f"$A${ledger_start_row}:$A${ledger_end_row}"
    ledger_yards_range = f"$D${ledger_start_row}:$D${ledger_end_row}"
    ledger_sold_range = f"$E${ledger_start_row}:$E${ledger_end_row}"
    ledger_rows: list[list[Any]] = []
    next_roll_row = ledger_start_row
    for idx, fabric in enumerate(fabrics, start=1):
        grid = normalize_grid(fabric.get("grid"))
        rolls = flatten_rolls(grid)
        block = str(fabric.get("block") or fabric.get("label") or idx)
        label = str(fabric.get("label") or block)
        notes = str(fabric.get("notes") or "")
        summary_row = summary_start_row + idx - 1
        fabric_id = f"P{page:02d}-F{idx:02d}"
        restored_fabric = existing_fabrics.get(fabric_id)
        ok = restored_fabric["ok"] if restored_fabric is not None else False
        written_yards = value_or_formula(fabric.get("total_amount"), f"=E{summary_row}")
        written_pcs = value_or_formula(fabric.get("piece_count"), f"=F{summary_row}")
        issue_literal = "TRUE" if fabric_needs_review(fabric, grid) else "FALSE"
        written_yards_cell = f"{a1_col(PAGE_SUMMARY_HEADERS.index('Written Yards'))}{summary_row}"
        written_pcs_cell = f"{a1_col(PAGE_SUMMARY_HEADERS.index('Written Pcs'))}{summary_row}"
        roll_sum_cell = f"{a1_col(PAGE_SUMMARY_HEADERS.index('Roll Sum'))}{summary_row}"
        roll_count_cell = f"{a1_col(PAGE_SUMMARY_HEADERS.index('Roll Count'))}{summary_row}"
        ok_cell = f"{a1_col(PAGE_SUMMARY_HEADERS.index('OK?'))}{summary_row}"
        line_note_cell = f"{a1_col(PAGE_SUMMARY_HEADERS.index('Line Note'))}{summary_row}"
        needs_check_formula = (
            f"=AND({ok_cell}<>TRUE,"
            f'OR({issue_literal},{line_note_cell}<>"",{written_yards_cell}<>{roll_sum_cell},{written_pcs_cell}<>{roll_count_cell}))'
        )

        summary = [
            fabric_id,
            label,
            written_yards,
            written_pcs,
            f"=SUMIF({ledger_fabric_range},A{summary_row},{ledger_yards_range})",
            f"=COUNTIF({ledger_fabric_range},A{summary_row})",
            f"=C{summary_row}-SUMIFS({ledger_yards_range},{ledger_fabric_range},A{summary_row},{ledger_sold_range},TRUE)",
            f"=D{summary_row}-COUNTIFS({ledger_fabric_range},A{summary_row},{ledger_sold_range},TRUE)",
            "TRUE" if ok else "FALSE",
            notes,
            needs_check_formula,
        ]
        values.append(summary)

        for roll_no, roll_value in enumerate(rolls, start=1):
            restored = existing_sales.get(roll_key(fabric_id, roll_no), {})
            sold = "TRUE" if restored.get("sold") else "FALSE"
            roll_row = next_roll_row
            ledger_rows.append(
                [
                    fabric_id,
                    label,
                    roll_no,
                    roll_value,
                    sold,
                    restored.get("sold_date", ""),
                    restored.get("customer", ""),
                    f"=IF(E{roll_row}=TRUE,0,D{roll_row})",
                    restored.get("notes", ""),
                ]
            )
            next_roll_row += 1

        source_range = f"{title}!A{summary_row}:K{summary_row}"
        master_rows.append({
            "fabric_id": fabric_id,
            "fabric_id_ref": sheet_ref(title, summary_row, 0),
            "page_ref": f"LEFT({sheet_ref(title, 1, 0)},7)",
            "owner_ref": sheet_ref(title, 1, 3),
            "design_ref": sheet_ref(title, summary_row, 1),
            "item_ref": sheet_ref(title, 1, 7),
            "date_ref": sheet_ref(title, 1, 5),
            "written_yards_ref": sheet_ref(title, summary_row, 2),
            "written_pcs_ref": sheet_ref(title, summary_row, 3),
            "roll_sum_ref": sheet_ref(title, summary_row, 4),
            "roll_count_ref": sheet_ref(title, summary_row, 5),
            "sold_yards_ref": f"{sheet_ref(title, summary_row, 2)}-{sheet_ref(title, summary_row, 6)}",
            "sold_pcs_ref": f"{sheet_ref(title, summary_row, 3)}-{sheet_ref(title, summary_row, 7)}",
            "available_yards_ref": sheet_ref(title, summary_row, 6),
            "available_pcs_ref": sheet_ref(title, summary_row, 7),
            "needs_check_ref": sheet_ref(title, summary_row, 10),
            "ok_ref": sheet_ref(title, summary_row, 8),
            "source_range": source_range,
            "line_note_ref": sheet_ref(title, summary_row, 9),
            "master_note_ref": sheet_ref(title, 2, 1),
        })

    values.append([])
    values.append(["Roll Ledger"])
    values.append(PAGE_ROLL_HEADERS)
    values.extend(ledger_rows or [["", "", "", "", False, "", "", "", ""]])

    return values, master_rows, {
        "summary_start_row": summary_start_row,
        "summary_end_row": summary_end_row,
        "ledger_label_row": ledger_label_row,
        "ledger_header_row": ledger_header_row,
        "ledger_start_row": ledger_start_row,
        "ledger_end_row": max(next_roll_row - 1, ledger_start_row),
    }


def format_color(hex_color: str) -> dict[str, float]:
    hex_color = hex_color.lstrip("#")
    return {
        "red": int(hex_color[0:2], 16) / 255,
        "green": int(hex_color[2:4], 16) / 255,
        "blue": int(hex_color[4:6], 16) / 255,
    }


def base_format_requests(sheet_id: int, rows: int, cols: int, frozen_rows: int = 1) -> list[dict[str, Any]]:
    return [
        {
            "updateSheetProperties": {
                "properties": {"sheetId": sheet_id, "gridProperties": {"frozenRowCount": frozen_rows}},
                "fields": "gridProperties.frozenRowCount",
            }
        },
        {
            "repeatCell": {
                "range": {"sheetId": sheet_id, "startRowIndex": 0, "endRowIndex": rows, "startColumnIndex": 0, "endColumnIndex": cols},
                "cell": {
                    "userEnteredFormat": {
                        "backgroundColor": format_color("#FFFFFF"),
                        "horizontalAlignment": "LEFT",
                        "verticalAlignment": "MIDDLE",
                        "wrapStrategy": "WRAP",
                        "textFormat": {"bold": False, "foregroundColor": format_color("#111827")},
                    }
                },
                "fields": "userEnteredFormat(backgroundColor,horizontalAlignment,verticalAlignment,wrapStrategy,textFormat)",
            }
        },
        {
            "repeatCell": {
                "range": {"sheetId": sheet_id, "startRowIndex": 0, "endRowIndex": rows, "startColumnIndex": 0, "endColumnIndex": cols},
                "cell": {"userEnteredFormat": {"verticalAlignment": "MIDDLE", "wrapStrategy": "WRAP"}},
                "fields": "userEnteredFormat(verticalAlignment,wrapStrategy)",
            }
        },
    ]


def header_format(sheet_id: int, row_start: int, row_end: int, col_end: int) -> dict[str, Any]:
    return {
        "repeatCell": {
            "range": {"sheetId": sheet_id, "startRowIndex": row_start, "endRowIndex": row_end, "startColumnIndex": 0, "endColumnIndex": col_end},
            "cell": {
                "userEnteredFormat": {
                    "backgroundColor": format_color("#111827"),
                    "horizontalAlignment": "CENTER",
                    "verticalAlignment": "MIDDLE",
                    "wrapStrategy": "WRAP",
                    "textFormat": {"bold": True, "foregroundColor": format_color("#FFFFFF")},
                }
            },
            "fields": "userEnteredFormat(backgroundColor,horizontalAlignment,verticalAlignment,wrapStrategy,textFormat)",
        }
    }


def width_requests(sheet_id: int, widths: dict[int, int]) -> list[dict[str, Any]]:
    return [
        {
            "updateDimensionProperties": {
                "range": {"sheetId": sheet_id, "dimension": "COLUMNS", "startIndex": col, "endIndex": col + 1},
                "properties": {"pixelSize": px},
                "fields": "pixelSize",
            }
        }
        for col, px in widths.items()
    ]


def row_height_requests(sheet_id: int, heights: dict[int, int]) -> list[dict[str, Any]]:
    return [
        {
            "updateDimensionProperties": {
                "range": {"sheetId": sheet_id, "dimension": "ROWS", "startIndex": row, "endIndex": row + 1},
                "properties": {"pixelSize": px},
                "fields": "pixelSize",
            }
        }
        for row, px in heights.items()
    ]


def checkbox_request(sheet_id: int, start_row: int, end_row: int, col: int) -> dict[str, Any]:
    return {
        "setDataValidation": {
            "range": {"sheetId": sheet_id, "startRowIndex": start_row, "endRowIndex": end_row, "startColumnIndex": col, "endColumnIndex": col + 1},
            "rule": {"condition": {"type": "BOOLEAN"}},
        }
    }


def number_format_request(sheet_id: int, start_row: int, end_row: int, start_col: int, end_col: int) -> dict[str, Any]:
    return {
        "repeatCell": {
            "range": {
                "sheetId": sheet_id,
                "startRowIndex": start_row,
                "endRowIndex": end_row,
                "startColumnIndex": start_col,
                "endColumnIndex": end_col,
            },
            "cell": {"userEnteredFormat": {"numberFormat": {"type": "NUMBER", "pattern": "#,##0.##"}}},
            "fields": "userEnteredFormat.numberFormat",
        }
    }


def delete_conditional_format_requests(spreadsheet, sheet_id: int) -> list[dict[str, Any]]:
    metadata = google_retry(
        f"reading conditional format rules for sheet {sheet_id}",
        lambda: spreadsheet.fetch_sheet_metadata(
            params={
                "includeGridData": "false",
                "fields": "sheets(properties(sheetId),conditionalFormats)",
            }
        ),
    )
    rule_count = 0
    for sheet in metadata.get("sheets", []):
        if sheet.get("properties", {}).get("sheetId") == sheet_id:
            rule_count = len(sheet.get("conditionalFormats", []))
            break
    return [{"deleteConditionalFormatRule": {"sheetId": sheet_id, "index": 0}} for _ in range(rule_count)]


def format_control(spreadsheet, ws, n_rows: int) -> None:
    rows = max(n_rows, 2)
    reqs = delete_conditional_format_requests(spreadsheet, ws.id)
    reqs.extend(base_format_requests(ws.id, rows, len(CONTROL_HEADERS)))
    reqs.append(header_format(ws.id, 0, 1, len(CONTROL_HEADERS)))
    reqs.append(checkbox_request(ws.id, 1, rows, CONTROL_HEADERS.index("PDF in Drive")))
    reqs.append(number_format_request(ws.id, 1, rows, CONTROL_HEADERS.index("Lines"), CONTROL_HEADERS.index("OK") + 1))
    reqs.extend(width_requests(ws.id, {
        0: 86,
        1: 78,
        2: 92,
        3: 110,
        4: 110,
        5: 118,
        6: 70,
        7: 104,
        8: 82,
        9: 340,
    }))
    reqs.append({"setBasicFilter": {"filter": {"range": {"sheetId": ws.id, "startRowIndex": 0, "endRowIndex": rows, "startColumnIndex": 0, "endColumnIndex": len(CONTROL_HEADERS)}}}})
    status_col = a1_col(CONTROL_HEADERS.index("Status"))
    for label, color in [
        ("MISSING PDF", "#FEE2E2"),
        ("NEED UPDATING", "#FDE68A"),
        ("CHECK", "#FEF3C7"),
        ("OPEN", "#E0F2FE"),
        ("DONE", "#DCFCE7"),
    ]:
        reqs.append({
            "addConditionalFormatRule": {
                "index": 0,
                "rule": {
                    "ranges": [{"sheetId": ws.id, "startRowIndex": 1, "endRowIndex": rows, "startColumnIndex": 0, "endColumnIndex": len(CONTROL_HEADERS)}],
                    "booleanRule": {
                        "condition": {"type": "CUSTOM_FORMULA", "values": [{"userEnteredValue": f"=${status_col}2=\"{label}\""}]},
                        "format": {"backgroundColor": format_color(color)},
                    },
                },
            }
        })
    google_retry(f"formatting {ws.title}", lambda: spreadsheet.batch_update({"requests": reqs}))


def format_master(spreadsheet, ws, n_rows: int) -> None:
    rows = max(n_rows, 2)
    reqs = delete_conditional_format_requests(spreadsheet, ws.id)
    reqs.extend(base_format_requests(ws.id, rows, len(MASTER_HEADERS)))
    reqs.append(header_format(ws.id, 0, 1, len(MASTER_HEADERS)))
    reqs.append({"setBasicFilter": {"filter": {"range": {"sheetId": ws.id, "startRowIndex": 0, "endRowIndex": rows, "startColumnIndex": 0, "endColumnIndex": len(MASTER_HEADERS)}}}})
    reqs.extend(width_requests(ws.id, {
        0: 90,
        1: 78,
        2: 78,
        3: 150,
        4: 150,
        5: 86,
        6: 104,
        7: 104,
        8: 92,
        9: 92,
        10: 92,
        11: 92,
        12: 110,
        13: 110,
        14: 104,
        15: 82,
        16: 92,
        17: 98,
        18: 140,
        19: 280,
        20: 360,
    }))
    reqs.append(checkbox_request(ws.id, 1, rows, MASTER_HEADERS.index("Needs Check")))
    reqs.append(checkbox_request(ws.id, 1, rows, MASTER_HEADERS.index("OK")))
    reqs.append(number_format_request(ws.id, 1, rows, MASTER_HEADERS.index("Written Yards"), MASTER_HEADERS.index("Needs Check")))
    needs_check_col = a1_col(MASTER_HEADERS.index("Needs Check"))
    ok_col = a1_col(MASTER_HEADERS.index("OK"))
    reqs.append({
        "addConditionalFormatRule": {
            "index": 0,
            "rule": {
                "ranges": [{"sheetId": ws.id, "startRowIndex": 1, "endRowIndex": rows, "startColumnIndex": 0, "endColumnIndex": len(MASTER_HEADERS)}],
                "booleanRule": {
                    "condition": {"type": "CUSTOM_FORMULA", "values": [{"userEnteredValue": f"=${needs_check_col}2=TRUE"}]},
                    "format": {"backgroundColor": format_color("#FEF3C7")},
                },
            },
        }
    })
    reqs.append({
        "addConditionalFormatRule": {
            "index": 0,
            "rule": {
                "ranges": [{"sheetId": ws.id, "startRowIndex": 1, "endRowIndex": rows, "startColumnIndex": 0, "endColumnIndex": len(MASTER_HEADERS)}],
                "booleanRule": {
                    "condition": {"type": "CUSTOM_FORMULA", "values": [{"userEnteredValue": f"=${ok_col}2=TRUE"}]},
                    "format": {"backgroundColor": format_color("#DCFCE7")},
                },
            },
        }
    })
    google_retry(f"formatting {ws.title}", lambda: spreadsheet.batch_update({"requests": reqs}))


def format_page(spreadsheet, ws, n_rows: int, layout: dict[str, int]) -> None:
    rows = max(n_rows, ws.row_count, 8)
    format_cols = max(PAGE_HEADER_WIDTH, ws.col_count)
    reqs = delete_conditional_format_requests(spreadsheet, ws.id)
    reqs.extend(base_format_requests(ws.id, rows, format_cols, frozen_rows=SUMMARY_HEADER_ROW))
    reqs.append(header_format(ws.id, SUMMARY_HEADER_ROW - 1, SUMMARY_HEADER_ROW, PAGE_HEADER_WIDTH))
    reqs.append(header_format(ws.id, layout["ledger_header_row"] - 1, layout["ledger_header_row"], PAGE_HEADER_WIDTH))
    reqs.extend(width_requests(ws.id, {
        0: 94,
        1: 180,
        2: 112,
        3: 96,
        4: 108,
        5: 92,
        6: 118,
        7: 104,
        8: 82,
        9: 340,
        10: 92,
    }))
    reqs.append({
        "updateDimensionProperties": {
            "range": {
                "sheetId": ws.id,
                "dimension": "COLUMNS",
                "startIndex": PAGE_SUMMARY_HEADERS.index("Needs Check"),
                "endIndex": PAGE_SUMMARY_HEADERS.index("Needs Check") + 1,
            },
            "properties": {"hiddenByUser": True},
            "fields": "hiddenByUser",
        }
    })
    reqs.extend(row_height_requests(ws.id, {0: 28, 1: 44, SUMMARY_HEADER_ROW - 1: 30}))
    summary_start = layout["summary_start_row"] - 1
    summary_end = layout["summary_end_row"]
    ledger_start = layout["ledger_start_row"] - 1
    ledger_end = layout["ledger_end_row"]
    reqs.append(checkbox_request(ws.id, summary_start, summary_end, PAGE_SUMMARY_HEADERS.index("OK?")))
    reqs.append(checkbox_request(ws.id, summary_start, summary_end, PAGE_SUMMARY_HEADERS.index("Needs Check")))
    reqs.append(checkbox_request(ws.id, ledger_start, ledger_end, PAGE_ROLL_HEADERS.index("Sold?")))
    reqs.append(number_format_request(ws.id, summary_start, summary_end, PAGE_SUMMARY_HEADERS.index("Written Yards"), PAGE_SUMMARY_HEADERS.index("OK?")))
    reqs.append(number_format_request(ws.id, ledger_start, ledger_end, PAGE_ROLL_HEADERS.index("Yards"), PAGE_ROLL_HEADERS.index("Yards") + 1))
    reqs.append(number_format_request(ws.id, ledger_start, ledger_end, PAGE_ROLL_HEADERS.index("Available Yards"), PAGE_ROLL_HEADERS.index("Available Yards") + 1))
    reqs.append({
        "repeatCell": {
            "range": {"sheetId": ws.id, "startRowIndex": layout["ledger_label_row"] - 1, "endRowIndex": layout["ledger_label_row"], "startColumnIndex": 0, "endColumnIndex": PAGE_HEADER_WIDTH},
            "cell": {"userEnteredFormat": {"textFormat": {"bold": True}}},
            "fields": "userEnteredFormat.textFormat.bold",
        }
    })
    reqs.append({
        "repeatCell": {
            "range": {"sheetId": ws.id, "startRowIndex": ledger_start, "endRowIndex": ledger_end, "startColumnIndex": PAGE_ROLL_HEADERS.index("Roll #"), "endColumnIndex": PAGE_ROLL_HEADERS.index("Sold?") + 1},
            "cell": {"userEnteredFormat": {"horizontalAlignment": "CENTER"}},
            "fields": "userEnteredFormat.horizontalAlignment",
        }
    })
    reqs.append({
        "addConditionalFormatRule": {
            "index": 0,
            "rule": {
                "ranges": [{"sheetId": ws.id, "startRowIndex": summary_start, "endRowIndex": summary_end, "startColumnIndex": 0, "endColumnIndex": PAGE_HEADER_WIDTH}],
                "booleanRule": {
                    "condition": {"type": "CUSTOM_FORMULA", "values": [{"userEnteredValue": f"=${a1_col(PAGE_SUMMARY_HEADERS.index('Needs Check'))}{layout['summary_start_row']}=TRUE"}]},
                    "format": {"backgroundColor": format_color("#FEF3C7")},
                },
            },
        }
    })
    reqs.append({
        "addConditionalFormatRule": {
            "index": 0,
            "rule": {
                "ranges": [{"sheetId": ws.id, "startRowIndex": summary_start, "endRowIndex": summary_end, "startColumnIndex": 0, "endColumnIndex": PAGE_HEADER_WIDTH}],
                "booleanRule": {
                    "condition": {"type": "CUSTOM_FORMULA", "values": [{"userEnteredValue": f"=${a1_col(PAGE_SUMMARY_HEADERS.index('OK?'))}{layout['summary_start_row']}=TRUE"}]},
                    "format": {"backgroundColor": format_color("#DCFCE7")},
                },
            },
        }
    })
    reqs.append({
        "addConditionalFormatRule": {
            "index": 0,
            "rule": {
                "ranges": [{"sheetId": ws.id, "startRowIndex": 0, "endRowIndex": 3, "startColumnIndex": 0, "endColumnIndex": PAGE_HEADER_WIDTH}],
                "booleanRule": {
                    "condition": {"type": "CUSTOM_FORMULA", "values": [{"userEnteredValue": '=REGEXMATCH($A$1,"NEED UPDATING")'}]},
                    "format": {"backgroundColor": format_color("#FDE68A")},
                },
            },
        }
    })
    reqs.append({
        "addConditionalFormatRule": {
            "index": 0,
            "rule": {
                "ranges": [{"sheetId": ws.id, "startRowIndex": ledger_start, "endRowIndex": ledger_end, "startColumnIndex": 0, "endColumnIndex": len(PAGE_ROLL_HEADERS)}],
                "booleanRule": {
                    "condition": {"type": "CUSTOM_FORMULA", "values": [{"userEnteredValue": f"=$E{layout['ledger_start_row']}=TRUE"}]},
                    "format": {"backgroundColor": format_color("#DCFCE7")},
                },
            },
        }
    })
    google_retry(f"formatting {ws.title}", lambda: spreadsheet.batch_update({"requests": reqs}))


def hide_old_tabs(spreadsheet, visible_titles: set[str]) -> None:
    reqs = []
    for ws in spreadsheet.worksheets():
        reqs.append({
            "updateSheetProperties": {
                "properties": {"sheetId": ws.id, "hidden": ws.title not in visible_titles},
                "fields": "hidden",
            }
        })
    google_retry("hiding old tabs", lambda: spreadsheet.batch_update({"requests": reqs}))


def reorder_tabs(spreadsheet, ordered_titles: list[str]) -> None:
    by_title = {ws.title: ws for ws in spreadsheet.worksheets()}
    reqs = []
    for idx, title in enumerate(ordered_titles):
        ws = by_title.get(title)
        if ws:
            reqs.append({
                "updateSheetProperties": {
                    "properties": {"sheetId": ws.id, "index": idx},
                    "fields": "index",
                }
            })
    if reqs:
        google_retry("reordering tabs", lambda: spreadsheet.batch_update({"requests": reqs}))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", default=str(MANUAL_DIR))
    args = parser.parse_args()

    import gspread

    if not config.GOOGLE_SHEET_ID:
        sys.exit("Set GOOGLE_SHEET_ID in .env.")

    data_dir = Path(args.data_dir)
    data_dir.mkdir(parents=True, exist_ok=True)

    gc = gspread.authorize(google_io.credentials())
    spreadsheet = gc.open_by_key(config.GOOGLE_SHEET_ID)
    pdf_links = drive_pdf_links()

    # Create page tabs first so master/control can link to their gid.
    page_meta: dict[int, dict[str, Any]] = {}
    master_records: list[dict[str, Any]] = []
    page_ws_ids: dict[int, int] = {}
    for page in PAGE_NUMBERS:
        data, source = load_manual_page(page)
        title = page_name(page)
        pdf_url = pdf_links.get(f"{title}.pdf", "")
        existing_fabrics, existing_sales = read_existing_page_state(spreadsheet, title)
        working_data = data if page in VERIFIED_PAGES else {
            "page": page,
            "date": "",
            "item": "",
            "notes": "",
            "fabrics": [],
        }
        page_values, records, page_layout = build_page_values(page, working_data, pdf_url, existing_fabrics, existing_sales)
        ws = google_retry(
            f"creating/finding {title}",
            lambda title=title, page_values=page_values: get_or_create_ws(
                spreadsheet, title, rows=max(len(page_values) + 20, 80), cols=PAGE_HEADER_WIDTH
            ),
        )
        reset_sheet_values(ws, page_values)
        format_page(spreadsheet, ws, len(page_values), page_layout)
        time.sleep(GOOGLE_WRITE_PAUSE_SECS)
        page_ws_ids[page] = ws.id
        page_meta[page] = {"data": working_data, "source": source, "pdf_url": pdf_url, "rows": len(records)}
        master_records.extend(records)

    master_values = [MASTER_HEADERS]
    for record in master_records:
        page = int(record["fabric_id"][1:3])
        title = page_name(page)
        pdf_url = pdf_links.get(f"{title}.pdf", "")
        master_values.append([
            f"={record['fabric_id_ref']}",
            f"={record['page_ref']}",
            f"={record['owner_ref']}",
            f"={record['design_ref']}",
            f"={record['item_ref']}",
            f"={record['date_ref']}",
            f"={record['written_yards_ref']}",
            f"={record['written_pcs_ref']}",
            f"={record['roll_sum_ref']}",
            f"={record['roll_count_ref']}",
            f"={record['sold_yards_ref']}",
            f"={record['sold_pcs_ref']}",
            f"={record['available_yards_ref']}",
            f"={record['available_pcs_ref']}",
            f"={record['needs_check_ref']}",
            f"={record['ok_ref']}",
            hyperlink(pdf_url, "PDF"),
            tab_link(page_ws_ids[page], title),
            record["source_range"],
            f"={record['line_note_ref']}",
            f"={record['master_note_ref']}",
        ])
    master_ws = google_retry(
        "creating/finding Master List",
        lambda: get_or_create_ws(spreadsheet, "Master List", rows=max(len(master_values) + 50, 200), cols=len(MASTER_HEADERS)),
    )
    reset_sheet_values(master_ws, master_values)
    format_master(spreadsheet, master_ws, len(master_values))
    time.sleep(GOOGLE_WRITE_PAUSE_SECS)

    master_page_col = a1_col(MASTER_HEADERS.index("Page"))
    master_needs_check_col = a1_col(MASTER_HEADERS.index("Needs Check"))
    master_ok_col = a1_col(MASTER_HEADERS.index("OK"))
    control_pdf_present_col = a1_col(CONTROL_HEADERS.index("PDF in Drive"))
    control_lines_col = a1_col(CONTROL_HEADERS.index("Lines"))
    control_needs_check_col = a1_col(CONTROL_HEADERS.index("Needs Check"))
    control_ok_col = a1_col(CONTROL_HEADERS.index("OK"))
    control_values = [CONTROL_HEADERS]
    for page in PAGE_NUMBERS:
        title = page_name(page)
        row_no = len(control_values) + 1
        meta = page_meta[page]
        data = meta["data"]
        pdf_url = meta["pdf_url"]
        needs_update = page not in VERIFIED_PAGES
        control_note = "NEED UPDATING - roll-level verification pending." if needs_update else str(data.get("notes", ""))
        control_values.append([
            title,
            page_owner(page),
            "TRUE" if pdf_url else "FALSE",
            hyperlink(pdf_url, f"{title}.pdf"),
            tab_link(page_ws_ids[page], title),
            f'=IF({control_pdf_present_col}{row_no}=FALSE,"MISSING PDF",IF({str(needs_update).upper()},"NEED UPDATING",IF({control_needs_check_col}{row_no}>0,"CHECK",IF({control_ok_col}{row_no}<{control_lines_col}{row_no},"OPEN","DONE"))))',
            f"=COUNTIF('Master List'!{master_page_col}:{master_page_col},A{row_no})",
            f"=COUNTIFS('Master List'!{master_page_col}:{master_page_col},A{row_no},'Master List'!{master_needs_check_col}:{master_needs_check_col},TRUE)",
            f"=COUNTIFS('Master List'!{master_page_col}:{master_page_col},A{row_no},'Master List'!{master_ok_col}:{master_ok_col},TRUE)",
            control_note,
        ])
    control_ws = google_retry("creating/finding Control Panel", lambda: get_or_create_ws(spreadsheet, "Control Panel", rows=80, cols=len(CONTROL_HEADERS)))
    reset_sheet_values(control_ws, control_values)
    format_control(spreadsheet, control_ws, len(control_values))

    ordered_titles = ["Control Panel", "Master List"] + [page_name(p) for p in PAGE_NUMBERS]
    reorder_tabs(spreadsheet, ordered_titles)
    hide_old_tabs(spreadsheet, set(ordered_titles))

    print(
        f"Rebuilt clean workbook: 32 page tabs, {len(master_records)} fabric rows, "
        f"{sum(1 for p in PAGE_NUMBERS if page_meta[p]['rows'])}/32 pages transcribed."
    )


if __name__ == "__main__":
    main()
