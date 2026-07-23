# Team photos — About page

Drop one photo per team member into this folder, named **exactly** as the
`Expected file` below. The About page team showcase (`initTeamShowcase()` in
`app.js`) builds each member's image path as `assets/team/<slug>.jpg`, where
`<slug>` is the lowercased, hyphenated name from the `TEAM` array. If a file is
missing, the tile falls back automatically to a CSS initials avatar (via the
`onerror` handler), so nothing looks broken.

- Format: **JPG** (`.jpg`), the filenames below are required.
- Recommended: square-ish crop, at least 600×600, face reasonably centred.
- Photos are shown greyscale by default and reveal to colour on hover/focus.

| Member | Role (placeholder — EDITABLE) | Expected file |
| --- | --- | --- |
| Veer Sethi | Founder | `veer-sethi.jpg` |
| Shaan | Catalogue & Sourcing | `shaan.jpg` |
| Krish | Operations | `krish.jpg` |

To add or rename people, edit the `TEAM` array in `app.js` (each entry's `slug`
determines the expected filename here) and update this table to match.
