# APARECÉ — Presencia Digital y Cursos

Página central de **APARECÉ**: presencia digital para negocios de Costa Rica + cursos gratuitos de programación.

**URL:** [https://sotonavarrojosue-creator.github.io/aparece-web/](https://sotonavarrojosue-creator.github.io/aparece-web/)

> **Nota:** `aparece.cr` aún no está configurado como dominio. Al configurarlo en GitHub Pages (Settings → Pages → Custom domain), cambiar las URLs canónicas en `index.html`, `robots.txt` y `sitemap.xml`.

---

## Contenido

- **Servicios**: páginas web para PYMEs (web + dominio + Google Business + WhatsApp)
- **Cursos**: cursos gratuitos online de programación (Python, Git, HTML/CSS, JS)
- **Portafolio**: demos reales con datos de negocios de Costa Rica
- **Planes**: Base ($25/mes), Estándar ($45/mes), Premium ($75/mes)

## Stack

- HTML5 + CSS3 + JS vanilla
- Google Fonts: Barlow Condensed, Barlow, IBM Plex Mono
- Sin frameworks, sin build, sin dependencias

## Estructura

```
├── index.html                  ← Página principal
├── robots.txt                  ← Reglas para buscadores
├── sitemap.xml                 ← Mapa del sitio (SEO)
├── .gitignore                  ← Archivos ignorados por Git
├── css/
│   ├── styles.css              ← Estilos principales
│   └── responsive.css          ← Media queries (móvil/tablet)
├── js/
│   └── main.js                 ← JavaScript (menú, cookies, formulario, canvas)
├── img/
│   └── og-image.png            ← Imagen para compartir en redes (1200×630)
├── pages/
│   ├── privacy-policy.html     ← Política de Privacidad (Ley 8968)
│   ├── terms-conditions.html   ← Términos y Condiciones (Ley 10946)
│   ├── cookie-policy.html      ← Política de Cookies
│   └── refund-policy.html      ← Política de Reembolso (Ley 7472)
├── docs/
│   ├── MANTENIMIENTO.md        ← Cómo cambiar textos, colores, etc.
│   ├── COLORES.md              ← Paleta de colores y tipografía
│   └── LEGAL.md                ← Obligaciones legales y pendientes
└── README.md                   ← Este archivo
```

## Funcionalidades

- ✅ Menú hamburguesa móvil
- ✅ Scroll reveal animations
- ✅ Canvas interactivo con el cursor
- ✅ Banner de consentimiento de cookies
- ✅ Formulario de contacto con consentimiento (Ley 8968)
- ✅ Páginas legales completas
- ✅ Sección de preguntas frecuentes (FAQ) con JSON-LD FAQPage
- ✅ Open Graph + Twitter Cards + imagen OG
- ✅ JSON-LD LocalBusiness
- ✅ robots.txt + sitemap.xml
- ✅ Accesibilidad (skip-link, aria-labels, contraste WCAG)

## Deploy

GitHub Pages se actualiza automáticamente al hacer push a `main`.

```bash
git add .
git commit -m "Descripción del cambio"
git push
```

## Marca

- **Paleta**: carbón (`#111318`) + papel (`#f6f1e7`) + naranja (`#ff5a1f`)
- **Tipografía**: Barlow Condensed (display) + Barlow (body) + IBM Plex Mono (labels)
- **Logo**: pin de mapa naranja con check

## Contacto

- **WhatsApp:** [+506 7216‑9369](https://wa.me/50672169369)
- **Instagram:** [@aparece_cr](https://www.instagram.com/aparece_cr)
- **Email:** [aparece.cr@gmail.com](mailto:aparece.cr@gmail.com)

## Cumplimiento Legal

Este sitio cumple con:
- **Ley 8968** — Protección de Datos Personales (Costa Rica)
- **Ley 10946** — Gobernanza de Servicios Digitales (Costa Rica, 2026)
- **Ley 7472** — Defensa del Consumidor (Costa Rica)

Ver `docs/LEGAL.md` para más detalles y pendientes.

## Licencia

© 2026 APARECÉ — Hecho en Costa Rica
