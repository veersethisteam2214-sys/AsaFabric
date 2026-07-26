# Book 2 catalogue image fidelity audit

Initial audit: 25 July 2026

Generated-image re-audit: 26 July 2026

## Acceptance standard

The catalogue must show AI-generated product swatches, not the photographed
source samples themselves. Each generated image is checked against its
individual Book 2 reference for colour, pattern, weave/texture and visible
surface character. Presentation must match the supplied style reference: one
flat rectangular swatch with pinked edges on a clean white background.

The real Drive photos are reference evidence only. Page backgrounds, staples,
handwriting, plastic glare, neighbouring samples and other photographic
artifacts must not appear in a final catalogue image.

Generated pixels cannot be identical to source-photo pixels. The acceptance
criterion is therefore source-faithful representation of the fabric itself,
with no invented colourway, substituted motif or sample from another record.

## Coverage

- Book 2 families checked: 15 of 15
- Source pages checked: Page 34 through Page 48
- Distinct photographed swatches found and represented: 87
- Photo-backed pages: 12
- Pages with no source swatch photo: 3
- Spreadsheet design/colour groups retained: 135
- Photographed swatches omitted: 0
- Generated catalogue images: 87
- Images regenerated after visual rejection: 27

## Page results

| ID | Source | Spreadsheet groups | Photographed swatches | Final status |
| --- | --- | ---: | ---: | --- |
| B2-P34 | Page 34 | 12 | 11 | All visible swatches generated and audited |
| B2-P35 | Page 35 | 9 | 9 | All visible swatches generated and audited |
| B2-P36 | Page 36 | 9 | 9 | All visible swatches generated and audited |
| B2-P37 | Page 37 | 5 | 4 | All visible swatches generated and audited |
| B2-P38 | Page 38 | 8 | 8 | All visible swatches generated and audited |
| B2-P39 | Page 39 | 5 | 6 | All visible swatches generated, including mint |
| B2-P40 | Page 40 | 4 | 0 | Blocked: source page has no swatch photo |
| B2-P41 | Page 41 | 7 | 0 | Blocked: source page has no swatch photo |
| B2-P42 | Page 42 | 14 | 14 | All visible swatches generated and audited |
| B2-P43 | Page 43 | 11 | 11 | All visible swatches generated and audited |
| B2-P44 | Page 44 | 29 | 0 | Blocked: source page has no swatch photo |
| B2-P45 | Page 45 | 5 | 5 | All visible swatches generated and audited |
| B2-P46 | Page 46 | 6 | 6 | All visible swatches generated and audited |
| B2-P47 | Page 47 | 8 | 1 | The one attached source swatch was generated |
| B2-P48 | Page 48 | 3 | 3 | All visible swatches generated and audited |
| **Total** | **Page 34-48** | **135** | **87** | **Every photographed swatch accounted for** |

The number of spreadsheet groups is not always the same as the number of
attached physical swatches. The catalogue lists every spreadsheet group, but
only assigns an image where the source page provides photographic evidence.

## Generation and verification

All 87 output PNGs were generated individually from their corresponding source
crop and the supplied style reference. The first-pass visual audit rejected 27
outputs that included an adjacent fabric, staple, page line, handwriting or an
insufficiently faithful target. Those outputs were regenerated with explicit
target descriptions and checked again.

The source filename and crop coordinates remain in
[`book2-swatches/manifest.json`](book2-swatches/manifest.json) for traceability.
The manifest also records generated-image dimensions, decoded-pixel SHA-256
hashes and visual-audit status. Final automated checks require 87 expected
filenames, 87 unique hashes, valid image files and no missing placements.

The catalogue remains reconciled with all 15 Google Sheet tabs: 15 families,
135 spreadsheet groups and 87 displayed generated images. No photographed
swatch is omitted, duplicated or placed in another family.

## Required follow-up

To complete 100% source-photo coverage for every spreadsheet group, real swatch
photos are still required for:

1. B2-P40 - CVC Opar Embroidery 44 inch
2. B2-P41 - CVC O/R 44 inch pink/off
3. B2-P44 - Sin Ram 44 inch

Page 47 also contains eight recorded designs but only one attached physical
sample. Seven additional Page 47 photos are needed if each recorded design
must have its own verified image.
