"""Interactive page-review app: scan a page -> Claude reads it -> you confirm
-> rows append to the master Google Sheet.

Single-model mode (MODEL_A). High-confidence rows are pre-approved; rows the
model marked low-confidence (or with an odd yardage) are flagged for a look.
Nothing reaches the Sheet until you click Approve.

    source .venv/bin/activate
    pip install -r requirements.txt
    streamlit run scripts/review_app.py
"""
from __future__ import annotations

import sys
import tempfile
from pathlib import Path

import streamlit as st

sys.path.insert(0, str(Path(__file__).resolve().parent))
import config
import google_io
import models as M
import providers


def image_link_for(image_name: str) -> str:
    if not (image_name and config.GOOGLE_DRIVE_FOLDER_ID):
        return ""
    try:
        links = google_io.folder_image_links(config.GOOGLE_DRIVE_FOLDER_ID)
    except Exception:
        return ""
    for name, link in links.items():
        if name == image_name or Path(name).stem == Path(image_name).stem:
            return link
    return ""


def append_rows_to_sheet(rows: list, image_name: str = "") -> int:
    import format_sheet

    link = image_link_for(image_name)
    formula = f'=HYPERLINK("{link.replace(chr(34), "%22")}","view")' if link else ""
    ws = google_io.open_worksheet(create_header=M.SHEET_COLUMNS)
    values = [
        [(formula if c == "image" else str(r.get(c, ""))) for c in M.SHEET_COLUMNS]
        for r in rows
    ]
    if values:
        ws.append_rows(values, value_input_option="USER_ENTERED")
    try:
        format_sheet.format_inventory(ws)
    except Exception:
        pass
    return len(values)


def extract_rows(image_path: Path, page_ref: str) -> list:
    entries = [e.__dict__ for e in providers.extract(config.MODEL_A, image_path)]
    return [M.sheet_row(page_ref, e) for e in entries]


# --- UI --------------------------------------------------------------------
st.set_page_config(page_title="ASAFabric — page review", layout="wide")
st.title("ASAFabric — scan & confirm")

with st.sidebar:
    st.subheader("Config")
    st.write(f"**Model:** `{config.MODEL_A}`")
    st.write(f"**Sheet:** `{config.GOOGLE_SHEET_ID or 'NOT SET — see .env'}`")
    st.caption("🟢 high confidence (pre-approved). 🟡 low confidence — check it.")
    if "appended_pages" not in st.session_state:
        st.session_state.appended_pages = []
    if st.session_state.appended_pages:
        st.success("Appended: " + ", ".join(st.session_state.appended_pages))

uploaded = st.file_uploader(
    "Scan / upload the next page photo", type=["jpg", "jpeg", "png", "webp"]
)

if uploaded:
    tmp = Path(tempfile.gettempdir()) / uploaded.name
    tmp.write_bytes(uploaded.getbuffer())
    page_ref = st.text_input("Page label", value=Path(uploaded.name).stem)

    cache_key = f"rows::{uploaded.name}"
    if cache_key not in st.session_state:
        with st.spinner(f"Reading page with {config.MODEL_A}…"):
            try:
                st.session_state[cache_key] = extract_rows(tmp, page_ref)
            except Exception as exc:
                st.error(f"Extraction failed: {exc}")
                st.stop()
    rows = st.session_state[cache_key]

    col_img, col_rows = st.columns([1, 2])
    with col_img:
        st.image(str(tmp), use_container_width=True)

    with col_rows:
        st.markdown("**✓ &nbsp; fabric name &nbsp; · &nbsp; yards &nbsp; · &nbsp; status**")
        edited = []
        for i, r in enumerate(rows):
            flagged = r["needs_review"] == "TRUE"
            c = st.columns([0.5, 3.5, 1.5, 2])
            ok = c[0].checkbox(
                "ok", value=not flagged, key=f"ok{cache_key}{i}", label_visibility="collapsed"
            )
            name = c[1].text_input(
                "name", value=r["fabric_name"], key=f"nm{cache_key}{i}", label_visibility="collapsed"
            )
            yard = c[2].text_input(
                "yd", value=r["yardage"], key=f"yd{cache_key}{i}", label_visibility="collapsed"
            )
            c[3].markdown("🟡 low — check" if flagged else "🟢 high")
            edited.append(
                {**r, "fabric_name": name, "yardage": yard,
                 "verified": "TRUE" if ok else "FALSE", "_approved": ok}
            )

    n_ok = sum(e["_approved"] for e in edited)
    st.caption(f"{n_ok} / {len(edited)} rows approved")

    disabled = page_ref in st.session_state.appended_pages
    if st.button("✅ Approve & append to Sheet", type="primary", disabled=disabled):
        to_write = [{k: v for k, v in e.items() if k != "_approved"} for e in edited if e["_approved"]]
        try:
            n = append_rows_to_sheet(to_write, uploaded.name)
            st.session_state.appended_pages.append(page_ref)
            st.success(f"Appended {n} rows for '{page_ref}'. Scan the next page.")
        except Exception as exc:
            st.error(f"Append failed: {exc}")
    if disabled:
        st.info(f"'{page_ref}' was already appended this session.")
