# Page JSON Template

Use this shape for `data/manual/Page NN.json`.

```json
{
  "page": 13,
  "date": "15/7/20",
  "buyer": "",
  "item": "Cotton Dobrt 444",
  "ref": "",
  "page_total_pcs": 0,
  "page_total_yards": 0,
  "notes": "Whole-page note if needed.",
  "fabrics": [
    {
      "label": "4394",
      "grid": [
        [40, 73, 60],
        [40, 95]
      ],
      "total_amount": 308,
      "piece_count": 6,
      "notes": "Line-specific note if needed.",
      "needs_review": false
    }
  ]
}
```

Rules:

- Keep the page number two digits in the filename: `Page 13.json`.
- Use exact scan wording when possible.
- Leave `buyer` and `ref` blank if they are not on the scan.
- If the scan has no written total, leave `page_total_pcs` and
  `page_total_yards` blank or omit them.
- If a roll value is unreadable, use an empty string and add a line note.
- Do not invent values to make totals match.
- If a value is crossed out, omit it unless the user specifically wants crossed
  values tracked.

