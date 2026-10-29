/**
 * Auto-City — Must Try Experiences Parallax & Hover Interactions
 * Features:
 * 1. Viewport Scroll Parallax (Smooth image translation in framed window)
 * 2. 3D Perspective Tilt Parallax on hover (Mouse tracking with feathered spring reset)
 * 3. Hardware-accelerated rAF updates with reduced-motion safeguards
 */

(function () {
  'use strict';

  var cards = document.querySelectorAll('.must-try-card, .whats-on-card');
  if (!cards.length) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var isMouse = window.matchMedia('(pointer: fine)').matches;

  // =========================================================================
  // 1. Scroll Parallax Engine
  // =========================================================================
  var ticking = false;

  function updateScrollParallax() {
    var vh = window.innerHeight || document.documentElement.clientHeight;

    cards.forEach(function (card) {
      var rect = card.getBoundingClientRect();
      // Only compute when visible in viewport
      if (rect.top < vh && rect.bottom > 0) {
        var cardCenter = rect.top + rect.height * 0.5;
        var viewCenter = vh * 0.5;
        var diff = (cardCenter - viewCenter) / (vh * 0.5); // Range ~ -1 to +1
        var clamped = Math.max(-1.2, Math.min(1.2, diff));
        var shiftY = Math.round(clamped * 16); // Subtle 16px shift

        var img = card.querySelector('.must-try-image, .whats-on-image');
        if (img) {
          img.style.setProperty('--scroll-parallax', shiftY + 'px');
        }
      }
    });

    ticking = false;
  }

  function requestScrollTick() {
    if (!ticking) {
      requestAnimationFrame(updateScrollParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestScrollTick, { passive: true });
  window.addEventListener('resize', requestScrollTick, { passive: true });
  // Initial run
  updateScrollParallax();

  // =========================================================================
  // 2. Interactive 3D Mouse Parallax Tilt
  // =========================================================================
  if (isMouse) {
    cards.forEach(function (card) {
      var rafId = null;

      function onMouseMove(e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;

        // Compute gentle tilt angles (max ~6 degrees)
        var tiltX = (y - 0.5) * -10;
        var tiltY = (x - 0.5) * 10;

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(function () {
          card.style.transform = 'perspective(1000px) rotateX(' + tiltX.toFixed(2) + 'deg) rotateY(' + tiltY.toFixed(2) + 'deg) translateY(-8px)';
        });
      }

      function onMouseLeave() {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.transform = '';
      }

      card.addEventListener('mousemove', onMouseMove);
      card.addEventListener('mouseleave', onMouseLeave);
    });
  }

  // =========================================================================
  // 3. Mobile Horizontal Drag-to-Scroll Support
  // =========================================================================
  var carousels = document.querySelectorAll('.must-try-grid, .whats-on-grid');
  carousels.forEach(function (slider) {
    var isDown = false;
    var startX = 0;
    var scrollLeft = 0;

    slider.addEventListener('mousedown', function (e) {
      if (window.innerWidth > 768) return;
      isDown = true;
      slider.classList.add('is-dragging');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', function () {
      isDown = false;
      slider.classList.remove('is-dragging');
    });

    slider.addEventListener('mouseup', function () {
      isDown = false;
      slider.classList.remove('is-dragging');
    });

    slider.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - slider.offsetLeft;
      var walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    });
  });
})();
