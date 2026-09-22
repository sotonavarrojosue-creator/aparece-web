/**
 * Monta <ShapeWaves /> en [data-shape-waves].
 * Sin WebGPU (o si falla) → fallback canvas brand-bg (siempre visible).
 */
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import ShapeWaves from './ShapeWaves.js';

const BRAND_FONT = "'Barlow Condensed', 'Arial Narrow', sans-serif";
const LIGHT = {
  bg: '#f6f1e7',
  color: '#8a847a',
  hover: '#ff5a1f',
  glow: 0
};
const DARK = {
  bg: '#111318',
  color: '#9a9a9a',
  hover: '#ff5a1f',
  glow: 0.35
};

async function hasAdapter() {
  if (!navigator.gpu) return false;
  try {
    const adapter = await navigator.gpu.requestAdapter();
    return !!adapter;
  } catch {
    return false;
  }
}

/** Fallback: importa brand-bg lógica mínima (canvas 2D) o pinta wordmark CSS */
async function fallback(el) {
  el.classList.add('sw-failed');
  if (el.dataset.fbDone) return;
  el.dataset.fbDone = '1';

  // Intentar el canvas brand-bg si existe el script helper
  try {
    const mod = await import('./brand-fallback.js');
    mod.mountBrandFallback(el);
    return;
  } catch {
    /* sigue con CSS */
  }

  // Último recurso: wordmark con CSS
  if (!el.querySelector('.sw-fb-word')) {
    const word = document.createElement('div');
    word.className = 'sw-fb-word';
    word.textContent = el.dataset.text || '';
    el.appendChild(word);
  }
}

function mountOne(el) {
  if (el.dataset.swMounted) return;
  el.dataset.swMounted = '1';

  const theme = el.dataset.theme === 'light' ? LIGHT : DARK;

  const root = createRoot(el);
  root.render(
    createElement(ShapeWaves, {
      text: el.dataset.text || '',
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
      glow: Number(el.dataset.glow ?? theme.glow),
      intro: true,
      introDuration: 1.6,
      paused: false,
      onError: () => {
        fallback(el);
      }
    })
  );
}

async function mountAll() {
  const nodes = [...document.querySelectorAll('[data-shape-waves]')];
  if (!nodes.length) return;

  const gpuOk = await hasAdapter();
  if (!gpuOk) {
    await Promise.all(nodes.map(fallback));
    return;
  }

  try {
    nodes.forEach(mountOne);
  } catch (err) {
    console.warn('[shape-waves] mount error, fallback:', err);
    await Promise.all(nodes.map(fallback));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountAll, { once: true });
} else {
  mountAll();
}
