# Book 2 catalogue image fidelity audit

Audit date: 25 July 2026

## Acceptance standard

The audit checks every distinct photographed swatch on Book 2 Pages 34-48 for
agreement in colour, pattern, weave/texture and visible surface details. The
required standard is 100% source fidelity, not a visually plausible AI
approximation.

AI-generated images cannot be certified as identical because generation can
alter colour, thread structure and motif geometry. The final photo-backed
assets therefore use decoded pixels from the source photographs themselves.
They are cropped around each real swatch and saved as lossless PNGs with no
resampling, recolouring, retouching, cleanup or generated content.

## Coverage

- Book 2 families checked: 15 of 15
- Source pages checked: Page 34 through Page 48
- Distinct photographed swatches found and extracted: 87
- Photo-backed pages: 12
- Pages with no source swatch photo: 3
- Spreadsheet design/colour groups retained: 135
- Photographed swatches omitted: 0

## Page results

| ID | Source | Spreadsheet groups | Photographed swatches | Final status |
| --- | --- | ---: | ---: | --- |
| B2-P34 | Page 34 | 12 | 11 | All visible swatches extracted |
| B2-P35 | Page 35 | 9 | 9 | All visible swatches extracted |
| B2-P36 | Page 36 | 9 | 9 | All visible swatches extracted |
| B2-P37 | Page 37 | 5 | 4 | All visible swatches extracted |
| B2-P38 | Page 38 | 8 | 8 | All visible swatches extracted |
| B2-P39 | Page 39 | 5 | 6 | All visible swatches extracted, including mint |
| B2-P40 | Page 40 | 4 | 0 | Blocked: source page has no swatch photo |
| B2-P41 | Page 41 | 7 | 0 | Blocked: source page has no swatch photo |
| B2-P42 | Page 42 | 14 | 14 | All visible swatches extracted |
| B2-P43 | Page 43 | 11 | 11 | All visible swatches extracted |
| B2-P44 | Page 44 | 29 | 0 | Blocked: source page has no swatch photo |
| B2-P45 | Page 45 | 5 | 5 | All visible swatches extracted |
| B2-P46 | Page 46 | 6 | 6 | All visible swatches extracted |
| B2-P47 | Page 47 | 8 | 1 | The one attached source swatch was extracted |
| B2-P48 | Page 48 | 3 | 3 | All visible swatches extracted |
| **Total** | **Page 34-48** | **135** | **87** | **Every photographed swatch accounted for** |

The number of spreadsheet groups is not always the same as the number of
attached physical swatches. The catalogue lists every spreadsheet group, but
only assigns an image where the source page provides photographic evidence.

## Pixel verification

The 87 output PNGs are direct lossless crops from the decoded source images.
The crop coordinates, source filename, dimensions and decoded-pixel SHA-256
hash are recorded in
[`book2-swatches/manifest.json`](book2-swatches/manifest.json). Recomputing each
source crop produced the same dimensions and pixel hash as its catalogue PNG.
No AI-generated fabric content remains in the Book 2 galleries.

## Required follow-up

To complete 100% source-photo coverage for every spreadsheet group, real swatch
photos are still required for:

1. B2-P40 - CVC Opar Embroidery 44 inch
2. B2-P41 - CVC O/R 44 inch pink/off
3. B2-P44 - Sin Ram 44 inch

Page 47 also contains eight recorded designs but only one attached physical
sample. Seven additional Page 47 photos are needed if each recorded design
must have its own verified image.
