/* AWS SES v2 adapter — SendEmail (https://docs.aws.amazon.com/ses/latest/APIReference-V2/API_SendEmail.html)
   Signed with AWS Signature V4 using only Node's built-in `crypto` — no
   aws-sdk dependency. Configure via AWS_REGION, AWS_ACCESS_KEY_ID,
   AWS_SECRET_ACCESS_KEY (and optionally AWS_SESSION_TOKEN). */

"use strict";

const crypto = require("crypto");

const SERVICE = "ses";

function sha256Hex(data) {
  return crypto.createHash("sha256").update(data, "utf8").digest("hex");
}
function hmac(key, data) {
  return crypto.createHmac("sha256", key).update(data, "utf8").digest();
}
function signingKey(secret, date, region) {
  const kDate = hmac("AWS4" + secret, date);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, SERVICE);
  return hmac(kService, "aws4_request");
}

async function send({ from, to, replyTo, subject, html, text }) {
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const sessionToken = process.env.AWS_SESSION_TOKEN;
  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error("AWS_REGION, AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be set");
  }

  const host = `email.${region}.amazonaws.com`;
  const path = "/v2/email/outbound-emails";
  const body = JSON.stringify({
    FromEmailAddress: from,
    Destination: { ToAddresses: Array.isArray(to) ? to : [to] },
    ReplyToAddresses: replyTo ? [replyTo] : undefined,
    Content: {
      Simple: {
        Subject: { Data: subject, Charset: "UTF-8" },
        Body: {
          Text: { Data: text || "", Charset: "UTF-8" },
          Html: { Data: html || "", Charset: "UTF-8" },
        },
      },
    },
  });

  // Timestamps
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, ""); // YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.slice(0, 8); // YYYYMMDD

  const payloadHash = sha256Hex(body);

  // Canonical request
  const signedHeaders = sessionToken
    ? "content-type;host;x-amz-content-sha256;x-amz-date;x-amz-security-token"
    : "content-type;host;x-amz-content-sha256;x-amz-date";
  let canonicalHeaders =
    `content-type:application/json\n` +
    `host:${host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;
  if (sessionToken) canonicalHeaders += `x-amz-security-token:${sessionToken}\n`;

  const canonicalRequest = [
    "POST",
    path,
    "", // query string
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  // String to sign
  const scope = `${dateStamp}/${region}/${SERVICE}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    scope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  // Signature
  const signature = crypto
    .createHmac("sha256", signingKey(secretAccessKey, dateStamp, region))
    .update(stringToSign, "utf8")
    .digest("hex");

  const authorization =
    `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${scope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const headers = {
    "Content-Type": "application/json",
    "X-Amz-Content-Sha256": payloadHash,
    "X-Amz-Date": amzDate,
    Authorization: authorization,
  };
  if (sessionToken) headers["X-Amz-Security-Token"] = sessionToken;

  const res = await fetch(`https://${host}${path}`, { method: "POST", headers, body });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`SES send failed (${res.status}): ${detail}`);
  }
  return res.json().catch(() => ({}));
}

module.exports = { send };
