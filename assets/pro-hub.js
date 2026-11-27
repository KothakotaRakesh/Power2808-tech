/* Progressive enhancement for the contact hub: accessible tabs + restrained pointer lighting. */
(() => {
  "use strict";
  const tabs = Array.from(document.querySelectorAll('.hub-tablist [role="tab"]'));
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute("aria-controls")));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (!tabs.length || panels.some(panel => !panel)) return;

  function activate(index, focusTab = false) {
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      tab.classList.toggle("is-current", selected);
      panels[i].hidden = !selected;
    });
    if (focusTab) tabs[index].focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => activate(i));
    tab.addEventListener("keydown", event => {
      let target = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") target = (i + 1) % tabs.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") target = (i + tabs.length - 1) % tabs.length;
      else if (event.key === "Home") target = 0;
      else if (event.key === "End") target = tabs.length - 1;
      if (target !== null) {
        event.preventDefault();
        activate(target, true);
      }
    });
  });
  activate(0);

  // Ambient light gently follows a mouse, never the user's touch or keyboard focus.
  const card = document.querySelector(".profile-card");
  if (!card) return;
  let frame = 0, mouseX = 50, mouseY = 20;
  function pointerMove(event) {
    if (reduced.matches || !fine.matches || event.pointerType !== "mouse") return;
    const bounds = card.getBoundingClientRect();
    mouseX = bounds.width ? Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100)) : 50;
    mouseY = bounds.height ? Math.max(0, Math.min(100, (event.clientY - bounds.top) / bounds.height * 100)) : 20;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (reduced.matches) return;
      card.style.setProperty("--card-x", mouseX.toFixed(1) + "%");
      card.style.setProperty("--card-y", mouseY.toFixed(1) + "%");
    });
  }
  card.addEventListener("pointermove", pointerMove, { passive: true });
  card.addEventListener("pointerleave", () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    card.style.removeProperty("--card-x");
    card.style.removeProperty("--card-y");
  });
  reduced.addEventListener("change", event => {
    if (event.matches) {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      card.style.removeProperty("--card-x");
      card.style.removeProperty("--card-y");
    }
  });
})();
