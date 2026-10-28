/* ============================================================
   Demo study navigation: arrow keys and horizontal swipe.

   Targets are read from the spec strip's rel="prev"/rel="next"
   links rather than hardcoded, so the page order stays defined
   in exactly one place.
   ============================================================ */
(function () {
  'use strict';

  var prevEl = document.querySelector('a[rel="prev"]');
  var nextEl = document.querySelector('a[rel="next"]');
  if (!prevEl && !nextEl) return;

  var prevHref = prevEl && prevEl.getAttribute('href');
  var nextHref = nextEl && nextEl.getAttribute('href');

  /* warm both neighbours so flipping through feels instant */
  [prevHref, nextHref].forEach(function (href) {
    if (!href) return;
    var l = document.createElement('link');
    l.rel = 'prefetch';
    l.href = href;
    document.head.appendChild(l);
  });

  function go(href) { if (href) window.location.href = href; }

  /* ---------------- keyboard ---------------- */
  document.addEventListener('keydown', function (e) {
    if (e.defaultPrevented) return;
    /* leave browser history/tab shortcuts (cmd/alt + arrow) alone */
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;

    var t = e.target;
    if (t && (t.isContentEditable ||
              /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;

    if (e.key === 'ArrowLeft')       { e.preventDefault(); go(prevHref); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(nextHref); }
  });

  /* ---------------- touch ---------------- */
  var EDGE  = 32;   /* px: don't fight the OS back/forward edge gesture */
  var MIN_X = 60;   /* px of travel before it counts as a swipe        */
  var MAX_T = 800;  /* ms: a slow drag is a scroll, not a swipe        */
  var RATIO = 1.6;  /* horizontal must dominate vertical by this much  */

  var x0 = 0, y0 = 0, t0 = 0, tracking = false;

  /* a swipe that starts inside a horizontally scrollable box belongs
     to that box, not to us */
  function scrollableX(node) {
    while (node && node !== document.body) {
      if (node.scrollWidth > node.clientWidth + 1) {
        var ox = getComputedStyle(node).overflowX;
        if (ox === 'auto' || ox === 'scroll') return true;
      }
      node = node.parentElement;
    }
    return false;
  }

  document.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { tracking = false; return; }
    var t = e.touches[0];
    if (t.clientX < EDGE || t.clientX > window.innerWidth - EDGE) {
      tracking = false; return;
    }
    if (scrollableX(e.target)) { tracking = false; return; }
    x0 = t.clientX; y0 = t.clientY; t0 = Date.now(); tracking = true;
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    if (!tracking) return;
    tracking = false;
    if (Date.now() - t0 > MAX_T) return;

    var t = e.changedTouches[0];
    var dx = t.clientX - x0;
    var dy = t.clientY - y0;

    if (Math.abs(dx) < MIN_X) return;
    if (Math.abs(dx) < Math.abs(dy) * RATIO) return;  /* that was a scroll */

    go(dx < 0 ? nextHref : prevHref);
  }, { passive: true });
})();
