/* ╔══════════════════════════════════════════════════════
   ║  VERA ESG — Intro Splash Animation
   ║  Runs once per session · ~2.5s · GPU-only transforms
   ║  Reduced-motion safe · sessionStorage guard
   ╚══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Guards ────────────────────────────────────────── */
  if (sessionStorage.getItem('vera_intro_seen')) return;
  sessionStorage.setItem('vera_intro_seen', '1');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ── Overlay ───────────────────────────────────────── */
  const overlay = document.createElement('div');
  overlay.id = 'vera-intro';
  Object.assign(overlay.style, {
    position: 'fixed', inset: '0', zIndex: '99999',
    background: '#030a06',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  });

  /* ── Noise texture overlay (subtle grain) ─────────── */
  const grain = document.createElement('canvas');
  grain.width = 256; grain.height = 256;
  const ctx = grain.getContext('2d');
  const id = ctx.createImageData(256, 256);
  for (let i = 0; i < id.data.length; i += 4) {
    const v = Math.random() * 18 | 0;
    id.data[i] = id.data[i+1] = id.data[i+2] = v;
    id.data[i+3] = 28;
  }
  ctx.putImageData(id, 0, 0);
  Object.assign(grain.style, {
    position: 'absolute', inset: '0',
    width: '100%', height: '100%',
    backgroundImage: `url(${grain.toDataURL()})`,
    backgroundRepeat: 'repeat',
    backgroundSize: '256px 256px',
    pointerEvents: 'none', zIndex: '0', opacity: '0.6',
  });

  /* ── HTML ──────────────────────────────────────────── */
  overlay.innerHTML = `
<div id="ii-center" style="
  position:relative;z-index:1;
  display:flex;flex-direction:column;align-items:center;
  gap:clamp(10px,2vw,18px)
">

  <!-- Logo mark — strokes draw in, then fill -->
  <svg id="ii-svg" width="72" height="72" viewBox="0 0 28 28" fill="none"
    style="
      filter:drop-shadow(0 0 28px oklch(0.72 0.21 150 / 0.55));
      transform:scale(0.65) translateY(6px);
      opacity:0;
      will-change:transform,opacity
    ">
    <rect width="28" height="28" rx="7" fill="#0d2318"/>
    <path id="ii-p1" d="M7 20L14 8l7 12H7z"
      fill="none" stroke="#4ade80" stroke-width="1.1"
      stroke-linecap="round" stroke-linejoin="round"
      stroke-dasharray="55" stroke-dashoffset="55"/>
    <path id="ii-p2" d="M10.5 20l3.5-6 3.5 6h-7z"
      fill="none" stroke="#86efac" stroke-width="1.1"
      stroke-linecap="round" stroke-linejoin="round"
      stroke-dasharray="30" stroke-dashoffset="30"/>
  </svg>

  <!-- VERA — chars sweep up with stagger -->
  <div style="overflow:hidden;line-height:1.05;margin-top:2px">
    <div style="display:flex;align-items:baseline;gap:0.01em">
      <span id="ii-c0" style="
        font-family:'Space Grotesk',sans-serif;
        font-size:clamp(3.8rem,8.5vw,6.8rem);
        font-weight:700;letter-spacing:-.04em;
        color:#f0fdf4;display:inline-block;
        transform:translateY(108%);opacity:0;
        will-change:transform,opacity
      ">V</span>
      <span id="ii-c1" style="
        font-family:'Space Grotesk',sans-serif;
        font-size:clamp(3.8rem,8.5vw,6.8rem);
        font-weight:700;letter-spacing:-.04em;
        color:#f0fdf4;display:inline-block;
        transform:translateY(108%);opacity:0;
        will-change:transform,opacity
      ">E</span>
      <span id="ii-c2" style="
        font-family:'Space Grotesk',sans-serif;
        font-size:clamp(3.8rem,8.5vw,6.8rem);
        font-weight:700;letter-spacing:-.04em;
        color:#f0fdf4;display:inline-block;
        transform:translateY(108%);opacity:0;
        will-change:transform,opacity
      ">R</span>
      <span id="ii-c3" style="
        font-family:'Space Grotesk',sans-serif;
        font-size:clamp(3.8rem,8.5vw,6.8rem);
        font-weight:700;letter-spacing:-.04em;
        color:#4ade80;display:inline-block;
        transform:translateY(108%);opacity:0;
        will-change:transform,opacity
      ">A</span>
    </div>
  </div>

  <!-- Scan line (expands from center) -->
  <div id="ii-line" style="
    height:1.5px;width:0;
    background:linear-gradient(90deg,
      transparent 0%,
      oklch(0.72 0.21 150 / 0.4) 15%,
      oklch(0.72 0.21 150) 45%,
      #86efac 55%,
      oklch(0.72 0.21 150 / 0.4) 85%,
      transparent 100%
    );
    margin-top:-2px;
    will-change:width
  "></div>

  <!-- Subtitle -->
  <div id="ii-sub" style="
    font-family:'DM Sans',sans-serif;
    font-size:clamp(0.68rem,1.4vw,0.85rem);
    font-weight:500;letter-spacing:.2em;
    text-transform:uppercase;
    color:oklch(0.72 0.21 150);
    opacity:0;transform:translateY(10px);
    will-change:transform,opacity
  ">ESG Platform per PMI italiane</div>

  <!-- Tagline -->
  <div id="ii-tag" style="
    font-family:'DM Sans',sans-serif;
    font-size:clamp(0.62rem,1vw,0.74rem);
    color:oklch(0.52 0.10 150);
    letter-spacing:.05em;
    opacity:0;transform:translateY(8px);
    margin-top:-4px;
    will-change:transform,opacity
  ">Calcolo GHG &nbsp;·&nbsp; Doppia Materialità &nbsp;·&nbsp; Reporting conforme</div>

</div>

<!-- Curtain — top half -->
<div id="ii-ct" style="
  position:absolute;top:0;left:0;right:0;height:51%;
  background:#030a06;z-index:5;
  will-change:transform
"></div>

<!-- Curtain — bottom half -->
<div id="ii-cb" style="
  position:absolute;bottom:0;left:0;right:0;height:51%;
  background:#030a06;z-index:5;
  will-change:transform
"></div>
`;

  overlay.appendChild(grain);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  /* ── Helpers ───────────────────────────────────────── */
  const $ = id => document.getElementById(id);
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function trans(el, props, durationMs, delayMs, easing) {
    setTimeout(() => {
      const e = easing || 'cubic-bezier(0.4,0,0.2,1)';
      el.style.transition = Object.keys(props)
        .map(k => `${k} ${durationMs}ms ${e}`)
        .join(',');
      Object.assign(el.style, props);
    }, delayMs || 0);
  }

  /* ── Animation sequence ────────────────────────────── */
  async function run() {

    // ── T=60ms: SVG logo springs in ──────────────────────
    trans($('ii-svg'), {
      transform: 'scale(1) translateY(0)',
      opacity: '1',
    }, 520, 60, 'cubic-bezier(0.34,1.56,0.64,1)');

    // ── T=160ms: outer triangle stroke draws ─────────────
    setTimeout(() => {
      const p1 = $('ii-p1');
      p1.style.transition = 'stroke-dashoffset 0.48s cubic-bezier(0.4,0,0.2,1)';
      p1.style.strokeDashoffset = '0';
    }, 160);

    // ── T=340ms: inner triangle stroke draws ─────────────
    setTimeout(() => {
      const p2 = $('ii-p2');
      p2.style.transition = 'stroke-dashoffset 0.38s cubic-bezier(0.4,0,0.2,1)';
      p2.style.strokeDashoffset = '0';
    }, 340);

    // ── T=640ms: paths fill in ────────────────────────────
    setTimeout(() => {
      const p1 = $('ii-p1');
      p1.style.transition = 'fill 0.28s ease, stroke-width 0.2s ease';
      p1.style.fill = '#4ade80'; p1.style.strokeWidth = '0';
    }, 640);
    setTimeout(() => {
      const p2 = $('ii-p2');
      p2.style.transition = 'fill 0.28s ease, stroke-width 0.2s ease';
      p2.style.fill = '#86efac'; p2.style.strokeWidth = '0';
    }, 700);

    // ── T=480ms: "VERA" chars sweep up (staggered 60ms) ──
    ['ii-c0','ii-c1','ii-c2','ii-c3'].forEach((id, i) => {
      trans($(id), {
        transform: 'translateY(0)',
        opacity: '1',
      }, 620, 480 + i * 60, 'cubic-bezier(0.16,1,0.3,1)');
    });

    // ── T=900ms: scan line expands ────────────────────────
    setTimeout(() => {
      const ln = $('ii-line');
      ln.style.transition = 'width 0.58s cubic-bezier(0.4,0,0.2,1)';
      ln.style.width = 'clamp(200px,30vw,340px)';
    }, 900);

    // ── T=1080ms: subtitle fades in ──────────────────────
    trans($('ii-sub'), {
      opacity: '1', transform: 'translateY(0)',
    }, 520, 1080, 'cubic-bezier(0.4,0,0.2,1)');

    // ── T=1230ms: tagline fades in ───────────────────────
    trans($('ii-tag'), {
      opacity: '1', transform: 'translateY(0)',
    }, 500, 1230, 'cubic-bezier(0.4,0,0.2,1)');

    // ── Hold ─────────────────────────────────────────────
    await sleep(1950);

    // ── T=1950ms: curtain reveal ─────────────────────────
    const ct = $('ii-ct');
    const cb = $('ii-cb');
    const center = $('ii-center');

    // Fade logo out simultaneously
    center.style.transition = 'opacity 0.4s ease';
    center.style.opacity = '0';

    // Panels slide away
    ct.style.transition = 'transform 0.72s cubic-bezier(0.76,0,0.24,1)';
    cb.style.transition = 'transform 0.72s cubic-bezier(0.76,0,0.24,1)';
    ct.style.transform = 'translateY(-101%)';
    cb.style.transform = 'translateY(101%)';

    // ── T=2700ms: remove overlay ──────────────────────────
    await sleep(750);
    document.body.style.overflow = '';
    overlay.style.transition = 'opacity 0.18s ease';
    overlay.style.opacity = '0';
    await sleep(200);
    overlay.remove();
  }

  // Start when fonts are likely loaded (small delay for DOMContentLoaded)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

})();
