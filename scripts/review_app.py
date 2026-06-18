"""Interactive page-review app: scan a page -> two models read it -> you confirm
-> rows append to the Google Sheet.

This is the "press yes/no after we scan" workflow. Rows where the two models
AGREE are pre-approved; DISAGREE rows are highlighted with both models' values
so you only have to decide the handful that actually conflict. Nothing reaches
the Sheet until you click Approve — so a misread yardage can't slip in silently.

Reuses the same extraction (providers.py) and cross-check (diff.py) as the batch
pipeline. Run it with:

    source .venv/bin/activate
    pip install -r requirements.txt          # includes streamlit
    streamlit run scripts/review_app.py

Requires the two model API keys and the Google Sheets service account in .env
(see README). Fabric-name de-duplication still runs as a final pass (dedupe.py)
once the whole book is in — clustering needs the full set of names.
"""
from __future__ import annotations

import sys
import tempfile
from itertools import zip_longest
from pathlib import Path

import streamlit as st

sys.path.insert(0, str(Path(__file__).resolve().parent))
import config
import diff
import providers


# --- Google Sheets helpers -------------------------------------------------
def _worksheet():
    import gspread

    gc = gspread.service_account(filename=config.GOOGLE_SA_JSON)
    sh = gc.open_by_key(config.GOOGLE_SHEET_ID)
    try:
        ws = sh.worksheet(config.GOOGLE_WORKSHEET)
    except gspread.WorksheetNotFound:
        ws = sh.add_worksheet(title=config.GOOGLE_WORKSHEET, rows=2000, cols=20)
    if not ws.acell("A1").value:  # write the header once
        ws.update(values=[diff.FIELDS], range_name="A1")
    return ws


def append_rows_to_sheet(rows: list) -> int:
    ws = _worksheet()
    values = [[str(r.get(c, "")) for c in diff.FIELDS] for r in rows]
    if values:
        ws.append_rows(values, value_input_option="RAW")  # one batched write per page
    return len(values)


# --- Extraction (cached per uploaded file) ---------------------------------
def extract_both(image_path: Path, page_ref: str) -> list:
    ea = [e.__dict__ for e in providers.extract(config.MODEL_A, image_path)]
    eb = [e.__dict__ for e in providers.extract(config.MODEL_B, image_path)]
    return [
        diff.build_row(page_ref, i, a, b)
        for i, (a, b) in enumerate(zip_longest(ea, eb), start=1)
    ]


# --- UI --------------------------------------------------------------------
st.set_page_config(page_title="ASAFabric — page review", layout="wide")
st.title("ASAFabric — scan & confirm")

with st.sidebar:
    st.subheader("Config")
    st.write(f"**Model A:** `{config.MODEL_A}`")
    st.write(f"**Model B:** `{config.MODEL_B}`")
    st.write(f"**Sheet:** `{config.GOOGLE_SHEET_ID or 'NOT SET — see .env'}`")
    st.caption("Green = both models agree (pre-approved). Yellow = they disagree; check it.")
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
        if not config.GOOGLE_SHEET_ID:
            st.warning("GOOGLE_SHEET_ID isn't set in .env — you can review, but Approve will fail until it is.")
        with st.spinner(f"Reading page with {config.MODEL_A} + {config.MODEL_B}…"):
            try:
                st.session_state[cache_key] = extract_both(tmp, page_ref)
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
        for r in rows:
            agree = r["agreement_flag"] == "AGREE"
            c = st.columns([0.5, 3.5, 1.5, 3])
            ok = c[0].checkbox(
                "ok", value=agree, key=f"ok{cache_key}{r['row_index']}",
                label_visibility="collapsed",
            )
            name = c[1].text_input(
                "name", value=r["raw_name"], key=f"nm{cache_key}{r['row_index']}",
                label_visibility="collapsed",
            )
            yard = c[2].text_input(
                "yd", value=r["yardage"], key=f"yd{cache_key}{r['row_index']}",
                label_visibility="collapsed",
            )
            if agree:
                status = "🟢 agree"
            else:
                status = (
                    f"🟡 {r['agreement_flag']} — "
                    f"A:`{r['pass_a_name']}/{r['pass_a_yard']}` "
                    f"B:`{r['pass_b_name']}/{r['pass_b_yard']}`"
                )
            if r["yardage_warn"]:
                status += f"  ❗{r['yardage_warn']}"
            c[3].markdown(status)
            edited.append(
                {**r, "raw_name": name, "yardage": yard,
                 "verified": "TRUE" if ok else "FALSE", "_approved": ok}
            )

    n_ok = sum(e["_approved"] for e in edited)
    st.caption(f"{n_ok} / {len(edited)} rows approved")

    disabled = page_ref in st.session_state.appended_pages
    if st.button("✅ Approve & append to Sheet", type="primary", disabled=disabled):
        to_write = [e for e in edited if e["_approved"]]
        try:
            n = append_rows_to_sheet(to_write)
            st.session_state.appended_pages.append(page_ref)
            st.success(f"Appended {n} rows for '{page_ref}'. Scan the next page.")
        except Exception as exc:
            st.error(f"Append failed: {exc}")
    if disabled:
        st.info(f"'{page_ref}' was already appended this session.")
