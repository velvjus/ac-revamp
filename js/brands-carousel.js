/**
 * Auto-City Brands Showcase Carousel
 * Smooth continuous 60fps infinite marquee that keeps moving without stopping on mouse hover.
 */

(function () {
  'use strict';

  function initBrandsCarousel() {
    const stage = document.querySelector('.brands-carousel-stage');
    const track = document.querySelector('.brands-carousel-track');
    if (!stage || !track) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return;
    }

    // Carousel NEVER pauses on hover per user directive: keeps moving continuously.

    // Keyboard navigation (Tab + Arrow navigation)
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const activeCard = document.activeElement;
        const allCards = Array.from(track.querySelectorAll('.brand-card'));
        const currentIndex = allCards.indexOf(activeCard);
        if (currentIndex !== -1) {
          e.preventDefault();
          const nextIndex = e.key === 'ArrowRight' 
            ? (currentIndex + 1) % allCards.length 
            : (currentIndex - 1 + allCards.length) % allCards.length;
          allCards[nextIndex].focus();
        }
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBrandsCarousel);
  } else {
    initBrandsCarousel();
  }
})();
