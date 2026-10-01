/* ─────────────────────────────────────────────────────────────
   "The Date" — scratch to reveal.

   Each card paints a gold foil onto a canvas above the value and erases
   it with destination-out compositing as you drag. Past a threshold the
   remainder fades on its own.

   The foil is painted from a ResizeObserver rather than on load: the
   card sits behind the tap-to-open overlay at first, and on some loads
   measures zero before the page settles.
   ───────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var REVEAL_AT = 0.42;   // fraction cleared before it opens fully
  var RADIUS    = 18;     // brush radius in CSS px

  function paintFoil(ctx, w, h) {
    var g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0.00, '#E0BE84');
    g.addColorStop(0.26, '#F0D9AC');
    g.addColorStop(0.50, '#D2AC72');
    g.addColorStop(0.74, '#EDD3A2');
    g.addColorStop(1.00, '#C8A163');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    ctx.globalAlpha = 0.07;
    ctx.strokeStyle = '#8A6A3F';
    ctx.lineWidth = 1;
    for (var i = -h; i < w; i += 5) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function initCard(card) {
    var canvas = card.querySelector('.sd-card__foil');
    if (!canvas) return;

    var ctx = canvas.getContext('2d', { willReadFrequently: true });
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var drawing = false;
    var done = false;
    var painted = 0;
    var last = null;

    function paint() {
      var r = card.getBoundingClientRect();
      if (!r.width || !r.height || done) return;
      if (Math.abs(r.width - painted) < 1) return;   // already correct
      painted = r.width;
      canvas.width  = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      paintFoil(ctx, r.width, r.height);
    }

    function at(e) {
      var r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    function scratch(p) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = RADIUS * 2;
      if (last) {
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, RADIUS, 0, Math.PI * 2);
      ctx.fill();
      last = p;
    }

    function clearedFraction() {
      var d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      var total = 0, clear = 0;
      for (var i = 3; i < d.length; i += 4 * 12) {
        total++;
        if (d[i] < 40) clear++;
      }
      return total ? clear / total : 0;
    }

    function reveal() {
      if (done) return;
      done = true;
      card.classList.add('is-revealed');
    }

    canvas.addEventListener('pointerdown', function (e) {
      if (done) return;
      drawing = true;
      last = null;
      if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
      scratch(at(e));
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!drawing || done) return;
      e.preventDefault();
      scratch(at(e));
    }, { passive: false });

    function release() {
      if (!drawing) return;
      drawing = false;
      last = null;
      if (!done && clearedFraction() >= REVEAL_AT) reveal();
    }
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    canvas.addEventListener('pointerleave', release);

    // Keyboard / assistive path
    canvas.setAttribute('tabindex', '0');
    canvas.setAttribute('role', 'button');
    canvas.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(); }
    });

    paint();
    if (window.ResizeObserver) new ResizeObserver(paint).observe(card);
    window.addEventListener('resize', paint);
  }

  function init() {
    var cards = document.querySelectorAll('.sd-card');
    for (var i = 0; i < cards.length; i++) initCard(cards[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
