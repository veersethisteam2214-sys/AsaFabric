"""Record your Sheet + Drive folder IDs into .env (robot-account mode).

You create a blank Google Sheet and share it + your Drive folder with the
service-account email (see README / run check_google.py to print that email),
then point this at the Sheet:

    python scripts/setup_google.py <google-sheet-url-or-id>
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import config

DRIVE_FOLDER_ID = "194XsU0gcDRgSkWUzouMCShvW_3lmn7Ff"


def extract_sheet_id(s: str) -> str:
    m = re.search(r"/spreadsheets/d/([a-zA-Z0-9-_]+)", s)
    return m.group(1) if m else s.strip()


def set_env(key: str, value: str) -> None:
    env = config.ROOT / ".env"
    lines = env.read_text().splitlines() if env.exists() else []
    out, found = [], False
    for ln in lines:
        if ln.split("=", 1)[0] == key:
            out.append(f"{key}={value}")
            found = True
        else:
            out.append(ln)
    if not found:
        out.append(f"{key}={value}")
    env.write_text("\n".join(out) + "\n")


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit("usage: python scripts/setup_google.py <google-sheet-url-or-id>")
    sid = extract_sheet_id(sys.argv[1])
    set_env("GOOGLE_SHEET_ID", sid)
    set_env("GOOGLE_DRIVE_FOLDER_ID", DRIVE_FOLDER_ID)
    print(f"wrote .env: GOOGLE_SHEET_ID={sid}")
    print(f"wrote .env: GOOGLE_DRIVE_FOLDER_ID={DRIVE_FOLDER_ID}")
    print("\nNow verify the connection:  python scripts/check_google.py")


if __name__ == "__main__":
    main()
