"""Phase 1, step 1: run every page photo through TWO vision models.

Reads images from PHOTOS_DIR (page_001.jpg ...), calls MODEL_A and MODEL_B
(config.py), and writes one JSON file per page per model into RAW_DIR, e.g.:
    data/raw/page_001.gemini.json
    data/raw/page_001.anthropic.json

Already-written files are skipped, so the run is resumable. Run `diff.py` next.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import config
from providers import extract

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".heic"}


def provider_of(model_spec: str) -> str:
    return model_spec.split(":", 1)[0]


def main() -> None:
    config.RAW_DIR.mkdir(parents=True, exist_ok=True)
    pages = sorted(
        p for p in config.PHOTOS_DIR.glob("*") if p.suffix.lower() in IMAGE_EXTS
    )
    if not pages:
        sys.exit(
            f"No page images in {config.PHOTOS_DIR}. Add photos first (README Phase 0)."
        )

    models = [m for m in (config.MODEL_A, config.MODEL_B) if m]
    print(f"Extracting {len(pages)} pages with {', '.join(models)}")
    for page in pages:
        for model_spec in models:
            out = config.RAW_DIR / f"{page.stem}.{provider_of(model_spec)}.json"
            if out.exists():
                print(f"  skip {out.name} (exists)")
                continue
            try:
                entries = extract(model_spec, page)
                out.write_text(
                    json.dumps({"entries": [e.__dict__ for e in entries]}, indent=2)
                )
                print(f"  {out.name}: {len(entries)} entries")
            except Exception as exc:  # one bad page shouldn't halt the whole run
                print(f"  ERROR {page.name} via {model_spec}: {exc}")


if __name__ == "__main__":
    main()
