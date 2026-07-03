# Consultation & Sample-Request Workflow

A lead-generation + consultation-booking feature added to the Asa Fabric
landing page. It lets prospective customers either **request information /
a physical sample** or **book an in-person consultation**, and emails both
the internal team and the customer on submission.

It is built within the project's hard constraints: **vanilla HTML/CSS/JS for
the site (no framework, no build, no npm deps), all behavior in `app.js` /
`styles.css`**, plus a small **zero-config Vercel serverless backend** under
`/api` (Node, CommonJS, no dependencies) for validation + email.

---

## 1. User-facing surface

| Trigger | Where | Opens |
|---|---|---|
| Floating action button (`#fabConsult`) | Fixed bottom-right on every screen | Modal, "Request Info & Sample" tab |
| "Request a sample" CTA | Enquiry section (`#contact`) | Modal, sample tab |
| "Book a consultation" CTA | Enquiry section (`#contact`) | Modal, consultation tab |

The existing lightweight quick-enquiry form (`#leadForm`) is **unchanged** and
remains the no-JS fallback. The modal markup is inert until `initConsultation()`
upgrades it (the FAB is `hidden` until JS reveals it).

### Modal (`#consultModal`)
An accessible `role="dialog"` with `aria-modal`, a focus trap, ESC-to-close,
focus return to the trigger, and a two-`role="tab"` tablist with roving
arrow-key navigation.

**Tab 1 — Request Info & Sample:** Full Name*, Company, Email*, Phone*, fabric
chips (multi-select), project details, and a delivery choice — *Email me more
information* or *Send me a physical sample by post*. Choosing **post** reveals
Delivery Address*, City*, Postal Code*, Country*.

**Tab 2 — Book a Consultation:** Full Name*, Company, Email*, Phone*, Preferred
Date*, Preferred Time*, and project requirements.

(* = required)

---

## 2. Business rule — no same-day / next-day booking

The earliest selectable consultation date is **today + 2 days**.

- **Client:** `initConsultation()` sets the date input's `min` and shows an
  "Earliest available date" hint.
- **Server (source of truth):** `api/_lib/validation.js` re-checks the date
  against `earliestConsultationDate(now)` (`LEAD_DAYS = 2`) and rejects anything
  earlier with a 422. Never trust the client.

---

## 3. Validation

Rules live once in `api/_lib/validation.js` and are **mirrored** on the client
in `app.js` for instant feedback. The server always re-validates.

- Name, email (format), phone (7–20 digits) required on both forms.
- Sample: at least one fabric; valid delivery method; full postal address when
  "by post".
- Consultation: valid date ≥ today+2; a known time slot.
- Unknown products / time slots are filtered or rejected server-side.
- Per-field length caps; a hidden **honeypot** (`website`) silently drops bots.

Invalid submits return `422` with `{ errors: { field: message } }`, which the
client maps back onto the matching fields.

---

## 4. Email layer (provider-agnostic)

`api/_lib/email/` is a small adapter system selected by `EMAIL_PROVIDER`:

```
email/
  index.js       notify(submission) → sends internal + customer emails
  templates.js   on-brand HTML + plaintext for both email types
  resend.js      Resend REST (fetch)
  sendgrid.js    SendGrid REST (fetch)
  ses.js         AWS SES v2, signed with pure-Node SigV4 (no aws-sdk)
  console.js     default fallback — logs instead of sending (no secrets needed)
```

On a valid submission the handler sends:
1. **Internal notification** to `EMAIL_TO` (reply-to = customer), and
2. **Customer confirmation** to the submitter.

Email failures are caught and logged — a mail outage never turns a valid lead
into a 500.

### Configuration (`.env.example`)
```
EMAIL_PROVIDER=resend|sendgrid|ses|console   # default: console
EMAIL_FROM="Asa Fabric <hello@asafabric.com>"
EMAIL_TO="sales@asafabric.com"               # comma-separated for multiple
RESEND_API_KEY=...                           # provider-specific
SENDGRID_API_KEY=...
AWS_REGION=... AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=...
```
Set these as Vercel Environment Variables (or `.env.local` for local dev).
With no provider configured the form still works end-to-end (console logs).

---

## 5. API

`POST /api/consultation` — `api/consultation.js`

Request body: `{ type: "sample" | "consultation", ...fields }`

| Status | Meaning |
|---|---|
| `200 { ok: true, type, delivery }` | Accepted; emails attempted |
| `422 { ok: false, errors, earliestDate }` | Validation failed |
| `400` | Bad/missing JSON or unknown `type` |
| `405` | Non-POST |

Zero-config Vercel Node function — no `package.json`, no build step; uses the
global `fetch` (Node 18+) and built-in `crypto` only.

---

## 6. Accessibility & motion

- Labelled dialog, focus trap, ESC close, focus return, `aria-live` error slots,
  `aria-invalid` + `aria-describedby` on invalid fields, keyboard-navigable tabs.
- All transitions/animations are gated by the global
  `prefers-reduced-motion` block; the submit spinner is suppressed and the busy
  label reads "Sending…" under reduced motion.

---

## 7. Local testing

The serverless function can be exercised locally with any Node static+API
shim (see the PR notes). Validation/date logic is covered by a Node assertion
script; the UI was verified in-browser at desktop / tablet / mobile widths for
both flows, validation errors, loading, and success states.

> Remember the repo convention: **bump the `?v=` token** on the `styles.css` /
> `app.js` links in `index.html` whenever those files change (currently
> `?v=20260630-2`).
