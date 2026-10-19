/* ============================================================================
   APARECÉ — Efectos interactivos (adaptados de ReactBits · reactbits.dev)
   Versiones vanilla ligeras: CSS + canvas + rAF. Sin dependencias.
   Respetan prefers-reduced-motion. No rompen accesibilidad.
   Efectos: ShinyText, CountUp, SpotlightCard, TiltedCard, Magnet,
   StarBorder (cometa), ClickSpark, TextType (typewriter), ScrollSpy,
   barra de progreso de lectura.
============================================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sinHover = window.matchMedia('(hover: none)').matches;

  /* ----------------------------------------------------------
     1. BARRA DE PROGRESO DE LECTURA
     ---------------------------------------------------------- */
  (function () {
    var barra = document.getElementById('scroll-progress');
    if (!barra) return;
    var raf = 0;
    function pintar() {
      raf = 0;
      var d = document.documentElement;
      var max = d.scrollHeight - d.clientHeight;
      barra.style.setProperty('--p', String(max > 0 ? Math.min(1, window.scrollY / max) : 0));
    }
    window.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(pintar); }, { passive: true });
    pintar();
  })();

  /* ----------------------------------------------------------
     2. COUNTUP — números que cuentan al aparecer
     ---------------------------------------------------------- */
  (function () {
    var objetivos = document.querySelectorAll('[data-count]');
    if (!objetivos.length) return;
    if (reduce) return; // se quedan estáticos con su valor final
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        io.unobserve(el);
        var fin = parseInt(el.getAttribute('data-count'), 10) || 0;
        var t0 = performance.now();
        (function paso(now) {
          var p = Math.min(1, (now - t0) / 1100);
          el.textContent = String(Math.round(fin * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(paso);
        })(t0);
      });
    }, { threshold: 0.5 });
    objetivos.forEach(function (el) { io.observe(el); });
  })();

  /* ----------------------------------------------------------
     3. SPOTLIGHT — brillo que sigue al cursor
     ---------------------------------------------------------- */
  (function () {
    if (reduce || sinHover) return;
    document.querySelectorAll('[data-spotlight]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  })();

  /* ----------------------------------------------------------
     4. TILT — inclinación 3D suave de tarjetas
     ---------------------------------------------------------- */
  (function () {
    if (reduce || sinHover) return;
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var MAX = 4;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transition = 'none';
        el.style.transform = 'perspective(900px) rotateX(' + (-py * MAX).toFixed(2) + 'deg) rotateY(' + (px * MAX).toFixed(2) + 'deg)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .4s var(--ease)';
        el.style.transform = '';
      });
    });
  })();

  /* ----------------------------------------------------------
     5. MAGNET — el botón se acerca al cursor
     ---------------------------------------------------------- */
  (function () {
    if (reduce || sinHover) return;
    document.querySelectorAll('[data-magnet]').forEach(function (el) {
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, activo = false;
      function tick() {
        cx += (tx - cx) * 0.16;
        cy += (ty - cy) * 0.16;
        if (Math.abs(cx - tx) > 0.2 || Math.abs(cy - ty) > 0.2 || Math.hypot(tx, ty) > 0.2) {
          activo = true;
          el.style.transform = 'translate3d(' + cx.toFixed(1) + 'px, ' + cy.toFixed(1) + 'px, 0)';
          raf = requestAnimationFrame(tick);
        } else {
          activo = false;
          el.style.transform = '';
        }
      }
      window.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        if (Math.hypot(dx, dy) < Math.max(r.width, r.height) / 2 + 70) {
          tx = dx * 0.2;
          ty = dy * 0.2;
        } else {
          tx = 0;
          ty = 0;
        }
        if (!activo) tick();
      }, { passive: true });
    });
  })();

  /* ----------------------------------------------------------
     6. COMET BORDER — cometa recorriendo el borde (StarBorder)
     ---------------------------------------------------------- */
  function hexARGB(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  (function () {
    if (reduce) return;
    var botones = document.querySelectorAll('[data-comet]');
    if (!botones.length) return;

    botones.forEach(function (root) {
      var canvas = document.createElement('canvas');
      canvas.className = 'comet-lienzo';
      canvas.setAttribute('aria-hidden', 'true');
      root.appendChild(canvas);
      var ctx = canvas.getContext('2d');
      if (!ctx) return;

      var R = 4, BLEED = 14, PASO = 2.2, COLA = 30;
      var w = 0, h = 0, perim = 1;
      var visible = true, fase = 0, vel = 0, burst = 0;
      var raf = 0, vivo = true, last = performance.now();
      var base = root.getAttribute('data-comet') || '#ff5a1f';

      function punto(s) {
        s = ((s % perim) + perim) % perim;
        var arco = (Math.PI * R) / 2;
        var segs = [
          { len: w - 2 * R, t: 'l', x0: R, y0: 0, dx: 1, dy: 0 },
          { len: arco, t: 'a', cx: w - R, cy: R, a0: -Math.PI / 2 },
          { len: h - 2 * R, t: 'l', x0: w, y0: R, dx: 0, dy: 1 },
          { len: arco, t: 'a', cx: w - R, cy: h - R, a0: 0 },
          { len: w - 2 * R, t: 'l', x0: w - R, y0: h, dx: -1, dy: 0 },
          { len: arco, t: 'a', cx: R, cy: h - R, a0: Math.PI / 2 },
          { len: h - 2 * R, t: 'l', x0: 0, y0: h - R, dx: 0, dy: -1 },
          { len: arco, t: 'a', cx: R, cy: R, a0: Math.PI }
        ];
        for (var i = 0; i < segs.length; i++) {
          var sg = segs[i];
          if (sg.len <= 0) continue;
          if (s <= sg.len) {
            if (sg.t === 'l') return [sg.x0 + sg.dx * s, sg.y0 + sg.dy * s];
            var a = sg.a0 + s / R;
            return [sg.cx + Math.cos(a) * R, sg.cy + Math.sin(a) * R];
          }
          s -= sg.len;
        }
        return [R, 0];
      }

      function dibujar(color) {
        ctx.clearRect(-BLEED, -BLEED, w + BLEED * 2, h + BLEED * 2);
        for (var i = COLA; i >= 0; i--) {
          var a = punto(fase - i * PASO);
          var b = punto(fase - (i + 1) * PASO);
          var t = 1 - i / COLA;
          ctx.strokeStyle = hexARGB(color, t * t * 0.9);
          ctx.lineWidth = 0.7 + 2.4 * t;
          ctx.lineCap = i < 4 ? 'round' : 'butt';
          ctx.beginPath();
          ctx.moveTo(a[0], a[1]);
          ctx.lineTo(b[0], b[1]);
          ctx.stroke();
        }
        var cab = punto(fase);
        var g = ctx.createRadialGradient(cab[0], cab[1], 0, cab[0], cab[1], 15);
        g.addColorStop(0, hexARGB(color, 0.5));
        g.addColorStop(1, hexARGB(color, 0));
        ctx.fillStyle = g;
        ctx.fillRect(cab[0] - 15, cab[1] - 15, 30, 30);
      }

      function frame(now) {
        raf = 0;
        if (!vivo || !visible) return;
        var dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
        last = now;
        burst *= Math.exp(-dt * 3);
        var objetivo = (root.matches(':hover') || root.matches(':focus-visible') ? 210 : 75) * (1 + burst * 2.2);
        vel += (objetivo - vel) * Math.min(1, dt * 6);
        fase += vel * dt;
        dibujar(root.matches(':hover') ? '#ffffff' : base);
        raf = requestAnimationFrame(frame);
      }

      function despertar() {
        if (raf || !vivo || !visible) return;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }

      function medir() {
        w = root.offsetWidth;
        h = root.offsetHeight;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var W = w + BLEED * 2, H = h + BLEED * 2;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        canvas.style.left = -BLEED + 'px';
        canvas.style.top = -BLEED + 'px';
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, BLEED * dpr, BLEED * dpr);
        perim = Math.max(1, 2 * (w + h - 4 * R) + 2 * Math.PI * R);
        despertar();
      }

      new ResizeObserver(medir).observe(root);
      new IntersectionObserver(function (es) {
        visible = es.some(function (e) { return e.isIntersecting; });
        if (visible) despertar();
      }).observe(root);
      root.addEventListener('pointerdown', function () { burst = 1; despertar(); });
      root.addEventListener('pointerenter', despertar);
      root.addEventListener('focus', despertar);
      medir();
    });
  })();

  /* ----------------------------------------------------------
     7. CLICK SPARK — chispas al hacer click
     ---------------------------------------------------------- */
  (function () {
    if (reduce) return;
    var canvas = document.createElement('canvas');
    canvas.className = 'fx-spark-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var w = 0, h = 0;
    function medir() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    medir();
    var chispas = [], raf = 0;
    function tick() {
      ctx.clearRect(0, 0, w, h);
      chispas = chispas.filter(function (s) { return s.vida > 0; });
      chispas.forEach(function (s) {
        s.x += s.vx; s.y += s.vy;
        s.vy += 0.14; s.vx *= 0.95; s.vy *= 0.95;
        s.vida -= 0.035;
        ctx.globalAlpha = Math.max(0, s.vida);
        ctx.strokeStyle = '#ff5a1f';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 3.5, s.y - s.vy * 3.5);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      raf = chispas.length ? requestAnimationFrame(tick) : 0;
    }
    window.addEventListener('pointerdown', function (e) {
      for (var i = 0; i < 8; i++) {
        var a = (Math.PI * 2 * i) / 8 + Math.random() * 0.4;
        var sp = 2 + Math.random() * 2.6;
        chispas.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1, vida: 1 });
      }
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
    window.addEventListener('resize', medir);
  })();

  /* ----------------------------------------------------------
     8. TEXT TYPE — hero-note con máquina de escribir
     ---------------------------------------------------------- */
  (function () {
    var el = document.querySelector('[data-ciclo]');
    if (!el) return;
    var frases = (el.getAttribute('data-ciclo') || '').split('|').filter(Boolean);
    if (!frases.length) return;
    if (reduce) return; // queda la primera frase estática
    var span = document.createElement('span');
    span.className = 'fx-caret';
    el.textContent = '';
    el.appendChild(span);
    var fi = 0, ci = 0, borrando = false;
    function paso() {
      var frase = frases[fi];
      if (!borrando) {
        ci++;
        span.textContent = frase.slice(0, ci);
        if (ci === frase.length) {
          borrando = true;
          setTimeout(paso, 2200);
          return;
        }
        setTimeout(paso, 55);
      } else {
        ci--;
        span.textContent = frase.slice(0, ci);
        if (ci === 0) {
          borrando = false;
          fi = (fi + 1) % frases.length;
          setTimeout(paso, 350);
          return;
        }
        setTimeout(paso, 28);
      }
    }
    setTimeout(paso, 600);
  })();

  /* ----------------------------------------------------------
     9. SCROLLSPY — resalta la sección activa en el nav
     ---------------------------------------------------------- */
  (function () {
    var enlaces = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
    var pares = [];
    enlaces.forEach(function (a) {
      var sec = document.getElementById(a.getAttribute('href').slice(1));
      if (sec) pares.push({ a: a, sec: sec });
    });
    if (!pares.length) return;
    var raf = 0;
    function pintar() {
      raf = 0;
      var linea = window.innerHeight * 0.34;
      var activo = null, anterior = null;
      pares.forEach(function (p) {
        var r = p.sec.getBoundingClientRect();
        if (r.top <= linea) anterior = p;
        if (r.top <= linea && r.bottom > linea) activo = p;
      });
      activo = activo || anterior;
      pares.forEach(function (p) { p.a.classList.toggle('is-active', p === activo); });
    }
    function pedir() { if (!raf) raf = requestAnimationFrame(pintar); }
    window.addEventListener('scroll', pedir, { passive: true });
    window.addEventListener('resize', pedir, { passive: true });
    pintar();
  })();

  /* ----------------------------------------------------------
     10. ANCLAS SUAVES — scroll con offset del header fijo
     ---------------------------------------------------------- */
  (function () {
    var header = document.querySelector('header');
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href').slice(1);
        if (!id || id === 'main-content') return;
        var el = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        var off = (header ? header.offsetHeight : 0) + 12;
        var y = el.getBoundingClientRect().top + window.scrollY - off;
        window.scrollTo({ top: Math.max(0, y), behavior: reduce ? 'auto' : 'smooth' });
        if (history.replaceState) history.replaceState(null, '', '#' + id);
      });
    });
  })();

  /* ----------------------------------------------------------
     11. TICKER — marquee que acelera con el scroll
     ---------------------------------------------------------- */
  (function () {
    var track = document.querySelector('[data-ticker]');
    if (!track) return;
    track.innerHTML += track.innerHTML;
    var mitad = 0, x = 0, boost = 0, raf = 0, visible = true, prevY = window.scrollY;
    var BASE = 46;
    function medir() { mitad = track.scrollWidth / 2 || 1; }
    function tick() {
      raf = 0;
      if (!visible) return;
      x -= (BASE + boost) / 60;
      if (x <= -mitad) x += mitad;
      track.style.transform = 'translate3d(' + x.toFixed(2) + 'px, 0, 0)';
      boost *= 0.93;
      raf = requestAnimationFrame(tick);
    }
    function despertar() { if (!raf && visible && !reduce) raf = requestAnimationFrame(tick); }
    medir();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(medir);
    window.addEventListener('resize', medir);
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      boost = Math.min(900, boost + Math.abs(y - prevY) * 3.4);
      prevY = y;
    }, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        visible = es.some(function (e) { return e.isIntersecting; });
        despertar();
      }, { rootMargin: '120px 0px' }).observe(track);
    }
    despertar();
  })();

  /* ----------------------------------------------------------
     12. SCRAMBLE — los títulos se "decodifican" al entrar
     ---------------------------------------------------------- */
  (function () {
    if (reduce) return;
    var GLIFOS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&/0123456789';
    var titulos = document.querySelectorAll('.sec-head h2');
    if (!titulos.length) return;
    function animar(el) {
      var final = el.textContent;
      if (!final.trim()) return;
      el.setAttribute('aria-label', final);
      var t0 = performance.now(), dur = 850;
      (function paso(now) {
        var p = Math.min(1, (now - t0) / dur);
        var n = Math.round(p * final.length);
        var txt = final.slice(0, n);
        for (var i = n; i < final.length; i++) {
          var c = final[i];
          txt += c === ' ' ? ' ' : GLIFOS[(Math.random() * GLIFOS.length) | 0];
        }
        el.textContent = txt;
        if (p < 1) requestAnimationFrame(paso);
        else el.textContent = final;
      })(t0);
    }
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        animar(e.target);
      });
    }, { threshold: 0.6 });
    titulos.forEach(function (el) {
      if (!el.children.length) io.observe(el);
    });
  })();

  /* ---------- 13 · FONDO VIVO ---------- */
  (function () {
    if (reduce) return;

    /* Aura: halo suave que persigue al cursor en toda la página */
    var raiz = document.documentElement;
    var tx = 50, ty = 28, ax = 50, ay = 28, rafAura = 0;
    function pintarAura() {
      rafAura = 0;
      ax += (tx - ax) * 0.09;
      ay += (ty - ay) * 0.09;
      raiz.style.setProperty('--cx', ax.toFixed(2) + '%');
      raiz.style.setProperty('--cy', ay.toFixed(2) + '%');
      if (Math.abs(tx - ax) > 0.08 || Math.abs(ty - ay) > 0.08) rafAura = requestAnimationFrame(pintarAura);
    }
    window.addEventListener('mousemove', function (e) {
      tx = (e.clientX / window.innerWidth) * 100;
      ty = (e.clientY / window.innerHeight) * 100;
      if (!rafAura) rafAura = requestAnimationFrame(pintarAura);
    }, { passive: true });

    /* Malla: puntos que huyen del cursor y se encienden a su paso */
    if (sinHover) return;

    document.querySelectorAll('[data-mesh]').forEach(function (host) {
      var lienzo = document.createElement('canvas');
      lienzo.className = 'mesh-lienzo';
      lienzo.setAttribute('aria-hidden', 'true');
      host.insertBefore(lienzo, host.firstChild);

      var ctx = lienzo.getContext('2d');
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      var W = 0, H = 0;
      var nodos = [];
      var mx = -9999, my = -9999;
      var activo = false, rafMalla = 0;
      var oscuro = host.classList.contains('dark');

      function medir() {
        W = host.clientWidth; H = host.clientHeight;
        lienzo.width = Math.round(W * dpr);
        lienzo.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        nodos = [];
        var paso = W < 720 ? 56 : 46;
        for (var y = paso * 0.55; y < H + paso; y += paso) {
          for (var x = paso * 0.55; x < W + paso; x += paso) {
            nodos.push({ ox: x, oy: y, x: x, y: y, ph: Math.random() * 6.2832 });
          }
        }
      }

      function tic(t) {
        rafMalla = 0;
        if (!activo) return;
        t /= 1000;
        ctx.clearRect(0, 0, W, H);

        var R = 140;
        var i, n, dx, dy, d, f, tx2, ty2;
        for (i = 0; i < nodos.length; i++) {
          n = nodos[i];
          tx2 = n.ox + Math.sin(t * 0.5 + n.ph) * 5;
          ty2 = n.oy + Math.cos(t * 0.42 + n.ph * 1.3) * 5;
          dx = tx2 - mx; dy = ty2 - my;
          d = Math.sqrt(dx * dx + dy * dy);
          if (d < R) {
            f = (1 - d / R) * 24;
            tx2 += (dx / (d || 1)) * f;
            ty2 += (dy / (d || 1)) * f;
          }
          n.x += (tx2 - n.x) * 0.12;
          n.y += (ty2 - n.y) * 0.12;
        }

        /* Conexiones que emergen del cursor */
        ctx.lineWidth = 1;
        for (i = 0; i < nodos.length; i++) {
          n = nodos[i];
          dx = n.x - mx; dy = n.y - my;
          d = Math.sqrt(dx * dx + dy * dy);
          if (d < R) {
            ctx.strokeStyle = 'rgba(249,109,16,' + ((1 - d / R) * 0.42).toFixed(3) + ')';
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(mx, my); ctx.stroke();
          }
        }

        /* Puntos: apagados en reposo, naranjas cerca del cursor */
        var base = oscuro ? '232,228,220' : '24,23,20';
        var alfa = oscuro ? '0.30' : '0.18';
        for (i = 0; i < nodos.length; i++) {
          n = nodos[i];
          dx = n.x - mx; dy = n.y - my;
          d = Math.sqrt(dx * dx + dy * dy);
          var cal = d < R ? 1 - d / R : 0;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 1.15 + cal * 2.1, 0, 6.2832);
          ctx.fillStyle = cal > 0.02
            ? 'rgba(249,109,16,' + (0.4 + cal * 0.6).toFixed(3) + ')'
            : 'rgba(' + base + ',' + alfa + ')';
          ctx.fill();
        }
        rafMalla = requestAnimationFrame(tic);
      }

      host.addEventListener('mousemove', function (e) {
        var r = host.getBoundingClientRect();
        mx = e.clientX - r.left; my = e.clientY - r.top;
      }, { passive: true });
      host.addEventListener('mouseleave', function () { mx = -9999; my = -9999; });

      if ('ResizeObserver' in window) new ResizeObserver(medir).observe(host);
      else window.addEventListener('resize', medir);
      medir();

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (ent) {
          activo = ent[0].isIntersecting;
          if (activo && !rafMalla) rafMalla = requestAnimationFrame(tic);
        }, { rootMargin: '120px' }).observe(host);
      } else {
        activo = true;
        rafMalla = requestAnimationFrame(tic);
      }
    });
  })();

})();
