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

    var lastY = window.pageYOffset || document.documentElement.scrollTop;
    var ticking = false;
    var TOP_THRESHOLD = 80; // near the very top → always transparent

    function update() {
      var y = window.pageYOffset || document.documentElement.scrollTop;

      if (y <= TOP_THRESHOLD) {
        header.classList.remove('nn-scroll-up');
      } else if (y < lastY - 2) {
        header.classList.add('nn-scroll-up'); // scrolling up
      } else if (y > lastY + 2) {
        header.classList.remove('nn-scroll-up'); // scrolling down
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
