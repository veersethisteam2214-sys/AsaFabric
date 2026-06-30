/* SendGrid adapter — https://docs.sendgrid.com/api-reference/mail-send/mail-send
   Uses the global fetch (Node 18+ on Vercel). No SDK dependency. */

"use strict";

async function send({ from, to, replyTo, subject, html, text }) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) throw new Error("SENDGRID_API_KEY is not set");

  const recipients = (Array.isArray(to) ? to : [to]).map((email) => ({ email }));

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: recipients }],
      from: { email: from },
      reply_to: replyTo ? { email: replyTo } : undefined,
      subject,
      content: [
        { type: "text/plain", value: text || "" },
        { type: "text/html", value: html || "" },
      ],
    }),
  });

  // SendGrid returns 202 with an empty body on success.
  if (res.status !== 202) {
    const detail = await res.text().catch(() => "");
    throw new Error(`SendGrid send failed (${res.status}): ${detail}`);
  }
  return { status: res.status };
}

module.exports = { send };
