/* ╔══════════════════════════════════════════════════════
   ║  VERA ESG — Intro Splash Animation
   ║  Total ~4.5s · GPU-only transforms · once per session
   ╚══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Guards (same as head inline check) ───────────────── */
  if (sessionStorage.getItem('vera_intro_seen')) return;
  sessionStorage.setItem('vera_intro_seen', '1');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.style.visibility = '';
    return;
  }

  /* ── Unhide body (was hidden by head script) ──────────── */
  document.body.style.visibility = '';

  /* ── Overlay ──────────────────────────────────────────── */
  const overlay = document.createElement('div');
  overlay.id = 'vera-intro';
  Object.assign(overlay.style, {
    position: 'fixed', inset: '0', zIndex: '99999',
    background: '#030a06',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  });

  /* ── Grain texture ────────────────────────────────────── */
  const grain = document.createElement('canvas');
  grain.width = 256; grain.height = 256;
  const ctx = grain.getContext('2d');
  const imgd = ctx.createImageData(256, 256);
  for (let i = 0; i < imgd.data.length; i += 4) {
    const v = Math.random() * 20 | 0;
    imgd.data[i] = imgd.data[i+1] = imgd.data[i+2] = v;
    imgd.data[i+3] = 30;
  }
  ctx.putImageData(imgd, 0, 0);
  Object.assign(grain.style, {
    position: 'absolute', inset: '0',
    width: '100%', height: '100%',
    backgroundImage: `url(${grain.toDataURL()})`,
    backgroundRepeat: 'repeat', backgroundSize: '256px',
    pointerEvents: 'none', zIndex: '0', opacity: '0.5',
  });

  /* ── Markup ───────────────────────────────────────────── */
  overlay.innerHTML = `
<div id="ii-center" style="
  position:relative;z-index:1;
  display:flex;flex-direction:column;align-items:center;
  gap:clamp(12px,2.2vw,22px)
">

  <!-- Logo SVG (stroke draw → fill) -->
  <svg id="ii-svg" width="80" height="80" viewBox="0 0 28 28" fill="none" style="
    filter:drop-shadow(0 0 32px oklch(0.72 0.21 150 / 0.5));
    transform:scale(0.6) translateY(8px);opacity:0;
    will-change:transform,opacity
  ">
    <rect width="28" height="28" rx="7" fill="#0d2318"/>
    <path id="ii-p1" d="M7 20L14 8l7 12H7z"
      fill="none" stroke="#4ade80" stroke-width="1.2"
      stroke-linecap="round" stroke-linejoin="round"
      stroke-dasharray="56" stroke-dashoffset="56"/>
    <path id="ii-p2" d="M10.5 20l3.5-6 3.5 6h-7z"
      fill="none" stroke="#86efac" stroke-width="1.2"
      stroke-linecap="round" stroke-linejoin="round"
      stroke-dasharray="31" stroke-dashoffset="31"/>
  </svg>

  <!-- VERA chars — sweep up with stagger -->
  <div style="overflow:hidden;line-height:1.05;margin-top:4px">
    <div id="ii-word" style="display:flex;align-items:baseline;gap:.01em">
      <span id="ii-c0" style="font-family:'Space Grotesk',sans-serif;font-size:clamp(4rem,9vw,7.5rem);font-weight:700;letter-spacing:-.04em;color:#f0fdf4;display:inline-block;transform:translateY(110%);opacity:0;will-change:transform,opacity">V</span>
      <span id="ii-c1" style="font-family:'Space Grotesk',sans-serif;font-size:clamp(4rem,9vw,7.5rem);font-weight:700;letter-spacing:-.04em;color:#f0fdf4;display:inline-block;transform:translateY(110%);opacity:0;will-change:transform,opacity">E</span>
      <span id="ii-c2" style="font-family:'Space Grotesk',sans-serif;font-size:clamp(4rem,9vw,7.5rem);font-weight:700;letter-spacing:-.04em;color:#f0fdf4;display:inline-block;transform:translateY(110%);opacity:0;will-change:transform,opacity">R</span>
      <span id="ii-c3" style="font-family:'Space Grotesk',sans-serif;font-size:clamp(4rem,9vw,7.5rem);font-weight:700;letter-spacing:-.04em;color:#4ade80;display:inline-block;transform:translateY(110%);opacity:0;will-change:transform,opacity">A</span>
    </div>
  </div>

  <!-- Scan line -->
  <div id="ii-line" style="
    height:1.5px;width:0;
    background:linear-gradient(90deg,transparent 0%,oklch(0.72 0.21 150/.4) 10%,oklch(0.72 0.21 150) 45%,#86efac 55%,oklch(0.72 0.21 150/.4) 90%,transparent 100%);
    margin-top:-4px;will-change:width
  "></div>

  <!-- Subtitle -->
  <div id="ii-sub" style="
    font-family:'DM Sans',sans-serif;
    font-size:clamp(0.7rem,1.5vw,0.88rem);font-weight:500;
    letter-spacing:.22em;text-transform:uppercase;
    color:oklch(0.72 0.21 150);
    opacity:0;transform:translateY(12px);will-change:transform,opacity
  ">ESG Platform per PMI italiane</div>

  <!-- Tagline pills -->
  <div id="ii-pills" style="
    display:flex;gap:10px;flex-wrap:wrap;justify-content:center;
    opacity:0;transform:translateY(10px);will-change:transform,opacity
  ">
    <span style="font-family:'DM Sans',sans-serif;font-size:clamp(.6rem,.9vw,.72rem);padding:4px 10px;border-radius:20px;border:1px solid oklch(0.72 0.21 150/.3);color:oklch(0.58 0.12 150);letter-spacing:.04em">Calcolo GHG</span>
    <span style="font-family:'DM Sans',sans-serif;font-size:clamp(.6rem,.9vw,.72rem);padding:4px 10px;border-radius:20px;border:1px solid oklch(0.72 0.21 150/.3);color:oklch(0.58 0.12 150);letter-spacing:.04em">Doppia Materialità</span>
    <span style="font-family:'DM Sans',sans-serif;font-size:clamp(.6rem,.9vw,.72rem);padding:4px 10px;border-radius:20px;border:1px solid oklch(0.72 0.21 150/.3);color:oklch(0.58 0.12 150);letter-spacing:.04em">Reporting conforme</span>
  </div>

  <!-- Skip button -->
  <button id="ii-skip" onclick="window.__veraIntroSkip && window.__veraIntroSkip()" style="
    margin-top:clamp(16px,3vw,32px);
    font-family:'DM Sans',sans-serif;font-size:11px;
    color:oklch(0.38 0.06 150);background:none;border:none;cursor:pointer;
    letter-spacing:.06em;padding:6px 12px;
    opacity:0;transition:opacity .4s ease, color .2s ease
  " onmouseenter="this.style.color='oklch(0.58 0.12 150)'" onmouseleave="this.style.color='oklch(0.38 0.06 150)'">
    Salta →
  </button>

</div>

<!-- Curtain top -->
<div id="ii-ct" style="position:absolute;top:0;left:0;right:0;height:51%;background:#030a06;z-index:5;will-change:transform"></div>
<!-- Curtain bottom -->
<div id="ii-cb" style="position:absolute;bottom:0;left:0;right:0;height:51%;background:#030a06;z-index:5;will-change:transform"></div>
`;

  overlay.appendChild(grain);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  /* ── Helpers ──────────────────────────────────────────── */
  const $ = id => document.getElementById(id);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let skipFn = null;

  function trans(el, props, durationMs, delayMs, easing) {
    if (!el) return;
    setTimeout(() => {
      const e = easing || 'cubic-bezier(0.4,0,0.2,1)';
      el.style.transition = Object.keys(props).map(k => `${k} ${durationMs}ms ${e}`).join(',');
      Object.assign(el.style, props);
    }, delayMs || 0);
  }

  /* ── Curtain reveal (extracted so skip can call it) ───── */
  async function reveal() {
    const ct = $('ii-ct'), cb = $('ii-cb'), center = $('ii-center');
    center.style.transition = 'opacity 0.45s ease';
    center.style.opacity = '0';
    ct.style.transition = 'transform 0.85s cubic-bezier(0.76,0,0.24,1)';
    cb.style.transition = 'transform 0.85s cubic-bezier(0.76,0,0.24,1)';
    ct.style.transform = 'translateY(-101%)';
    cb.style.transform = 'translateY(101%)';
    await sleep(900);
    document.body.style.overflow = '';
    overlay.style.transition = 'opacity 0.2s ease';
    overlay.style.opacity = '0';
    await sleep(220);
    overlay.remove();
    window.__veraIntroSkip = null;
  }

  /* ── Skip handler ─────────────────────────────────────── */
  window.__veraIntroSkip = async function () {
    window.__veraIntroSkip = null; // prevent double-call
    // Clear all pending timeouts by replacing with curtain immediately
    await reveal();
  };

  /* ── Main sequence ────────────────────────────────────── */
  async function run() {

    /* Phase 1 — Logo springs in ──────────────────────────── */
    trans($('ii-svg'), { transform: 'scale(1) translateY(0)', opacity: '1' },
      600, 80, 'cubic-bezier(0.34,1.56,0.64,1)');

    // Outer triangle stroke draw
    setTimeout(() => {
      const p = $('ii-p1');
      p.style.transition = 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)';
      p.style.strokeDashoffset = '0';
    }, 200);

    // Inner triangle stroke draw
    setTimeout(() => {
      const p = $('ii-p2');
      p.style.transition = 'stroke-dashoffset 0.5s cubic-bezier(0.4,0,0.2,1)';
      p.style.strokeDashoffset = '0';
    }, 450);

    // Paths fill with color
    setTimeout(() => {
      const p = $('ii-p1');
      p.style.transition = 'fill 0.3s ease';
      p.style.fill = '#4ade80'; p.style.strokeWidth = '0';
    }, 820);
    setTimeout(() => {
      const p = $('ii-p2');
      p.style.transition = 'fill 0.3s ease';
      p.style.fill = '#86efac'; p.style.strokeWidth = '0';
    }, 900);

    /* Phase 2 — VERA chars sweep up ──────────────────────── */
    ['ii-c0','ii-c1','ii-c2','ii-c3'].forEach((id, i) => {
      trans($(id), { transform: 'translateY(0)', opacity: '1' },
        680, 700 + i * 80, 'cubic-bezier(0.16,1,0.3,1)');
    });

    /* Phase 3 — Details ──────────────────────────────────── */
    // Scan line expands
    setTimeout(() => {
      const ln = $('ii-line');
      ln.style.transition = 'width 0.7s cubic-bezier(0.4,0,0.2,1)';
      ln.style.width = 'clamp(220px,32vw,380px)';
    }, 1280);

    // Subtitle
    trans($('ii-sub'), { opacity: '1', transform: 'translateY(0)' },
      600, 1580, 'cubic-bezier(0.4,0,0.2,1)');

    // Pills
    trans($('ii-pills'), { opacity: '1', transform: 'translateY(0)' },
      600, 1850, 'cubic-bezier(0.4,0,0.2,1)');

    // Skip button
    setTimeout(() => {
      const sk = $('ii-skip');
      if (sk) sk.style.opacity = '0.7';
    }, 2200);

    /* Phase 4 — Hold ─────────────────────────────────────── */
    await sleep(3200);

    /* Phase 5 — Curtain reveal ───────────────────────────── */
    await reveal();
  }

  run();

})();
