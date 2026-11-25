"use strict";
/*
 * Optional upgrades for the single-page contact hub.
 * This script adds no network requests or trackers.
 */
(() => {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const toggleIcon = document.getElementById("theme-icon");
  const toggleLabel = document.getElementById("theme-label");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const status = document.getElementById("tool-status");
  const STORAGE_KEY = "kothakota-links-theme-v1";

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  }
  function setTheme(theme) {
    const light = theme === "light";
    root.dataset.theme = light ? "light" : "dark";
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(light));
      toggle.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
    }
    if (toggleIcon) toggleIcon.textContent = light ? "☾" : "☀";
    if (toggleLabel) toggleLabel.textContent = light ? "Dark" : "Light";
    if (themeMeta) themeMeta.setAttribute("content", light ? "#f1f5fd" : "#080b19");
  }
  setTheme(getStoredTheme());
  toggle?.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    setTheme(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* optional preference storage */ }
  });

  // WhatsApp opens a draft message; it never sends without the visitor approving it.
  const whatsappLink = document.getElementById("whatsapp-link");
  if (whatsappLink?.href && !whatsappLink.hidden) {
    try {
      const url = new URL(whatsappLink.href);
      if (url.hostname === "wa.me") {
        url.searchParams.set("text", "Hi Rakesh! I visited your portfolio and would like to connect.");
        whatsappLink.href = url.toString();
      }
    } catch { /* leave existing working WhatsApp link unchanged */ }
  }

  // A standards-based downloadable contact record. Only use details already
  // displayed on this public page or explicitly supplied for publication.
  const saveContact = document.getElementById("save-contact");
  saveContact?.addEventListener("click", () => {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:Rakesh;Kothakota;;;",
      "FN:Kothakota Rakesh",
      "ORG:Student",
      "TITLE:AI/ML Student and Full-Stack Developer",
      "TEL;TYPE=CELL:+918317631534",
      "EMAIL;TYPE=INTERNET:192525075.simats@saveetha.com",
      "URL:https://kothakotarakesh.github.io/Power2808-tech/",
      "X-SOCIALPROFILE;TYPE=linkedin:https://www.linkedin.com/in/kothakota-rakesh-b31499380/",
      "X-SOCIALPROFILE;TYPE=instagram:https://www.instagram.com/power_2808/",
      "NOTE:GitHub - https://github.com/KothakotaRakesh",
      "END:VCARD",
      ""
    ].join("\r\n");
    try {
      const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
      const objectURL = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectURL;
      a.download = "Kothakota-Rakesh-Contact.vcf";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(objectURL), 2000);
      if (status) status.textContent = "Contact file downloaded. Open it to save the details.";
    } catch {
      if (status) status.textContent = "Unable to download. Try a modern browser or use the phone link above.";
    }
  });
})();
