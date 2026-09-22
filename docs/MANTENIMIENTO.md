# Guía de Mantenimiento — APARECÉ Landing Page

Cambios rápidos que puedes hacer sin tocar el código complejo.

---

## Cambiar textos

Todo el texto está en `index.html`. Busca el texto que quieres cambiar y edítalo directamente.

**Ejemplo:** Cambiar el subtítulo del hero:
```html
<!-- Buscar esto -->
<p class="hero-note">Respuesta habitual en menos de 24 h · Cartago y San José · Costa Rica</p>

<!-- Cambiar por (si cambia el horario de respuesta) -->
<p class="hero-note">Respuesta habitual en menos de 48 h · Cartago y San José · Costa Rica</p>
```

---

## Cambiar colores

Los colores están definidos como variables CSS en `css/styles.css`:

```css
:root {
  --carbono:     hsl(220 12% 7%);   /* Fondo oscuro */
  --papel:       hsl(40 33% 96%);   /* Fondo claro */
  --naranja:     hsl(24 95% 52%);   /* Acentos */
  --gris:        hsl(220 8% 32%);   /* Texto secundario */
}
```

Para cambiar un color, solo modifica los valores `hsl()`. 

**Herramienta:** Usa [google.com/search?q=color+picker](https://www.google.com/search?q=color+picker) para elegir colores y obtener el valor HSL.

---

## Agregar un servicio

1. En `index.html`, busca la sección `<!-- SERVICIOS -->`
2. Copia un bloque `<div class="svc-item">` existente
3. Cambia el número, título y descripción

```html
<div class="svc-item">
  <span class="svc-item-num">11</span>
  <div>
    <h5>Nuevo servicio</h5>
    <p>Descripción del servicio.</p>
  </div>
</div>
```

---

## Agregar un curso

1. En `index.html`, busca la sección `<!-- CURSOS -->`
2. Copia un bloque `<div class="course">`
3. Actualiza número, título y descripción

Para cursos **gratuitos** (próximamente):
```html
<div class="course course-locked" data-reveal style="--rd:.XXs">
  <div class="course-num">[08]</div>
  <h3>Nombre del curso</h3>
  <p>Descripción del curso.</p>
  <div class="course-meta">X MÓDULOS · X EJERCICIOS · GRATIS</div>
  <span class="course-tag">Próximamente</span>
</div>
```

Para cursos **de pago** (próximamente):
```html
<a class="course course-link" data-reveal style="--rd:.XXs" href="#planes">
  <div class="course-num">[08]</div>
  <h3>Nombre del curso</h3>
  <p>Descripción del curso.</p>
  <div class="course-meta">X MÓDULOS · $XX/MESS · INTERACTIVO</div>
  <span class="course-tag">Próximamente</span>
</a>
```

---

## Cambiar planes/precios

1. En `index.html`, busca la tabla `<!-- PLANES -->`
2. Modifica precios, nombres o características

**Importante:** Los precios en colones se calculan de forma aproximada. Actualiza ambos valores cuando cambies el precio en dólares.

---

## Agregar testimonios

Cuando tengas testimonios, busca la sección `<!-- PORTAFOLIO -->` y agrega una nueva sección antes del CTA final:

```html
<!-- TESTIMONIOS -->
<section class="sec" id="testimonios">
  <div class="wrap">
    <div class="sec-head" data-reveal>
      <h2>Testimonios</h2>
      <span class="mono">[ 07 ] · LO QUE DICEN NUESTROS CLIENTES</span>
    </div>
    <!-- Agregar tarjetas de testimonios aquí -->
  </div>
</section>
```

---

## Cambiar el número de WhatsApp

Busca en `index.html` todas las ocurrencias de `50672169369` y reemplázalas por tu número actual.

---

## Cambiar el correo

Busca `aparece.cr@gmail.com` en `index.html` y reemplázalo.

---

## Cambiar Instagram

Busca `aparece_cr` en `index.html` y reemplázalo por tu usuario actual.

---

## Estructura de archivos

```
LANDING PAGE/
├── index.html          ← Todo el contenido HTML
├── robots.txt          ← Reglas para buscadores
├── sitemap.xml         ← Mapa del sitio (SEO)
├── .gitignore          ← Archivos ignorados por Git
├── css/
│   ├── styles.css      ← Estilos principales
│   └── responsive.css  ← Estilos para móvil/tablet
├── js/
│   └── main.js         ← JavaScript (animaciones, menú, cookies, formulario)
├── img/
│   └── og-image.png    ← Imagen para compartir en redes (1200×630)
├── pages/              ← Páginas legales (privacidad, términos, cookies, reembolsos)
├── docs/
│   ├── MANTENIMIENTO.md  ← Este archivo
│   ├── COLORES.md        ← Paleta de colores
│   └── LEGAL.md          ← Obligaciones legales
└── README.md           ← Instrucciones del proyecto
```

---

## Después de cualquier cambio

1. Guarda el archivo
2. Abre `index.html` en tu navegador para verificar
3. Cuando esté listo, sube a GitHub:
   ```bash
   git add .
   git commit -m "Descripción del cambio"
   git push
   ```
4. GitHub Pages actualiza automáticamente en 1-2 minutos
