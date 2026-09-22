# Paleta de Colores — APARECÉ

## Colores Principales

| Variable | Valor HSL | Valor HEX | Uso |
|----------|-----------|-----------|-----|
| `--carbono` | `hsl(220 12% 7%)` | `#111318` | Fondo oscuro, texto principal |
| `--carbono-2` | `hsl(220 10% 13%)` | `#1e2025` | Texto secundario en fondos claros |
| `--carbono-3` | `hsl(220 10% 18%)` | `#2a2c32` | Bordes sutiles |
| `--papel` | `hsl(40 33% 96%)` | `#f6f1e7` | Fondo claro principal |
| `--papel-2` | `hsl(40 26% 90%)` | `#e3ddd0` | Fondos alternos |
| `--naranja` | `hsl(24 95% 52%)` | `#ff5a1f` | Acentos, CTAs, hover |
| `--naranja-osc` | `hsl(24 90% 42%)` | `#d94a15` | Hover states |
| `--gris` | `hsl(220 8% 32%)` | `#4B4F58` | Texto secundario |
| `--gris-claro` | `hsl(220 8% 60%)` | `#8d9099` | Metadatos, timestamps |
| `--hairline` | `hsl(220 10% 82%)` | `#cdd0d5` | Bordes ligeros |
| `--verde` | `hsl(140 45% 48%)` | `#48a848` | Estados positivos (stats) |

## Uso por Sección

| Sección | Fondo | Texto | Acento |
|---------|-------|-------|--------|
| Header | `--papel` (88% opacity) | `--carbono` | `--naranja` (hover) |
| Hero | `--papel` | `--carbono` | `--naranja` |
| Servicios | `--papel` | `--carbono` | `--naranja` |
| Portafolio | `--papel` | `--carbono` | `--naranja` |
| Cursos | `--carbono` | `--papel` | `--naranja` |
| Planes | `--papel` | `--carbono` | `--naranja` (precio) |
| Proceso | `--carbono` | `--papel` | `--naranja` |
| CTA Final | `--papel` | `--carbono` | `--naranja` |
| Footer | `--papel` | `--gris` | `--naranja` (hover) |

## Tipografía

| Fuente | Peso | Uso | CSS Variable |
|--------|------|-----|--------------|
| Barlow Condensed | 600, 700, 800 | Títulos, display | `--disp` |
| Barlow | 400, 500, 600 | Texto cuerpo | `--body` |
| IBM Plex Mono | 400, 500 | Labels, números, metadata | `--mono` |

## Tamaños de Fuente

| Elemento | Tamaño | Fuente |
|----------|--------|--------|
| Hero h1 | `clamp(52px, 7vw, 88px)` | Disp 800 |
| Section h2 | `clamp(34px, 4.5vw, 54px)` | Disp 700 |
| Body text | `17px` (16px en móvil) | Body 400 |
| Labels | `12-13px` | Mono 500 |
| Botones | `13px` | Mono 500 |

## Border Radius

- Botones: `2px` (`--r-btn`)
- Iconos de categoría: `2px`
- Todo es angular (sin border-radius grande) — parte de la identidad de marca

## Sombras

```css
/* Header compacto */
box-shadow: 0 8px 24px -12px hsl(220 20% 10% / .25);

/* Cards hover */
box-shadow: 0 8px 32px -8px hsl(24 95% 52% / .12);

/* Menú móvil */
box-shadow: 0 12px 24px -8px hsl(220 20% 10% / .15);
```
