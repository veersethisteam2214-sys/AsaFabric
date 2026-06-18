"""Shared data model + the strict-JSON schema every vision model must emit."""
from __future__ import annotations

import re
from dataclasses import dataclass

# The schema we force every vision model to return (one page -> many entries).
# Keep `yardage` a STRING: preserve exactly what's on the page ("12 1/2",
# "12.5", "~12") and validate/parse downstream, rather than losing information
# at read time. `confidence` lets a single model self-flag unclear rows so the
# human-review signal still works without a second model.
EXTRACTION_SCHEMA = {
    "type": "object",
    "properties": {
        "entries": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "fabric_name": {"type": "string"},
                    "yardage": {"type": "string"},
                    "notes": {"type": "string"},
                    "confidence": {"type": "string", "enum": ["high", "low"]},
                },
                "required": ["fabric_name", "yardage", "confidence"],
                "additionalProperties": False,
            },
        }
    },
    "required": ["entries"],
    "additionalProperties": False,
}

EXTRACTION_PROMPT = (
    "You are transcribing one page of a handwritten fabric inventory book. "
    "Read every row exactly as written, top to bottom. For each row return the "
    "fabric name/description and its yardage. Transcribe the yardage EXACTLY as "
    "written (keep fractions, decimals, or symbols verbatim); never round, infer, "
    "or invent a number. If a value is unreadable, put the literal string "
    "'UNREADABLE'. Set \"confidence\" to \"low\" for any row where the name or "
    "(especially) the yardage digits are unclear, smudged, or ambiguous, and "
    "\"high\" only when you are sure of every character. Do not skip rows and do "
    "not merge rows. Return only JSON matching the provided schema."
)

# Columns shown in the master Google Sheet (single-model presentation).
SHEET_COLUMNS = [
    "page", "image", "fabric_name", "yardage", "notes", "confidence",
    "needs_review", "verified",
]


@dataclass
class Entry:
    fabric_name: str
    yardage: str
    notes: str = ""
    confidence: str = "high"

    @classmethod
    def from_dict(cls, d: dict) -> "Entry":
        return cls(
            fabric_name=str(d.get("fabric_name", "")).strip(),
            yardage=str(d.get("yardage", "")).strip(),
            notes=str(d.get("notes", "")).strip(),
            confidence=str(d.get("confidence", "high")).strip().lower() or "high",
        )


def needs_review(entry: dict) -> bool:
    """A row needs a human look if the model was unsure or the yardage looks off."""
    conf = str(entry.get("confidence", "")).lower()
    y = str(entry.get("yardage", "")).strip()
    numeric_start = bool(re.match(r"^[0-9]", y))
    return conf == "low" or y == "" or y.upper() == "UNREADABLE" or not numeric_start


def sheet_row(page: str, entry: dict, image_link: str = "") -> dict:
    """Map a raw extracted entry to the master-sheet presentation columns."""
    return {
        "page": page,
        "image": image_link,
        "fabric_name": entry.get("fabric_name", ""),
        "yardage": entry.get("yardage", ""),
        "notes": entry.get("notes", ""),
        "confidence": entry.get("confidence", ""),
        "needs_review": "TRUE" if needs_review(entry) else "FALSE",
        "verified": "FALSE",
    }
