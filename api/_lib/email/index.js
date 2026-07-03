/* ============================================================
   Asa Fabric — email layer entry point (no deps)
   Selects a provider from EMAIL_PROVIDER and exposes notify(), which
   sends the internal-team email and the customer confirmation for a
   validated submission.

   Environment variables:
     EMAIL_PROVIDER   resend | sendgrid | ses | console   (default: console)
     EMAIL_FROM       verified sender, e.g. "Asa Fabric <hello@asafabric.com>"
     EMAIL_TO         internal inbox(es), comma-separated
     + provider keys  (see each adapter / .env.example)
   ============================================================ */

"use strict";

const templates = require("./templates");

const PROVIDERS = {
  resend: () => require("./resend"),
  sendgrid: () => require("./sendgrid"),
  ses: () => require("./ses"),
  console: () => require("./console"),
};

function getProvider() {
  const name = (process.env.EMAIL_PROVIDER || "console").toLowerCase();
  const load = PROVIDERS[name] || PROVIDERS.console;
  return { name: PROVIDERS[name] ? name : "console", adapter: load() };
}

/* Send both emails for a submission. Returns a result object; it never
   throws, so a mail outage cannot turn a valid submission into a 500.
   The handler decides how to surface partial failures. */
async function notify(submission) {
  const { name, adapter } = getProvider();
  const from = process.env.EMAIL_FROM || "Asa Fabric <onboarding@resend.dev>";
  const internalTo = (process.env.EMAIL_TO || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const internal = templates.internalEmail(submission);
  const customer = templates.customerEmail(submission);

  const results = { provider: name, internal: null, customer: null };

  // Internal notification (only if we have somewhere to send it).
  if (internalTo.length) {
    try {
      await adapter.send({
        from,
        to: internalTo,
        replyTo: submission.email,
        subject: internal.subject,
        html: internal.html,
        text: internal.text,
      });
      results.internal = "sent";
    } catch (err) {
      console.error("[email] internal notification failed:", err.message);
      results.internal = "failed";
    }
  } else {
    results.internal = "skipped";
  }

  // Customer confirmation.
  try {
    await adapter.send({
      from,
      to: submission.email,
      replyTo: internalTo[0] || undefined,
      subject: customer.subject,
      html: customer.html,
      text: customer.text,
    });
    results.customer = "sent";
  } catch (err) {
    console.error("[email] customer confirmation failed:", err.message);
    results.customer = "failed";
  }

  return results;
}

module.exports = { notify, getProvider };
