"""Gemini vision read of a packing-list page PDF -> structured dict.

Mirrors the REST call the Apps Script 'Scan' button makes (generateContent with
an inline PDF + responseSchema), so the in-sheet button and this local reader
stay consistent. Validated on real pages.
"""
from __future__ import annotations

import base64
import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import config

PROMPT = (
    "This is one scanned page of a fabric PACKING LIST. Header: DATE, BUYER, "
    "ITEMS (fabric type, top-left), REF, and a TOTAL of pieces/yards. Each table "
    "row is one DESIGN with DESIGN NO, COL. NOS (color numbers), a 'DETAIL OF "
    "PACKING' grid of individual piece lengths (IGNORE the grid), and QUANTITY "
    "(that row's TOTAL yards and TOTAL pieces). Extract the header plus one entry "
    "per design row {design_no, color_nos, total_yards, total_pcs, confidence, "
    "notes}; total_yards/total_pcs come from the QUANTITY column, never the grid. "
    "Transcribe EXACTLY as written; never compute, sum, or infer. Use empty string "
    "and confidence 'low' for anything unreadable, smudged, or cropped at the edge. "
    "Set confidence 'low' for any total you are not fully sure of. Handwritten — "
    "read carefully."
)

SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "header": {
            "type": "OBJECT",
            "properties": {
                "date": {"type": "STRING"},
                "buyer": {"type": "STRING"},
                "item": {"type": "STRING"},
                "ref": {"type": "STRING"},
                "page_total_yards": {"type": "STRING"},
                "page_total_pcs": {"type": "STRING"},
            },
        },
        "rows": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "design_no": {"type": "STRING"},
                    "color_nos": {"type": "STRING"},
                    "total_yards": {"type": "STRING"},
                    "total_pcs": {"type": "STRING"},
                    "confidence": {"type": "STRING"},
                    "notes": {"type": "STRING"},
                },
            },
        },
    },
}


def read_pdf(path, retries: int = 4) -> dict:
    if not config.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY not set in .env")
    b64 = base64.standard_b64encode(Path(path).read_bytes()).decode()
    body = json.dumps({
        "contents": [{"parts": [
            {"text": PROMPT},
            {"inline_data": {"mime_type": "application/pdf", "data": b64}},
        ]}],
        "generationConfig": {"response_mime_type": "application/json",
                             "response_schema": SCHEMA, "temperature": 0},
    }).encode()
    url = (f"https://generativelanguage.googleapis.com/v1beta/models/"
           f"{config.GEMINI_MODEL}:generateContent?key={config.GEMINI_API_KEY}")
    last = None
    for i in range(retries):
        try:
            req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
            resp = json.load(urllib.request.urlopen(req, timeout=180))
            return json.loads(resp["candidates"][0]["content"]["parts"][0]["text"])
        except urllib.error.HTTPError as e:
            last = f"HTTP {e.code}: {e.read()[:200].decode(errors='replace')}"
            time.sleep(4 * (i + 1))
        except Exception as e:  # transient network / parse
            last = str(e)
            time.sleep(4)
    raise RuntimeError(f"Gemini read failed for {Path(path).name}: {last}")
