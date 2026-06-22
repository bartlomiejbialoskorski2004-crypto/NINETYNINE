/*
 * NINETYNINE header scroll-direction state.
 * Adds `.nn-scroll-up` to the header while the user scrolls UP (past the top),
 * and removes it when scrolling down or sitting at the very top.
 * CSS uses this on the homepage to show a solid white bar on scroll-up and
 * stay transparent otherwise.
 */
(function () {
  function init() {
    var header = document.querySelector('.section-header');
    if (!header) return;

    var marquee = document.getElementById('nn-top-marquee');
    var lastY = window.pageYOffset || document.documentElement.scrollTop;
    var ticking = false;
    var TOP_THRESHOLD = 80; // near the very top → always transparent
    var MARQUEE_THRESHOLD = 10; // marquee shows only at the very top

    function update() {
      var y = window.pageYOffset || document.documentElement.scrollTop;

      if (y <= TOP_THRESHOLD) {
        header.classList.remove('nn-scroll-up');
      } else if (y < lastY - 2) {
        header.classList.add('nn-scroll-up'); // scrolling up
      } else if (y > lastY + 2) {
        header.classList.remove('nn-scroll-up'); // scrolling down
      }

      // Top marquee: visible only at the very top, hides smoothly once scrolled
      if (marquee) {
        if (y <= MARQUEE_THRESHOLD) {
          marquee.classList.remove('nn-top-marquee--hidden');
          document.body.classList.remove('nn-marquee-hidden');
        } else {
          marquee.classList.add('nn-top-marquee--hidden');
          document.body.classList.add('nn-marquee-hidden');
        }
      }

      lastY = y;
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );

    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
