# ASAFabric Google Sheet Handoff

Last updated: 2026-06-20

Use `google-sheets-tracking/` as the main handoff folder for Google Sheet work.

## Current truth

- Live Google Sheet:
  `https://docs.google.com/spreadsheets/d/1wdwDo_UWCe8GJZ2G4GNQ93rZF1oZhn5lmclqgDMC8Pg/edit`
- Google Drive PDF folder:
  `https://drive.google.com/drive/u/1/folders/194XsU0gcDRgSkWUzouMCShvW_3lmn7Ff`
- Pages 01-05 currently feed Master List.
- Pages 06-32 are marked `NEED UPDATING` until re-checked against the PDF.
- Page ownership:
  - Pages 01-12: Shaan
  - Pages 13-24: Veer
  - Pages 25-32: Krish

## Source of truth

- Manual page JSON: `google-sheets-tracking/data/manual/Page NN.json`
- Builder: `google-sheets-tracking/scripts/build_workbook.py`
- Apps Script helper: `google-sheets-tracking/apps_script/Code.gs`
- Google Sheets tracking docs: `google-sheets-tracking/`

The old Gemini/raw extraction path is legacy. Do not use it as final truth
unless the user explicitly changes direction.

## Dynamic model

The intended chain is:

```text
Google Drive PDFs -> data/manual/Page NN.json -> Page NN tab -> Master List -> Control Panel
```

- The PDF is the visual source. JSON is a working transcription and may be wrong.
- Page tabs are generated from manual JSON after PDF re-check.
- Master List mirrors Page tabs with formulas.
- Control Panel counts Master List with formulas.
- PDF presence and PDF links are refreshed from the Google Drive folder by
  `scripts/build_workbook.py` or Apps Script.
- Manual `OK?`, sold checkbox, sold date, customer/invoice, and roll notes are
  preserved across rebuilds.

## For the next agent

Start with:

1. `google-sheets-tracking/README.md`
2. `google-sheets-tracking/AGENT_INSTRUCTIONS.md`
3. `google-sheets-tracking/PAGE_JSON_TEMPLATE.md`
4. `google-sheets-tracking/VERIFY_GOOGLE_SHEET.md`
5. `google-sheets-tracking/data/manual/README.md`

If working for Veer, start at Page 13 and continue through Page 24. Only add a
page to `MASTER_LIST_PAGES` in `google-sheets-tracking/scripts/build_workbook.py`
after it is checked against the PDF.

## Main command

```bash
.venv/bin/python google-sheets-tracking/scripts/build_workbook.py
```

Expected current rebuild shape:

- 32 page tabs
- 45 Master List fabric rows
- 5/32 pages transcribed into Master List
