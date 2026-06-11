/*
 * NINETYNINE brand marquee parallax.
 * The wordmark rises from below the bottom frame as the marquee scrolls into
 * view, then settles resting on the bottom edge. Pure scroll-linked transform.
 */
(function () {
  function init() {
    var marquees = document.querySelectorAll('.brand-marquee');
    if (!marquees.length) return;

    function update() {
      var vh = window.innerHeight;
      marquees.forEach(function (m) {
        var inner = m.querySelector('.brand-marquee__inner');
        if (!inner) return;
        var rect = m.getBoundingClientRect();
        // progress: 0 when the marquee's top first enters the viewport bottom,
        // 1 once it has fully scrolled up to the viewport bottom edge.
        var start = vh; // element top at viewport bottom
        var end = vh - rect.height; // element top one element-height above
        var raw = (start - rect.top) / (start - end || 1);
        var progress = Math.min(1, Math.max(0, raw));
        // Shift from 55% (below the frame) up to 0% (resting on the edge).
        var shift = (1 - progress) * 55;
        inner.style.setProperty('--marquee-shift', shift.toFixed(2) + '%');
      });
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        update();
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
