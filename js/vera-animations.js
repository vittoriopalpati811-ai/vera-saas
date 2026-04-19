/* ╔══════════════════════════════════════════════════════════
   ║  VERA ESG Platform — Animation Module v4
   ║  Principles: Emil Kowalski · purposeful motion only
   ║  Rules:
   ║   - GPU only: transform + opacity
   ║   - No bounce/elastic easing
   ║   - Always respect prefers-reduced-motion
   ║   - Animate with purpose, not decoration
   ╚══════════════════════════════════════════════════════════ */

'use strict';

/* ── Motion preference ───────────────────────────────────── */
const _reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Easing curves ───────────────────────────────────────── */
const EASE = {
  out:      'cubic-bezier(0.25, 1, 0.5, 1)',
  outQuint: 'cubic-bezier(0.22, 1, 0.36, 1)',
  outExpo:  'cubic-bezier(0.16, 1, 0.3, 1)',
  inOut:    'cubic-bezier(0.45, 0, 0.55, 1)',
};

const veraAnims = {

  /* ── Count-up animation for numeric KPI values ──────────── */
  countUp(el, target, duration = 900) {
    if (_reducedMotion) return;
    if (isNaN(target) || target <= 0) return;
    const isFloat = target % 1 !== 0;
    const isLarge = target > 1000;
    const start   = performance.now();
    const update  = (now) => {
      const t      = Math.min((now - start) / duration, 1);
      const eased  = 1 - Math.pow(1 - t, 4);
      const cur    = target * eased;
      el.textContent = isFloat
        ? cur.toFixed(1)
        : isLarge
          ? Math.round(cur).toLocaleString('it-IT')
          : Math.round(cur);
      if (t < 1) requestAnimationFrame(update);
      else {
        el.textContent = isLarge
          ? Math.round(target).toLocaleString('it-IT')
          : isFloat ? target.toFixed(1) : Math.round(target);
      }
    };
    requestAnimationFrame(update);
  },

  /* ── Staggered entrance for a NodeList/Array ────────────── */
  staggerIn(els, { delay = 40, baseDelay = 0, y = 10, duration = 280 } = {}) {
    if (_reducedMotion) return;
    Array.from(els).forEach((el, i) => {
      el.style.opacity    = '0';
      el.style.transform  = `translateY(${y}px)`;
      el.style.transition = 'none';
      setTimeout(() => {
        el.style.transition = `opacity ${duration}ms ${EASE.out}, transform ${duration}ms ${EASE.out}`;
        el.style.opacity    = '1';
        el.style.transform  = 'translateY(0)';
      }, baseDelay + i * delay);
    });
  },

  /* ── Animate progress bar 0 → target% ──────────────────── */
  animateBar(el, targetPct, duration = 700) {
    if (!el) return;
    if (_reducedMotion) { el.style.width = targetPct + '%'; return; }
    el.style.width      = '0%';
    el.style.transition = 'none';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transition = `width ${duration}ms ${EASE.outQuint}`;
      el.style.width      = targetPct + '%';
    }));
  },

  animateBarsInScreen(screenEl) {
    if (!screenEl) return;
    screenEl.querySelectorAll(
      '.prog-fill, .gauge-fill, .scope-bar-s1, .scope-bar-s2, .scope-bar-s3, .assess-progress-fill, .mat-progress-fill'
    ).forEach(bar => {
      const target = bar.style.width || bar.getAttribute('data-width');
      if (target && parseFloat(target) > 0) this.animateBar(bar, parseFloat(target));
    });
  },

  /* ── Screen entrance ────────────────────────────────────── */
  screenEnter(screenId) {
    const screen = document.getElementById('screen-' + screenId);
    if (!screen) return;
    const cards = screen.querySelectorAll(
      '.acard, .kpi-card, .rkpi, .how-step, .pain-card, .ai-feat-card, .assess-q-card, .mat-impact-row, .mat-upgrade-card'
    );
    this.staggerIn(cards, { delay: 45, baseDelay: 30, y: 8, duration: 260 });
    setTimeout(() => {
      screen.querySelectorAll('.kpi-value, .rkpi-val, .stat-n').forEach(el => {
        const num = parseFloat(el.textContent.replace(/[^\d.]/g, ''));
        if (!isNaN(num) && num > 0) {
          const suffix = el.textContent.replace(/[\d.,]/g, '').trim();
          this.countUp(el, num);
          if (suffix) setTimeout(() => {
            if (!el.textContent.includes(suffix)) el.textContent += ' ' + suffix;
          }, 950);
        }
      });
    }, 80);
    setTimeout(() => this.animateBarsInScreen(screen), 150);
  },

  /* ── Sidebar stagger ────────────────────────────────────── */
  sidebarStagger() {
    if (_reducedMotion) return;
    this.staggerIn(document.querySelectorAll('.sb-item'), { delay: 28, baseDelay: 120, y: 6, duration: 240 });
  },

  /* ── App entrance after login ───────────────────────────── */
  appEntrance() {
    if (_reducedMotion) return;
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.style.opacity    = '0';
      sidebar.style.transform  = 'translateX(-12px)';
      sidebar.style.transition = 'none';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        sidebar.style.transition = `opacity 380ms ${EASE.outQuint}, transform 380ms ${EASE.outQuint}`;
        sidebar.style.opacity    = '1';
        sidebar.style.transform  = 'translateX(0)';
      }));
    }
    const topbar = document.querySelector('.topbar');
    if (topbar) {
      topbar.style.opacity    = '0';
      topbar.style.transition = 'none';
      setTimeout(() => {
        topbar.style.transition = `opacity 300ms ${EASE.out}`;
        topbar.style.opacity    = '1';
      }, 180);
    }
    setTimeout(() => this.sidebarStagger(), 200);
  },

  /* ══════════════════════════════════════════════════════════
     LANDING PAGE ANIMATIONS
  ══════════════════════════════════════════════════════════ */

  /* ── Word-split hero h1 into animatable spans ────────────── */
  _splitHeroWords() {
    const h1 = document.querySelector('.hero h1');
    if (!h1 || h1.querySelector('.hw')) return h1;

    const nodes = Array.from(h1.childNodes);
    h1.innerHTML = '';

    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        // Split text into words, preserve spaces
        node.textContent.split(/( )/).forEach(part => {
          if (part === ' ') {
            h1.appendChild(document.createTextNode(' '));
          } else if (part.trim()) {
            const span = document.createElement('span');
            span.className = 'hw';
            span.textContent = part;
            span.style.cssText =
              'display:inline-block;opacity:0;transform:translateY(28px);will-change:transform,opacity';
            h1.appendChild(span);
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'BR') {
          h1.appendChild(node.cloneNode(true));
        } else {
          // Wrap element (em, strong…) as a single animated unit
          const span = document.createElement('span');
          span.className = 'hw';
          span.style.cssText =
            'display:inline-block;opacity:0;transform:translateY(28px);will-change:transform,opacity';
          span.appendChild(node.cloneNode(true));
          h1.appendChild(span);
        }
      }
    });
    return h1;
  },

  /* ── Hero sequential entrance (badge → words → body → CTAs) */
  landingEntrance() {
    if (_reducedMotion) return;
    const e = EASE.outExpo;
    let nextAt = 0;

    // Badge
    const badge = document.querySelector('.hero-badge');
    if (badge) {
      badge.style.cssText += 'opacity:0;transform:translateY(14px)';
      setTimeout(() => {
        badge.style.transition = `opacity 550ms ${e}, transform 550ms ${e}`;
        badge.style.opacity    = '1';
        badge.style.transform  = 'translateY(0)';
      }, 60);
      nextAt = 140;
    }

    // h1 words stagger
    const h1    = this._splitHeroWords();
    const words = h1 ? h1.querySelectorAll('.hw') : [];
    words.forEach((w, i) => {
      setTimeout(() => {
        w.style.transition = `opacity 680ms ${e}, transform 680ms ${e}`;
        w.style.opacity    = '1';
        w.style.transform  = 'translateY(0)';
      }, nextAt + 80 + i * 60);
    });
    nextAt += 80 + words.length * 60;

    // Subtitle, actions, note — sequential
    ['.hero > p', '.hero-actions', '.hero-note'].forEach((sel, i) => {
      const el = document.querySelector(sel);
      if (!el) return;
      el.style.cssText += 'opacity:0;transform:translateY(18px)';
      setTimeout(() => {
        el.style.transition = `opacity 620ms ${e}, transform 620ms ${e}`;
        el.style.opacity    = '1';
        el.style.transform  = 'translateY(0)';
      }, nextAt + 80 + i * 110);
    });
  },

  /* ── Scroll reveal: solo elements + staggered card grids ── */
  initScrollReveal() {
    if (_reducedMotion) {
      document.querySelectorAll('.reveal').forEach(el => {
        el.style.opacity   = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const GRID_PARENTS = '.pain-grid, .how-grid, .ai-feature-grid, .pricing-grid';
    const e            = EASE.outQuint;

    /* Individual reveals (skip elements inside card grids) */
    const indivObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.style.transition = `opacity 560ms ${e}, transform 560ms ${e}`;
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'translateY(0)';
        indivObs.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => {
      if (el.closest(GRID_PARENTS)) return;   // handled by group observer
      el.style.opacity   = '0';
      el.style.transform = 'translateY(28px)';
      indivObs.observe(el);
    });

    /* Group stagger for card grids */
    const GROUPS = [
      { grid: '.pain-grid',        item: '.pain-card'    },
      { grid: '.how-grid',         item: '.how-step'     },
      { grid: '.ai-feature-grid',  item: '.ai-feat-card' },
      { grid: '.pricing-grid',     item: '.plan'         },
    ];

    GROUPS.forEach(({ grid: gSel, item: iSel }) => {
      document.querySelectorAll(gSel).forEach(grid => {
        // Set initial hidden state
        grid.querySelectorAll(iSel).forEach(item => {
          item.style.opacity   = '0';
          item.style.transform = 'translateY(36px)';
        });

        const gridObs = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.querySelectorAll(iSel).forEach((item, i) => {
              setTimeout(() => {
                item.style.transition = `opacity 640ms ${e}, transform 640ms ${e}`;
                item.style.opacity    = '1';
                item.style.transform  = 'translateY(0)';
              }, i * 90);
            });
            gridObs.unobserve(entry.target);
          });
        }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

        gridObs.observe(grid);
      });
    });

    /* Stats count-up when stats bar enters viewport */
    const statsBar = document.querySelector('.ln-stats');
    if (statsBar) {
      const statsObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          statsBar.querySelectorAll('.stat-n').forEach(el => {
            // Parse number from text like "4 giorni*", "100%", "€0", "AI"
            const raw = el.textContent;
            const num = parseFloat(raw.replace(/[^\d.]/g, ''));
            if (!isNaN(num) && num > 0) {
              const before = raw.match(/^[^\d]*/)?.[0] || '';
              const after  = raw.match(/[^\d.]+$/)?.[0] || '';
              this.countUp({ set textContent(v) { el.textContent = before + v + after; } }, num, 1200);
            }
          });
          statsObs.unobserve(entry.target);
        });
      }, { threshold: 0.5 });
      statsObs.observe(statsBar);
    }
  },

  /* ── 3-D card tilt on hover (desktop only) ───────────────── */
  initCardTilt() {
    if (_reducedMotion) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const TILT_MAX = 5; // degrees
    document.querySelectorAll('.how-step, .ai-feat-card, .plan').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
        const y = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
        const tx = -y * TILT_MAX;
        const ty =  x * TILT_MAX;
        card.style.transition = 'transform 0ms, box-shadow 150ms ease';
        card.style.transform  = `perspective(800px) rotateX(${tx}deg) rotateY(${ty}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = `transform 400ms ${EASE.outQuint}, box-shadow 400ms ${EASE.outQuint}`;
        card.style.transform  = '';
      });
    });
  },

  /* ── Ripple effect on button click ─────────────────────── */
  ripple(btn, e) {
    if (_reducedMotion) return;
    const existing = btn.querySelector('.btn-ripple');
    if (existing) existing.remove();
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 2;
    const x      = (e.clientX - rect.left)  - size / 2;
    const y      = (e.clientY - rect.top)   - size / 2;
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    ripple.style.cssText = `
      position:absolute;width:${size}px;height:${size}px;
      left:${x}px;top:${y}px;border-radius:50%;
      background:rgba(255,255,255,0.22);pointer-events:none;
      transform:scale(0);animation:rippleAnim 500ms ${EASE.out} forwards;
    `;
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 520);
  },

  initRipple() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.btn-primary, .btn-outline');
      if (btn && !btn.disabled) this.ripple(btn, e);
    });
  },

  /* ── Sticky nav: add .scrolled class on scroll ───────────── */
  initStickyNav() {
    const nav = document.querySelector('.ln-nav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  },

  /* ── Lightweight canvas particle field ──────────────────── */
  initParticles() {
    if (_reducedMotion) return;

    const landing = document.getElementById('view-landing');
    if (!landing) return;

    const canvas  = document.createElement('canvas');
    canvas.id     = 'vera-particles';
    canvas.style.cssText = `
      position:absolute;inset:0;z-index:1;pointer-events:none;
      opacity:0;transition:opacity 1.2s ease;
    `;
    const bg = document.getElementById('vera-bg');
    if (bg) bg.appendChild(canvas);

    const ctx  = canvas.getContext('2d');
    let W, H, particles, raf;

    const COUNT = Math.min(60, Math.round(window.innerWidth * 0.04));

    function resize() {
      const bg = document.getElementById('vera-bg');
      W = canvas.width  = (bg || landing).offsetWidth  || window.innerWidth;
      H = canvas.height = (bg || landing).offsetHeight || window.innerHeight * 5;
      canvas.style.width  = '100%';
      canvas.style.height = '100%';
    }

    function init() {
      resize();
      particles = Array.from({ length: COUNT }, () => ({
        x:    Math.random() * W,
        y:    Math.random() * H,
        r:    Math.random() * 1.8 + 0.4,
        vx:   (Math.random() - 0.5) * 0.25,
        vy:   -(Math.random() * 0.3 + 0.08),
        a:    Math.random() * Math.PI * 2,
        life: Math.random(),
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x  += p.vx;
        p.y  += p.vy;
        p.life += 0.003;
        const alpha = Math.sin(p.life * Math.PI) * 0.35;
        if (alpha <= 0 || p.y < -10) {
          p.y    = H + 4;
          p.x    = Math.random() * W;
          p.life = 0;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 208, 106, ${alpha.toFixed(3)})`; /* #22d06a */
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }

    init();
    draw();
    // Fade canvas in after a short delay
    setTimeout(() => { canvas.style.opacity = '1'; }, 600);

    // Pause when off-screen
    const pauseObs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!raf) raf = requestAnimationFrame(draw); }
      else { cancelAnimationFrame(raf); raf = null; }
    }, { threshold: 0 });
    pauseObs.observe(canvas);

    window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
  },

  /* ── Boot ───────────────────────────────────────────────── */
  init() {
    this.initRipple();
    this.initStickyNav();
    this.initScrollReveal();

    const landing = document.getElementById('view-landing');
    if (landing && landing.classList.contains('active')) {
      setTimeout(() => {
        this.landingEntrance();
        this.initParticles();
      }, 60);
      setTimeout(() => this.initCardTilt(), 800);
    }
  },
};

/* ── Inject CSS keyframes ────────────────────────────────── */
(function injectCSS() {
  if (document.getElementById('vera-anim-css')) return;
  const s = document.createElement('style');
  s.id    = 'vera-anim-css';
  s.textContent = `
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
  document.head.appendChild(s);
})();

window.veraAnims = veraAnims;
document.addEventListener('DOMContentLoaded', () => veraAnims.init());
