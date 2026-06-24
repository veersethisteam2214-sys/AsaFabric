# Prompt For Codex On The Mac

Read this file and `codex-mac-handoff/README.md` completely before doing any
work.

You are continuing Veer's ASA Fabric inventory project from a previous Codex
chat. The Windows Codex set up and verified service-account access, but the key
file itself is not in git and must be placed locally on this Mac.

## Mission

Redesign and continue the duplicate Google Sheet as an inventory, audit,
pricing, and sales/profit tracking workbook.

Work only on the duplicate sheet:

`https://docs.google.com/spreadsheets/d/1O7qNn69Dy8LUfbKMTo9_NUkWPexb0djIKvy8WrzQl64/edit`

Never edit the live sheet:

`https://docs.google.com/spreadsheets/d/1wdwDo_UWCe8GJZ2G4GNQ93rZF1oZhn5lmclqgDMC8Pg/edit`

Use the Drive PDF folder:

`https://drive.google.com/drive/folders/194XsU0gcDRgSkWUzouMCShvW_3lmn7Ff`

## Setup Check

Before any writes:

1. Confirm `google-sheets-tracking/.env` points to the duplicate:

```env
GOOGLE_SHEET_ID=1O7qNn69Dy8LUfbKMTo9_NUkWPexb0djIKvy8WrzQl64
GOOGLE_DRIVE_FOLDER_ID=194XsU0gcDRgSkWUzouMCShvW_3lmn7Ff
GOOGLE_SA_JSON=service-account.json
```

2. Confirm `google-sheets-tracking/service-account.json` exists locally.
3. Run `python scripts/check_google.py` from `google-sheets-tracking`.
4. If the key is missing, ask Veer to copy/download it before proceeding.

## Current Service Account

`asafabric-sheets@asa-fabric-inventory.iam.gserviceaccount.com`

The duplicate sheet and Drive folder should already be shared with this account
as Editor.

## Important User Rules

- Status is always whole-page.
- Valid means the page remains active inventory.
- Need Check means keep it but flag for manual review.
- IV (X) means the inventory is no longer available and should eventually be
  removed, but do not delete it yet.
- For IV (X), show `PLEASE DELETE AFTER CHECKING`.
- Keep page tabs visible for now.
- Future pages continue as Page 33, Page 34, etc.
- Currency is THB.
- COGS should support per-yard and per-roll tracking.
- Sales tab should calculate revenue, COGS, profit/loss, and margin from Veer's
  sales inputs.

## Redesign Tabs

Create/update:

1. `Dashboard`
2. `Active Inventory`
3. `Page Audit`
4. `Needs Check`
5. `Invalid Review`
6. `Inventory Totals`
7. `COGS & Pricing`
8. `Sales / Profit Loss`
9. `Master List`
10. existing/future `Page NN` tabs

Use formulas and repeatable scripts where practical. Avoid hardcoded summary
totals.

## When Veer Sends Page Status Data

For each page:

1. Apply Veer's whole-page status.
2. Inspect the corresponding PDF/page tab yourself.
3. Trust Veer's IV status for physical availability, but flag inconsistencies.
4. Update audit/status tabs.
5. Keep invalid items visible with the delete warning.
6. Report all manually flagged pages at the end.

