/*
 * NINETYNINE custom product gallery (desktop)
 * One image at a time. No visible arrow buttons. Instead, hovering the LEFT
 * half of the image shows a left-arrow cursor (click = previous), and the
 * RIGHT half shows a right-arrow cursor (click = next).
 * Touch devices keep a simple swipe via the same prev/next.
 */
(function () {
  function isDesktop() {
    return window.matchMedia('(min-width: 990px)').matches;
  }

  // Custom BLACK arrow cursors (subtle white halo so they show on dark photos too).
  var CURSOR_LEFT =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M30 12 18 24l12 12' fill='none' stroke='%23fff' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' opacity='.5'/%3E%3Cpath d='M30 12 18 24l12 12' fill='none' stroke='%23000' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\") 24 24, w-resize";
  var CURSOR_RIGHT =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M18 12l12 12-12 12' fill='none' stroke='%23fff' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' opacity='.5'/%3E%3Cpath d='M18 12l12 12-12 12' fill='none' stroke='%23000' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\") 24 24, e-resize";

  function initGallery(gallery) {
    if (gallery.dataset.nnInit === 'true') return;

    var slides = Array.prototype.slice.call(
      gallery.querySelectorAll('.product__media-item')
    );
    if (slides.length < 2) return;

    var currentEl = gallery.querySelector('.slider-counter--current');
    var totalEl = gallery.querySelector('.slider-counter--total');
    var stage = gallery.querySelector('.product__media-wrapper') || gallery;

    gallery.dataset.nnInit = 'true';

    var index = slides.findIndex(function (s) {
      return s.classList.contains('is-active');
    });
    if (index < 0) index = 0;

    if (totalEl) totalEl.textContent = slides.length;

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (slide, n) {
        slide.classList.toggle('is-active', n === index);
      });
      if (currentEl) currentEl.textContent = index + 1;
    }

    function isLeftHalf(e) {
      var rect = stage.getBoundingClientRect();
      return e.clientX - rect.left < rect.width / 2;
    }

    /* ---- Cursor turns into a left/right arrow over the image ------------- */
    stage.addEventListener('mousemove', function (e) {
      if (!isDesktop()) {
        stage.style.removeProperty('cursor');
        return;
      }
      // setProperty with priority beats any CSS rule (incl. !important).
      stage.style.setProperty(
        'cursor',
        isLeftHalf(e) ? CURSOR_LEFT : CURSOR_RIGHT,
        'important'
      );
    });

    /* ---- Click left half = prev, right half = next ---------------------- */
    stage.addEventListener('click', function (e) {
      if (!isDesktop()) return;
      // ignore clicks on real controls/links inside the stage
      if (e.target.closest('a, button')) return;
      if (isLeftHalf(e)) {
        show(index - 1);
      } else {
        show(index + 1);
      }
    });

    /* ---- Touch swipe (mobile) ------------------------------------------- */
    var startX = null;
    stage.addEventListener(
      'touchstart',
      function (e) {
        startX = e.touches[0].clientX;
      },
      { passive: true }
    );
    stage.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) < 40) return;
      show(index + (dx < 0 ? 1 : -1));
    });

    show(index);
  }

  function initAll() {
    document.querySelectorAll('media-gallery').forEach(initGallery);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      window.setTimeout(initAll, 0);
    });
  } else {
    window.setTimeout(initAll, 0);
  }
})();
