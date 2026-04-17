/* ╔══════════════════════════════════════════════════════════
   ║  VERA ESG Platform — Animation Module
   ║  Principles: Emil Kowalski + impeccable/animate skill
   ║  Rules:
   ║   - GPU only: transform + opacity
   ║   - No bounce/elastic easing
   ║   - Always respect prefers-reduced-motion
   ║   - Animate with purpose, not decoration
   ╚══════════════════════════════════════════════════════════ */

'use strict';

/* ── Motion preference ───────────────────────────────────── */
const _reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Easing curves (Emil's rules — no bounce, no elastic) ── */
const EASE = {
  out:      'cubic-bezier(0.25, 1, 0.5, 1)',       // smooth deceleration
  outQuint: 'cubic-bezier(0.22, 1, 0.36, 1)',      // confident, decisive
  outExpo:  'cubic-bezier(0.16, 1, 0.3, 1)',       // snappy entrance
  inOut:    'cubic-bezier(0.45, 0, 0.55, 1)',      // layout shifts
};

const veraAnims = {

  /* ── Count-up animation for numeric KPI values ──────────── */
  countUp(el, target, duration = 900) {
    if (_reducedMotion) return;
    if (isNaN(target) || target <= 0) return;
    const isFloat   = target % 1 !== 0;
    const isLarge   = target > 1000;
    const start     = performance.now();
    const update    = (now) => {
      const t       = Math.min((now - start) / duration, 1);
      const eased   = 1 - Math.pow(1 - t, 4); // ease-out-quart
      const current = target * eased;
      if (isFloat) {
        el.textContent = current.toFixed(1);
      } else if (isLarge) {
        el.textContent = Math.round(current).toLocaleString('it-IT');
      } else {
        el.textContent = Math.round(current);
      }
      if (t < 1) requestAnimationFrame(update);
      else {
        // Final value — preserve original formatting
        if (isLarge) el.textContent = Math.round(target).toLocaleString('it-IT');
        else if (isFloat) el.textContent = target.toFixed(1);
        else el.textContent = Math.round(target);
      }
    };
    requestAnimationFrame(update);
  },

  /* ── Staggered entrance for a NodeList/Array of elements ── */
  staggerIn(els, { delay = 40, baseDelay = 0, y = 10, duration = 280 } = {}) {
    if (_reducedMotion) return;
    Array.from(els).forEach((el, i) => {
      el.style.opacity   = '0';
      el.style.transform = `translateY(${y}px)`;
      el.style.transition = 'none';
      setTimeout(() => {
        el.style.transition = `opacity ${duration}ms ${EASE.out}, transform ${duration}ms ${EASE.out}`;
        el.style.opacity    = '1';
        el.style.transform  = 'translateY(0)';
      }, baseDelay + i * delay);
    });
  },

  /* ── Animate progress bar from 0 → target% ─────────────── */
  animateBar(el, targetPct, duration = 700) {
    if (!el) return;
    if (_reducedMotion) { el.style.width = targetPct + '%'; return; }
    el.style.width      = '0%';
    el.style.transition = 'none';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `width ${duration}ms ${EASE.outQuint}`;
        el.style.width      = targetPct + '%';
      });
    });
  },

  /* ── Animate all bars on a screen ──────────────────────── */
  animateBarsInScreen(screenEl) {
    if (!screenEl) return;
    screenEl.querySelectorAll('.prog-fill, .gauge-fill, .scope-bar-s1, .scope-bar-s2, .scope-bar-s3, .assess-progress-fill, .mat-progress-fill').forEach(bar => {
      const target = bar.style.width || bar.getAttribute('data-width');
      if (target && parseFloat(target) > 0) {
        const pct = parseFloat(target);
        this.animateBar(bar, pct);
      }
    });
  },

  /* ── Screen entrance: stagger cards + count-up KPIs ────── */
  screenEnter(screenId) {
    const screen = document.getElementById('screen-' + screenId);
    if (!screen) return;

    // Stagger cards/panels
    const cards = screen.querySelectorAll(
      '.acard, .kpi-card, .rkpi, .how-step, .pain-card, .ai-feat-card, .assess-q-card, .mat-impact-row, .mat-upgrade-card'
    );
    this.staggerIn(cards, { delay: 45, baseDelay: 30, y: 8, duration: 260 });

    // Count-up KPI numbers
    setTimeout(() => {
      screen.querySelectorAll('.kpi-value, .rkpi-val, .stat-n').forEach(el => {
        const text = el.textContent.replace(/[^\d.]/g, '');
        const num  = parseFloat(text);
        if (!isNaN(num) && num > 0) {
          const suffix = el.textContent.replace(/[\d.,]/g, '').trim();
          this.countUp(el, num);
          // Restore suffix after count-up finishes
          if (suffix) {
            setTimeout(() => {
              if (!el.textContent.includes(suffix)) {
                el.textContent = el.textContent + ' ' + suffix;
              }
            }, 950);
          }
        }
      });
    }, 80);

    // Animate bars
    setTimeout(() => this.animateBarsInScreen(screen), 150);
  },

  /* ── Sidebar items: stagger in after login ──────────────── */
  sidebarStagger() {
    if (_reducedMotion) return;
    const items = document.querySelectorAll('.sb-item');
    this.staggerIn(items, { delay: 28, baseDelay: 120, y: 6, duration: 240 });
  },

  /* ── Full app entrance choreography after login ─────────── */
  appEntrance() {
    if (_reducedMotion) return;

    // Sidebar slides in from left
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.style.opacity   = '0';
      sidebar.style.transform = 'translateX(-12px)';
      sidebar.style.transition = 'none';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          sidebar.style.transition = `opacity 380ms ${EASE.outQuint}, transform 380ms ${EASE.outQuint}`;
          sidebar.style.opacity    = '1';
          sidebar.style.transform  = 'translateX(0)';
        });
      });
    }

    // Topbar fades in
    const topbar = document.querySelector('.topbar');
    if (topbar) {
      topbar.style.opacity    = '0';
      topbar.style.transition = 'none';
      setTimeout(() => {
        topbar.style.transition = `opacity 300ms ${EASE.out}`;
        topbar.style.opacity    = '1';
      }, 180);
    }

    // Sidebar items stagger
    setTimeout(() => this.sidebarStagger(), 200);
  },

  /* ── Landing page hero sequential entrance ──────────────── */
  landingEntrance() {
    if (_reducedMotion) return;
    const targets = [
      '.hero-badge',
      '.hero h1',
      '.hero > p',
      '.hero-actions',
      '.hero-note',
    ].map(s => document.querySelector(s)).filter(Boolean);
    this.staggerIn(targets, { delay: 90, baseDelay: 60, y: 16, duration: 420 });
  },

  /* ── Ripple effect on button click ─────────────────────── */
  ripple(btn, e) {
    if (_reducedMotion) return;
    const existing = btn.querySelector('.btn-ripple');
    if (existing) existing.remove();
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 2;
    const x      = (e.clientX - rect.left) - size / 2;
    const y      = (e.clientY - rect.top)  - size / 2;
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    ripple.style.cssText = `
      position:absolute;width:${size}px;height:${size}px;
      left:${x}px;top:${y}px;
      border-radius:50%;background:rgba(255,255,255,0.25);
      pointer-events:none;transform:scale(0);
      animation:rippleAnim 500ms ${EASE.out} forwards;
    `;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 520);
  },

  /* ── Init: attach ripple listeners to primary buttons ───── */
  initRipple() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-primary, .btn-outline');
      if (btn && !btn.disabled) this.ripple(btn, e);
    });
  },

  /* ── Scroll reveal via IntersectionObserver ─────────────── */
  initScrollReveal() {
    if (_reducedMotion) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transition = `opacity 480ms ${EASE.out}, transform 480ms ${EASE.out}`;
          entry.target.style.opacity    = '1';
          entry.target.style.transform  = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => {
      if (!_reducedMotion) {
        el.style.opacity   = '0';
        el.style.transform = 'translateY(20px)';
      }
      obs.observe(el);
    });
  },

  /* ── Boot: run on DOMContentLoaded ──────────────────────── */
  init() {
    this.initRipple();
    this.initScrollReveal();

    // Landing page entrance (if on landing)
    const landing = document.getElementById('view-landing');
    if (landing && landing.classList.contains('active')) {
      setTimeout(() => this.landingEntrance(), 100);
    }
  },
};

/* ── Global CSS for ripple keyframe ─────────────────────── */
(function injectRippleCSS() {
  if (document.getElementById('vera-anim-css')) return;
  const style     = document.createElement('style');
  style.id        = 'vera-anim-css';
  style.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(1); opacity: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `;
  document.head.appendChild(style);
})();

window.veraAnims = veraAnims;
document.addEventListener('DOMContentLoaded', () => veraAnims.init());
