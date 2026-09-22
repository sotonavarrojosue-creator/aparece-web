/* ============================================================
   APARECÉ — Fondo de marca (canvas 2D, sin dependencias)
   Dots animados + wordmark gigante en hero, cursos y proceso.
   ============================================================ */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nodes = document.querySelectorAll('[data-brand-bg]');
  if (!nodes.length) return;

  const FONT = "'Barlow Condensed', 'Arial Narrow', sans-serif";

  const THEMES = {
    light: {
      base: 'rgba(17, 19, 24, 0.12)',
      hover: 'hsl(24 95% 52%)',
      stroke: 'rgba(17, 19, 24, 0.14)',
      wordAlpha: 0.10
    },
    dark: {
      base: 'rgba(246, 241, 231, 0.16)',
      hover: 'hsl(24 95% 58%)',
      stroke: 'rgba(246, 241, 231, 0.12)',
      wordAlpha: 0.10
    }
  };

  function attach(host) {
    const theme = THEMES[host.dataset.theme] || THEMES.light;
    const text = host.dataset.text || '';
    const spacing = Number(host.dataset.spacing) || 36;

    const canvas = document.createElement('canvas');
    canvas.className = 'brand-bg__canvas';
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let w = 0;
    let h = 0;
    let dpr = 1;
    let dots = [];
    let mouse = { x: -9999, y: -9999 };
    let raf = 0;
    let t0 = performance.now();

    const RADIUS = 120;
    const PUSH = 14;
    const EASE = 0.12;

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = host.clientWidth;
      h = host.clientHeight;
      if (w < 2 || h < 2) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = [];
      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const ox = i * spacing;
          const oy = j * spacing;
          dots.push({ ox, oy, x: ox, y: oy, phase: (i * 0.35 + j * 0.55) });
        }
      }
    }

    function onMove(e) {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }
    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    host.addEventListener('mousemove', onMove, { passive: true });
    host.addEventListener('mouseleave', onLeave);

    function drawWordmark(now) {
      if (!text) return;
      const elapsed = (now - t0) / 1000;
      const appear = reduce ? 1 : Math.min(1, elapsed / 1.2);
      const size = Math.max(64, Math.min(w * 0.22, 200));
      const cx = w / 2;
      const cy = h / 2 + (1 - appear) * 24;
      const drift = reduce ? 0 : Math.sin(elapsed * 0.35) * (w * 0.012);

      ctx.save();
      ctx.globalAlpha = theme.wordAlpha * appear;
      ctx.font = `700 ${size}px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '0.06em';
      ctx.lineWidth = Math.max(1, size * 0.012);
      ctx.strokeStyle = theme.stroke;
      ctx.strokeText(text, cx + drift, cy);
      // relleno tenible para que se lea en cualquier fondo
      ctx.globalAlpha = theme.wordAlpha * 0.55 * appear;
      ctx.fillStyle = theme.stroke;
      ctx.fillText(text, cx + drift, cy);
      ctx.restore();
    }

    function tick(now) {
      ctx.clearRect(0, 0, w, h);
      drawWordmark(now);

      const elapsed = (now - t0) / 1000;
      for (const d of dots) {
        const dx = d.ox - mouse.x;
        const dy = d.oy - mouse.y;
        const dist = Math.hypot(dx, dy);
        let tx = d.ox;
        let ty = d.oy;
        let near = 0;

        if (dist < RADIUS) {
          near = 1 - dist / RADIUS;
          const push = near * PUSH;
          const ang = Math.atan2(dy, dx);
          tx = d.ox + Math.cos(ang) * push;
          ty = d.oy + Math.sin(ang) * push;
        }

        // pulso sutil aunque el mouse no esté cerca
        if (!reduce) {
          const wave = Math.sin(elapsed * 1.4 + d.phase) * 1.2;
          if (near < 0.05) {
            tx += wave;
            ty += Math.cos(elapsed * 1.1 + d.phase) * 1.2;
          }
        }

        d.x += (tx - d.x) * EASE;
        d.y += (ty - d.y) * EASE;

        ctx.beginPath();
        ctx.fillStyle = near > 0.05 ? theme.hover : theme.base;
        ctx.globalAlpha = near > 0.05 ? 0.35 + near * 0.45 : 1;
        ctx.arc(d.x, d.y, near > 0.05 ? 1.7 + near * 1.6 : 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!reduce) raf = requestAnimationFrame(tick);
    }

    let rt;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        build();
        if (reduce) {
          ctx.clearRect(0, 0, w, h);
          drawWordmark(performance.now());
        }
      }, 150);
    });

    build();

    if (reduce) {
      ctx.clearRect(0, 0, w, h);
      drawWordmark(performance.now());
      // puntos estáticos
      for (const d of dots) {
        ctx.beginPath();
        ctx.fillStyle = theme.base;
        ctx.arc(d.ox, d.oy, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }

    // Pausar fuera de viewport
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!raf) {
              t0 = performance.now() - 1500; // sin re-play del intro
              raf = requestAnimationFrame(tick);
            }
          } else if (raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
        }
      }, { rootMargin: '80px' });
      io.observe(host);
    } else {
      raf = requestAnimationFrame(tick);
    }
  }

  nodes.forEach(attach);
})();
