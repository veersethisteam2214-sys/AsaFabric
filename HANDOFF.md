# ASAFabric — Handoff (for Codex / a new contributor)

Last updated: 2026-06-18. Repo: https://github.com/shaanpawa/ASAFabric (private).

## Goal
Digitize Veer's scanned fabric **packing-list** PDFs into a clean, collaborative
Google Sheet, then (later) a customer catalog + mass-send. Near-term target:
a **master Control Panel** (one row per page, status `NOT SCANNED → SCANNED →
APPROVED`) + a **detail tab per scan** (designs, colors, yards, pcs), every cell
linking to that page's PDF in Drive, with a self-service **"Scan" button** for
future drops. `scanned` (AI read it) and `approved` (a human verified the
numbers) are **distinct states**.

## What exists right now
- **Google robot (service account)** `asafabric-sheets@gen-lang-client-0545517633.iam.gserviceaccount.com`
  — READS the Drive folder + WRITES the Sheet. Key in `service-account.json` (gitignored).
  **It cannot upload to Drive** (a service account has 0 Drive storage) — key constraint.
- **Drive folder** `194XsU0gcDRgSkWUzouMCShvW_3lmn7Ff` (shared with the robot):
  2 source scans + per-page `Page 01.pdf … Page 32.pdf` + the Sheet
  **"ASA Fabric Inventory"** (`1wdwDo_UWCe8GJZ2G4GNQ93rZF1oZhn5lmclqgDMC8Pg`).
- **Python pipeline** in `scripts/` (see below). `scripts/gemini.py` reads a page
  PDF → structured packing-list JSON (validated on Page 01); `scripts/scan_gemini.py`
  bulk-reads → `data/raw/Page NN.gemini.json`. A free **Gemini API key** is already
  created (in the project) and lives in `.env` as `GEMINI_API_KEY`.

## Data model (packing list)
- Page header: `date, buyer, item (fabric type), ref, page_total_yards, page_total_pcs`.
- Per design row: `design_no, color_nos, total_yards, total_pcs, confidence, notes`.
- `needs_review` = confidence low OR total missing/non-numeric. `verified` = human-approved.
- Source-page mapping: pages 1–11 = Scan 1; pages 12–32 = Scan 2.

## scripts/ (Python)
- `config.py` — env-driven config (sheet id, folder id, keys, model).
- `google_io.py` — robot auth + Sheets/Drive helpers (`open_worksheet`,
  `list_folder_files`, `download_file`, `folder_image_links`).
- `gemini.py` — **reference vision read**: page PDF → `{header, rows}` JSON via the
  Gemini REST API (`generateContent`, inline PDF, `responseSchema`). To use OpenAI
  GPT vision instead, mirror this with the OpenAI API + an `OPENAI_API_KEY`.
- `scan_gemini.py` — resumable bulk read of `drive_upload/Page *.pdf` → `data/raw/`.
- `check_google.py` — connectivity smoke test.
- `setup_google.py` — writes Sheet/Drive ids into `.env`.
- `ingest_drive.py` — pull source files from Drive, split PDFs to per-page images.
- (older single-page helpers: `models.py`, `diff.py`, `dedupe.py`, `load_to_sheets.py`,
  `format_sheet.py`, `review_app.py`, `extract.py`, `providers.py` — earlier
  iterations; `providers.py` has an OpenAI vision adapter to crib from.)

## What's left to build (next tasks)
1. **`build_workbook.py`** — read `data/raw/*.gemini.json` → write the **Control Panel**
   + **Scan 1 / Scan 2** detail tabs via gspread, with `=HYPERLINK()` to each
   `Page NN.pdf`, number formats, `needs_review`/`verified` checkboxes, amber flag
   highlight, status coloring, basic filter. Resolve Drive links via
   `google_io.list_folder_files`.
2. **`apps_script/Code.gs`** — bound Apps Script: menu **"ASA Fabric"** →
   *Scan new PDFs* (UrlFetchApp → vision API on page PDFs not yet scanned; append to
   the right detail tab; **never overwrite `verified` rows**) and *Rebuild Control
   Panel & format*. Key in Script Properties (`VISION_API_KEY`).
3. **In-sheet verification**: humans tick `verified` → Control Panel flips to APPROVED.

## Vision engine — pick one (Codex can't "see" images itself)
- **Gemini API** (free tier, already wired in `gemini.py`) — works today.
- **OpenAI GPT vision** — paid; set `OPENAI_API_KEY`; adapt `gemini.py` / `providers.py`.
- **ChatGPT app** — paste pages manually, copy results. No automation.

## Secrets / running (NOT in the repo — gitignored)
`.env` keys: `GOOGLE_SHEET_ID`, `GOOGLE_DRIVE_FOLDER_ID`, `GEMINI_API_KEY`,
`GOOGLE_SA_JSON`. Robot key: `service-account.json`. **A Codex cloud task needs
these supplied as env/secrets, and network access enabled, to run anything that
touches Google or a vision API** — otherwise Codex can only edit code.

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python scripts/check_google.py     # verify robot can reach Sheet + Drive
python scripts/scan_gemini.py      # read pages -> data/raw/   (needs GEMINI_API_KEY)
```

## Suggested Codex kickoff prompt
> This repo digitizes scanned fabric packing-list PDFs into a Google Sheet. Read
> HANDOFF.md fully. The robot service account reads Drive + writes the Sheet but
> cannot upload to Drive. Build `scripts/build_workbook.py` to assemble
> `data/raw/*.gemini.json` into a Control Panel tab (one row per page, status
> NOT SCANNED/SCANNED/APPROVED, links to each Page NN.pdf) plus Scan 1 / Scan 2
> detail tabs (design/colors/yards/pcs, needs_review + verified checkboxes, amber
> flags). Then author `apps_script/Code.gs` for an in-sheet "Scan" button. Use the
> data model and `google_io.py` helpers described in HANDOFF.md. Note: vision
> reading needs an API key (Gemini already wired in `gemini.py`, or OpenAI via an
> OPENAI_API_KEY); the ChatGPT subscription cannot be called from code.
