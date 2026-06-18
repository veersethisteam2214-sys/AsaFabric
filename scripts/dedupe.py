"""Phase 1, step 3: normalize inconsistent fabric names with fuzzy matching.

Runs LAST, on the merged CSV, so it never interferes with faithful
transcription. Greedy clustering on rapidfuzz token_set_ratio:
  score >= AUTO_MERGE  -> attach to that canonical name (clean)
  FLOOR <= score < AUTO -> attach but mark dedupe_flag=REVIEW (human checks)
  score < FLOOR        -> becomes a new canonical name
Both the raw transcription (raw_name) and the cleaned name (canonical_name) are
kept.

  python scripts/dedupe.py --in data/merged_sample.csv --out data/deduped_sample.csv
"""
from __future__ import annotations

import argparse
import csv
import re
import sys
from pathlib import Path

from rapidfuzz import fuzz

sys.path.insert(0, str(Path(__file__).resolve().parent))
import config


def preprocess(name: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9 ]", " ", (name or "").lower())).strip()


def cluster(names, auto: int, floor: int) -> dict:
    """Return {raw_name: (canonical_display, score, flag)}."""
    canon = []  # list of (display_name, preprocessed)
    mapping = {}
    for name in names:
        pp = preprocess(name)
        best_disp, best_score = None, -1
        for disp, cpp in canon:
            s = fuzz.token_set_ratio(pp, cpp)
            if s > best_score:
                best_disp, best_score = disp, s
        if best_disp is not None and best_score >= auto:
            mapping[name] = (best_disp, best_score, "")
        elif best_disp is not None and best_score >= floor:
            mapping[name] = (best_disp, best_score, "REVIEW")
        else:
            canon.append((name, pp))
            mapping[name] = (name, 100, "")
    return mapping


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="inp", default=str(config.MERGED_CSV))
    ap.add_argument("--out", default=str(config.DEDUPED_CSV))
    ap.add_argument("--auto", type=int, default=config.DEDUPE_AUTO_MERGE)
    ap.add_argument("--floor", type=int, default=config.DEDUPE_REVIEW_FLOOR)
    args = ap.parse_args()

    with Path(args.inp).open() as f:
        rows = list(csv.DictReader(f))
    if not rows:
        sys.exit(f"No rows in {args.inp}. Run diff.py first.")

    seen, names = set(), []
    for r in rows:
        nm = r.get("raw_name", "")
        if nm and nm not in seen:
            seen.add(nm)
            names.append(nm)

    mapping = cluster(names, args.auto, args.floor)

    fieldnames = list(rows[0].keys())
    if "dedupe_flag" not in fieldnames:
        fieldnames.append("dedupe_flag")
    for r in rows:
        disp, _score, flag = mapping.get(r.get("raw_name", ""), (r.get("raw_name", ""), 100, ""))
        r["canonical_name"] = disp
        r["dedupe_flag"] = flag

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    with out.open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(rows)

    n_canon = len({disp for disp, _, _ in mapping.values()})
    n_review = sum(1 for _, _, fl in mapping.values() if fl == "REVIEW")
    print(f"{len(names)} distinct raw names -> {n_canon} canonical "
          f"({n_review} need review) -> {out}")


if __name__ == "__main__":
    main()
