"""Shared data model + the strict-JSON schema every vision model must emit."""
from __future__ import annotations

from dataclasses import dataclass

# The schema we force every vision model to return (one page -> many entries).
# Keep `yardage` a STRING: preserve exactly what's on the page ("12 1/2",
# "12.5", "~12") and validate/parse downstream, rather than losing information
# at read time.
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
                },
                "required": ["fabric_name", "yardage"],
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
    "'UNREADABLE'. Do not skip rows and do not merge rows. Return only JSON "
    "matching the provided schema."
)


@dataclass
class Entry:
    fabric_name: str
    yardage: str
    notes: str = ""

    @classmethod
    def from_dict(cls, d: dict) -> "Entry":
        return cls(
            fabric_name=str(d.get("fabric_name", "")).strip(),
            yardage=str(d.get("yardage", "")).strip(),
            notes=str(d.get("notes", "")).strip(),
        )
