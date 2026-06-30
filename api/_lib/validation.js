/* ============================================================
   Asa Fabric — shared request validation (serverless / Node, no deps)
   Used by the /api/consultation handler. The SAME rules are mirrored
   on the client in app.js (initConsultation) so the user sees instant
   feedback, but the server is the source of truth and re-validates
   everything — never trust the client.
   ============================================================ */

"use strict";

/* The fabric categories offered on the site (kept in sync with the
   "Fabrics by use" data + the quick-enquiry <select> in index.html). */
const PRODUCTS = [
  "Shirtings",
  "Suitings",
  "Trousers",
  "Workwear",
  "Linens",
  "Cottons",
  "Bulk / clearance",
  "Other",
];

/* Consultation time slots (label is what we email; value is the wire form). */
const TIME_SLOTS = [
  "Morning (9:00–12:00)",
  "Midday (12:00–15:00)",
  "Afternoon (15:00–18:00)",
];

/* Business rule: a consultation may not be booked same-day or next-day.
   Earliest selectable date is today + LEAD_DAYS. */
const LEAD_DAYS = 2;

/* Length guards so a single field can't be abused as an unbounded blob. */
const LIMITS = { short: 120, email: 254, phone: 40, long: 2000 };

/* ---------- small primitives ---------- */
function str(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value) {
  const v = str(value);
  // Pragmatic, not RFC-exhaustive: one @, a dot in the domain, no spaces.
  return v.length <= LIMITS.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isValidPhone(value) {
  const v = str(value);
  // Accept +, spaces, dashes, parens; require 7–20 digits overall.
  const digits = v.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 20 && /^[+0-9 ()\-]+$/.test(v);
}

/* Date-only helpers. We compare YYYY-MM-DD strings to avoid timezone drift
   from Date math. `today` is taken in the server's local time; the +2 rule
   is intentionally generous so clients a few hours ahead are never blocked. */
function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function earliestConsultationDate(now) {
  const base = now instanceof Date ? new Date(now) : new Date();
  base.setHours(0, 0, 0, 0);
  base.setDate(base.getDate() + LEAD_DAYS);
  return toISODate(base);
}

function isValidISODate(value) {
  const v = str(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(v + "T00:00:00");
  return !Number.isNaN(d.getTime()) && toISODate(d) === v;
}

/* ---------- field collectors ---------- */
function baseContact(data, errors) {
  const contact = {
    fullName: str(data.fullName).slice(0, LIMITS.short),
    company: str(data.company).slice(0, LIMITS.short),
    email: str(data.email).slice(0, LIMITS.email),
    phone: str(data.phone).slice(0, LIMITS.phone),
  };
  if (!contact.fullName) errors.fullName = "Please enter your full name.";
  if (!isValidEmail(contact.email)) errors.email = "Enter a valid email address.";
  if (!isValidPhone(contact.phone)) errors.phone = "Enter a valid phone number.";
  return contact;
}

/* ---------- Option 1: Request information & sample ---------- */
function validateSampleRequest(data) {
  const errors = {};
  const contact = baseContact(data, errors);

  const products = Array.isArray(data.products)
    ? data.products.map(str).filter((p) => PRODUCTS.includes(p))
    : [];
  if (!products.length) {
    errors.products = "Select at least one fabric of interest.";
  }

  const deliveryMethod = str(data.deliveryMethod); // "email" | "post"
  if (deliveryMethod !== "email" && deliveryMethod !== "post") {
    errors.deliveryMethod = "Choose how you'd like to receive information.";
  }

  const projectDetails = str(data.projectDetails).slice(0, LIMITS.long);

  // Postal address only required when a physical sample is requested.
  const address = {
    line1: str(data.addressLine1).slice(0, LIMITS.short),
    city: str(data.city).slice(0, LIMITS.short),
    postalCode: str(data.postalCode).slice(0, LIMITS.short),
    country: str(data.country).slice(0, LIMITS.short),
  };
  if (deliveryMethod === "post") {
    if (!address.line1) errors.addressLine1 = "Enter a delivery address.";
    if (!address.city) errors.city = "Enter a city.";
    if (!address.postalCode) errors.postalCode = "Enter a postal code.";
    if (!address.country) errors.country = "Enter a country.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    value: {
      type: "sample",
      ...contact,
      products,
      deliveryMethod,
      projectDetails,
      address: deliveryMethod === "post" ? address : null,
    },
  };
}

/* ---------- Option 2: Book an in-person consultation ---------- */
function validateConsultation(data, now) {
  const errors = {};
  const contact = baseContact(data, errors);

  const preferredDate = str(data.preferredDate);
  const earliest = earliestConsultationDate(now);
  if (!isValidISODate(preferredDate)) {
    errors.preferredDate = "Choose a valid date.";
  } else if (preferredDate < earliest) {
    errors.preferredDate = `Earliest available date is ${earliest}.`;
  }

  const timeSlot = str(data.timeSlot);
  if (!TIME_SLOTS.includes(timeSlot)) {
    errors.timeSlot = "Choose a preferred time slot.";
  }

  const projectDetails = str(data.projectDetails).slice(0, LIMITS.long);

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    value: {
      type: "consultation",
      ...contact,
      preferredDate,
      timeSlot,
      projectDetails,
    },
  };
}

module.exports = {
  PRODUCTS,
  TIME_SLOTS,
  LEAD_DAYS,
  LIMITS,
  isValidEmail,
  isValidPhone,
  isValidISODate,
  earliestConsultationDate,
  validateSampleRequest,
  validateConsultation,
};
