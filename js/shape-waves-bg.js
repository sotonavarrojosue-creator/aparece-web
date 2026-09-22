/**
 * Monta <ShapeWaves /> en [data-shape-waves].
 * - Con WebGPU real → ShapeWaves (React + vgpu) vía import dinámico.
 * - Sin WebGPU o si algo falla → fallback canvas 2D (siempre visible).
 *
 * Sin imports estáticos de react/vgpu: si esas dependencias fallan,
 * el fallback igual se ejecuta.
 */

const BRAND_FONT = "'Barlow Condensed', 'Arial Narrow', sans-serif";
const LIGHT = { bg: '#f6f1e7', color: '#8a847a', hover: '#ff5a1f', glow: 0 };
const DARK = { bg: '#111318', color: '#9a9a9a', hover: '#ff5a1f', glow: 0.35 };

async function hasAdapter() {
  if (typeof navigator === 'undefined' || !navigator.gpu) return false;
  try {
    const adapter = await navigator.gpu.requestAdapter();
    return !!adapter;
  } catch {
    return false;
  }
}

async function mountFallback(el) {
  if (el.dataset.fbDone) return;
  el.dataset.fbDone = '1';
  el.classList.add('sw-failed');

  try {
    const mod = await import('./brand-fallback.js');
    mod.mountBrandFallback(el);
    return;
  } catch (err) {
    console.warn('[shape-waves] brand-fallback import failed:', err);
  }

  if (!el.querySelector('.sw-fb-word')) {
    const word = document.createElement('div');
    word.className = 'sw-fb-word';
    word.textContent = el.dataset.text || '';
    el.appendChild(word);
  }
}

async function mountShapeWaves(el, deps) {
  if (el.dataset.swMounted) return;
  el.dataset.swMounted = '1';

  const { createElement, createRoot, ShapeWaves } = deps;
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
        // ShapeWaves montó pero GPU falló a runtime → fallback
        mountFallback(el);
      }
    })
  );
}

async function mountAll() {
  const nodes = [...document.querySelectorAll('[data-shape-waves]')];
  if (!nodes.length) return;

  const gpuOk = await hasAdapter();
  if (!gpuOk) {
    await Promise.all(nodes.map(mountFallback));
    return;
  }

  try {
    const [{ createElement }, { createRoot }, { default: ShapeWaves }] = await Promise.all([
      import('react'),
      import('react-dom/client'),
      import('./ShapeWaves.js')
    ]);
    const deps = { createElement, createRoot, ShapeWaves };
    for (const el of nodes) {
      try {
        await mountShapeWaves(el, deps);
      } catch (err) {
        console.warn('[shape-waves] mount error:', err);
        await mountFallback(el);
      }
    }
  } catch (err) {
    console.warn('[shape-waves] deps load failed, fallback:', err);
    await Promise.all(nodes.map(mountFallback));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountAll, { once: true });
} else {
  mountAll();
}
