/* Connexa Studios — shared runtime */
gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = matchMedia('(max-width: 900px)').matches;
const hasHover = matchMedia('(hover:hover)').matches;
document.documentElement.classList.remove('no-js');

/* ---------- Lenis smooth scroll ---------- */
let lenis = null;
if (!reduced && typeof Lenis !== 'undefined') {
  lenis = new Lenis(isMobile
    ? { syncTouch: true, syncTouchLerp: .08, touchMultiplier: 1.2 }
    : { duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
window.__lenis = lenis;

/* ---------- Page transition curtain ---------- */
const curtain = document.createElement('div');
curtain.className = 'curtain';
curtain.innerHTML = '<div class="c2"></div><div class="c1"></div><div class="c-logo"><img src="assets/img/mark-lime.svg" alt=""></div>';
document.body.appendChild(curtain);
const c1 = curtain.querySelector('.c1'), c2 = curtain.querySelector('.c2'), cl = curtain.querySelector('.c-logo');

function pageIn() {
  if (reduced) return;
  gsap.set([c1, c2], { scaleY: 1, transformOrigin: 'top' });
  gsap.set(cl, { opacity: 1 });
  const tl = gsap.timeline();
  tl.to(cl, { opacity: 0, duration: .3, ease: 'power2.out' })
    .to(c2, { scaleY: 0, duration: .7, ease: 'power4.inOut' }, .05)
    .to(c1, { scaleY: 0, duration: .7, ease: 'power4.inOut' }, .17);
}
function pageOut(href) {
  if (reduced) { location.href = href; return; }
  gsap.set([c1, c2], { scaleY: 0, transformOrigin: 'bottom' });
  const tl = gsap.timeline({ onComplete: () => location.href = href });
  tl.to(c1, { scaleY: 1, duration: .55, ease: 'power4.inOut' })
    .to(c2, { scaleY: 1, duration: .55, ease: 'power4.inOut' }, .12)
    .fromTo(cl, { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .4, ease: 'back.out(2)' }, .4);
}
document.addEventListener('click', e => {
  const a = e.target.closest('a');
  if (!a) return;
  const href = a.getAttribute('href') || '';
  if (a.target === '_blank' || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return;
  e.preventDefault();
  pageOut(href);
});
window.__pageOut = pageOut;
window.addEventListener('pageshow', e => { if (e.persisted) gsap.set([c1, c2], { scaleY: 0 }); });

/* ---------- Custom cursor ---------- */
const cursor = document.createElement('div');
cursor.className = 'cursor';
cursor.innerHTML = '<span class="cur-lbl">Apri</span>';
document.body.appendChild(cursor);
if (hasHover) {
  const cx = gsap.quickTo(cursor, 'x', { duration: .35, ease: 'power3.out' });
  const cy = gsap.quickTo(cursor, 'y', { duration: .35, ease: 'power3.out' });
  window.addEventListener('mousemove', e => { cx(e.clientX); cy(e.clientY); });
  const bindCursor = () => {
    document.querySelectorAll('a,button,.gxpand').forEach(el => {
      if (el.dataset.cb) return; el.dataset.cb = 1;
      el.addEventListener('mouseenter', () => cursor.classList.add(el.classList.contains('pitem') || el.closest('.pitem') ? 'view' : 'grow'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('grow', 'view'));
    });
    document.querySelectorAll('.pitem').forEach(el => {
      if (el.dataset.cv) return; el.dataset.cv = 1;
      el.addEventListener('mouseenter', () => cursor.classList.add('view'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('view'));
    });
  };
  bindCursor();
}

/* ---------- Magnetic ---------- */
if (hasHover && !reduced) {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .5, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.4)' }));
  });
}

/* ---------- Nav ---------- */
const nav = document.getElementById('nav');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = scrollY;
  nav.classList.toggle('scrolled', y > 40);
  nav.classList.toggle('hide', y > 400 && y > lastY);
  lastY = y;
}, { passive: true });
const burger = document.getElementById('burger'), menu = document.getElementById('mobileMenu');
if (burger && menu) {
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    if (lenis) { open ? lenis.stop() : lenis.start(); }
    document.body.style.overflow = open ? 'hidden' : '';
  });
}

/* ---------- Text scramble on nav hover ---------- */
if (hasHover && !reduced) {
  const CH = '#@%&XO+=/';
  document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(a => {
    const orig = a.textContent;
    let iv;
    a.addEventListener('mouseenter', () => {
      let i = 0; clearInterval(iv);
      iv = setInterval(() => {
        a.textContent = orig.split('').map((c, j) => j < i ? c : CH[Math.random() * CH.length | 0]).join('');
        if (++i > orig.length) { clearInterval(iv); a.textContent = orig; }
      }, 28);
    });
  });
}

/* ---------- Smooth anchors ---------- */
if (lenis) {
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -70 }); }
  }));
}

/* ---------- Reveals ---------- */
document.querySelectorAll('.rv').forEach(el => {
  gsap.to(el, { opacity: 1, y: 0, duration: isMobile ? .9 : 1.1, ease: 'power4.out', scrollTrigger: { trigger: el, start: isMobile ? 'top 92%' : 'top 88%' } });
});
// tiles: entrata a cascata
const tilesEls = gsap.utils.toArray('.tiles .tile');
if (tilesEls.length && !reduced) {
  gsap.set(tilesEls, { opacity: 0, y: 40 });
  ScrollTrigger.batch(tilesEls, { start: 'top 90%', onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: .8, stagger: .12, ease: 'power3.out' }) });
}
document.querySelectorAll('.split').forEach(h => {
  const html = h.innerHTML;
  h.innerHTML = '<span style="display:block;overflow:hidden"><span class="split-in" style="display:block">' + html + '</span></span>';
});
document.querySelectorAll('.split-in').forEach(el => {
  gsap.from(el, { yPercent: 110, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
});

/* ---------- Page-hero line intro ---------- */
const phLines = document.querySelectorAll('.page-hero .ln>span');
if (phLines.length && !reduced) {
  gsap.set(phLines, { yPercent: 115 });
  gsap.to(phLines, { yPercent: 0, duration: 1.2, stagger: .1, ease: 'power4.out', delay: .55 });
}
const caseLines = document.querySelectorAll('.case-hero .ln>span');
if (caseLines.length && !reduced) {
  gsap.set(caseLines, { yPercent: 115 });
  gsap.to(caseLines, { yPercent: 0, duration: 1.2, stagger: .1, ease: 'power4.out', delay: .55 });
}

/* ---------- Marquee (scroll-velocity reactive) ---------- */
document.querySelectorAll('.marquee-track').forEach(track => {
  track.innerHTML += track.innerHTML + track.innerHTML;
  let x = 0; const base = reduced ? 0 : .6;
  gsap.ticker.add(() => {
    const vel = lenis ? Math.abs(lenis.velocity) : 0;
    x -= base + Math.min(vel * .06, 3);
    const w = track.scrollWidth / 3;
    if (-x >= w) x += w;
    track.style.transform = 'translateX(' + x + 'px)';
  });
});

/* ---------- Counters ---------- */
document.querySelectorAll('.count').forEach(el => {
  const to = parseFloat(el.dataset.to), dec = el.dataset.dec ? +el.dataset.dec : 0;
  ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter() {
    gsap.to({ v: 0 }, { v: to, duration: 1.8, ease: 'power3.out', onUpdate() { el.textContent = this.targets()[0].v.toFixed(dec).replace('.', ','); } });
  }});
});

/* ---------- Method light-up ---------- */
const mthSteps = document.querySelectorAll('.mth-step');
if (mthSteps.length) {
  mthSteps.forEach(s => ScrollTrigger.create({ trigger: s, start: 'top 75%', onEnter: () => s.classList.add('lit') }));
  const bar = document.querySelector('.mth-progress i');
  if (bar) gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.mth-steps', start: 'top 80%', end: 'bottom 40%', scrub: true } });
}

/* ---------- Lime highlight sweep ---------- */
document.querySelectorAll('.cta-band h2, .lit-on-scroll').forEach(el => {
  ScrollTrigger.create({ trigger: el, start: 'top 75%', onEnter: () => el.classList.add('lit') });
});

/* ---------- Image parallax (case pages, founders) ---------- */
document.querySelectorAll('.chero-img img, .cgal img, .founder .fimg img').forEach(img => {
  gsap.fromTo(img, { yPercent: -8 }, { yPercent: 2, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
});

/* ---------- Project index hover preview ---------- */
const plist = document.querySelector('.plist');
if (plist && hasHover) {
  const prev = document.createElement('div');
  prev.className = 'preview';
  const items = plist.querySelectorAll('.pitem[data-img]');
  items.forEach(it => {
    const im = document.createElement('img');
    im.src = it.dataset.img; im.alt = '';
    prev.appendChild(im);
    it._img = im;
  });
  document.body.appendChild(prev);
  const px = gsap.quickTo(prev, 'x', { duration: .6, ease: 'power3.out' });
  const py = gsap.quickTo(prev, 'y', { duration: .6, ease: 'power3.out' });
  let active = null;
  plist.addEventListener('mousemove', e => { px(e.clientX + 30); py(e.clientY - 140); });
  items.forEach(it => {
    it.addEventListener('mouseenter', () => {
      if (active) active.classList.remove('on');
      active = it._img; active.classList.add('on');
      gsap.to(prev, { opacity: 1, scale: 1, duration: .5, ease: 'power3.out' });
    });
    it.addEventListener('mouseleave', () => {
      gsap.to(prev, { opacity: 0, scale: .9, duration: .4, ease: 'power3.out' });
    });
  });
}

/* ---------- Footer clock (Europe/Rome) + big text drift ---------- */
const clock = document.getElementById('ftClock');
if (clock) {
  const tick = () => {
    const now = new Date().toLocaleTimeString('it-IT', { timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const h = +new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome', hour: '2-digit', hour12: false });
    clock.innerHTML = 'Sarno, Italia — ' + now + ' · <b>' + (h >= 9 && h < 19 ? 'Studio aperto' : 'Studio chiuso') + '</b>';
  };
  tick(); setInterval(tick, 1000);
}
const ftBig = document.querySelector('.ft-big');
if (ftBig) gsap.fromTo(ftBig, { xPercent: 5 }, { xPercent: -5, ease: 'none', scrollTrigger: { trigger: 'footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });

/* ---------- Contact form floating labels ---------- */
document.querySelectorAll('.field input, .field textarea').forEach(inp => {
  inp.addEventListener('input', () => inp.closest('.field').classList.toggle('filled', !!inp.value));
});

/* ---------- Film grain ---------- */
{
  const g = document.createElement('div');
  g.className = 'grain';
  g.style.animation = 'none';
  g.style.inset = '0';
  document.body.appendChild(g);
}

/* ---------- Scrubbed word-reveal (manifesto) ---------- */
document.querySelectorAll('.manifesto').forEach(el => {
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(tk => {
          if (/^\s+$/.test(tk) || tk === '') { frag.appendChild(document.createTextNode(tk)); return; }
          const s = document.createElement('span');
          s.className = 'w'; s.textContent = tk;
          frag.appendChild(s);
        });
        node.replaceChild(frag, n);
      } else if (n.nodeType === 1) walk(n);
    });
  };
  walk(el);
  const words = el.querySelectorAll('.w');
  gsap.to(words, {
    opacity: 1, stagger: .05, ease: 'none',
    scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 55%', scrub: .4 }
  });
});

/* ---------- Work gallery: pinned horizontal on desktop ---------- */
const hwork2 = document.querySelector('.hwork');
if (hwork2 && !reduced) {
  hwork2.classList.add('pinned');
  const track2 = hwork2.querySelector('.hwork-track');
  const bar2 = hwork2.querySelector('.hwork-progress i');
  const dist2 = () => Math.max(track2.scrollWidth - innerWidth, 0);
  gsap.to(track2, {
    x: () => -dist2(), ease: 'none',
    scrollTrigger: {
      trigger: hwork2, start: 'top top', end: () => '+=' + dist2(),
      pin: true, scrub: .7, invalidateOnRefresh: true, anticipatePin: 1,
      onUpdate: self => { if (bar2) bar2.style.transform = 'scaleX(' + self.progress + ')'; }
    }
  });
}

/* ---------- Image scale-in on enter ---------- */
document.querySelectorAll('.chero-img, .cgal .g, .founder .fimg').forEach(box => {
  if (reduced) return;
  gsap.fromTo(box, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power4.inOut',
    scrollTrigger: { trigger: box, start: 'top 85%' } });
  const im = box.querySelector('img');
  if (im) gsap.fromTo(im, { scale: 1.25 }, { scale: 1, duration: 1.4, ease: 'power3.out',
    scrollTrigger: { trigger: box, start: 'top 85%' } });
});
// citazioni dei casi: wipe laterale
document.querySelectorAll('.cquote').forEach(q => {
  if (reduced) return;
  gsap.fromTo(q, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power4.inOut',
    scrollTrigger: { trigger: q, start: 'top 82%' } });
});

/* ---------- Scroll progress bar ---------- */
(() => {
  const sp = document.createElement('div');
  sp.className = 'sprog'; sp.innerHTML = '<i></i>';
  document.body.appendChild(sp);
  const bar = sp.firstChild;
  ScrollTrigger.create({
    start: 0, end: () => document.documentElement.scrollHeight - innerHeight,
    onUpdate: self => bar.style.transform = 'scaleX(' + self.progress + ')'
  });
})();

/* ---------- Diagonal kinetic band: scroll-driven opposite rows ---------- */
document.querySelectorAll('.diag .row').forEach(row => {
  const dir = +row.dataset.dir || 1;
  const from = dir > 0 ? 0 : -10, to = dir > 0 ? -10 : 0;
  gsap.fromTo(row, { xPercent: from }, { xPercent: to, ease: 'none',
    scrollTrigger: { trigger: row.closest('.diag'), start: 'top bottom', end: 'bottom top', scrub: .4 } });
});

/* ---------- Scramble hover on big words ---------- */
if (hasHover && !reduced) {
  const CH2 = 'XO#%&@+=/';
  document.querySelectorAll('[data-scramble]').forEach(a => {
    const orig = a.textContent; let iv2;
    a.addEventListener('mouseenter', () => {
      let i = 0; clearInterval(iv2);
      iv2 = setInterval(() => {
        a.textContent = orig.split('').map((c, j) => j < i ? c : CH2[Math.random() * CH2.length | 0]).join('');
        if (++i > orig.length) { clearInterval(iv2); a.textContent = orig; }
      }, 34);
    });
  });
}

/* ---------- Hero wordmark: split & sink on scroll ---------- */
const wmk = document.querySelector('.wordmark');
if (wmk && !reduced) {
  const l1 = wmk.querySelector('.wm.solid'), l2 = wmk.querySelector('.wm.limef') || wmk.querySelector('.wm.ghost');
  const amp = isMobile ? 3 : 7;
  const st = { trigger: '.hero', start: 'top top', end: 'bottom 40%', scrub: .5 };
  if (l1) gsap.to(l1, { xPercent: -amp, ease: 'none', scrollTrigger: st });
  if (l2) gsap.to(l2, { xPercent: amp * .8, ease: 'none', scrollTrigger: st });
}

/* ---------- Lime band pattern: marches with scroll ---------- */
const cpat = document.querySelector('.cpattern');
if (cpat && !reduced) {
  gsap.fromTo(cpat, { x: 60 }, { x: -60, ease: 'none',
    scrollTrigger: { trigger: cpat, start: 'top bottom', end: 'bottom top', scrub: .4 } });
  gsap.from(cpat.querySelectorAll('img'), { yPercent: 60, opacity: 0, stagger: .05, duration: .7, ease: 'power3.out',
    scrollTrigger: { trigger: cpat, start: 'top 90%' } });
}

/* ---------- Section heading parallax ---------- */
if (!reduced) {
  document.querySelectorAll('.ghostn').forEach(g => {
    gsap.fromTo(g, { yPercent: -35 }, { yPercent: -65, ease: 'none',
      scrollTrigger: { trigger: g.closest('.svc-row'), start: 'top bottom', end: 'bottom top', scrub: .6 } });
  });
}

/* ---------- Hero mark: float + scroll rotation ---------- */
const hm = document.querySelector('.hero-mark');
if (hm && !reduced) {
  gsap.to(hm, { y: -24, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to(hm, { rotate: 28, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .5 } });
  if (hasHover) {
    window.addEventListener('mousemove', e => {
      const dx = (e.clientX / innerWidth - .5), dy = (e.clientY / innerHeight - .5);
      gsap.to(hm, { x: dx * 30, duration: 1.2, ease: 'power2.out' });
    });
  }
}

/* ---------- Safety net: reveal anything stuck hidden ---------- */
setInterval(() => {
  document.querySelectorAll('.rv').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight * .98 && r.bottom > 0 && +getComputedStyle(el).opacity < .05) {
      gsap.to(el, { opacity: 1, y: 0, duration: .6, ease: 'power2.out' });
    }
  });
  document.querySelectorAll('.split-in').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight * .98 && r.bottom > 0) {
      const m = new DOMMatrixReadOnly(getComputedStyle(el).transform === 'none' ? undefined : getComputedStyle(el).transform);
      if (Math.abs(m.m42) > r.height * .5) gsap.to(el, { yPercent: 0, y: 0, duration: .6, ease: 'power2.out' });
    }
  });
}, 1500);

/* ---------- Stacked cards: la carta sotto si schiaccia mentre arriva la successiva ---------- */
const scards = gsap.utils.toArray('.scard');
if (scards.length && !reduced) {
  scards.forEach((card, i) => {
    if (i === scards.length - 1) return;
    const next = scards[i + 1];
    const shade = document.createElement('div');
    shade.style.cssText = 'position:absolute;inset:0;background:#000;opacity:0;pointer-events:none;z-index:5';
    card.appendChild(shade);
    gsap.to(card, { scale: .92, transformOrigin: 'center top', ease: 'none',
      scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true } });
    gsap.to(shade, { opacity: .5, ease: 'none',
      scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true } });
  });
}

/* ---------- Gridlines globali ---------- */
if (!document.querySelector('.gridlines')) {
  const gl = document.createElement('div');
  gl.className = 'gridlines'; gl.setAttribute('aria-hidden', 'true');
  gl.innerHTML = '<i></i><i></i><i></i><i></i><i></i>';
  document.body.prepend(gl);
}

/* ---------- FAQ accordion ---------- */
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q'), a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const open = item.classList.toggle('open');
    a.style.maxHeight = open ? a.scrollHeight + 'px' : 0;
    document.querySelectorAll('.faq-item.open').forEach(o => {
      if (o !== item) { o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = 0; }
    });
  });
});

/* ---------- Back to top ---------- */
(() => {
  const b = document.createElement('button');
  b.className = 'totop'; b.innerHTML = '↑'; b.setAttribute('aria-label', 'Torna su');
  b.classList.add('magnetic');
  document.body.appendChild(b);
  window.addEventListener('scroll', () => b.classList.toggle('on', scrollY > innerHeight * 1.5), { passive: true });
  b.addEventListener('click', () => lenis ? lenis.scrollTo(0) : scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ---------- Easter egg: 5 click sul logo ---------- */
(() => {
  const logo = document.querySelector('nav .logo');
  if (!logo) return;
  let n = 0, t, nav;
  logo.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    n++; clearTimeout(t); clearTimeout(nav);
    t = setTimeout(() => n = 0, 1500);
    if (n < 5) {
      // click normale: naviga solo se non arrivano altri click
      nav = setTimeout(() => { if (n < 5) pageOut('index.html'); }, 400);
      return;
    }
    {
      n = 0;
      const f = document.createElement('div');
      f.style.cssText = 'position:fixed;inset:0;z-index:5000;background:#c8f504;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:18px';
      f.innerHTML = '<img src="assets/img/mark-black.svg" style="height:90px"><div style="font-family:Encode Sans,sans-serif;font-weight:800;font-size:clamp(28px,5vw,64px);color:#0b0b0b;text-transform:uppercase;letter-spacing:-.02em">Restiamo connessi</div>';
      document.body.appendChild(f);
      gsap.from(f, { clipPath: 'circle(0% at 50% 50%)', duration: .6, ease: 'power4.out' });
      setTimeout(() => gsap.to(f, { opacity: 0, duration: .5, onComplete: () => f.remove() }), 1600);
    }
  });
})();

/* ---------- Report bars: riempimento allo scroll ---------- */
document.querySelectorAll('[data-report]').forEach(rep => {
  ScrollTrigger.create({ trigger: rep, start: 'top 75%', once: true, onEnter() {
    rep.querySelectorAll('.rbar').forEach((b, i) => setTimeout(() => b.classList.add('on'), 200 + i * 220));
  }});
});

/* ---------- hero-mark tilt allo scroll ---------- */
(function(){
  const hm=document.querySelector('.hero-mark');
  if(hm && !reduced){ gsap.to(hm,{rotate:18,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.6}}); }
})();

/* ---------- Cookie consent (GDPR / Garante) ---------- */
(function(){
  const KEY='cx-consent';
  function loadClarity(){
    if(window.__clarityLoaded)return; window.__clarityLoaded=1;
    (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","qb8j9a9cid");
  }
  let cc=null;
  function showBanner(){
    if(cc)return;
    cc=document.createElement('div');
    cc.className='cc'; cc.setAttribute('role','dialog'); cc.setAttribute('aria-label','Consenso cookie');
    cc.innerHTML='<div class="cc-inner"><h4><img src="assets/img/mark-lime.svg" alt="">Cookie &amp; Privacy</h4><p>Usiamo cookie tecnici necessari al funzionamento del sito e, solo con il tuo consenso, cookie analitici (Microsoft Clarity) per capire come viene usato il sito in forma aggregata. Leggi la <a href="/cookie-policy">Cookie Policy</a> e la <a href="/privacy-policy">Privacy Policy</a>.</p><div class="cc-btns"><button class="cc-acc">Accetta</button><button class="cc-rej">Rifiuta</button></div></div>';
    document.body.appendChild(cc);
    requestAnimationFrame(()=>requestAnimationFrame(()=>cc.classList.add('on')));
    const close=v=>{ localStorage.setItem(KEY,v); cc.classList.remove('on'); const el=cc; cc=null; setTimeout(()=>el.remove(),600); if(v==='accept')loadClarity(); else if(window.__clarityLoaded)location.reload(); };
    cc.querySelector('.cc-acc').addEventListener('click',()=>close('accept'));
    cc.querySelector('.cc-rej').addEventListener('click',()=>close('reject'));
  }
  const saved=localStorage.getItem(KEY);
  if(saved==='accept'){ loadClarity(); }
  else if(saved!=='reject'){ showBanner(); }
  // revoca/modifica consenso dal footer ("Gestisci cookie")
  document.addEventListener('click',e=>{ const m=e.target.closest('[data-cc-manage]'); if(m){ e.preventDefault(); showBanner(); } });
})();

/* ---------- Run page-in ---------- */
window.addEventListener('load', () => { ScrollTrigger.refresh(); });
pageIn();
