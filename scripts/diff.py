"""Phase 1, step 2: merge the two model passes and flag disagreements.

For each page it pairs MODEL_A and MODEL_B entries by row order, compares the
fabric name (fuzzy) and yardage (exact, normalized), and writes a CSV with one
row per entry, disagreements sorted to the top for the human review pass.

agreement_flag values:
  AGREE          names match (fuzzy) AND yardage matches  -> auto-acceptable
  DISAGREE_YARD  names match but yardage differs          -> the critical case
  DISAGREE_NAME  yardage matches but names differ
  DISAGREE_BOTH  neither matches
  MISSING_A/B    one model produced fewer rows (row-count mismatch)

Runs offline on the bundled sample:
  python scripts/diff.py --raw-dir sample --provider-a openai --provider-b gemini \
      --out data/merged_sample.csv
"""
from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from itertools import zip_longest
from pathlib import Path

from rapidfuzz import fuzz

sys.path.insert(0, str(Path(__file__).resolve().parent))
import config

NAME_MATCH_MIN = 85  # token_set_ratio above this counts as the "same" fabric name

FIELDS = [
    "page_ref", "image_link", "row_index", "raw_name", "canonical_name", "yardage",
    "pass_a_name", "pass_b_name", "pass_a_yard", "pass_b_yard",
    "agreement_flag", "yardage_warn", "verified",
]


def norm_yard(y: str) -> str:
    return re.sub(r"\s+", "", (y or "").strip().lower())


def norm_name(n: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9 ]", " ", (n or "").lower())).strip()


def yardage_warn(y: str) -> str:
    """Cheap numeric sanity check surfaced as a QA column."""
    v = (y or "").strip()
    if v == "" or v.upper() == "UNREADABLE":
        return "UNREADABLE"
    token = re.sub(r"[^0-9.]", "", v.split()[0]) if v.split() else ""
    try:
        f = float(token)
    except ValueError:
        return "NONNUMERIC"
    if f < config.YARDAGE_MIN or f > config.YARDAGE_MAX:
        return "OUT_OF_RANGE"
    return ""


def load_page(raw_dir: Path, stem: str, provider: str) -> list:
    p = raw_dir / f"{stem}.{provider}.json"
    if not p.exists():
        return []
    return json.loads(p.read_text()).get("entries", [])


def build_row(stem: str, idx: int, a: dict, b: dict) -> dict:
    a, b = a or {}, b or {}
    an, bn = a.get("fabric_name", ""), b.get("fabric_name", "")
    ay, by = a.get("yardage", ""), b.get("yardage", "")
    have_a, have_b = bool(an or ay), bool(bn or by)

    if have_a and not have_b:
        flag = "MISSING_B"
    elif have_b and not have_a:
        flag = "MISSING_A"
    else:
        yard_match = norm_yard(ay) != "" and norm_yard(ay) == norm_yard(by)
        name_match = (
            norm_name(an) == norm_name(bn)
            or fuzz.token_set_ratio(norm_name(an), norm_name(bn)) >= NAME_MATCH_MIN
        )
        if yard_match and name_match:
            flag = "AGREE"
        elif name_match:
            flag = "DISAGREE_YARD"
        elif yard_match:
            flag = "DISAGREE_NAME"
        else:
            flag = "DISAGREE_BOTH"

    yardage = ay if flag == "AGREE" else (ay or by)
    return {
        "page_ref": stem,
        "image_link": "",  # filled from the Drive folder by filename (review_app/load)
        "row_index": idx,
        "raw_name": an or bn,
        "canonical_name": "",  # filled by dedupe.py
        "yardage": yardage,
        "pass_a_name": an,
        "pass_b_name": bn,
        "pass_a_yard": ay,
        "pass_b_yard": by,
        "agreement_flag": flag,
        "yardage_warn": yardage_warn(yardage),
        "verified": "FALSE",
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--raw-dir", default=str(config.RAW_DIR))
    ap.add_argument("--out", default=str(config.MERGED_CSV))
    ap.add_argument("--provider-a", default=config.MODEL_A.split(":")[0])
    ap.add_argument("--provider-b", default=config.MODEL_B.split(":")[0])
    args = ap.parse_args()

    raw = Path(args.raw_dir)
    pa, pb = args.provider_a, args.provider_b
    suffix = f".{pa}.json"
    stems = sorted(p.name[: -len(suffix)] for p in raw.glob(f"*{suffix}"))
    if not stems:
        sys.exit(f"No '*{suffix}' files in {raw}. Run extract.py first (or check --provider-a).")

    rows, agree = [], 0
    for stem in stems:
        ea, eb = load_page(raw, stem, pa), load_page(raw, stem, pb)
        for i, (a, b) in enumerate(zip_longest(ea, eb), start=1):
            row = build_row(stem, i, a, b)
            rows.append(row)
            agree += row["agreement_flag"] == "AGREE"

    rows.sort(key=lambda r: (r["agreement_flag"] == "AGREE", r["page_ref"], r["row_index"]))
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    with out.open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        w.writerows(rows)

    need = len(rows) - agree
    pct = (need * 100 // len(rows)) if rows else 0
    print(f"{len(rows)} entries across {len(stems)} pages -> {out}")
    print(f"  AGREE: {agree}   needs review: {need}  (~{pct}% of rows)")


if __name__ == "__main__":
    main()
