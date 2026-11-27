/* Professional portfolio: accessible expertise tabs and active navigation. */
(() => {
  "use strict";
  const tabs = [...document.querySelectorAll('.focus-tablist [role="tab"]')];
  const panels = tabs.map(t => document.getElementById(t.getAttribute("aria-controls")));
  if (tabs.length && panels.every(Boolean)) {
    const tabList = document.querySelector(".focus-tablist");
    const smallScreen = window.matchMedia("(max-width: 690px)");
    const setOrientation = () => tabList?.setAttribute("aria-orientation", smallScreen.matches ? "horizontal" : "vertical");
    setOrientation();
    smallScreen.addEventListener("change", setOrientation);
    const select = (index, withFocus = false) => {
      tabs.forEach((tab, i) => {
        const active = i === index;
        tab.classList.toggle("is-current", active);
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
        panels[i].hidden = !active;
      });
      if (withFocus) tabs[index].focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(i));
      tab.addEventListener("keydown", e => {
        let next = null;
        const vertical = window.matchMedia("(min-width: 691px)").matches;
        if (e.key === "ArrowRight" || (vertical && e.key === "ArrowDown")) next = (i + 1) % tabs.length;
        else if (e.key === "ArrowLeft" || (vertical && e.key === "ArrowUp")) next = (i + tabs.length - 1) % tabs.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = tabs.length - 1;
        if (next !== null) { e.preventDefault(); select(next, true); }
      });
    });
    select(0);
  }

  // Highlight the current section in the main navigation.
  const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const entries = sectionLinks.map(link => {
    const selector = link.getAttribute("href");
    const target = selector ? document.querySelector(selector) : null;
    return target ? {link, target} : null;
  }).filter(Boolean);
  if ("IntersectionObserver" in window && entries.length) {
    let activeId = "";
    const observer = new IntersectionObserver(visible => {
      for (const item of visible) {
        if (item.isIntersecting) activeId = item.target.id;
      }
      if (!activeId) return;
      entries.forEach(({link,target}) => {
        const active = target.id === activeId;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current","location");
        else link.removeAttribute("aria-current");
      });
    }, {rootMargin:"-26% 0px -63% 0px", threshold:0});
    entries.forEach(({target}) => observer.observe(target));
  }

  // Respect motion settings: no extra cursor tracking, autoplay or forced scrolling.
})();
