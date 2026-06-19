"""Shared Google auth + Sheets/Drive helpers (one service account for both).

Used by check_google.py, review_app.py, and load_to_sheets.py so there's a
single place that knows how to talk to Google. Needs no vision-model keys —
only the service-account JSON (GOOGLE_SA_JSON) and a Sheet shared with the
service-account email.
"""
from __future__ import annotations

import json
import mimetypes
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import config

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]


def credentials():
    if Path(config.GOOGLE_SA_JSON).exists():
        from google.oauth2.service_account import Credentials

        return Credentials.from_service_account_file(config.GOOGLE_SA_JSON, scopes=SCOPES)
    # Fallback: Application Default Credentials (`gcloud auth application-default login`)
    import google.auth

    creds, _ = google.auth.default(scopes=SCOPES)
    return creds


def service_account_email() -> str:
    """The address to SHARE your Sheet / Drive folder with (service-account mode)."""
    p = Path(config.GOOGLE_SA_JSON)
    if p.exists():
        return json.loads(p.read_text()).get("client_email", "")
    return "(using your gcloud application-default login — nothing to share)"


def open_worksheet(create_header: list | None = None):
    import gspread

    gc = gspread.authorize(credentials())
    sh = gc.open_by_key(config.GOOGLE_SHEET_ID)
    try:
        ws = sh.worksheet(config.GOOGLE_WORKSHEET)
    except gspread.WorksheetNotFound:
        ws = sh.add_worksheet(title=config.GOOGLE_WORKSHEET, rows=2000, cols=26)
    if create_header and not ws.acell("A1").value:
        ws.update(values=[create_header], range_name="A1")
    return ws


def create_spreadsheet(title: str, share_with: str = "", header: list | None = None) -> str:
    """Create a new spreadsheet (owned by these creds), optionally share it and
    write a header row. Returns the spreadsheet id."""
    import gspread

    gc = gspread.authorize(credentials())
    sh = gc.create(title)
    ws = sh.sheet1
    try:
        ws.update_title(config.GOOGLE_WORKSHEET)
    except Exception:
        pass
    if header:
        ws.update(values=[header], range_name="A1")
    if share_with:
        sh.share(share_with, perm_type="user", role="writer", notify=False)
    return sh.id


def _drive():
    from googleapiclient.discovery import build

    return build("drive", "v3", credentials=credentials(), cache_discovery=False)


def upload_image_to_drive(image_path, folder_id: str, make_public: bool = True) -> str:
    """Upload one image into a shared Drive folder; return a shareable link."""
    from googleapiclient.http import MediaFileUpload

    image_path = Path(image_path)
    svc = _drive()
    meta = {"name": image_path.name, "parents": [folder_id]}
    mime = mimetypes.guess_type(str(image_path))[0] or "image/png"
    media = MediaFileUpload(str(image_path), mimetype=mime, resumable=False)
    f = svc.files().create(
        body=meta, media_body=media, fields="id, webViewLink", supportsAllDrives=True
    ).execute()
    if make_public:
        svc.permissions().create(
            fileId=f["id"], body={"role": "reader", "type": "anyone"}, supportsAllDrives=True
        ).execute()
    return f.get("webViewLink") or f"https://drive.google.com/uc?id={f['id']}"


def folder_image_links(folder_id: str) -> dict:
    """Read-only: {filename: shareable link} for image files in a Drive folder.
    Works with a service account — listing/reading needs no storage quota."""
    svc = _drive()
    q = f"'{folder_id}' in parents and mimeType contains 'image/' and trashed = false"
    out: dict = {}
    token = None
    while True:
        resp = svc.files().list(
            q=q,
            fields="nextPageToken, files(id, name, webViewLink)",
            pageSize=1000,
            pageToken=token,
            supportsAllDrives=True,
            includeItemsFromAllDrives=True,
        ).execute()
        for f in resp.get("files", []):
            out[f["name"]] = f.get("webViewLink") or f"https://drive.google.com/file/d/{f['id']}/view"
        token = resp.get("nextPageToken")
        if not token:
            break
    return out


def list_folder_files(folder_id: str, mime_contains: str = "") -> list:
    """Read-only: list files in a Drive folder (optionally filtered by mimeType)."""
    svc = _drive()
    q = f"'{folder_id}' in parents and trashed = false"
    if mime_contains:
        q += f" and mimeType contains '{mime_contains}'"
    out, token = [], None
    while True:
        resp = svc.files().list(
            q=q,
            fields="nextPageToken, files(id, name, mimeType, webViewLink)",
            pageSize=1000,
            pageToken=token,
            supportsAllDrives=True,
            includeItemsFromAllDrives=True,
        ).execute()
        out.extend(resp.get("files", []))
        token = resp.get("nextPageToken")
        if not token:
            break
    return out


def download_file(file_id: str, dest) -> Path:
    """Read-only: download a Drive file's bytes to a local path."""
    import io

    from googleapiclient.http import MediaIoBaseDownload

    dest = Path(dest)
    dest.parent.mkdir(parents=True, exist_ok=True)
    req = _drive().files().get_media(fileId=file_id, supportsAllDrives=True)
    with open(dest, "wb") as fh:
        dl = MediaIoBaseDownload(fh, req)
        done = False
        while not done:
            _, done = dl.next_chunk()
    return dest
