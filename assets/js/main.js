/* Connexa Studios — shared runtime */
gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = matchMedia('(max-width: 900px)').matches;
const hasHover = matchMedia('(hover:hover)').matches;
document.documentElement.classList.remove('no-js');

/* ---------- Lenis smooth scroll ---------- */
let lenis = null;
if (!reduced && typeof Lenis !== 'undefined') {
  lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------- Page transition curtain ---------- */
const curtain = document.createElement('div');
curtain.className = 'curtain';
curtain.innerHTML = '<div class="c2"></div><div class="c1"></div><div class="c-logo">Connexa<sup style="color:var(--lime);font-size:.5em">®</sup></div>';
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
    .to(cl, { opacity: 1, duration: .3 }, .4);
}
document.addEventListener('click', e => {
  const a = e.target.closest('a');
  if (!a) return;
  const href = a.getAttribute('href') || '';
  if (a.target === '_blank' || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return;
  e.preventDefault();
  pageOut(href);
});
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
  gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
});
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
if (!reduced) {
  const g = document.createElement('div');
  g.className = 'grain';
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
    opacity: 1, stagger: .06, ease: 'none',
    scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 45%', scrub: .4 }
  });
});

/* ---------- Horizontal pinned work gallery ---------- */
const hwork = document.querySelector('.hwork');
if (hwork && !isMobile && !reduced) {
  const track = hwork.querySelector('.hwork-track');
  const bar = hwork.querySelector('.hwork-progress i');
  const dist = () => track.scrollWidth - innerWidth;
  const tl = gsap.to(track, {
    x: () => -dist(), ease: 'none',
    scrollTrigger: {
      trigger: hwork, start: 'top top', end: () => '+=' + dist(),
      pin: true, scrub: .6, invalidateOnRefresh: true,
      onUpdate: self => { if (bar) bar.style.transform = 'scaleX(' + self.progress + ')'; }
    }
  });
  hwork.querySelectorAll('.hpanel .him img').forEach(img => {
    gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: 'none',
      scrollTrigger: { trigger: img.closest('.hpanel'), containerAnimation: tl, start: 'left right', end: 'right left', scrub: true } });
  });
}

/* ---------- Image scale-in on enter ---------- */
document.querySelectorAll('.chero-img, .cgal .g, .founder .fimg').forEach(box => {
  if (reduced) return;
  gsap.fromTo(box, { scale: .92, opacity: .4 }, { scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out',
    scrollTrigger: { trigger: box, start: 'top 85%' } });
});

/* ---------- 3D tilt on cards & images ---------- */
if (hasHover && !reduced) {
  document.querySelectorAll('.hpanel .him, .cgal .g, .chero-img, .product, .founder .fimg').forEach(el => {
    el.style.transformStyle = 'preserve-3d';
    el.style.perspective = '900px';
    const inner = el.querySelector('img') || el;
    let raf = null;
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const rx = -((e.clientY - r.top) / r.height - .5) * 7;
      const ry = ((e.clientX - r.left) / r.width - .5) * 9;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        gsap.to(el, { rotateX: rx, rotateY: ry, scale: 1.015, duration: .6, ease: 'power3.out', transformPerspective: 900 });
      });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, scale: 1, duration: .9, ease: 'elastic.out(1,.5)' });
    });
  });
}

/* ---------- Scroll-velocity skew (the page feels physical) ---------- */
if (!reduced && !isMobile) {
  const skewTargets = gsap.utils.toArray('.svc-row, .pitem, .stat, .value, .csec .cbody');
  const proxy = { skew: 0 };
  const skewSetter = gsap.quickSetter(skewTargets, 'skewY', 'deg');
  const clamp = gsap.utils.clamp(-4, 4);
  ScrollTrigger.create({
    onUpdate: self => {
      const skew = clamp(self.getVelocity() / -450);
      if (Math.abs(skew) > Math.abs(proxy.skew)) {
        proxy.skew = skew;
        gsap.to(proxy, { skew: 0, duration: .8, ease: 'power3', overwrite: true, onUpdate: () => skewSetter(proxy.skew) });
      }
    }
  });
}

/* ---------- Big heading chars float-in ---------- */
if (!reduced) {
  document.querySelectorAll('.case-hero h1 .ln>span, .page-hero h1 .ln>span').forEach(span => {
    // wrap chars for a subtle per-char settle
    const txt = span.innerHTML;
    if (span.querySelector('em')) return; // keep markup-safe lines intact
    span.innerHTML = txt.split('').map(c => c === ' ' ? ' ' : '<i style="display:inline-block;font-style:inherit">' + c + '</i>').join('');
    gsap.from(span.querySelectorAll('i'), {
      yPercent: 60, opacity: 0, duration: 1, stagger: .018, ease: 'power4.out', delay: .7
    });
  });
}

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

/* ---------- Giant wordmark: scrub split on scroll ---------- */
const wm = document.querySelector('.wordmark');
if (wm && !reduced) {
  const solid = wm.querySelector('.wm.solid'), ghost = wm.querySelector('.wm.ghost');
  gsap.to(solid, { xPercent: -14, ease: 'none', scrollTrigger: { trigger: wm, start: 'top top', end: '+=120%', scrub: .5 } });
  gsap.to(ghost, { xPercent: 10, ease: 'none', scrollTrigger: { trigger: wm, start: 'top top', end: '+=120%', scrub: .5 } });
}

/* ---------- Diagonal kinetic band: scroll-driven opposite rows ---------- */
document.querySelectorAll('.diag .row').forEach(row => {
  const dir = +row.dataset.dir || 1;
  gsap.fromTo(row, { xPercent: dir * -12 }, { xPercent: dir * 2, ease: 'none',
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

/* ---------- Run page-in ---------- */
window.addEventListener('load', () => { ScrollTrigger.refresh(); });
pageIn();
