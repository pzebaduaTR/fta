/* =========================================================
   FTA — Monografía institucional · script.js
   Las librerías CDN (AOS, Lucide) hacen el trabajo pesado.
   Aquí solo queda lo que ninguna librería puede resolver:
   índice lateral activo, barra de progreso, menú, modales y
   el formulario (mailto).
   ========================================================= */

document.documentElement.classList.remove('no-js');
document.body.classList.remove('no-js');

document.addEventListener('DOMContentLoaded', () => {

  /* --- Iconos (Lucide, CDN) --- */
  if (window.lucide) lucide.createIcons();

  /* --- Reveal al hacer scroll (AOS, CDN) --- */
  if (window.AOS) {
    AOS.init({ duration: 900, easing: 'ease-out-quart', once: true, offset: 90 });
  }

  /* --- Año del colofón --- */
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* --- Barra de progreso de lectura --- */
  const progress = document.getElementById('progress');
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- Índice lateral: capítulo activo (IntersectionObserver) --- */
  const railLinks = Array.from(document.querySelectorAll('.rail a'));
  const byId = id => railLinks.find(a => a.getAttribute('href') === '#' + id);
  const sections = railLinks
    .map(a => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          railLinks.forEach(a => a.classList.remove('active'));
          byId(e.target.id)?.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    sections.forEach(s => io.observe(s));
  }

  /* --- Menú overlay --- */
  const overlay = document.getElementById('overlay');
  const open = () => { overlay.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { overlay.classList.remove('open'); document.body.style.overflow = ''; };
  document.getElementById('menuOpen')?.addEventListener('click', open);
  document.getElementById('menuClose')?.addEventListener('click', close);
  overlay?.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  /* --- Modales legales --- */
  const openModal = id => {
    const m = document.getElementById(id);
    if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
  };
  const closeModals = () => {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    if (!overlay.classList.contains('open')) document.body.style.overflow = '';
  };
  document.querySelectorAll('[data-modal]').forEach(b =>
    b.addEventListener('click', () => openModal(b.dataset.modal)));
  document.querySelectorAll('[data-modal-link]').forEach(a =>
    a.addEventListener('click', e => { e.preventDefault(); openModal(a.dataset.modalLink); }));
  document.querySelectorAll('[data-close]').forEach(b =>
    b.addEventListener('click', closeModals));
  document.querySelectorAll('.modal-overlay').forEach(o =>
    o.addEventListener('click', e => { if (e.target === o) closeModals(); }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModals(); close(); } });

  /* --- Formulario → mailto --- */
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const nombre  = form.nombre.value.trim();
    const correo  = form.correo.value.trim();
    const asunto  = form.asunto.value.trim() || 'Contacto desde el sitio web de FTA';
    const mensaje = form.mensaje.value.trim();
    if (!nombre || !correo || !mensaje) {
      alert('Por favor complete su nombre, correo y mensaje.');
      return;
    }
    const cuerpo = `Nombre: ${nombre}\nCorreo: ${correo}\n\n${mensaje}`;
    window.location.href =
      `mailto:info@fta.mx?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
  });
});
