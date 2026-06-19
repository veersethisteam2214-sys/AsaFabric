# Google Sheet Verification

After rebuilding the workbook, verify the generated Google Sheet before handing
work back.

## Google locations

- Sheet:
  `https://docs.google.com/spreadsheets/d/1wdwDo_UWCe8GJZ2G4GNQ93rZF1oZhn5lmclqgDMC8Pg/edit`
- PDF folder:
  `https://drive.google.com/drive/u/1/folders/194XsU0gcDRgSkWUzouMCShvW_3lmn7Ff`

## Visual checks

- `Control Panel` has workflow columns only.
- `Master List` has rows only for pages in `MASTER_LIST_PAGES`.
- Each Page tab has:
  - compact header
  - fabric summary table
  - roll ledger
  - simple notes
  - no random dark rows inside data
- Page tabs outside `MASTER_LIST_PAGES` say `NEED UPDATING`.

## PDF re-check

- Open the source PDF before trusting any JSON.
- Confirm every fabric/design line against the PDF.
- Leave notes and `needs_review: true` for unclear values.
- Do not add a page to `MASTER_LIST_PAGES` until the PDF has been re-checked.

## Formula checks

Master List should mirror Page tabs. For example, a Page 13 row should contain
formulas like:

```text
='Page 13'!A4
=LEFT('Page 13'!A1,7)
='Page 13'!D1
='Page 13'!B4
='Page 13'!H1
='Page 13'!F1
```

Control Panel counts should be formulas like:

```text
=COUNTIF('Master List'!B:B,A2)
=COUNTIFS('Master List'!B:B,A2,'Master List'!O:O,TRUE)
=COUNTIFS('Master List'!B:B,A2,'Master List'!P:P,TRUE)
```

## Real formula errors

Only count real spreadsheet errors:

```text
#REF!
#VALUE!
#NAME?
#DIV/0!
#N/A
#ERROR!
#NUM!
#NULL!
```

Do not count real fabric/design labels such as `#101` as formula errors.
