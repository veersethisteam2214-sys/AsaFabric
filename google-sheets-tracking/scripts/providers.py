"""Vision-model adapters: image -> list[Entry], via each provider's structured
output mode. Pluggable so the two-model cross-check can mix any two providers.

IMPORTANT (see README "Open risks"): model identifiers and SDK surfaces drift.
These adapters reflect the documented APIs as of mid-2026; confirm the exact
`model_id` and call shape in each provider's docs when you wire Phase 1, and run
ONE real page through before the full batch. The simplest correct pattern — one
synchronous vision call per page — is used here; switching to each provider's
50%-off Batch API is a later cost optimization, not needed for ~50 pages.

SDKs are imported lazily inside each function so the model-agnostic scripts
(diff.py, dedupe.py) run without any provider SDK installed.
"""
from __future__ import annotations

import base64
import json
import mimetypes
from pathlib import Path
from typing import Callable, Dict, List, Tuple

from models import EXTRACTION_PROMPT, EXTRACTION_SCHEMA, Entry


def _read_image_b64(path: Path) -> Tuple[str, str]:
    mime = mimetypes.guess_type(str(path))[0] or "image/jpeg"
    data = base64.standard_b64encode(path.read_bytes()).decode("ascii")
    return data, mime


def _entries(payload: dict) -> List[Entry]:
    return [Entry.from_dict(e) for e in payload.get("entries", [])]


def extract_openai(image_path: Path, model_id: str) -> List[Entry]:
    from openai import OpenAI  # pip install openai

    client = OpenAI()
    b64, mime = _read_image_b64(image_path)
    resp = client.responses.create(
        model=model_id,
        input=[
            {
                "role": "user",
                "content": [
                    {"type": "input_text", "text": EXTRACTION_PROMPT},
                    {"type": "input_image", "image_url": f"data:{mime};base64,{b64}"},
                ],
            }
        ],
        text={
            "format": {
                "type": "json_schema",
                "name": "ledger_page",
                "schema": EXTRACTION_SCHEMA,
                "strict": True,
            }
        },
    )
    return _entries(json.loads(resp.output_text))


def extract_gemini(image_path: Path, model_id: str) -> List[Entry]:
    from google import genai  # pip install google-genai
    from google.genai import types

    client = genai.Client()
    raw = image_path.read_bytes()
    mime = mimetypes.guess_type(str(image_path))[0] or "image/jpeg"
    resp = client.models.generate_content(
        model=model_id,
        contents=[
            EXTRACTION_PROMPT,
            types.Part.from_bytes(data=raw, mime_type=mime),
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=EXTRACTION_SCHEMA,
        ),
    )
    return _entries(json.loads(resp.text))


def extract_anthropic(image_path: Path, model_id: str) -> List[Entry]:
    import anthropic  # pip install anthropic

    client = anthropic.Anthropic()
    b64, mime = _read_image_b64(image_path)
    # Anthropic returns structured JSON most reliably via a forced tool call.
    tool = {
        "name": "record_entries",
        "description": "Record every transcribed row from the page.",
        "input_schema": EXTRACTION_SCHEMA,
    }
    resp = client.messages.create(
        model=model_id,
        max_tokens=8192,
        tools=[tool],
        tool_choice={"type": "tool", "name": "record_entries"},
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": EXTRACTION_PROMPT},
                    {
                        "type": "image",
                        "source": {"type": "base64", "media_type": mime, "data": b64},
                    },
                ],
            }
        ],
    )
    for block in resp.content:
        if getattr(block, "type", None) == "tool_use":
            return _entries(block.input)
    return []


PROVIDERS: Dict[str, Callable[[Path, str], List[Entry]]] = {
    "openai": extract_openai,
    "gemini": extract_gemini,
    "anthropic": extract_anthropic,
}


def extract(model_spec: str, image_path: Path) -> List[Entry]:
    """model_spec is 'provider:model_id', e.g. 'gemini:gemini-3.5-flash'."""
    provider, _, model_id = model_spec.partition(":")
    if provider not in PROVIDERS:
        raise ValueError(f"Unknown provider '{provider}'. Known: {list(PROVIDERS)}")
    if not model_id:
        raise ValueError(f"model_spec must be 'provider:model_id', got '{model_spec}'")
    return PROVIDERS[provider](Path(image_path), model_id)
