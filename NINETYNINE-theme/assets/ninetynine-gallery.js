/*
 * NINETYNINE custom product gallery (desktop)
 * Shows one product image at a time. Change the image by:
 *   - scrolling the mouse wheel over the image
 *   - dragging / swiping left-right on the image
 * The arrow buttons still work as a fallback. Counter (1/N) stays in sync.
 *
 * Dawn's own slider-component disables the arrows on desktop, so we keep
 * them enabled and take over the click handling in the capture phase.
 */
(function () {
  function isDesktop() {
    return window.matchMedia('(min-width: 990px)').matches;
  }

  function initGallery(gallery) {
    if (gallery.dataset.nnInit === 'true') return;

    var slides = Array.prototype.slice.call(
      gallery.querySelectorAll('.product__media-item')
    );
    if (slides.length < 2) return;

    var prevBtn = gallery.querySelector('.slider-button--prev');
    var nextBtn = gallery.querySelector('.slider-button--next');
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

    /* ---- Arrows (kept working as fallback) ------------------------------- */
    function keepEnabled() {
      if (!isDesktop()) return;
      [prevBtn, nextBtn].forEach(function (btn) {
        if (btn && btn.hasAttribute('disabled')) btn.removeAttribute('disabled');
      });
    }
    if (prevBtn && nextBtn) {
      var observer = new MutationObserver(keepEnabled);
      [prevBtn, nextBtn].forEach(function (btn) {
        observer.observe(btn, { attributes: true, attributeFilter: ['disabled'] });
      });
      keepEnabled();

      prevBtn.addEventListener(
        'click',
        function (e) {
          if (!isDesktop()) return;
          e.preventDefault();
          e.stopImmediatePropagation();
          show(index - 1);
        },
        true
      );
      nextBtn.addEventListener(
        'click',
        function (e) {
          if (!isDesktop()) return;
          e.preventDefault();
          e.stopImmediatePropagation();
          show(index + 1);
        },
        true
      );
    }

    /* ---- Mouse-wheel scroll changes the image --------------------------- */
    var wheelLock = false;
    stage.addEventListener(
      'wheel',
      function (e) {
        if (!isDesktop()) return;
        // Only hijack mostly-vertical or horizontal intent over the image.
        var delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        if (delta === 0) return;
        e.preventDefault();
        if (wheelLock) return;
        wheelLock = true;
        show(index + (delta > 0 ? 1 : -1));
        window.setTimeout(function () {
          wheelLock = false;
        }, 250);
      },
      { passive: false }
    );

    /* ---- Drag / swipe changes the image --------------------------------- */
    var dragStartX = null;
    var dragging = false;

    function pointerDown(x) {
      dragStartX = x;
      dragging = true;
    }
    function pointerUp(x) {
      if (!dragging || dragStartX === null) return;
      var dx = x - dragStartX;
      dragging = false;
      dragStartX = null;
      if (Math.abs(dx) < 40) return; // ignore tiny drags / clicks
      show(index + (dx < 0 ? 1 : -1)); // drag left → next
    }

    // Mouse drag (desktop)
    stage.addEventListener('mousedown', function (e) {
      if (!isDesktop()) return;
      pointerDown(e.clientX);
    });
    window.addEventListener('mouseup', function (e) {
      if (!isDesktop()) return;
      pointerUp(e.clientX);
    });
    // Prevent the browser's native image drag-ghost
    stage.addEventListener('dragstart', function (e) {
      if (isDesktop()) e.preventDefault();
    });

    // Touch swipe (kept for completeness; Dawn also handles mobile)
    stage.addEventListener(
      'touchstart',
      function (e) {
        pointerDown(e.touches[0].clientX);
      },
      { passive: true }
    );
    stage.addEventListener('touchend', function (e) {
      pointerUp(e.changedTouches[0].clientX);
    });

    stage.style.cursor = 'grab';
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
