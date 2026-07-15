/* Connexa Studios — WOW pack 2 (altre 20 chicche) */
(function () {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasHover = matchMedia('(hover:hover)').matches;
  const nav = document.getElementById('nav');
  const isLime = c => c === 'rgb(200, 245, 4)';

  /* ---------- 1. Contrast-aware nav (invert su sezioni lime) ---------- */
  if (nav) {
    let raf;
    addEventListener('scroll', () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const els = document.elementsFromPoint(innerWidth / 2, 30);
        let lime = false;
        for (const el of els) { if (isLime(getComputedStyle(el).backgroundColor)) { lime = true; break; } if (el === nav) continue; }
        nav.classList.toggle('invert', lime);
      });
    }, { passive: true });
  }

  /* ---------- 2. Sound design (Web Audio, off default) ---------- */
  let AC, sndOn = localStorage.getItem('cx-snd') === '1';
  function blip(freq, dur, type, vol) {
    if (!sndOn) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = type || 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(vol || .04, AC.currentTime);
      g.gain.exponentialRampToValueAtTime(.0001, AC.currentTime + (dur || .08));
      o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + (dur || .08));
    } catch (e) {}
  }
  const nl = document.querySelector('.nav-links');
  if (nl) {
    const btn = document.createElement('button');
    btn.className = 'snd' + (sndOn ? ' on' : ''); btn.type = 'button'; btn.setAttribute('aria-label', 'Suoni interfaccia');
    btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path class="w" d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14"/></svg>';
    btn.addEventListener('click', () => { sndOn = !sndOn; localStorage.setItem('cx-snd', sndOn ? '1' : '0'); btn.classList.toggle('on', sndOn); if (sndOn) blip(660, .1, 'triangle', .06); });
    nl.insertBefore(btn, nl.querySelector('.nav-cta'));
    document.querySelectorAll('a,button').forEach(el => {
      el.addEventListener('mouseenter', () => blip(880, .05, 'sine', .02));
    });
    addEventListener('pointerdown', () => blip(440, .07, 'triangle', .035));
  }

  /* ---------- 3. Hero mouse parallax ---------- */
  if (hasHover && !reduced) {
    const hero = document.querySelector('.hero');
    if (hero) {
      const layers = [
        { el: hero.querySelector('.hero-mark'), d: 40 },
        { el: hero.querySelector('.rotor'), d: 24 },
        { el: hero.querySelector('.wordmark'), d: -12 },
      ].filter(l => l.el);
      hero.addEventListener('mousemove', e => {
        const dx = (e.clientX / innerWidth - .5), dy = (e.clientY / innerHeight - .5);
        layers.forEach(l => { l.el.style.transform = (l.el.style.transform.replace(/translate\([^)]*\)/, '') + ` translate(${dx * l.d}px,${dy * l.d}px)`); });
      });
    }
  }

  /* ---------- 4. Concept gallery 3D tilt ---------- */
  if (hasHover && !reduced && window.gsap) {
    document.querySelectorAll('.cgcard').forEach(c => {
      c.style.transformStyle = 'preserve-3d';
      c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect();
        gsap.to(c, { rotateY: ((e.clientX - r.left) / r.width - .5) * 12, rotateX: -((e.clientY - r.top) / r.height - .5) * 12, duration: .5, ease: 'power3.out', transformPerspective: 800 });
      });
      c.addEventListener('mouseleave', () => gsap.to(c, { rotateX: 0, rotateY: 0, duration: .8, ease: 'elastic.out(1,.5)' }));
    });
  }

  /* ---------- 5. Idle screensaver ---------- */
  if (!reduced) {
    const saver = document.createElement('div');
    saver.className = 'saver';
    saver.innerHTML = '<img src="assets/img/mark-lime.svg" alt=""><span class="st">Muovi per tornare</span>';
    document.body.appendChild(saver);
    let idle;
    const reset = () => { saver.classList.remove('on'); clearTimeout(idle); idle = setTimeout(() => saver.classList.add('on'), 45000); };
    ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'].forEach(ev => addEventListener(ev, reset, { passive: true }));
    saver.addEventListener('click', reset); reset();
  }

  /* ---------- 7. Reading time (case studies) ---------- */
  const cbody = document.querySelectorAll('.cbody');
  if (cbody.length) {
    const words = [...cbody].reduce((n, el) => n + el.textContent.trim().split(/\s+/).length, 0);
    const min = Math.max(1, Math.round(words / 200));
    const meta = document.querySelector('.cmeta');
    if (meta) { const d = document.createElement('div'); d.className = 'readt'; d.innerHTML = '<b>' + min + ' min</b> di lettura'; meta.parentNode.insertBefore(d, meta.nextSibling); }
  }

  /* ---------- 8. Select-to-share ---------- */
  if (hasHover) {
    const bub = document.createElement('div'); bub.className = 'selshare'; bub.textContent = '↗ Condividi'; document.body.appendChild(bub);
    document.addEventListener('mouseup', () => {
      setTimeout(() => {
        const s = getSelection(); const txt = s.toString().trim();
        if (txt.length > 12) {
          const r = s.getRangeAt(0).getBoundingClientRect();
          bub.style.left = (r.left + r.width / 2 - 55) + 'px'; bub.style.top = (r.top - 46) + 'px';
          bub.classList.add('on');
          bub.onclick = () => { const q = '“' + txt + '” — ' + location.href; if (navigator.clipboard) navigator.clipboard.writeText(q); bub.classList.remove('on'); if (window.__toast) window.__toast('Citazione copiata'); };
        } else bub.classList.remove('on');
      }, 10);
    });
    document.addEventListener('mousedown', e => { if (!e.target.closest('.selshare')) bub.classList.remove('on'); });
  }

  /* ---------- 9+10+20. Keyboard: / palette, g+key nav, ? help, t top ---------- */
  const cmdk = document.querySelector('.cmdk');
  let gMode = false, gT;
  addEventListener('keydown', e => {
    if (e.target.matches('input,textarea')) return;
    if (e.key === '/' && cmdk) { e.preventDefault(); cmdk.classList.add('on'); const i = cmdk.querySelector('input'); if (i) setTimeout(() => i.focus(), 50); if (window.__lenis) window.__lenis.stop(); }
    else if (e.key === '?') { toggleHelp(); }
    else if (e.key === 't' && !gMode) { (window.__lenis ? window.__lenis.scrollTo(0) : scrollTo({ top: 0, behavior: 'smooth' })); }
    else if (e.key.toLowerCase() === 'g') { gMode = true; clearTimeout(gT); gT = setTimeout(() => gMode = false, 900); }
    else if (gMode) {
      const map = { p: '/progetti', c: '/contatti', s: '/servizi', h: '/', a: '/chi-siamo' };
      const dest = map[e.key.toLowerCase()];
      if (dest) { gMode = false; window.__pageOut ? window.__pageOut(dest) : location.href = dest; }
    }
  });

  /* ---------- 11. Section indicator ---------- */
  const secs = document.querySelectorAll('section, header');
  if (secs.length > 3) {
    const ind = document.createElement('div'); ind.className = 'secind'; ind.innerHTML = '<b>01</b> / ' + String(secs.length).padStart(2, '0'); document.body.appendChild(ind);
    let raf2;
    addEventListener('scroll', () => {
      if (raf2) return;
      raf2 = requestAnimationFrame(() => {
        raf2 = null; let cur = 1;
        secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * .5) cur = i + 1; });
        ind.innerHTML = '<b>' + String(cur).padStart(2, '0') + '</b> / ' + String(secs.length).padStart(2, '0');
        ind.classList.toggle('on', scrollY > innerHeight * .6);
      });
    }, { passive: true });
  }

  /* ---------- 13. Grana reattiva alla velocità ---------- */
  const grain = document.querySelector('.grain');
  if (grain && window.__lenis && !reduced) {
    gsap.ticker.add(() => {
      const v = Math.min(Math.abs(window.__lenis.velocity) * .006, .14);
      grain.style.opacity = (.05 + v).toFixed(3);
    });
  }

  /* ---------- 14. Triple-click → grid overlay ---------- */
  const gm = document.createElement('div');
  gm.className = 'gridmode';
  gm.innerHTML = '<div class="wrap"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="gm-lbl">Grid Mode — 12 col</span>';
  document.body.appendChild(gm);
  let clicks = 0, ct;
  addEventListener('click', () => { clicks++; clearTimeout(ct); ct = setTimeout(() => clicks = 0, 500); if (clicks >= 3) { clicks = 0; gm.classList.toggle('on'); } });

  /* ---------- 18. Cursor label per sezione ---------- */
  const cur = document.querySelector('.cursor'), curLbl = cur && cur.querySelector('.cur-lbl');
  if (cur && curLbl && hasHover) {
    document.querySelectorAll('.hwork-track, .cgal-grid').forEach(z => {
      z.addEventListener('mouseenter', () => { curLbl.textContent = 'Trascina'; cur.classList.add('drag'); });
      z.addEventListener('mouseleave', () => { cur.classList.remove('drag'); });
    });
  }

  /* ---------- 20. Shortcuts help panel (?) ---------- */
  const help = document.createElement('div');
  help.className = 'shpanel';
  help.innerHTML = '<div class="shpanel-box"><h3><img src="assets/img/mark-lime.svg" alt="">Scorciatoie</h3>' +
    [['Ricerca rapida', ['⌘', 'K']], ['Ricerca rapida', ['/']], ['Vai a Progetti', ['G', 'P']], ['Vai a Contatti', ['G', 'C']], ['Vai a Servizi', ['G', 'S']], ['Home', ['G', 'H']], ['Torna su', ['T']], ['Griglia design', ['3× click']], ['Questa finestra', ['?']]]
      .map(r => '<div class="shrow"><span>' + r[0] + '</span><span class="keys">' + r[1].map(k => '<kbd>' + k + '</kbd>').join('') + '</span></div>').join('') +
    '</div>';
  document.body.appendChild(help);
  function toggleHelp() { help.classList.toggle('on'); }
  help.addEventListener('click', e => { if (e.target === help) help.classList.remove('on'); });
  addEventListener('keydown', e => { if (e.key === 'Escape') help.classList.remove('on'); });

  /* ---------- 15. Confetti su grazie ---------- */
  if (location.pathname.includes('grazie')) {
    setTimeout(() => {
      for (let i = 0; i < 90; i++) {
        const c = document.createElement('div');
        c.style.cssText = 'position:fixed;z-index:9999;width:11px;height:11px;background:' + (i % 3 ? '#c8f504' : '#fff') + ';left:' + (Math.random() * 100) + 'vw;top:-20px;pointer-events:none';
        document.body.appendChild(c);
        c.animate([{ transform: 'translateY(0) rotate(0)', opacity: 1 }, { transform: `translateY(110vh) rotate(${Math.random() * 720}deg)`, opacity: .8 }], { duration: 2600 + Math.random() * 1800, easing: 'cubic-bezier(.3,.6,.4,1)' }).onfinish = () => c.remove();
      }
    }, 600);
  }

  /* ---------- 16. Magnetic esteso a tutti i bottoni ---------- */
  if (hasHover && !reduced && window.gsap) {
    document.querySelectorAll('.btn:not(.magnetic), .cc-btns button').forEach(el => {
      el.addEventListener('mousemove', e => { const r = el.getBoundingClientRect(); gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * .2, y: (e.clientY - r.top - r.height / 2) * .3, duration: .5, ease: 'power3.out' }); });
      el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.4)' }));
    });
  }

  /* ---------- 17. Wordmark decrypt on load ---------- */
  const wm = document.querySelector('.wordmark .wm.solid');
  if (wm && !reduced && !sessionStorage.getItem('cx-decrypted')) {
    sessionStorage.setItem('cx-decrypted', '1');
    const orig = wm.textContent, CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#@%';
    let f = 0;
    const iv = setInterval(() => {
      wm.textContent = orig.split('').map((c, i) => i < f ? c : (c === ' ' ? ' ' : CH[Math.random() * CH.length | 0])).join('');
      if (f >= orig.length) { clearInterval(iv); wm.innerHTML = orig; }
      f += 0.5;
    }, 40);
  }

  // esponi toast dal pack 1
  window.__toast = window.__toast || function (m) { const e = document.querySelector('.toast'); if (e) { e.textContent = m; e.classList.add('on'); setTimeout(() => e.classList.remove('on'), 2000); } };
})();
