/* ============================================================
   Asa Fabric — consultation / sample-request endpoint
   Zero-config Vercel Node serverless function (CommonJS, no deps).
   POST /api/consultation
     { type: "sample" | "consultation", ...fields }
   Validates server-side (source of truth), then sends the internal
   notification + customer confirmation via the configured email provider.
   ============================================================ */

"use strict";

const {
  validateSampleRequest,
  validateConsultation,
  earliestConsultationDate,
} = require("./_lib/validation");
const { notify } = require("./_lib/email");

/* Body can arrive parsed (Vercel) or as a raw string; handle both. */
function readBody(req) {
  if (req.body && typeof req.body === "object") return Promise.resolve(req.body);
  if (typeof req.body === "string") {
    try {
      return Promise.resolve(JSON.parse(req.body || "{}"));
    } catch (_) {
      return Promise.resolve(null);
    }
  }
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) req.destroy(); // ~1MB guard
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (_) {
        resolve(null);
      }
    });
    req.on("error", () => resolve(null));
  });
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const data = await readBody(req);
  if (!data || typeof data !== "object") {
    return res.status(400).json({ ok: false, error: "Invalid JSON body" });
  }

  // Honeypot: real users never fill this hidden field; bots do.
  if (typeof data.website === "string" && data.website.trim() !== "") {
    return res.status(200).json({ ok: true }); // silently accept + drop
  }

  const now = new Date();
  let result;
  if (data.type === "consultation") {
    result = validateConsultation(data, now);
  } else if (data.type === "sample") {
    result = validateSampleRequest(data);
  } else {
    return res
      .status(400)
      .json({ ok: false, error: "Unknown submission type" });
  }

  if (!result.valid) {
    return res.status(422).json({
      ok: false,
      error: "Please correct the highlighted fields.",
      errors: result.errors,
      earliestDate: earliestConsultationDate(now),
    });
  }

  // Validation passed — accept the lead even if email delivery has a hiccup.
  let delivery = null;
  try {
    delivery = await notify(result.value);
  } catch (err) {
    console.error("[consultation] notify threw:", err && err.message);
  }

  return res.status(200).json({
    ok: true,
    type: result.value.type,
    delivery,
  });
};
