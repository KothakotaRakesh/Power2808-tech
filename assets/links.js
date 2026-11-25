"use strict";

/*
  SOCIAL LINK CONFIGURATION
  Add your *own public* details below when ready.
  No account details are fabricated.
  - Instagram: full profile URL (https://www.instagram.com/yourhandle/)
  - WhatsApp: number with country code (+91XXXXXXXXXX)
  - Phone: number with country code (+91XXXXXXXXXX)
  Cards remain hidden until valid values are provided.
*/
const socialConfig = Object.freeze({
  instagram: "https://www.instagram.com/power_2808/",
  whatsapp: "+91 8317631534",
  phone: "+91 8317631534"
});

function normalizeInternationalPhone(raw) {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("+")) return null;
  const number = trimmed.replace(/[\s()\-]/g, "");
  return /^\+[1-9]\d{7,14}$/.test(number) ? number : null;
}
function normalizeInstagram(raw) {
  if (typeof raw !== "string" || !raw.trim()) return null;
  try {
    const url = new URL(raw.trim());
    const allowed = new Set(["instagram.com", "www.instagram.com"]);
    if (url.protocol !== "https:" || !allowed.has(url.hostname.toLowerCase())) return null;
    if (!url.pathname || url.pathname === "/") return null;
    return url.href;
  } catch { return null; }
}
function enableLink(id, href) {
  if (!href) return;
  const node = document.getElementById(id);
  if (!node) return;
  node.href = href;
  node.hidden = false;
}
const phone = normalizeInternationalPhone(socialConfig.phone);
const whatsapp = normalizeInternationalPhone(socialConfig.whatsapp);
enableLink("phone-link", phone ? "tel:" + phone : null);
enableLink("whatsapp-link", whatsapp ? "https://wa.me/" + whatsapp.slice(1) : null);
enableLink("instagram-link", normalizeInstagram(socialConfig.instagram));

const currentYear = document.getElementById("year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

const shareButton = document.getElementById("share-button");
const shareStatus = document.getElementById("share-status");
function announce(message) {
  shareStatus.textContent = message;
}
shareButton?.addEventListener("click", async () => {
  const url = new URL("./", window.location.href).href;
  const shareInfo = { title: "Kothakota Rakesh | All My Links", text: "Connect with me here:", url };
  try {
    if (navigator.share) {
      await navigator.share(shareInfo);
      announce("Page shared.");
    } else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      announce("Link copied to clipboard!");
    } else {
      announce("Copy the URL from your address bar to share it.");
    }
  } catch (error) {
    if (error && error.name === "AbortError") return;
    announce("Use your browser's address bar to copy this link.");
  }
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
if (!reducedMotion.matches && finePointer.matches) {
  document.querySelectorAll(".social-link").forEach(link => {
    let queued = false;
    let x = 50, y = 50;
    link.addEventListener("pointermove", e => {
      if (e.pointerType !== "mouse" || link.hidden) return;
      const bounds = link.getBoundingClientRect();
      x = bounds.width ? 100 * (e.clientX - bounds.left) / bounds.width : 50;
      y = bounds.height ? 100 * (e.clientY - bounds.top) / bounds.height : 50;
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        if (reducedMotion.matches) return;
        link.style.setProperty("--mouse-x", x.toFixed(1) + "%");
        link.style.setProperty("--mouse-y", y.toFixed(1) + "%");
      });
    }, {passive:true});
  });
}
