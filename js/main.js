/* ============================================================
   APARECÉ — JavaScript principal
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. HEADER — se compacta al hacer scroll
     ---------------------------------------------------------- */
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     2. HAMBURGER — menú móvil
     ---------------------------------------------------------- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      navLinks.classList.toggle('is-open', !isOpen);
    });

    // Cerrar al clickear un link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('is-open');
      });
    });

    // Cerrar al clickear fuera
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('is-open');
      }
    });
  }

  /* ----------------------------------------------------------
     3. SCROLL REVEAL — IntersectionObserver
     ---------------------------------------------------------- */
  const revealables = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealables.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealables.forEach(el => io.observe(el));
  } else {
    revealables.forEach(el => el.classList.add('is-in'));
  }

  /* ----------------------------------------------------------
     4. DOTS BACKGROUND — canvas interactivo con el cursor
     ---------------------------------------------------------- */
  (function () {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduce || coarse) return;

    function attachDots(canvas, container, opts) {
      const ctx = canvas.getContext('2d');
      const SPACING = opts.spacing || 42;
      const RADIUS_REACT = 130;
      const MAX_PUSH = 16;
      const EASE = 0.12;

      let w, h, dpr, dots = [];
      let mouse = { x: -9999, y: -9999 };

      function build() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        dots = [];
        const cols = Math.ceil(w / SPACING) + 1;
        const rows = Math.ceil(h / SPACING) + 1;
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const ox = i * SPACING, oy = j * SPACING;
            dots.push({ ox, oy, x: ox, y: oy });
          }
        }
      }

      container.addEventListener('mousemove', (e) => {
        const r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
      });
      container.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
      });

      function tick() {
        ctx.clearRect(0, 0, w, h);
        for (const d of dots) {
          const dx = d.ox - mouse.x;
          const dy = d.oy - mouse.y;
          const dist = Math.hypot(dx, dy);
          let tx = d.ox, ty = d.oy, near = 0;

          if (dist < RADIUS_REACT) {
            near = 1 - dist / RADIUS_REACT;
            const push = near * MAX_PUSH;
            const ang = Math.atan2(dy, dx);
            tx = d.ox + Math.cos(ang) * push;
            ty = d.oy + Math.sin(ang) * push;
          }

          d.x += (tx - d.x) * EASE;
          d.y += (ty - d.y) * EASE;

          ctx.beginPath();
          ctx.fillStyle = near > 0.05 ? opts.hoverColor : opts.baseColor;
          ctx.globalAlpha = near > 0.05 ? opts.baseAlpha + near * 0.4 : opts.baseAlpha;
          ctx.arc(d.x, d.y, near > 0.05 ? 1.6 + near * 1.4 : 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(tick);
      }

      let rt;
      window.addEventListener('resize', () => {
        clearTimeout(rt);
        rt = setTimeout(build, 150);
      });
      build();
      requestAnimationFrame(tick);
    }

    // Hero: fondo claro, puntos carbón → naranja
    const heroCanvas = document.getElementById('dots-bg');
    if (heroCanvas) {
      attachDots(heroCanvas, heroCanvas.closest('.hero'), {
        baseColor: 'hsl(220 12% 7%)',
        hoverColor: 'hsl(24 95% 52%)',
        baseAlpha: 0.10
      });
    }

    // Bloques oscuros: fondo carbón, puntos claros → naranja
    document.querySelectorAll('.sec.dark').forEach((section) => {
      const c = document.createElement('canvas');
      c.className = 'dots-bg';
      c.setAttribute('aria-hidden', 'true');
      section.insertBefore(c, section.firstChild);
      attachDots(c, section, {
        baseColor: 'hsl(40 20% 82%)',
        hoverColor: 'hsl(24 95% 58%)',
        baseAlpha: 0.16
      });
    });
  })();

  /* ----------------------------------------------------------
     5. COOKIE CONSENT BANNER
     ---------------------------------------------------------- */
  (function () {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const rejectBtn = document.getElementById('cookie-reject');
    if (!banner || !acceptBtn || !rejectBtn) return;

    // Verificar si ya dio consentimiento
    const consent = localStorage.getItem('cookie_consent');
    if (consent) return;

    // Mostrar banner después de 1s
    setTimeout(() => {
      banner.hidden = false;
      requestAnimationFrame(() => banner.classList.add('is-visible'));
    }, 1000);

    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'accepted');
      banner.classList.remove('is-visible');
      setTimeout(() => { banner.hidden = true; }, 400);
    });

    rejectBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'rejected');
      banner.classList.remove('is-visible');
      setTimeout(() => { banner.hidden = true; }, 400);
    });
  })();

  /* ----------------------------------------------------------
     6. FORMULARIO DE CONTACTO — validación + envío
     ---------------------------------------------------------- */
  (function () {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Validar nombre
      const name = form.querySelector('#cf-name');
      const nameGroup = name?.closest('.form-group');
      if (name && !name.value.trim()) {
        nameGroup?.classList.add('error');
        valid = false;
      } else {
        nameGroup?.classList.remove('error');
      }

      // Validar email
      const email = form.querySelector('#cf-email');
      const emailGroup = email?.closest('.form-group');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email.value.trim())) {
        emailGroup?.classList.add('error');
        valid = false;
      } else {
        emailGroup?.classList.remove('error');
      }

      // Validar mensaje
      const msg = form.querySelector('#cf-message');
      const msgGroup = msg?.closest('.form-group');
      if (msg && !msg.value.trim()) {
        msgGroup?.classList.add('error');
        valid = false;
      } else {
        msgGroup?.classList.remove('error');
      }

      // Validar consentimiento
      const consent = form.querySelector('#cf-consent');
      const consentGroup = form.querySelector('#cf-consent-group');
      if (consent && !consent.checked) {
        consent.focus();
        consentGroup?.classList.add('error');
        valid = false;
      } else {
        consentGroup?.classList.remove('error');
      }

      if (valid) {
        // Construir mailto con los datos
        const asunto = encodeURIComponent('Consulta desde la web de APARECÉ');
        const body = encodeURIComponent(
          `Nombre: ${name.value.trim()}\n` +
          `Email: ${email.value.trim()}\n` +
          `WhatsApp: ${form.querySelector('#cf-phone')?.value.trim() || 'No proporcionado'}\n\n` +
          `Mensaje:\n${msg.value.trim()}\n\n` +
          `---\nConsentimiento de privacidad: Aceptado`
        );

        // Abrir cliente de correo
        window.location.href = `mailto:aparece.cr@gmail.com?subject=${asunto}&body=${body}`;

        // Mostrar éxito
        const success = document.getElementById('form-success');
        success?.classList.add('is-visible');
        form.reset();

        // Ocultar mensaje después de 5s
        setTimeout(() => { success?.classList.remove('is-visible'); }, 5000);
      }
    });

    // Limpiar errores al escribir
    form.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', () => {
        el.closest('.form-group')?.classList.remove('error');
      });
    });
  })();

})();
