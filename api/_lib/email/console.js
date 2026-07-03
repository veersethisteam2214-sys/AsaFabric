/* Console adapter — the default when no EMAIL_PROVIDER is configured.
   Logs the message instead of sending so the form works end-to-end in
   local dev / preview without any secrets. Never throws. */

"use strict";

async function send({ from, to, replyTo, subject }) {
  console.log(
    "[email:console] would send",
    JSON.stringify({ from, to, replyTo, subject })
  );
  return { delivered: false, provider: "console" };
}

module.exports = { send };
