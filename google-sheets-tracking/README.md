# Google Sheets Tracking

This folder documents the repeatable Google Sheets workflow for the ASAFabric
scan-to-inventory workbook.

Use this when another person or agent is continuing the sheet work. The current
source of truth is:

- Page data: `data/manual/Page NN.json`
- Workbook builder: `scripts/build_workbook.py`
- Apps Script helper: `apps_script/Code.gs`
- Manual JSON schema: `data/manual/README.md`

## Google assets

- Live Google Sheet:
  `https://docs.google.com/spreadsheets/d/1wdwDo_UWCe8GJZ2G4GNQ93rZF1oZhn5lmclqgDMC8Pg/edit`
- Google Drive PDF folder:
  `https://drive.google.com/drive/u/1/folders/194XsU0gcDRgSkWUzouMCShvW_3lmn7Ff`
- Sheet id for `.env`:
  `1wdwDo_UWCe8GJZ2G4GNQ93rZF1oZhn5lmclqgDMC8Pg`
- Drive folder id for `.env`:
  `194XsU0gcDRgSkWUzouMCShvW_3lmn7Ff`
- Service account email:
  `asafabric-sheets@gen-lang-client-0545517633.iam.gserviceaccount.com`

The service account needs access to both the Sheet and Drive folder. Keep
`service-account.json` local only; it is ignored by git.

The Drive folder should contain the PDFs named like `Page 01.pdf`,
`Page 02.pdf`, etc. The script checks this folder during rebuild and writes PDF
presence plus PDF links into the workbook.

## Current state

- Pages 01-05 are verified enough to feed the workbook.
- Pages 06-32 are placeholders until reviewed.
- `VERIFIED_PAGES` in `scripts/build_workbook.py` controls which pages feed the
  Master List.
- Current owners:
  - Pages 01-12: Shaan
  - Pages 13-24: Veer
  - Pages 25-32: Krish

## One source of truth

Do not duplicate scan data by hand across sheets.

- Page tabs are the source of truth inside Google Sheets.
- Master List mirrors page tab cells with formulas.
- Control Panel counts status from Master List formulas.
- Do not manually edit Master List inventory values.
- Do not put inventory totals in Control Panel unless the user asks for a
  workflow reason.

If a value comes from the scan, it belongs in `data/manual/Page NN.json`, then
on the generated Page tab. Master List should point back to the Page tab.

## What is dynamic

There are two kinds of dynamic behavior:

1. In-sheet formulas, which update immediately inside Google Sheets.
2. API refreshes, which update when `scripts/build_workbook.py` or Apps Script
   refresh runs.

In-sheet formulas:

- Master List mirrors Page tabs:
  - item: `='Page 01'!H1`
  - date: `='Page 01'!F1`
  - design: `='Page 01'!B4`
  - line note: `='Page 01'!J4`
  - master note: `='Page 01'!B2`
- Page tab summary totals calculate from the roll ledger.
- Sold rolls reduce available yards/pieces.
- `Needs Check` calculates from notes, mismatch, unclear values, and `OK?`.
- Control Panel line/check/OK counts calculate from Master List.

API-refresh values:

- PDF presence comes from the Google Drive folder.
- PDF links come from the Google Drive folder.
- Page tabs and Master rows are regenerated from `data/manual/Page NN.json`.
- Manual `OK?`, sold checkbox, sold date, customer/invoice, and roll notes are
  read before rebuild and written back after rebuild.

The Sheet does not automatically read/parse PDFs. A person or agent updates the
manual JSON from the scan, then rebuilds the workbook.

## How to add a verified page

1. Open the PDF/image for the page.
2. Edit `data/manual/Page NN.json`.
3. Keep each scan line as one fabric entry.
4. Put each roll value into `grid`, left-to-right and top-to-bottom.
5. Put line-specific uncertainty in the fabric `notes` field.
6. Put whole-page uncertainty in the top-level `notes` field.
7. When the page is verified, add the page number to `VERIFIED_PAGES` in
   `scripts/build_workbook.py`.
8. Rebuild:

```bash
.venv/bin/python scripts/build_workbook.py
```

9. Verify:
   - Page tab is clean and readable.
   - Master List has formulas pointing back to the Page tab.
   - Control Panel status/counts are correct.
   - No real spreadsheet formula errors are present.

## Veer start point

Veer should start with Page 13, then continue through Page 24.

At first, only add a page to `VERIFIED_PAGES` after it has been checked against
the scan. It is okay for `data/manual/Page 13.json` through `Page 24.json` to
exist before they are verified; they do not feed Master List until the constant
is updated.

## Good rules

- Less is better.
- Make the page tab resemble the scan page.
- Keep notes simple.
- `Line Note` is for one fabric/design line.
- `Master Note` is for something wrong or uncertain about the whole scanned page.
- `OK?` is the manual checkbox.
- `Needs Check` is dynamic and read-only.
- Sold fields are entered on the roll ledger and preserved across rebuilds.
- If it does not exist on the scan page, it should not become static inventory.
