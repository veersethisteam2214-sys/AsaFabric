# ASAFabric — Fabric Inventory Digitization

Turning Veer's handwritten fabric inventory book (1,000+ entries: fabric name +
yardage) into a clean spreadsheet — accurately. This repo holds the **scripts**.
The inventory itself lives in a **Google Sheet**; the page photos live in
**Google Drive** (never in git).

> Full plan: see the approved project plan. TL;DR of the approach:
> **photos → extract each page with TWO vision models → only hand-check the rows
> where they disagree → land it in a Google Sheet.** The two-model cross-check is
> the accuracy mechanism — a standalone handwritten yardage (`12` vs `17` vs `72`)
> has no context for a model to self-correct, so wrong digits slip through
> silently unless a second model disagrees and flags it.

---

## Where we are: Phase 0 (do this first — no code, no API keys, no money)

### 1. Photograph the whole book into a folder

- Use a **book-scanning app** — **vFlat Scan** or **Genius Scan** — not the raw
  camera. They batch-capture, auto-crop, and flatten page curvature.
- **One image per page**, named in order: `page_001.jpg`, `page_002.jpg`, …
- Flat pages, soft two-sided ~45° light, **no glare**, ~300–400 DPI. Glance at
  each shot for legibility as you go — bad capture quietly tanks every later
  step and is the cheapest thing to get right.
- Put originals in a **shared Google Drive folder** (backup + Veer access). To
  run the pipeline later, copy them into this repo's `photos/` folder (it's
  gitignored — photos never get committed).

### 2. The free pilot — pick the model that reads Veer's hand best

Pick **3–5 representative pages** (include the messiest one). Paste each into the
**ChatGPT, Gemini, and Claude web apps** (free — no API keys), with this prompt:

```
You are transcribing one page of a handwritten fabric inventory book.
Read every row exactly as written, top to bottom. For each row give the fabric
name/description and its yardage. Transcribe the yardage EXACTLY as written
(keep fractions/decimals/symbols); never round, infer, or invent a number. If a
value is unreadable, write "UNREADABLE". Return a JSON array of
{fabric_name, yardage, notes}.
```

Then score each model against the actual page (a quick tally is enough):

| Model | Names correct | Yardages correct | Notes |
|-------|--------------|------------------|-------|
| ChatGPT (GPT-5.5/5.4) | /N | /N | |
| Gemini (3.5 Flash) | /N | /N | |
| Claude (Opus 4.8 / Sonnet 4.6) | /N | /N | |

**The winner + the runner-up become the two models for the bulk run.** Vendor
benchmarks won't predict whose hand reads best — this 30-minute test decides it.
Put your two picks in `.env` as `MODEL_A` / `MODEL_B`.

---

## Phase 1: the pipeline (after the pilot)

Common setup:

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # then fill in MODEL_A/MODEL_B + the two API keys you chose
```

### Option A — scan & confirm, one page at a time (recommended)

The interactive review app: drop in a page photo, both models read it, you see
the **image beside the rows**, agreements are pre-approved and disagreements are
highlighted with both models' values — you only decide the conflicts, then click
**Approve** to append that page to the Sheet. Nothing reaches the Sheet
unconfirmed, so a misread yardage can't slip in silently. Also your tool for
adding new fabric later.

```bash
streamlit run scripts/review_app.py
```

### Option B — batch the whole book, review in the Sheet

Better if you'd rather photograph everything first and review in bulk:

```bash
# put your page photos in ./photos as page_001.jpg, page_002.jpg, ...
python scripts/extract.py         # each page -> 2 models -> data/raw/*.json
python scripts/diff.py            # merge the two passes -> data/merged.csv (disagreements first)
python scripts/dedupe.py          # normalize fabric names -> data/deduped.csv
python scripts/load_to_sheets.py  # push to the Google Sheet
```

Then the **human verification pass** in the Sheet:
1. Review the flagged rows (sorted to the top) against the page image.
2. Do one fast eyeball **down the entire yardage column** — a wrong digit is
   invisible in a name-only review.
3. Spot-check 5–10% of the auto-accepted (`AGREE`) rows.

Either way, run `dedupe.py` as a **final** pass once the whole book is in —
fabric-name clustering needs the full set of names.

### Try the pipeline now, without photos or keys

`diff.py` and `dedupe.py` are model-agnostic and run on the included sample:

```bash
pip install rapidfuzz
python scripts/diff.py   --raw-dir sample --provider-a openai --provider-b gemini --out data/merged_sample.csv
python scripts/dedupe.py --in data/merged_sample.csv --out data/deduped_sample.csv
```

You'll see one yardage disagreement get flagged (`DISAGREE_YARD`) and name
variants collapse to a single canonical name — exactly the two mechanisms that
keep the real run honest.

---

## Repo layout

```
asafabric/
  scripts/
    config.py          # all paths, model picks, thresholds (reads .env)
    models.py          # Entry data model + the strict-JSON schema/prompt
    providers.py       # vision-model adapters (OpenAI / Gemini / Anthropic)
    extract.py         # photos -> 2 models -> per-page JSON   [needs keys+photos]
    diff.py            # merge two passes -> merged.csv         [runnable now]
    dedupe.py          # rapidfuzz canonical names -> deduped   [runnable now]
    load_to_sheets.py  # gspread batch upload                   [needs Google creds]
    review_app.py      # interactive scan-and-confirm app       [needs keys+creds]
  sample/              # tiny two-pass fixture for trying diff/dedupe offline
  photos/              # page images (gitignored — never committed)
  data/                # generated CSVs + data/raw/*.json (gitignored)
  .env.example         # config template (copy to .env)
  requirements.txt
```

The Sheet has these columns: `page_ref | image_link | raw_name | canonical_name |
yardage | pass_a_name | pass_b_name | pass_a_yard | pass_b_yard | agreement_flag |
yardage_warn | verified`.

---

## Open risks / gotchas

- **Model IDs drift monthly.** Confirm the exact `model_id` in each provider's
  docs the day you run `extract.py`. As of mid-2026: `gpt-5.5`/`gpt-5.4`,
  `gemini-3.5-flash`, `claude-opus-4-8`/`claude-sonnet-4-6`.
- **Provider SDK calls** in `providers.py` reflect the documented APIs as of
  mid-2026 — run **one** real page through before the full batch to confirm the
  call shape, then scale.
- **Secrets:** never commit `.env` or the Google `service-account.json`
  (`.gitignore` already excludes them). Share `.env.example` instead.
- **Cost is trivial** (~a few dollars for the whole book), so optimize for
  accuracy, not tokens. Switching to each provider's 50%-off Batch API is a
  later optimization, not needed for ~50 pages.

## Roadmap (later)

Catalog + customer mass-send: migrate the clean data to Airtable, build the site
with Softr (no-code) or Next.js on Cloudflare Pages, move images to Cloudflare R2.
Out of scope until the digitized sheet exists.
