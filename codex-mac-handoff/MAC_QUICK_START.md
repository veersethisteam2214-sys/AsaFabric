# Mac Quick Start - ASA Fabric Codex Handoff

Use this when setting up the office Mac quickly.

## Goal

Get the Mac Codex ready to continue the exact same ASA Fabric duplicate-sheet
project, with service-account access and all project rules loaded.

## 1. Pull The Repo On The Mac

```bash
git clone https://github.com/veersethisteam2214-sys/AsaFabric.git
cd AsaFabric
```

If the repo is already cloned:

```bash
cd AsaFabric
git pull origin main
```

## 2. Put The JSON Key In Place

The key file is not in GitHub. It must be copied manually.

Current Windows key location:

```text
C:\Users\User\OneDrive\Desktop\Asa Fabric VSK\_asafabric_repo\google-sheets-tracking\service-account.json
```

On the Mac, put that same file here:

```text
AsaFabric/google-sheets-tracking/service-account.json
```

Do not commit this file. It is private.

Best transfer options:

1. USB drive.
2. Create/download a fresh key directly on the Mac from Google Cloud Console.
3. Private Google Drive upload, download on Mac, then delete from Drive.
4. Email only if necessary, then delete the email from inbox, sent, and trash.

The service account email is:

```text
asafabric-sheets@asa-fabric-inventory.iam.gserviceaccount.com
```

## 3. Create The Mac `.env`

From the repo root:

```bash
cd google-sheets-tracking
cat > .env <<'EOF'
GOOGLE_SHEET_ID=1O7qNn69Dy8LUfbKMTo9_NUkWPexb0djIKvy8WrzQl64
GOOGLE_DRIVE_FOLDER_ID=194XsU0gcDRgSkWUzouMCShvW_3lmn7Ff
GOOGLE_SA_JSON=service-account.json
EOF
```

This points to the duplicate sheet only.

## 4. Install Python Dependencies

From `google-sheets-tracking`:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

If `python3` is missing, install Python first, then rerun the commands.

## 5. Verify Access Before Doing Work

From `google-sheets-tracking`:

```bash
source .venv/bin/activate
python scripts/check_google.py
```

Expected result:

- service account is detected
- duplicate sheet read/write works
- Drive folder is reachable

The check writes one temporary row to the duplicate sheet, reads it, then deletes
it.

## 6. Prompt Codex On The Mac

Paste this into Codex:

```text
Read codex-mac-handoff/MAC_QUICK_START.md,
codex-mac-handoff/README.md, and
codex-mac-handoff/NEXT_CODEX_PROMPT.md.

Then read the google-sheets-tracking docs listed in the handoff.
Work only on the duplicate sheet.
Verify .env and service-account.json are set up.
Do not run build_workbook.py blindly because the duplicate sheet has drifted from
the old builder model.
Wait for my page-status batch before changing workbook structure or inventory
data.
```

## 7. What To Send Codex After Setup

Send statuses like this:

```text
Page 01: Valid
Page 02: Need Check
Page 03: IV (X)
Page 04: Valid
```

Status is always whole-page.

Allowed statuses:

- `Valid`
- `Need Check`
- `IV (X)`

For `IV (X)`, Codex must keep the page visible and mark:

```text
PLEASE DELETE AFTER CHECKING
```

## 8. Critical Rules

- Edit only the duplicate sheet:
  `1O7qNn69Dy8LUfbKMTo9_NUkWPexb0djIKvy8WrzQl64`
- Never edit the live sheet:
  `1wdwDo_UWCe8GJZ2G4GNQ93rZF1oZhn5lmclqgDMC8Pg`
- Keep page tabs visible for now.
- Do not auto-delete invalid pages.
- Do not commit `service-account.json` or `.env`.
- Use repeatable scripts/formulas, not hardcoded summary totals.
- Audit PDFs/page tabs when page statuses are provided.
