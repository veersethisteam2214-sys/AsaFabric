"""Central configuration for the ASAFabric extraction pipeline.

Every tunable lives here so the scripts stay declarative. Values come from
environment variables (see ../.env.example); sensible defaults are provided for
everything except secrets.
"""
from __future__ import annotations

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

try:
    from dotenv import load_dotenv

    load_dotenv(ROOT / ".env")
except ImportError:  # python-dotenv is optional; real env vars still work without it
    pass

# --- Paths -----------------------------------------------------------------
PHOTOS_DIR = Path(os.getenv("PHOTOS_DIR", ROOT / "photos"))
RAW_DIR = Path(os.getenv("RAW_DIR", ROOT / "data" / "raw"))
MERGED_CSV = Path(os.getenv("MERGED_CSV", ROOT / "data" / "merged.csv"))
DEDUPED_CSV = Path(os.getenv("DEDUPED_CSV", ROOT / "data" / "deduped.csv"))

# --- Models (the two-model cross-check) ------------------------------------
# Format: "provider:model_id". The Phase 0 pilot decides these. Confirm the
# exact model_id in each provider's docs the day you run (ids drift monthly).
MODEL_A = os.getenv("MODEL_A", "anthropic:claude-sonnet-4-6")
MODEL_B = os.getenv("MODEL_B", "")  # empty => single-model mode

# --- Fuzzy-dedup thresholds (rapidfuzz token_set_ratio, 0-100) -------------
DEDUPE_AUTO_MERGE = int(os.getenv("DEDUPE_AUTO_MERGE", "90"))
DEDUPE_REVIEW_FLOOR = int(os.getenv("DEDUPE_REVIEW_FLOOR", "60"))

# --- Google Sheets ---------------------------------------------------------
GOOGLE_SHEET_ID = os.getenv("GOOGLE_SHEET_ID", "")
GOOGLE_WORKSHEET = os.getenv("GOOGLE_WORKSHEET", "inventory")
GOOGLE_SA_JSON = os.getenv("GOOGLE_SA_JSON", str(ROOT / "service-account.json"))
GOOGLE_DRIVE_FOLDER_ID = os.getenv("GOOGLE_DRIVE_FOLDER_ID", "")

# --- Gemini (vision reader; same call the Apps Script 'Scan' button uses) ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

# --- Yardage sanity bounds (QA flags values outside this range) ------------
YARDAGE_MIN = float(os.getenv("YARDAGE_MIN", "0"))
YARDAGE_MAX = float(os.getenv("YARDAGE_MAX", "100000"))
