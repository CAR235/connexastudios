/* Connexa Studios — WOW pack (15 micro-interazioni) */
(function () {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasHover = matchMedia('(hover:hover)').matches;
  const lenis = window.__lenis || null;

  /* ---------- shared: toast ---------- */
  let toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; document.body.appendChild(toastEl); }
    toastEl.innerHTML = '<img src="assets/img/mark-lime.svg" style="height:14px;filter:brightness(0)" alt="">' + msg;
    toastEl.classList.add('on');
    clearTimeout(toastEl._t); toastEl._t = setTimeout(() => toastEl.classList.remove('on'), 2200);
  }

  /* ---------- 1+2. Command palette (Cmd/Ctrl+K) ---------- */
  const NAV = [
    { k: 'Vai', t: 'Home', a: '/' },
    { k: 'Vai', t: 'Chi siamo', a: '/chi-siamo' },
    { k: 'Vai', t: 'Servizi', a: '/servizi' },
    { k: 'Vai', t: 'Progetti', a: '/progetti' },
    { k: 'Vai', t: 'Store', a: '/store' },
    { k: 'Vai', t: 'Contatti', a: '/contatti' },
    { k: 'Progetto', t: 'Lettere alla Rossa', a: '/lettereallarossa' },
    { k: 'Progetto', t: '3MF Design', a: '/3mfdesign' },
    { k: 'Progetto', t: 'Fatter', a: '/fatter' },
    { k: 'Progetto', t: 'Telos F1', a: '/telosf1' },
    { k: 'Concept', t: 'NÖVA', a: '/nova' },
    { k: 'Concept', t: 'Atlas', a: '/atlas' },
    { k: 'Concept', t: 'Kirò', a: '/kiro' },
    { k: 'Azione', t: 'Scrivici una mail', a: 'mailto:info@connexastudios.com' },
    { k: 'Azione', t: 'Prenota una call', a: '/contatti' },
  ];
  const cmdk = document.createElement('div');
  cmdk.className = 'cmdk';
  cmdk.innerHTML = '<div class="cmdk-box"><div class="cmdk-in"><img src="assets/img/mark-lime.svg" alt=""><input type="text" placeholder="Cerca una pagina, un progetto, un\'azione…" aria-label="Comando"><kbd>ESC</kbd></div><div class="cmdk-list"></div></div>';
  document.body.appendChild(cmdk);
  const cInput = cmdk.querySelector('input'), cList = cmdk.querySelector('.cmdk-list');
  let sel = 0, filtered = NAV;
  function render() {
    cList.innerHTML = filtered.map((it, i) => `<div class="cmdk-item${i === sel ? ' sel' : ''}" data-a="${it.a}"><span class="ci-k">${it.k}</span>${it.t}<span class="ci-arr">↵</span></div>`).join('');
  }
  function openCmd() { cmdk.classList.add('on'); cInput.value = ''; filtered = NAV; sel = 0; render(); setTimeout(() => cInput.focus(), 50); if (lenis) lenis.stop(); }
  function closeCmd() { cmdk.classList.remove('on'); if (lenis) lenis.start(); }
  function go(a) { closeCmd(); if (a.startsWith('mailto:')) location.href = a; else if (window.__pageOut) window.__pageOut(a); else location.href = a; }
  cInput.addEventListener('input', () => {
    const q = cInput.value.toLowerCase().trim();
    filtered = q ? NAV.filter(n => (n.t + ' ' + n.k).toLowerCase().includes(q)) : NAV;
    sel = 0; render();
  });
  cmdk.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, filtered.length - 1); render(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); render(); }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[sel]) go(filtered[sel].a); }
  });
  cList.addEventListener('click', e => { const it = e.target.closest('.cmdk-item'); if (it) go(it.dataset.a); });
  cmdk.addEventListener('click', e => { if (e.target === cmdk) closeCmd(); });
  addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); cmdk.classList.contains('on') ? closeCmd() : openCmd(); }
    else if (e.key === 'Escape' && cmdk.classList.contains('on')) closeCmd();
  });
  // hint chip nella nav
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    const hint = document.createElement('button');
    hint.className = 'kbd-hint'; hint.type = 'button';
    hint.innerHTML = (navigator.platform.includes('Mac') ? '⌘' : 'Ctrl') + ' K';
    hint.setAttribute('aria-label', 'Apri ricerca rapida');
    hint.addEventListener('click', openCmd);
    navLinks.insertBefore(hint, navLinks.querySelector('.nav-cta'));
  }

  /* ---------- 3. Copy email ---------- */
  document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
    a.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey) return;
      const mail = a.getAttribute('href').replace('mailto:', '').split('?')[0];
      if (navigator.clipboard) { e.preventDefault(); navigator.clipboard.writeText(mail).then(() => toast('Email copiata')); }
    });
  });

  /* ---------- 4. Tab-blur title ---------- */
  const origTitle = document.title;
  addEventListener('blur', () => { document.title = '● Torna da noi — Connexa'; });
  addEventListener('focus', () => { document.title = origTitle; });

  /* ---------- 5. Time-aware greeting ---------- */
  const tl = document.querySelector('.c-tl');
  if (tl) {
    const h = new Date().getHours();
    const g = h < 6 ? 'Ancora svegli?' : h < 13 ? 'Buongiorno' : h < 19 ? 'Buon pomeriggio' : 'Buonasera';
    tl.innerHTML = g + '<br>Creative Studio';
  }

  /* ---------- 6. Cursor spotlight (hero) ---------- */
  if (hasHover && !reduced) {
    const spot = document.createElement('div'); spot.className = 'spot';
    const hero = document.querySelector('.hero') || document.querySelector('.case-hero') || document.querySelector('.page-hero');
    if (hero) {
      hero.appendChild(spot);
      hero.addEventListener('mousemove', e => {
        const r = hero.getBoundingClientRect();
        spot.style.left = (e.clientX - r.left) + 'px'; spot.style.top = (e.clientY - r.top) + 'px'; spot.style.opacity = '1';
      });
      hero.addEventListener('mouseleave', () => spot.style.opacity = '0');
    }
  }

  /* ---------- 7. Lime click ripple ---------- */
  if (!reduced) {
    addEventListener('pointerdown', e => {
      if (e.target.closest('input,textarea')) return;
      const r = document.createElement('div'); r.className = 'ripple';
      r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px'; r.style.width = r.style.height = '0px';
      document.body.appendChild(r);
      r.animate([{ width: '0px', height: '0px', opacity: .8 }, { width: '80px', height: '80px', opacity: 0 }], { duration: 550, easing: 'cubic-bezier(.32,.72,0,1)' }).onfinish = () => r.remove();
    });
  }

  /* ---------- 8. Konami → confetti lime ---------- */
  const KON = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let ki = 0;
  addEventListener('keydown', e => {
    ki = (e.key === KON[ki] || e.key.toLowerCase() === KON[ki]) ? ki + 1 : 0;
    if (ki === KON.length) { ki = 0; confetti(); }
  });
  function confetti() {
    for (let i = 0; i < 80; i++) {
      const c = document.createElement('div');
      c.style.cssText = 'position:fixed;z-index:9999;width:10px;height:10px;background:' + (i % 3 ? '#c8f504' : '#fff') + ';left:50%;top:40%;pointer-events:none';
      document.body.appendChild(c);
      c.animate([
        { transform: 'translate(0,0) rotate(0)', opacity: 1 },
        { transform: `translate(${(Math.random() - .5) * 900}px,${(Math.random() - .3) * 900}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
      ], { duration: 1400 + Math.random() * 800, easing: 'cubic-bezier(.15,.8,.3,1)' }).onfinish = () => c.remove();
    }
    toast('Restiamo connessi 🟢');
  }

  /* ---------- 9. Deep-link su heading ---------- */
  let hid = 0;
  document.querySelectorAll('.sec-head h2, .csec .cnum h2').forEach(h => {
    if (!h.id) h.id = 'sec-' + (++hid);
    const a = document.createElement('a'); a.className = 'deep'; a.href = '#' + h.id; a.textContent = '#'; a.setAttribute('aria-label', 'Copia link a questa sezione');
    a.addEventListener('click', e => {
      e.preventDefault();
      const url = location.origin + location.pathname + '#' + h.id;
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => toast('Link copiato'));
    });
    h.insertBefore(a, h.firstChild);
  });

  /* ---------- 11. Back-to-top progress ring ---------- */
  const totop = document.querySelector('.totop');
  if (totop) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 60 60'); svg.innerHTML = '<circle cx="30" cy="30" r="27"></circle>';
    totop.appendChild(svg);
    const circ = svg.querySelector('circle'), C = 2 * Math.PI * 27; circ.style.strokeDasharray = C;
    addEventListener('scroll', () => {
      const p = scrollY / (document.documentElement.scrollHeight - innerHeight || 1);
      circ.style.strokeDashoffset = C * (1 - p);
    }, { passive: true });
  }

  /* ---------- 15. Copia link progetto (case pages) ---------- */
  const cnav = document.querySelector('.cnav, .cnext');
  if (cnav && document.querySelector('.case-hero')) {
    const share = document.createElement('button');
    share.className = 'btn btn-ghost magnetic';
    share.style.cssText = 'margin:clamp(40px,7vh,80px) auto 0;display:flex';
    share.innerHTML = '<span class="lbl">Condividi questo progetto</span> <span class="arr">↗</span>';
    share.addEventListener('click', () => {
      const url = location.href;
      if (navigator.share) navigator.share({ title: document.title, url }).catch(() => {});
      else if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => toast('Link del progetto copiato'));
    });
    cnav.parentNode.insertBefore(share, cnav);
  }
})();
