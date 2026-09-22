/** Fallback canvas 2D cuando ShapeWaves no puede correr (sin WebGPU). */
export function mountBrandFallback(host) {
  if (host.dataset.fallbackMounted) return;
  host.dataset.fallbackMounted = '1';

  const theme = host.dataset.theme === 'light' ? 'light' : 'dark';
  const text = host.dataset.text || '';
  const font = "'Barlow Condensed', 'Arial Narrow', sans-serif";

  const canvas = document.createElement('canvas');
  canvas.className = 'brand-bg__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const spacing = 36;
  const colors =
    theme === 'light'
      ? { base: 'rgba(17,19,24,0.12)', hover: '#ff5a1f', word: 'rgba(17,19,24,0.14)' }
      : { base: 'rgba(246,241,231,0.16)', hover: '#ff5a1f', word: 'rgba(246,241,231,0.14)' };

  let w = 0;
  let h = 0;
  let dpr = 1;
  let dots = [];
  let mouse = { x: -9999, y: -9999 };
  let raf = 0;

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
        dots.push({ ox, oy, x: ox, y: oy, phase: i * 0.35 + j * 0.55 });
      }
    }
  }

  host.addEventListener(
    'mousemove',
    e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    },
    { passive: true }
  );
  host.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  function drawWord(t) {
    if (!text) return;
    const size = Math.max(64, Math.min(w * 0.22, 200));
    const drift = reduce ? 0 : Math.sin(t * 0.35) * (w * 0.012);
    ctx.save();
    ctx.globalAlpha = 0.14;
    ctx.font = `700 ${size}px ${font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = colors.word;
    ctx.strokeText(text, w / 2 + drift, h / 2);
    ctx.globalAlpha = 0.07;
    ctx.fillStyle = colors.word;
    ctx.fillText(text, w / 2 + drift, h / 2);
    ctx.restore();
  }

  function tick(now) {
    const t = now / 1000;
    ctx.clearRect(0, 0, w, h);
    drawWord(t);
    for (const d of dots) {
      const dx = d.ox - mouse.x;
      const dy = d.oy - mouse.y;
      const dist = Math.hypot(dx, dy);
      let tx = d.ox;
      let ty = d.oy;
      let near = 0;
      if (dist < 120) {
        near = 1 - dist / 120;
        const push = near * 14;
        const ang = Math.atan2(dy, dx);
        tx = d.ox + Math.cos(ang) * push;
        ty = d.oy + Math.sin(ang) * push;
      }
      if (!reduce) {
        tx += Math.sin(t * 1.4 + d.phase) * 1.2;
        ty += Math.cos(t * 1.1 + d.phase) * 1.2;
      }
      d.x += (tx - d.x) * 0.12;
      d.y += (ty - d.y) * 0.12;
      ctx.beginPath();
      ctx.fillStyle = near > 0.05 ? colors.hover : colors.base;
      ctx.globalAlpha = near > 0.05 ? 0.4 + near * 0.4 : 1;
      ctx.arc(d.x, d.y, near > 0.05 ? 1.7 + near * 1.6 : 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!reduce) raf = requestAnimationFrame(tick);
  }

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(build, 150);
  });

  build();
  if (reduce) {
    ctx.clearRect(0, 0, w, h);
    drawWord(0);
    for (const d of dots) {
      ctx.beginPath();
      ctx.fillStyle = colors.base;
      ctx.arc(d.ox, d.oy, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }
  raf = requestAnimationFrame(tick);
}
