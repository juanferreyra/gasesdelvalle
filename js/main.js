/* ==========================================================================
   Gases del Valle — Interactividad
   ========================================================================== */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Año en el footer ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar: fondo al hacer scroll + progreso ---------- */
  const navbar = document.getElementById("navbar");
  const progress = document.getElementById("scrollProgress");
  const toTop = document.getElementById("toTop");

  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle("scrolled", y > 40);
    toTop.classList.toggle("show", y > 600);

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  function closeMenu() {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  /* ---------- Volver arriba ---------- */
  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" })
  );

  /* ---------- Catálogo de gases (generado dinámicamente) ---------- */
  const gases = [
    { symbol: "O₂", formula: "Oxígeno", name: "Oxígeno", tag: "Combustión · Corte", grad: "linear-gradient(155deg,#2a86ff,#0f4faf)", uses: "Oxicorte, soldadura y procesos de combustión industrial." },
    { symbol: "N₂", formula: "Nitrógeno", name: "Nitrógeno", tag: "Cervecerías · Inertización", grad: "linear-gradient(155deg,#17c3b2,#0a8f86)", uses: "Cerveza nitro, purga de líneas y barriles, atmósferas inertes y enfriamiento." },
    { symbol: "Ar", formula: "Argón", name: "Argón", tag: "Soldadura TIG/MIG", grad: "linear-gradient(155deg,#8a7bff,#4b3fb0)", uses: "Gas de protección en soldadura TIG y MIG de aceros, aluminio y otros metales." },
    { symbol: "CO₂", formula: "Dióxido de carbono", name: "Dióxido de carbono", tag: "Cervecerías · Soldadura", grad: "linear-gradient(155deg,#4a5568,#232b3a)", uses: "Carbonatación de cerveza y bebidas, soldadura MAG y sistemas de extinción." },
    { symbol: "He", formula: "Helio", name: "Helio", tag: "Detección · Globos", grad: "linear-gradient(155deg,#f472b6,#a21caf)", uses: "Detección de fugas, refrigeración criogénica y globos." },
    { symbol: "Mix", formula: "Mezclas especiales", name: "Mezclas a medida", tag: "Personalizado", grad: "linear-gradient(155deg,#2bd6ff,#1b7bd6)", uses: "Preparamos mezclas según tu necesidad, por ejemplo Ar/CO₂ para soldadura." },
  ];

  const gasGrid = document.getElementById("gasGrid");
  if (gasGrid) {
    gases.forEach((g) => {
      const card = document.createElement("div");
      card.className = "gas-card reveal";
      card.setAttribute("role", "listitem");
      card.style.background = g.grad;
      card.innerHTML = `
        <div class="gas-symbol">${g.symbol}</div>
        <div class="gas-formula">${g.formula}</div>
        <div class="gas-name">${g.name}</div>
        <div class="gas-uses">
          <span class="gas-tag">${g.tag}</span>
          <p>${g.uses}</p>
        </div>`;
      gasGrid.appendChild(card);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Contadores animados ---------- */
  const counters = document.querySelectorAll(".stat-num");
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    if (prefersReduced) { el.textContent = target; return; }
    const dur = 1600;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }
  if (counters.length) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => cio.observe(c));
  }

  /* ---------- Manómetro animado del hero ---------- */
  const gaugeFill = document.getElementById("gaugeFill");
  const gaugeVal = document.getElementById("gaugeVal");
  if (gaugeFill && gaugeVal && !prefersReduced) {
    const circ = 2 * Math.PI * 50; // 314
    let dir = 1, val = 200;
    setInterval(() => {
      val += dir * (Math.random() * 6 + 2);
      if (val > 210) { val = 210; dir = -1; }
      if (val < 150) { val = 150; dir = 1; }
      const pct = val / 300; // fondo escala 300 bar
      gaugeFill.style.strokeDashoffset = circ * (1 - pct);
      gaugeVal.textContent = Math.round(val);
    }, 900);
  }

  /* ---------- Canvas de partículas (moléculas de gas) ---------- */
  const canvas = document.getElementById("heroCanvas");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    let w, h, particles, raf;
    const COUNT = window.innerWidth < 760 ? 34 : 66;
    const MAX_DIST = 130;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }

    function initParticles() {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(95, 225, 255, 0.7)";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MAX_DIST) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(43, 214, 255, ${0.14 * (1 - dist / MAX_DIST)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }

    function start() { resize(); initParticles(); cancelAnimationFrame(raf); draw(); }
    window.addEventListener("resize", () => { resize(); initParticles(); });
    // Pausar cuando el hero no está visible (ahorro de CPU)
    const heroObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) draw();
        else cancelAnimationFrame(raf);
      });
    });
    start();
    heroObs.observe(canvas);
  }

  /* ---------- Validación del formulario ---------- */
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  if (form) {
    const showError = (name, msg) => {
      const field = form.querySelector(`#${name}`).closest(".field");
      const span = form.querySelector(`.error[data-for="${name}"]`);
      field.classList.toggle("invalid", !!msg);
      if (span) span.textContent = msg || "";
    };

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      note.textContent = "";
      note.className = "form-note";
      let ok = true;

      const nombre = form.nombre.value.trim();
      const email = form.email.value.trim();
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (nombre.length < 3) { showError("nombre", "Ingresá tu nombre y empresa."); ok = false; }
      else showError("nombre", "");

      if (!emailRe.test(email)) { showError("email", "Ingresá un email válido."); ok = false; }
      else showError("email", "");

      if (!ok) {
        note.textContent = "Revisá los campos marcados.";
        note.classList.add("form-note");
        return;
      }

      // Simulación de envío (sin backend). Integrar con un servicio real si se necesita.
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Enviando…";
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = original;
        form.reset();
        note.textContent = "¡Gracias! Recibimos tu solicitud. Un asesor te contactará a la brevedad.";
        note.classList.add("ok");
      }, 1000);
    });

    // Limpiar error al escribir
    ["nombre", "email"].forEach((n) => {
      form[n].addEventListener("input", () => showError(n, ""));
    });
  }
})();
