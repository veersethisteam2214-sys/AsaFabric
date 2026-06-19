# Asa Fabric

This repo now holds two connected pieces of the Asa Fabric project:

- A static website prototype for the buyer-facing fabric catalog.
- A Google Sheets tracking workflow for turning scanned inventory PDFs into a
  clean, shared stock workbook.

The website uses sample catalog values for now. The real inventory source is the
Google Sheet built from the scanned PDFs.

## Website

Premium front-end concept for Asa Fabric, a textile stock house selling fabrics
such as TC, wool blend, poly cotton, chambray, twill, shirting, trousering, and
clearance dead stock.

Current files:

- `index.html` - page structure and content.
- `styles.css` - responsive visual design and textile treatments.
- `app.js` - sample catalog data, use-case rendering, search, and filters.

Next website steps:

1. Connect catalog data to the real stock Sheet or an exported CSV/JSON file.
2. Add real fabric photos for each lot.
3. Replace placeholder prices with confirmed roll and cut-length pricing.
4. Decide how enquiries should be handled: WhatsApp, email, form backend, or CRM.

## Google Sheets Tracking

The active Sheet workflow is documented in `google-sheets-tracking/`.

- Live Sheet:
  `https://docs.google.com/spreadsheets/d/1wdwDo_UWCe8GJZ2G4GNQ93rZF1oZhn5lmclqgDMC8Pg/edit`
- PDF Drive folder:
  `https://drive.google.com/drive/u/1/folders/194XsU0gcDRgSkWUzouMCShvW_3lmn7Ff`
- Tracking workspace: `google-sheets-tracking/`
- Current PDF transcription files: `google-sheets-tracking/data/manual/Page NN.json`
- Current builder: `google-sheets-tracking/scripts/build_workbook.py`
- Current active pages: Pages 01-05 feed Master List; Pages 06-32 stay
  `NEED UPDATING` until re-checked against the PDF.

For another agent, start with:

1. `google-sheets-tracking/README.md`
2. `google-sheets-tracking/AGENT_INSTRUCTIONS.md`
3. `google-sheets-tracking/data/manual/README.md`

The dynamic chain is:

```text
Google Drive PDFs -> google-sheets-tracking/data/manual/Page NN.json -> Page NN tab -> Master List -> Control Panel
```

Master List mirrors Page tabs with formulas. Control Panel counts Master List
with formulas. PDF presence and links refresh from Google Drive when the builder
or Apps Script runs.

## Ownership

- Pages 01-12: Shaan.
- Pages 13-24: Veer.
- Pages 25-32: Krish.

Only pages listed in `MASTER_LIST_PAGES` in
`google-sheets-tracking/scripts/build_workbook.py` feed Master List. Add a page
number there only after the PDF has been re-checked. The JSON is a working
transcription, not proof that the scan was read correctly.

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r google-sheets-tracking/requirements.txt
cp google-sheets-tracking/.env.example google-sheets-tracking/.env
```

Fill `.env` with the Google Sheet id, Drive folder id, and local service account
JSON path. Do not commit `.env` or `service-account.json`.

Main rebuild command:

```bash
.venv/bin/python google-sheets-tracking/scripts/build_workbook.py
```

## Repo Layout

```text
asafabric/
  index.html
  styles.css
  app.js
  google-sheets-tracking/
    README.md
    AGENT_INSTRUCTIONS.md
    PAGE_JSON_TEMPLATE.md
    VERIFY_GOOGLE_SHEET.md
  google-sheets-tracking/
    apps_script/
      Code.gs
    data/
      manual/
        Page 01.json ... Page 32.json
        README.md
      raw/
    scripts/
      build_workbook.py
      config.py
      google_io.py
      check_google.py
      split_pdf.py
      ...
    sample/
    photos/
```

## Rules

- Do not manually edit Master List inventory cells.
- Do not replace formulas with pasted values.
- Do not add Page 06+ to Master List until the PDF has been re-checked.
- Do not trust legacy Gemini/API output as final truth.
- Do not trust current JSON without comparing it back to the PDF.
- Keep scan-derived data in `google-sheets-tracking/data/manual/Page NN.json`.
- Keep secrets and scanned media out of git.
