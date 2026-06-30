/* ============================================================
   Asa Fabric — email templates (no deps)
   Builds the internal-team notification and the customer confirmation
   for both submission types. Returns { subject, html, text } so any
   provider adapter can send it unchanged.
   ============================================================ */

"use strict";

const BRAND = {
  name: "Asa Fabric",
  tagline: "Quality fabrics, by the roll or the cut.",
  canvas: "#FAF9F6",
  ink: "#1A1A1A",
  muted: "#444748",
  hairline: "#c4c7c7",
  accent: "#0ea5e9",
};

function esc(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function labelFor(submission) {
  return submission.type === "consultation"
    ? "Consultation booking"
    : "Information / sample request";
}

/* Ordered [label, value] rows for whichever submission came in. */
function rowsFor(submission) {
  const rows = [
    ["Full name", submission.fullName],
    ["Company", submission.company || "—"],
    ["Email", submission.email],
    ["Phone", submission.phone],
  ];

  if (submission.type === "sample") {
    rows.push(["Fabrics of interest", (submission.products || []).join(", ")]);
    rows.push([
      "Preferred response",
      submission.deliveryMethod === "post"
        ? "Physical sample by post"
        : "Email me more information",
    ]);
    if (submission.address) {
      const a = submission.address;
      rows.push([
        "Delivery address",
        [a.line1, a.city, a.postalCode, a.country].filter(Boolean).join(", "),
      ]);
    }
    rows.push(["Project details", submission.projectDetails || "—"]);
  } else {
    rows.push(["Preferred date", submission.preferredDate]);
    rows.push(["Preferred time", submission.timeSlot]);
    rows.push(["Project requirements", submission.projectDetails || "—"]);
  }

  return rows;
}

/* Shared HTML shell — inline styles only (email clients ignore <style>). */
function shell(heading, intro, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:${BRAND.canvas};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.canvas};">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${BRAND.hairline};border-radius:14px;overflow:hidden;font-family:Georgia,'Times New Roman',serif;">
        <tr><td style="padding:28px 32px 8px;border-bottom:1px solid ${BRAND.hairline};">
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${BRAND.accent};font-weight:700;">${esc(BRAND.name)}</div>
          <div style="font-size:13px;color:${BRAND.muted};font-style:italic;margin-top:4px;">${esc(BRAND.tagline)}</div>
        </td></tr>
        <tr><td style="padding:28px 32px;">
          <h1 style="margin:0 0 12px;font-size:24px;font-weight:400;color:${BRAND.ink};">${esc(heading)}</h1>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${BRAND.muted};font-family:Arial,Helvetica,sans-serif;">${intro}</p>
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:20px 32px;border-top:1px solid ${BRAND.hairline};font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${BRAND.muted};">
          ${esc(BRAND.name)} · ${esc(BRAND.tagline)}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function detailTable(rows) {
  const body = rows
    .map(
      ([k, v]) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid ${BRAND.hairline};font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.muted};vertical-align:top;width:40%;">${esc(k)}</td>
        <td style="padding:10px 0 10px 16px;border-bottom:1px solid ${BRAND.hairline};font-size:15px;color:${BRAND.ink};">${esc(v)}</td>
      </tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${body}</table>`;
}

function rowsToText(rows) {
  return rows.map(([k, v]) => `${k}: ${v}`).join("\n");
}

/* ---------- Internal team notification ---------- */
function internalEmail(submission) {
  const rows = rowsFor(submission);
  const kind = labelFor(submission);
  const subject = `New ${kind.toLowerCase()} — ${submission.fullName}`;
  const intro = `A new ${esc(kind.toLowerCase())} was submitted through the website. Details below — reply directly to reach the customer.`;
  const html = shell("New " + kind.toLowerCase(), intro, detailTable(rows));
  const text =
    `New ${kind.toLowerCase()}\n\n` +
    rowsToText(rows) +
    `\n\n— ${BRAND.name} website`;
  return { subject, html, text };
}

/* ---------- Customer confirmation ---------- */
function customerEmail(submission) {
  const rows = rowsFor(submission);
  const isConsult = submission.type === "consultation";
  const subject = isConsult
    ? "Your consultation request — Asa Fabric"
    : "Your fabric enquiry — Asa Fabric";

  const intro = isConsult
    ? `Thank you, ${esc(submission.fullName)}. We've received your consultation request and the team will confirm your appointment shortly.`
    : submission.deliveryMethod === "post"
    ? `Thank you, ${esc(submission.fullName)}. We've received your request and will post your fabric sample, with full information to follow.`
    : `Thank you, ${esc(submission.fullName)}. We've received your enquiry and will email you the information you asked for shortly.`;

  const html = shell("Thank you", intro, detailTable(rows));
  const text =
    `Thank you, ${submission.fullName}.\n\n` +
    (isConsult
      ? "We've received your consultation request and will confirm your appointment shortly.\n\n"
      : "We've received your enquiry and will follow up shortly.\n\n") +
    "Summary of what you sent:\n" +
    rowsToText(rows) +
    `\n\n— ${BRAND.name}\n${BRAND.tagline}`;
  return { subject, html, text };
}

module.exports = { internalEmail, customerEmail, labelFor };
