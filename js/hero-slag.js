/* Rhythm Impact: de schokgolf in de hero.
   Een ingetogen sfeerlaag over de foto. Op een vaste beat (96 BPM) gaat er
   vanuit het raakpunt van de stok een golf door het beeld; op elke vierde
   tel een iets grotere, met de spikes uit het woordmerk.
   Geen klik- of tikbediening, geen geluid. Lichter op mobiel, uit bij
   verminderde beweging, pauzeert buiten beeld en in een verborgen tab. */
(function () {
  'use strict';

  var doek = document.querySelector('[data-slag-doek]');
  var beeld = document.querySelector('[data-slag]');
  if (!doek || !beeld || !doek.getContext) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ctx = doek.getContext('2d');
  var raak = beeld.getAttribute('data-slag').split(' ').map(parseFloat); /* positie in de foto, 0 tot 1 */
  var PAARS = '194,17,184';
  var GLOED = '242,123,232';
  var TEL = 60000 / 96;

  var B = 0, H = 0, dpr = 1, smal = false, punt = { x: 0, y: 0 };

  /* waar staat het raakpunt na object-fit: cover en object-position? */
  function meet() {
    var r = doek.getBoundingClientRect();
    B = r.width; H = r.height;
    smal = B < 760;
    dpr = smal ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    doek.width = Math.round(B * dpr);
    doek.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var iw = beeld.naturalWidth || 2400, ih = beeld.naturalHeight || 1569;
    var schaal = Math.max(B / iw, H / ih);
    var bw = iw * schaal, bh = ih * schaal;
    var pos = getComputedStyle(beeld).objectPosition.split(' ');
    var px = parseFloat(pos[0]) / 100, py = parseFloat(pos[1] || pos[0]) / 100;
    if (isNaN(px)) px = .5;
    if (isNaN(py)) py = .5;
    punt.x = (B - bw) * px + raak[0] * bw;
    punt.y = (H - bh) * py + raak[1] * bh;
  }

  var golven = [];
  function slag(groot) {
    golven.push({ r: 4, groot: groot, geboren: performance.now(), draai: Math.random() * Math.PI });
    if (golven.length > 6) golven.shift();
  }

  var zichtbaar = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { zichtbaar = e[0].isIntersecting; }).observe(doek);
  }

  var tel = 0, laatste = performance.now();
  function frame(nu) {
    requestAnimationFrame(frame);
    if (!zichtbaar || document.hidden) { laatste = nu; return; }

    /* de klok: om de twee tellen een golf, op de vier een grotere */
    if (nu - laatste >= TEL) {
      laatste += TEL * Math.floor((nu - laatste) / TEL);
      tel++;
      if (tel % 2 === 0) slag(tel % 4 === 0);
    }

    ctx.clearRect(0, 0, B, H);
    var maxR = Math.max(B, H) * (smal ? .55 : .7);
    for (var i = golven.length - 1; i >= 0; i--) {
      var g = golven[i];
      var leeftijd = (nu - g.geboren) / 1000;
      g.r = 6 + leeftijd * maxR * (g.groot ? .62 : .5);
      var a = Math.max(0, 1 - g.r / maxR);
      if (a <= .01) { golven.splice(i, 1); continue; }

      ctx.beginPath();
      ctx.arc(punt.x, punt.y, g.r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(' + (g.groot ? GLOED : PAARS) + ',' + (.42 * a).toFixed(3) + ')';
      ctx.lineWidth = g.groot ? 2.2 : 1.4;
      ctx.stroke();
      if (!smal) {
        ctx.beginPath();
        ctx.arc(punt.x, punt.y, g.r * .84, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(' + PAARS + ',' + (.14 * a).toFixed(3) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      /* op de vier: korte gloed en de spikes uit het logo */
      if (g.groot && leeftijd < .45) {
        var t = leeftijd / .45;
        var groei = 1 - Math.pow(1 - Math.min(1, t * 1.6), 3);
        var gloed = ctx.createRadialGradient(punt.x, punt.y, 0, punt.x, punt.y, 110);
        gloed.addColorStop(0, 'rgba(' + GLOED + ',' + (.2 * (1 - t)).toFixed(3) + ')');
        gloed.addColorStop(1, 'rgba(' + GLOED + ',0)');
        ctx.fillStyle = gloed;
        ctx.fillRect(punt.x - 110, punt.y - 110, 220, 220);
        ctx.strokeStyle = 'rgba(' + GLOED + ',' + (.6 * (1 - t)).toFixed(3) + ')';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        for (var k = 0; k < 6; k++) {
          var hoek = g.draai + k / 6 * Math.PI * 2;
          var r1 = 16 + groei * 26, r2 = r1 + (k % 2 ? 12 : 24) * groei;
          ctx.beginPath();
          ctx.moveTo(punt.x + Math.cos(hoek) * r1, punt.y + Math.sin(hoek) * r1);
          ctx.lineTo(punt.x + Math.cos(hoek) * r2, punt.y + Math.sin(hoek) * r2);
          ctx.stroke();
        }
      }
    }
  }

  function start() {
    meet();
    if ('ResizeObserver' in window) new ResizeObserver(meet).observe(doek);
    else window.addEventListener('resize', meet);
    /* de eerste golf valt samen met de instap van de kop */
    setTimeout(function () { slag(true); }, 650);
    requestAnimationFrame(frame);
  }
  if (beeld.complete) start(); else beeld.addEventListener('load', start);
})();
