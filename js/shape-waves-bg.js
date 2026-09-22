/**
 * Monta <ShapeWaves /> en todos los [data-shape-waves].
 * Sin WebGPU (o si falla) aplica .sw-failed → fallback CSS con el wordmark.
 *
 * Uso:
 *   <div class="sw-bg" data-shape-waves data-text="APARECÉ" data-theme="light" aria-hidden="true"></div>
 */

const BRAND_FONT = "'Barlow Condensed', 'Arial Narrow', sans-serif";
const LIGHT = { bg: '#f6f1e7', color: '#8a847a', hover: '#ff5a1f' };
const DARK = { bg: '#111318', color: '#9a9a9a', hover: '#ff5a1f' };

const hasWebGPU = typeof navigator !== 'undefined' && !!navigator.gpu;

function applyFallback(el) {
  el.classList.add('sw-failed');
}

function mountOne(el, ShapeWaves, createElement, createRoot) {
  if (el.dataset.swMounted) return;
  el.dataset.swMounted = '1';

  const theme = el.dataset.theme === 'light' ? LIGHT : DARK;
  const text = el.dataset.text || '';

  try {
    const root = createRoot(el);
    root.render(
      createElement(ShapeWaves, {
        text,
        fontFamily: BRAND_FONT,
        fontWeight: 700,
        textSize: Number(el.dataset.textSize) || 0.55,
        shapes: el.dataset.shapes || 'mixed',
        cellSize: Number(el.dataset.cellSize) || 12,
        dotSize: 0.72,
        color: el.dataset.color || theme.color,
        hoverColor: el.dataset.hoverColor || theme.hover,
        backgroundColor: el.dataset.bg || theme.bg,
        speed: 0.75,
        scale: 1.1,
        contrast: 1,
        brightness: 0.42,
        fade: 0.3,
        interactive: true,
        splashRadius: 48,
        splashStrength: 0.35,
        glow: el.dataset.theme === 'light' ? 0 : 0.35,
        intro: true,
        introDuration: 1.6,
        paused: false,
        onError: () => applyFallback(el)
      })
    );
  } catch {
    applyFallback(el);
  }
}

async function mountAll() {
  const nodes = [...document.querySelectorAll('[data-shape-waves]')];

  if (!hasWebGPU) {
    nodes.forEach(applyFallback);
    return;
  }

  // GPU disponible: cargar React + componente solo entonces
  try {
    const [{ createElement }, { createRoot }, { default: ShapeWaves }] = await Promise.all([
      import('react'),
      import('react-dom/client'),
      import('./ShapeWaves.js')
    ]);
    nodes.forEach((el) => mountOne(el, ShapeWaves, createElement, createRoot));
  } catch (err) {
    console.warn('[shape-waves] módulos no cargaron, fallback CSS:', err);
    nodes.forEach(applyFallback);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountAll, { once: true });
} else {
  mountAll();
}
