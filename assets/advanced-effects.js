/* Advanced visual effects: dependency-free, motion-aware, pointer-safe. */
(() => {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  // Scroll reading progress: transform only; no layout changes.
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);
  let progressFrame = 0;
  function updateProgress() {
    progressFrame = 0;
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = available > 0 ? Math.max(0, Math.min(1, window.scrollY / available)) : 0;
    progress.style.transform = "scaleX(" + ratio.toFixed(4) + ")";
  }
  function queueProgress() {
    if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
  }
  window.addEventListener("scroll", queueProgress, { passive: true });
  window.addEventListener("resize", queueProgress, { passive: true });
  updateProgress();

  // Smooth, limited 3D card tilt and mouse-follow spotlight.
  // Never activate on touch devices or with reduced motion enabled.
  const tiltCards = [...document.querySelectorAll(".project-card, .skill-card")];
  const resetters = [];
  tiltCards.forEach(card => {
    card.classList.add("tilt-card");
    let pendingFrame = 0;
    let pointerX = 0, pointerY = 0;
    function reset() {
      if (pendingFrame) cancelAnimationFrame(pendingFrame);
      pendingFrame = 0;
      card.classList.remove("is-tilting");
      card.style.removeProperty("transform");
      card.style.setProperty("--glow-x", "50%");
      card.style.setProperty("--glow-y", "50%");
    }
    resetters.push(reset);
    card.addEventListener("pointermove", event => {
      if (reduce.matches || !finePointer.matches || card.hidden || !card.classList.contains("visible")) return;
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      pointerX = event.clientX; pointerY = event.clientY;
      if (pendingFrame) return;
      pendingFrame = requestAnimationFrame(() => {
        pendingFrame = 0;
        if (reduce.matches || !finePointer.matches || card.hidden) { reset(); return; }
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = Math.min(1, Math.max(0, (pointerX - rect.left) / rect.width));
        const y = Math.min(1, Math.max(0, (pointerY - rect.top) / rect.height));
        const rx = ((.5 - y) * 7).toFixed(2);
        const ry = ((x - .5) * 7).toFixed(2);
        card.style.setProperty("--glow-x", (x * 100).toFixed(1) + "%");
        card.style.setProperty("--glow-y", (y * 100).toFixed(1) + "%");
        card.classList.add("is-tilting");
        card.style.transform = "perspective(1000px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-5px)";
      });
    }, { passive: true });
    card.addEventListener("pointerleave", reset);
    card.addEventListener("pointercancel", reset);
    card.addEventListener("focusin", () => {
      card.style.setProperty("--glow-x", "50%");
      card.style.setProperty("--glow-y", "40%");
    });
    card.addEventListener("focusout", () => {
      if (!card.contains(document.activeElement)) reset();
    });
  });
  function stopTilts() { resetters.forEach(reset => reset()); }
  reduce.addEventListener("change", stopTilts);
  finePointer.addEventListener("change", stopTilts);

  // Particle constellation: behind page content, capped to a low particle count.
  // Runs only while visible; pauses when the tab is hidden, and stops for reduced motion.
  const host = document.getElementById("stars");
  if (!host || !window.requestAnimationFrame) return;
  const canvas = document.createElement("canvas");
  canvas.id = "particle-field";
  canvas.setAttribute("aria-hidden", "true");
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;
  host.appendChild(canvas);

  const fract = n => n - Math.floor(n);
  const random = n => fract(Math.sin(n * 127.1 + 9.2) * 43758.5453);
  let width = 1, height = 1, particles = [], rafId = 0, lastTime = 0;
  let inViewport = true;
  function resizeParticles() {
    const rect = host.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(20, Math.min(48, Math.floor(width / 24)));
    particles = Array.from({ length: count }, (_, i) => ({
      x: random(i + 2) * width,
      y: random(i + 109) * height,
      vx: (random(i + 310) - .5) * .18,
      vy: (random(i + 476) - .5) * .18,
      radius: .75 + random(i + 752) * 1.05,
      alpha: .22 + random(i + 916) * .4
    }));
  }
  function stopParticles() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    lastTime = 0;
    ctx.clearRect(0, 0, width, height);
  }
  function canRun() { return !reduce.matches && !document.hidden && inViewport; }
  function animate(time) {
    rafId = 0;
    if (!canRun()) return;
    const step = Math.min(2, Math.max(.2, (time - (lastTime || time)) / 16.7));
    lastTime = time;
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.x += p.vx * step; p.y += p.vy * step;
      if (p.x < 0) p.x += width;
      if (p.x > width) p.x -= width;
      if (p.y < 0) p.y += height;
      if (p.y > height) p.y -= height;
    }
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y, dist2 = dx * dx + dy * dy;
        if (dist2 < 106 * 106) {
          ctx.strokeStyle = "rgba(103,230,216," + (0.11 * (1 - Math.sqrt(dist2) / 106)).toFixed(3) + ")";
          ctx.lineWidth = .7;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.fillStyle = "rgba(151,225,241," + a.alpha.toFixed(2) + ")";
      ctx.beginPath(); ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2); ctx.fill();
    }
    rafId = requestAnimationFrame(animate);
  }
  function startParticles() {
    if (canRun() && !rafId) { lastTime = 0; rafId = requestAnimationFrame(animate); }
  }
  function syncParticles() { if (canRun()) startParticles(); else stopParticles(); }
  resizeParticles();
  if ("IntersectionObserver" in window) {
    const viewportObserver = new IntersectionObserver(entries => {
      inViewport = entries[0].isIntersecting;
      syncParticles();
    }, { threshold: 0 });
    viewportObserver.observe(host);
  }
  document.addEventListener("visibilitychange", syncParticles);
  reduce.addEventListener("change", syncParticles);
  window.addEventListener("resize", () => {
    resizeParticles();
    syncParticles();
  }, { passive: true });
  syncParticles();
})();
