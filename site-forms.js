/* ============================================================
   Asa Fabric — shared form delivery + email-capture popup
   ------------------------------------------------------------
   Loaded on index.html, about.html and catalogue.html BEFORE the
   page script (app.js / catalogue.js). Everything is namespaced on
   window.AsaForms so it never collides with the page scripts' own
   top-level consts (prefersReducedMotion, escapeHtml, safe, …).

   Delivery uses FormSubmit.co (https://formsubmit.co) — no backend and
   no signup required. On the FIRST real submission from the live domain
   FormSubmit sends a one-time activation email to the destination
   address; that link must be clicked once to enable delivery.
   ============================================================ */
(function () {
  "use strict";

  /* ---- SINGLE swap point for the delivery address ----
     FormSubmit.co AJAX endpoint (posts JSON, no page redirect).
     To HIDE the email address publicly, create a hashed endpoint in the
     FormSubmit dashboard and replace the URL below with, e.g.:
        https://formsubmit.co/ajax/<your-hashed-token>
     Nothing else needs to change. */
  const FORM_ENDPOINT = "https://formsubmit.co/ajax/veersethisteam2214@gmail.com";
  const DEST_EMAIL = "veersethisteam2214@gmail.com";
  const FALLBACK_MSG = "Couldn't send just now — email us at " + DEST_EMAIL;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function validEmail(v) {
    return typeof v === "string" && v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  /* Deliver a set of fields to FormSubmit via AJAX (no page redirect).
     Always adds _subject + _template; the caller may include a `_honey`
     honeypot field (FormSubmit silently drops submissions where it's set).
     Resolves { ok: true, data } on success; throws on network error or a
     non-ok / { success:"false" } response so callers can fall back. */
  async function submit(fields, subject) {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(Object.assign({ _subject: subject, _template: "table" }, fields))
    });
    let data = {};
    try { data = await res.json(); } catch (_) { data = {}; }
    const success = data && typeof data.success !== "undefined"
      ? String(data.success) === "true"
      : res.ok;
    if (!res.ok || !success) {
      throw new Error("FormSubmit responded " + res.status);
    }
    return { ok: true, data };
  }

  /* ============================================================
     Email-capture popup (site-wide, once per visitor)
     ------------------------------------------------------------
     Shows after a short delay (or exit-intent) on the FIRST visit only.
     Once shown, submitted or dismissed it never shows again — a single
     localStorage flag (asaEmailPopupDone) is shared across all pages.
     Accessible: role="dialog", aria-modal, labelled, ESC + backdrop +
     × close, focus moves into the dialog, focus is trapped, and it
     respects prefers-reduced-motion (simple fade, no bounce).
     ============================================================ */
  const POPUP_FLAG = "asaEmailPopupDone";
  const POPUP_DELAY = 6000; // ~6s — never instant

  function popupDone() {
    try { return localStorage.getItem(POPUP_FLAG) === "1"; } catch (_) { return false; }
  }
  function markPopupDone() {
    try { localStorage.setItem(POPUP_FLAG, "1"); } catch (_) {}
  }

  function initEmailPopup() {
    const popup = document.getElementById("emailPopup");
    if (!popup || popupDone()) return;

    const card = popup.querySelector(".email-popup-card");
    const form = popup.querySelector("#emailPopupForm");
    const note = popup.querySelector("[data-popup-note]");
    const emailInput = form ? form.querySelector('input[name="email"]') : null;
    const honey = form ? form.querySelector('input[name="_honey"]') : null;
    const closers = Array.from(popup.querySelectorAll("[data-popup-close]"));
    if (!card || !form || !emailInput) return;

    let shown = false;
    let lastFocused = null;
    let delayTimer = window.setTimeout(open, POPUP_DELAY);

    function focusable() {
      return Array.from(card.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter((el) => el.offsetParent !== null);
    }

    function open() {
      if (shown || popupDone()) return;
      shown = true;
      // Impression = once-per-visitor: never surface again after this.
      markPopupDone();
      cleanupTriggers();
      lastFocused = document.activeElement;
      popup.hidden = false;
      requestAnimationFrame(() => popup.classList.add("is-open"));
      window.setTimeout(() => {
        if (emailInput && typeof emailInput.focus === "function") emailInput.focus();
      }, reducedMotion ? 0 : 60);
      document.addEventListener("keydown", onKey);
    }

    function close() {
      popup.classList.remove("is-open");
      const finish = () => { popup.hidden = true; };
      if (reducedMotion) finish(); else window.setTimeout(finish, 260);
      document.removeEventListener("keydown", onKey);
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    }

    function onKey(e) {
      if (e.key === "Escape") { e.preventDefault(); close(); return; }
      if (e.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    function onExitIntent(e) {
      // mouse leaving through the top of the viewport
      if ((e.clientY || 0) <= 4) open();
    }
    function cleanupTriggers() {
      window.clearTimeout(delayTimer);
      document.removeEventListener("mouseleave", onExitIntent);
    }

    // Additional exit-intent trigger (skip under reduced motion / touch).
    if (!reducedMotion) document.addEventListener("mouseleave", onExitIntent);

    closers.forEach((btn) => btn.addEventListener("click", close));

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (honey && honey.value) { close(); return; } // bot: drop silently
      const email = (emailInput.value || "").trim();
      if (!validEmail(email)) {
        emailInput.setAttribute("aria-invalid", "true");
        if (note) { note.hidden = false; note.textContent = "Please enter a valid email address."; }
        emailInput.focus();
        return;
      }
      emailInput.removeAttribute("aria-invalid");

      const btn = form.querySelector('button[type="submit"]');
      const originalLabel = btn ? btn.innerHTML : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      if (note) { note.hidden = false; note.textContent = "Sending…"; }

      try {
        await submit({ email: email, _honey: honey ? honey.value : "" }, "New Asa Fabric newsletter signup");
        markPopupDone();
        form.hidden = true;
        if (note) {
          note.hidden = false;
          note.textContent = "You're on the list — thank you. We'll be in touch with new arrivals.";
        }
        window.setTimeout(close, reducedMotion ? 0 : 2200);
      } catch (err) {
        console.error("[email-popup] submit failed:", err);
        if (note) { note.hidden = false; note.textContent = FALLBACK_MSG; }
        if (btn) { btn.disabled = false; btn.innerHTML = originalLabel; }
      }
    });
  }

  window.AsaForms = {
    FORM_ENDPOINT: FORM_ENDPOINT,
    DEST_EMAIL: DEST_EMAIL,
    FALLBACK_MSG: FALLBACK_MSG,
    reducedMotion: reducedMotion,
    validEmail: validEmail,
    submit: submit,
    initEmailPopup: initEmailPopup
  };
})();
