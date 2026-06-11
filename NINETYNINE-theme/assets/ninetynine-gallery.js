/*
 * NINETYNINE custom product gallery (desktop)
 * Shows one product image at a time and pages through them with the
 * existing .slider-button--prev / --next arrows + the 1/N counter.
 *
 * Dawn's own slider-component disables these buttons on desktop (it thinks
 * there's nothing to scroll because only the active slide has width). So we
 * take over: keep the buttons enabled, intercept their clicks in the capture
 * phase (before Dawn), and toggle the active slide ourselves.
 */
(function () {
  function isDesktop() {
    return window.matchMedia('(min-width: 990px)').matches;
  }

  function initGallery(gallery) {
    if (gallery.dataset.nnInit === 'true') return;

    var viewer = gallery.querySelector('[id^="GalleryViewer"]') || gallery;
    var slides = Array.prototype.slice.call(
      gallery.querySelectorAll('.product__media-item')
    );
    if (slides.length < 2) return;

    var prevBtn = gallery.querySelector('.slider-button--prev');
    var nextBtn = gallery.querySelector('.slider-button--next');
    var currentEl = gallery.querySelector('.slider-counter--current');
    var totalEl = gallery.querySelector('.slider-counter--total');
    if (!prevBtn || !nextBtn) return;

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

    // Stop Dawn from disabling the arrows on desktop.
    function keepEnabled() {
      if (!isDesktop()) return;
      [prevBtn, nextBtn].forEach(function (btn) {
        if (btn.hasAttribute('disabled')) btn.removeAttribute('disabled');
      });
    }
    var observer = new MutationObserver(keepEnabled);
    [prevBtn, nextBtn].forEach(function (btn) {
      observer.observe(btn, { attributes: true, attributeFilter: ['disabled'] });
    });
    keepEnabled();

    // Capture-phase handlers run before Dawn's bubble-phase listeners.
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

    show(index);
  }

  function initAll() {
    document.querySelectorAll('media-gallery').forEach(initGallery);
  }

  // Run after Dawn's deferred scripts have initialised, then keep enforcing.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      window.setTimeout(initAll, 0);
    });
  } else {
    window.setTimeout(initAll, 0);
  }
})();
