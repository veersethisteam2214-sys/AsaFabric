"""Smoke-test the Google integration — needs NO vision-model keys.

Run this FIRST to confirm credentials work before wiring the rest. It:
  1. reads the service-account JSON and prints the email to share things with,
  2. writes a test row to your Sheet and reads it back (then cleans it up),
  3. (optional) uploads a page image to your Drive folder and prints the link.

    python scripts/check_google.py
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import config
import google_io


def main() -> None:
    ok = True

    # 1. credentials + the email to share with
    try:
        email = google_io.service_account_email()
        print(f"[ok ] service account: {email}")
        print("      -> share your Sheet (and Drive folder) with this email as Editor")
    except Exception as exc:
        sys.exit(f"[FAIL] could not read {config.GOOGLE_SA_JSON}: {exc}")

    if not config.GOOGLE_SHEET_ID:
        sys.exit("[FAIL] GOOGLE_SHEET_ID not set in .env")

    # 2. Sheet write + read-back (+ cleanup)
    try:
        ws = google_io.open_worksheet()
        ws.append_row(["__connectivity_test__", "safe to ignore"], value_input_option="RAW")
        vals = ws.get_all_values()
        assert vals and vals[-1] and vals[-1][0] == "__connectivity_test__"
        ws.delete_rows(len(vals))  # remove the test row
        print(f"[ok ] sheet read/write works: '{config.GOOGLE_WORKSHEET}' in {config.GOOGLE_SHEET_ID}")
    except Exception as exc:
        ok = False
        print(f"[FAIL] sheet access: {exc}")

    # 3. Drive folder access (read — a service account can read/link, not upload)
    folder = config.GOOGLE_DRIVE_FOLDER_ID
    if folder:
        try:
            links = google_io.folder_image_links(folder)
            print(f"[ok ] drive folder reachable: {len(links)} image file(s) found")
        except Exception as exc:
            ok = False
            print(f"[FAIL] drive folder (is it shared with the service account?): {exc}")
    else:
        print("[skip] drive: set GOOGLE_DRIVE_FOLDER_ID in .env")

    print("\nAll green — Google credentials are wired up. ✅" if ok else "\nSome checks failed — see above. ❌")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
