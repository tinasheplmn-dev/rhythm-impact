/* Rhythm Impact: main.js
   Gebaseerd op motion.js uit de skill (fail-open reveals met vier vangnetten,
   stagger, hero-opening, scroll-voortgang voor de filmstroken, zweven),
   plus wat deze site zelf nodig heeft: mobiel menu, actiebalk, uitklappers
   die op mobiel dichtgaan en de mailto-formulieren.
   De schokgolf in de hero staat in js/hero-slag.js. */
(function () {
  'use strict';

  var html = document.documentElement;
  var kalm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var foto = /[?&]foto=1/.test(location.search);
  if (!foto) html.classList.add('js');

  function geefOp() { html.classList.add('klaar'); }
  window.addEventListener('error', geefOp);
  window.addEventListener('beforeprint', geefOp);

  function perFrame(fn) {
    var bezig = false;
    return function () {
      if (bezig) return;
      bezig = true;
      requestAnimationFrame(function () { bezig = false; fn(); });
    };
  }

  /* ---------- Header: schaduw zodra je scrolt ---------- */
  var balk = document.querySelector('[data-balk]');
  function balkStand() { if (balk) balk.classList.toggle('zweeft', window.scrollY > 10); }
  window.addEventListener('scroll', perFrame(balkStand), { passive: true });
  balkStand();

  /* ---------- Mobiel menu ---------- */
  var knop = document.querySelector('[data-menuknop]');
  var menu = document.querySelector('[data-menu]');
  if (knop && menu) {
    var sluit = function () {
      knop.setAttribute('aria-expanded', 'false');
      knop.setAttribute('aria-label', 'Menu openen');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    };
    knop.addEventListener('click', function () {
      if (knop.getAttribute('aria-expanded') === 'true') { sluit(); return; }
      knop.setAttribute('aria-expanded', 'true');
      knop.setAttribute('aria-label', 'Menu sluiten');
      menu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', sluit); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') sluit(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 860) sluit(); });
  }

  /* ---------- Tellers: de eindwaarde staat al in de HTML ---------- */
  function tel(el) {
    if (el.dataset.geteld || kalm) return;
    el.dataset.geteld = '1';
    var doel = parseInt(el.dataset.tel, 10);
    if (isNaN(doel)) return;
    var eind = el.textContent;
    var start = null;
    function stap(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / 1500, 1);
      el.textContent = Math.round(doel * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(stap); else el.textContent = eind;
    }
    requestAnimationFrame(stap);
  }

  /* ---------- Stagger: --i per kind ---------- */
  document.querySelectorAll('[data-stagger]').forEach(function (ouder) {
    [].slice.call(ouder.children).forEach(function (kind, i) { kind.style.setProperty('--i', i); });
  });

  /* ---------- Reveals, fail-open ---------- */
  var wachtend = [].slice.call(document.querySelectorAll('[data-rev]'));
  function rondAf(el) { setTimeout(function () { el.classList.add('af'); }, 1400); }
  function onthul(el) {
    el.classList.add('in');
    rondAf(el);
    [].slice.call(el.querySelectorAll('[data-tel]')).forEach(tel);
  }
  /* Alles wat boven de grens staat telt, ook wat al voorbij is gescrold:
     een blok dat je snel voorbij scrolt, mag nooit verborgen blijven. */
  function inBeeld(el, grens) {
    return el.getBoundingClientRect().top < grens;
  }
  function controleer() {
    if (!wachtend.length) return;
    var grens = window.innerHeight * 0.92;
    wachtend = wachtend.filter(function (el) {
      if (inBeeld(el, grens)) { onthul(el); return false; }
      return true;
    });
  }
  if (foto) {
    wachtend.forEach(onthul);
    wachtend = [];
    geefOp();
  } else {
    var vraag = perFrame(controleer);
    window.addEventListener('scroll', vraag, { passive: true });
    window.addEventListener('resize', vraag, { passive: true });
    window.addEventListener('load', vraag);
    window.addEventListener('pageshow', vraag);
    if ('IntersectionObserver' in window) {
      var kijker = new IntersectionObserver(function (items) {
        items.forEach(function (it) {
          if (!it.isIntersecting) return;
          var i = wachtend.indexOf(it.target);
          if (i !== -1) wachtend.splice(i, 1);
          onthul(it.target);
          kijker.unobserve(it.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
      wachtend.forEach(function (el) { kijker.observe(el); });
    }
    controleer();
    var waakhond = setInterval(function () {
      controleer();
      if (!wachtend.length) clearInterval(waakhond);
    }, 800);
    /* Dezelfde grens als de onthulling (met marge), anders geeft het script
       onterecht op voor een blok dat net onder de 92%-lijn staat. */
    setTimeout(function () {
      var vast = [].slice.call(document.querySelectorAll('[data-rev]:not(.in)'))
        .some(function (el) { return inBeeld(el, window.innerHeight * 0.85); });
      if (vast) {
        document.querySelectorAll('[data-rev]:not(.in)').forEach(onthul);
        wachtend = [];
        geefOp();
      }
    }, 1200);
  }

  /* ---------- Hero-opening: regels slaan erin, rest volgt ---------- */
  var hero = document.querySelector('[data-hero]');
  if (hero) {
    hero.querySelectorAll('[data-hero-item]').forEach(function (item, i) { item.style.setProperty('--i', i); });
    hero.querySelectorAll('h1 .regel > span').forEach(function (s, i) { s.style.setProperty('--r', i); });
    requestAnimationFrame(function () { requestAnimationFrame(function () { hero.classList.add('in'); }); });
    setTimeout(function () { hero.classList.add('in'); }, 400);
    rondAf(hero);
  }

  /* ---------- Scroll-voortgang per sectie (filmstroken) ---------- */
  var secties = [].slice.call(document.querySelectorAll('[data-sectie-p]'));
  if (!kalm && secties.length) {
    var voortgang = function () {
      var vh = window.innerHeight;
      secties.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) return;
        var p = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
        el.style.setProperty('--sectie-p', p.toFixed(4));
      });
    };
    var vraagV = perFrame(voortgang);
    window.addEventListener('scroll', vraagV, { passive: true });
    window.addEventListener('resize', vraagV, { passive: true });
    window.addEventListener('load', vraagV);
    voortgang();
  }

  /* ---------- Zwevende lagen, elk een eigen fase ---------- */
  if (!kalm) {
    document.querySelectorAll('[data-zweef]').forEach(function (el, i) {
      var afstand = parseFloat(el.dataset.zweef);
      if (!isNaN(afstand)) el.style.setProperty('--zweef-afstand', (-Math.abs(afstand)) + 'px');
      el.style.setProperty('--zweef-fase', (-(i * 1.3) % 6).toFixed(2) + 's');
      el.style.setProperty('--zweef-duur', (5.5 + (i % 3) * 0.8).toFixed(1) + 's');
      el.classList.add('zweef');
    });
  }

  /* ---------- Vaste actiebalk op mobiel ----------
     Verschijnt zodra de kop van de pagina uit beeld is, verdwijnt bij de footer. */
  var actiebalk = document.querySelector('[data-mobielcta]');
  var kopVanPagina = document.querySelector('[data-hero], .paginakop');
  if (actiebalk && kopVanPagina) {
    var voet = document.querySelector('footer');
    var toon = function () {
      var voorbij = kopVanPagina.getBoundingClientRect().bottom < 0;
      var bijVoet = voet && voet.getBoundingClientRect().top < window.innerHeight;
      actiebalk.classList.toggle('zichtbaar', voorbij && !bijVoet);
    };
    window.addEventListener('scroll', perFrame(toon), { passive: true });
    window.addEventListener('resize', perFrame(toon), { passive: true });
    toon();
  }

  /* ---------- Lange lijsten: op mobiel dicht, verder open (fail-open) ---------- */
  if (window.matchMedia('(max-width: 640px)').matches) {
    document.querySelectorAll('details[data-mobiel-dicht]').forEach(function (d) { d.open = false; });
  }

  /* ---------- Formulieren: nette mail met alles al ingevuld ---------- */
  document.querySelectorAll('form[data-mailto]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var regels = [];
      form.querySelectorAll('input, select, textarea').forEach(function (v) {
        if (!v.name) return;
        if ((v.type === 'radio' || v.type === 'checkbox') && !v.checked) return;
        if (!String(v.value).trim()) return;
        regels.push((v.dataset.label || v.name) + ': ' + v.value.trim());
      });
      var tekst = 'Beste Rhythm Impact,\n\n' + regels.join('\n') + '\n\nMet vriendelijke groet';
      var onderwerp = form.dataset.onderwerp || 'Bericht via de website';
      window.location.href = 'mailto:' + form.dataset.mailto +
        '?subject=' + encodeURIComponent(onderwerp) + '&body=' + encodeURIComponent(tekst);
      var status = form.querySelector('.form-status');
      if (status) { status.classList.add('toon'); status.focus(); }
    });
  });

  /* ---------- Jaartal in de footer ---------- */
  document.querySelectorAll('[data-jaar]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
