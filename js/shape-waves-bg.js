/**
 * Monta <ShapeWaves /> en todos los [data-shape-waves].
 * El texto de cada fondo se toma de data-text (la palabra que corresponda a la sección).
 *
 * Uso:
 *   <div class="sw-bg" data-shape-waves data-text="APARECÉ" data-theme="light" aria-hidden="true"></div>
 */
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import ShapeWaves from './ShapeWaves.js';

const BRAND_FONT = "'Barlow Condensed', 'Arial Narrow', sans-serif";
const LIGHT = { bg: '#f6f1e7', color: '#8a847a', hover: '#ff5a1f' };
const DARK = { bg: '#111318', color: '#9a9a9a', hover: '#ff5a1f' };

function mountOne(el) {
  if (el.dataset.swMounted) return;
  el.dataset.swMounted = '1';

  const theme = el.dataset.theme === 'light' ? LIGHT : DARK;
  const text = el.dataset.text || '';

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
      onError: () => {
        el.classList.add('sw-failed');
      }
    })
  );
}

function mountAll() {
  document.querySelectorAll('[data-shape-waves]').forEach(mountOne);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountAll, { once: true });
} else {
  mountAll();
}
