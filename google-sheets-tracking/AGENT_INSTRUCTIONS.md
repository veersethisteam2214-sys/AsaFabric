# Agent Instructions

You are continuing the ASAFabric Google Sheets tracking workbook.

Read these files before changing anything:

1. `google-sheets-tracking/README.md`
2. `google-sheets-tracking/data/manual/README.md`
3. `google-sheets-tracking/scripts/build_workbook.py`
4. `google-sheets-tracking/apps_script/Code.gs`

Work inside the `google-sheets-tracking/` folder for Sheet/Drive tasks.

## Mission

Continue verifying scanned inventory pages and make the generated Google Sheet
clean, simple, and repeatable.

The user wants no static inventory data except what is re-checked from the PDF
and entered into `data/manual/Page NN.json`. Existing JSON may be wrong. Open the
PDF again before trusting or expanding any page. Master List must mirror page
tabs with formulas. Control Panel is workflow only.

## Google assets

- Live Google Sheet:
  `https://docs.google.com/spreadsheets/d/1wdwDo_UWCe8GJZ2G4GNQ93rZF1oZhn5lmclqgDMC8Pg/edit`
- Google Drive PDF folder:
  `https://drive.google.com/drive/u/1/folders/194XsU0gcDRgSkWUzouMCShvW_3lmn7Ff`
- `.env` should contain:
  - `GOOGLE_SHEET_ID=1wdwDo_UWCe8GJZ2G4GNQ93rZF1oZhn5lmclqgDMC8Pg`
  - `GOOGLE_DRIVE_FOLDER_ID=194XsU0gcDRgSkWUzouMCShvW_3lmn7Ff`
  - `GOOGLE_SA_JSON=service-account.json`
- Service account email:
  `asafabric-sheets@gen-lang-client-0545517633.iam.gserviceaccount.com`

Keep `service-account.json` out of git.

The Drive folder is where the scanned PDFs live. The rebuild script checks it
for `Page NN.pdf` files and writes PDF presence/links into the workbook.

## Current ownership

- Shaan: Pages 01-12
- Veer: Pages 13-24
- Krish: Pages 25-32

If you are working for Veer, start at Page 13 and continue in order.

## Do not do these

- Do not edit Master List inventory cells manually.
- Do not add Page 06+ to Master List until the PDF has been re-checked.
- Do not trust legacy Gemini/API output as final truth.
- Do not trust current JSON without comparing it back to the PDF.
- Do not replace formulas with pasted values.
- Do not add extra static tracking columns to scan pages.
- Do not change the workbook shape unless the user asks.

## Dynamic model

The workbook has one clean chain:

```text
Google Drive PDFs -> data/manual/Page NN.json -> Page NN tab -> Master List -> Control Panel
```

- Google Drive is checked by API during rebuild for PDF presence/links.
- `data/manual/Page NN.json` is the manual scan transcription, not proof of accuracy.
- Page tabs are generated from JSON and hold the working roll ledger.
- Master List uses formulas pointing back to Page tabs.
- Control Panel uses formulas counting Master List.

If you change Page 13 item/date/design/line notes on the Page 13 tab, the Master
List should update by formula. If you change `data/manual/Page 13.json`, rebuild
the workbook so Page 13 tab updates first.

## Page verification process

For each page:

1. Open the scanned PDF/image from the Google Drive folder.
2. Compare it to `data/manual/Page NN.json`; do not trust JSON by itself.
3. Make the JSON match the scan.
4. Use one fabric entry per scan line/design.
5. Put roll values in `grid`, left-to-right and top-to-bottom.
6. Use `total_amount` and `piece_count` only when those totals are written on the
   scan or clearly intended by the page.
7. Use fabric `notes` for a line-specific issue.
8. Use top-level `notes` for a whole-page issue.
9. Add the page number to `MASTER_LIST_PAGES` in `scripts/build_workbook.py`.
10. Run `python scripts/build_workbook.py`.

## Required checks after rebuilding

Confirm:

- Master List only contains pages in `MASTER_LIST_PAGES`.
- New Master List rows use formulas like `='Page 13'!H1`, not pasted item/date
  values.
- Control Panel line counts come from Master List formulas.
- Page tabs outside `MASTER_LIST_PAGES` show `NEED UPDATING` and have zero Master
  rows.
- Manual `OK?`, sold checkbox, sold date, customer/invoice, and roll notes
  survive rebuilds.
- There are no real formula errors such as `#REF!`, `#VALUE!`, `#NAME?`,
  `#DIV/0!`, `#N/A`, `#ERROR!`, `#NUM!`, or `#NULL!`.

## Useful commands

```bash
rg "MASTER_LIST_PAGES|MASTER_HEADERS|PAGE_SUMMARY_HEADERS" scripts/build_workbook.py
PYTHONPYCACHEPREFIX=/private/tmp/asafabric-pycache python -m py_compile scripts/build_workbook.py
python scripts/build_workbook.py
```

## Handoff note

When you finish a page batch, report:

- Pages re-checked against PDF.
- Pages added to `MASTER_LIST_PAGES`.
- Any line notes or master notes that still need human review.
- Master List row count.
- Formula error check result.
