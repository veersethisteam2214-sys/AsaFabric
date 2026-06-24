# Codex Mac Handoff - ASA Fabric Duplicate Sheet

This folder is for continuing the ASA Fabric inventory project from another
computer, especially Veer's office Mac. It summarizes the decisions, setup,
sheet IDs, rules, and final task list from the Codex chat on the Windows
desktop.

The next Codex agent should read this folder first, then read the existing
project docs in `google-sheets-tracking/`.

## Absolute Safety Rule

Work only on the duplicate Google Sheet.

- Live sheet, read only, do not edit:
  `https://docs.google.com/spreadsheets/d/1wdwDo_UWCe8GJZ2G4GNQ93rZF1oZhn5lmclqgDMC8Pg/edit`
- Duplicate sheet, all work goes here:
  `https://docs.google.com/spreadsheets/d/1O7qNn69Dy8LUfbKMTo9_NUkWPexb0djIKvy8WrzQl64/edit`
- Drive folder with scanned PDFs:
  `https://drive.google.com/drive/folders/194XsU0gcDRgSkWUzouMCShvW_3lmn7Ff`

Do not use Apps Script as the primary workflow. Use the Python/service-account
pipeline and Google Sheets API access.

## Current Service Account

Veer created a new Google Cloud service account:

`asafabric-sheets@asa-fabric-inventory.iam.gserviceaccount.com`

On the Windows machine, `service-account.json` was downloaded and placed in:

`google-sheets-tracking/service-account.json`

That key file is intentionally ignored by git and must not be committed.

On the Mac, the same JSON key must be copied manually into:

`google-sheets-tracking/service-account.json`

If the key is not available on the Mac, create/download a new JSON key for the
same service account in Google Cloud Console, then place it at that path.

The duplicate sheet and scanned-PDF Drive folder were shared with this service
account as Editor.

## Required Mac Setup

From the repo root:

```bash
cd google-sheets-tracking
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create `google-sheets-tracking/.env` on the Mac with exactly:

```env
GOOGLE_SHEET_ID=1O7qNn69Dy8LUfbKMTo9_NUkWPexb0djIKvy8WrzQl64
GOOGLE_DRIVE_FOLDER_ID=194XsU0gcDRgSkWUzouMCShvW_3lmn7Ff
GOOGLE_SA_JSON=service-account.json
```

Then verify credentials:

```bash
python scripts/check_google.py
```

The built-in check writes one temporary row to the duplicate sheet, reads it,
then deletes it.

On Windows, verification succeeded:

- Service account key loaded.
- Duplicate sheet read/write worked.
- Drive folder was reachable.
- PDF listing found 33 PDF files.

## Existing Repo Context To Read

Before changing the workbook, read:

1. `google-sheets-tracking/README.md`
2. `google-sheets-tracking/AGENT_INSTRUCTIONS.md`
3. `google-sheets-tracking/PAGE_JSON_TEMPLATE.md`
4. `google-sheets-tracking/VERIFY_GOOGLE_SHEET.md`
5. `google-sheets-tracking/data/manual/README.md`
6. `google-sheets-tracking/scripts/build_workbook.py`

Important existing model:

```text
Drive PDFs -> data/manual/Page NN.json -> Page NN tabs -> Master List -> Control Panel
```

The original repo says Master List mirrors page tabs with formulas, not pasted
static values. Keep that principle unless a deliberate redesign replaces it with
an equally repeatable formula/script-backed model.

## What Was Observed In The Duplicate Sheet

Read-only inspection through the Google Drive/Sheets connector showed:

- Spreadsheet title: `Copy of ASA Fabric Inventory`
- Locale: `en_GB`
- Time zone: `Asia/Bangkok`
- Tabs included:
  - `Control Panel`
  - `Master List`
  - `Page 01` through `Page 32`
  - hidden legacy tabs such as `Sheet1`, `inventory`, `Scan 1`, `Scan 2`
- Some page tabs were hidden in the duplicate.
- `Control Panel` contained historical statuses such as:
  - `IV / HIDDEN`
  - `DELETE / HIDDEN`
  - `CHECK WITH VEER'S DAD`
  - `CHECK`
  - `OPEN`
  - `DONE`
- Veer said to ignore those historical statuses because he will provide a fresh
  page-by-page status set.
- `Master List` appeared empty through connector reads, while Control Panel
  counts referenced page-tab ranges directly.

Conclusion: the duplicate sheet has drifted from the original repo-generated
model. Redesign should be deliberate and repeatable, not a blind run of the old
builder.

## User Clarifications From The Chat

Veer's answers:

1. Page status is always for the whole page, not mixed by line.
2. `IV (X)` means the stock/page should be removed from the sheets entirely
   eventually because the inventory is no longer available. Do not assume it was
   sold.
3. After processing a batch, report all pages flagged for Veer's manual check.
4. Future new-book pages should continue numbering consecutively, e.g. `Page 33`,
   `Page 34`, even if the source file starts again at `Page 01.pdf`.
5. Keep old individual page tabs visible for now. Veer may hide/delete them
   manually later or instruct Codex to do so.
6. Add a tab displaying total yards for the whole inventory.
7. Add a tab to track COGS and selling price.
8. Add a tab to calculate profit/loss when sales data is entered.
9. Currency is THB.
10. COGS should support both per-yard and per-roll tracking.
11. Sales input will usually include fabric name/type, quantity in yards,
    selling price, COGS, and customer name.
12. Invalid pages should not be auto-deleted. They must get a big visible flag:
    `PLEASE DELETE AFTER CHECKING`.

## Reference Repos Veer Asked Codex To Read

These were inspected as reference material, not installed as dependencies:

- `CodeDaim0n/gsheets-skill.git`
- `gmickel/sheets-cli.git`

Useful takeaways:

- Prefer Google Sheets-native formulas such as `FILTER`, `UNIQUE`, `SORT`,
  `QUERY`, `XLOOKUP`, `INDEX`, `MATCH`, `SUMIFS`, `COUNTIFS`, `IFERROR`.
- Prefer helper columns over unreadable mega-formulas.
- Avoid hardcoded totals in summary/dashboard tabs.
- Keep raw/source data, assumptions, calculations, summaries, and dashboard
  concepts separated.
- Use finite ranges where practical so the sheet does not become slow.
- Follow read -> decide -> dry-run/preview -> apply.
- Prefer key-based updates over fragile row-number assumptions when doing
  targeted edits.
- Batch related sheet updates.

## Workbook Redesign Intent

Make the duplicate sheet behave like a small inventory system, not only a
transcription workbook.

Recommended tab order:

1. `Dashboard`
2. `Active Inventory`
3. `Page Audit`
4. `Needs Check`
5. `Invalid Review`
6. `Inventory Totals`
7. `COGS & Pricing`
8. `Sales / Profit Loss`
9. `Master List`
10. `Page 01`, `Page 02`, ...

### Dashboard

First tab. High-level overview for Veer:

- total active yards
- total active rolls/pieces
- pages by status
- total inventory value at COGS
- estimated selling value
- estimated gross profit
- pages needing manual review
- invalid pages pending deletion check

### Active Inventory

Main day-to-day selling/inventory tab.

Include only active sellable inventory. Exclude `IV (X)`.

Suggested columns:

- Fabric ID
- Page
- Book
- Source PDF
- Design / fabric name
- Type / item
- Available yards
- Available rolls
- Final status
- COGS per yard
- COGS per roll
- Default selling price per yard
- Notes

### Page Audit

One row per page. This is the status-control tab.

Suggested columns:

- Page
- Book
- Source folder
- Source PDF
- Page tab link
- User Status
- Codex Audit Status
- Final Status
- Delete Flag
- Last Checked
- Manual Check Required?
- Audit Notes

Status values:

- `Valid`
- `Need Check`
- `IV (X)`

If `IV (X)`, `Delete Flag` must show:

`PLEASE DELETE AFTER CHECKING`

### Needs Check

Filtered queue for anything uncertain:

- user status is `Need Check`
- Codex audit finds uncertainty
- PDF/page-tab mismatch
- missing/unclear roll values
- missing important pricing/COGS data if needed

### Invalid Review

All `IV (X)` pages/items.

Must visibly show:

`PLEASE DELETE AFTER CHECKING`

Do not delete rows, page tabs, or JSON unless Veer explicitly instructs it.

### Inventory Totals

Automated totals in THB/yard terms:

- active available yards
- active available rolls
- totals by page
- totals by fabric/item/type
- separate valid inventory from need-check inventory
- exclude `IV (X)`

### COGS & Pricing

THB pricing/cost assumptions:

- Fabric ID or page/item key
- Fabric name/type
- COGS per yard
- COGS per roll
- Default selling price per yard
- Pricing notes
- Last updated

### Sales / Profit Loss

Sales entry and automatic calculations.

Veer inputs:

- sale date
- fabric name/type
- quantity sold in yards
- selling price
- COGS if needed
- customer name

Formulas should calculate:

- revenue
- total COGS
- gross profit/loss
- margin %
- optionally remaining inventory if the sale can be linked cleanly to a fabric ID

## Dual-Verification Rule

When Veer sends page statuses, Codex must also inspect the corresponding PDF and
page data.

Important limitation: a scanned inventory page can confirm what was recorded in
the book, but it cannot prove whether the physical stock is currently present or
gone. For `IV (X)`, trust Veer's status, but flag any inconsistency that should
be manually reviewed.

At the end of each batch, report:

- pages updated
- pages marked `Valid`
- pages marked `Need Check`
- pages marked `IV (X)`
- pages flagged for Veer's manual check
- any formula or access problems

## Final Final To-Do List

1. Keep all work duplicate-only.
2. Build a repeatable script-backed redesign, not one-off manual edits.
3. Use `Dashboard` as the first overview tab.
4. Add `Page Audit` as the status-control tab.
5. Add `Active Inventory` as the main selling tab, excluding `IV (X)`.
6. Add `Needs Check` for uncertain or manually flagged pages.
7. Add `Invalid Review` for `IV (X)` pages with
   `PLEASE DELETE AFTER CHECKING`.
8. Keep all existing `Page NN` tabs visible for now.
9. Add status banners to page tabs where useful.
10. Add `Inventory Totals` with total active yards and roll counts.
11. Add `COGS & Pricing` in THB, supporting cost per yard and cost per roll.
12. Add `Sales / Profit Loss` where sales inputs auto-calculate revenue, COGS,
    profit/loss, and margin.
13. Use maintainable formulas: `FILTER`, `SUMIFS`, `COUNTIFS`, `XLOOKUP`,
    `IFERROR`, finite ranges where practical.
14. Avoid hardcoded totals in summary tabs.
15. Use helper columns where formulas would otherwise become messy.
16. Apply Veer's whole-page statuses: `Valid`, `Need Check`, `IV (X)`.
17. For every page status Veer sends, audit the PDF/page data too.
18. If there are conflicts or uncertainty, continue but flag the page for manual
    review.
19. At the end of each batch, report all flagged pages.
20. Add future pages consecutively as `Page 33`, `Page 34`, etc.
21. Before sheet writes, read current state; for larger updates, prepare the
    change set first, then apply in batches.
22. Preserve service-account setup and keep private keys out of git.

## Suggested First Prompt On The Mac

Copy/paste this to Codex on the Mac after cloning the repo and opening it:

```text
Read codex-mac-handoff/README.md first, then read the google-sheets-tracking
docs listed there. Work only on the duplicate Google Sheet. Verify .env and
service-account.json are set up for the duplicate. Then wait for my page status
batch and follow the final to-do list in the handoff.
```

