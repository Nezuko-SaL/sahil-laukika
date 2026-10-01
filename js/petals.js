/* Drifting petals.
 *
 * Held back until the envelope has opened -- nothing should be moving
 * behind the cover -- and paused whenever the tab is hidden.
 *
 * Call window.startPetals() to begin.
 */
(function () {
  'use strict';

  var PETALS = [
    'assets/img/noroot.webp',
    'assets/img/noroot-198c0b.webp',
    'assets/img/noroot-299910.webp',
    'assets/img/noroot-7b8569.webp',
    'assets/img/noroot-98659c.webp',
    'assets/img/noroot-e1ef8d.webp'
  ];

  var reduced = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var field = null;
  var started = false;

  function rand(min, max) { return min + Math.random() * (max - min); }

  function build() {
    field = document.createElement('div');
    field.id = 'petalField';
    field.setAttribute('aria-hidden', 'true');

    // Few enough to read as stray petals rather than weather.
    var count = window.innerWidth < 700 ? 7 : 11;

    for (var i = 0; i < count; i++) {
      var p = document.createElement('img');
      p.className = 'petal';
      p.src = PETALS[i % PETALS.length];
      p.alt = '';
      p.decoding = 'async';
      /* already fetched for the section ornaments, but be explicit */
      p.loading = 'eager';

      var size = rand(13, 29);
      p.style.setProperty('--size', size.toFixed(1) + 'px');
      p.style.setProperty('--x', rand(-2, 98).toFixed(2) + 'vw');
      p.style.setProperty('--dur', rand(15, 27).toFixed(1) + 's');
      /* negative delay starts each one mid-fall, so there is no empty
         opening stretch waiting for the first petal to arrive */
      p.style.setProperty('--delay', (-rand(0, 27)).toFixed(1) + 's');
      p.style.setProperty('--sway', rand(-11, 11).toFixed(1) + 'vw');
      p.style.setProperty('--r0', rand(0, 360).toFixed(0) + 'deg');
      /* smaller petals read as further away, so they sit fainter */
      p.style.setProperty('--op', (size < 19 ? rand(0.20, 0.34)
                                             : rand(0.30, 0.48)).toFixed(2));
      field.appendChild(p);
    }

    document.body.appendChild(field);

    document.addEventListener('visibilitychange', function () {
      field.classList.toggle('is-paused', document.hidden);
    });
  }

  window.startPetals = function () {
    if (started || reduced) return;
    started = true;
    build();
    // let the nodes land before transitioning opacity, or it snaps on
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { field.classList.add('is-on'); });
    });
  };
})();
