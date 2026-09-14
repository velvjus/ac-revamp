/**
 * Auto-City Website Revamp : Interaction Engine
 * Clean, event-delegated DOM interactions with strict escape, clipboard, and theme handling
 */

// Theme Management Engine
const THEME_STORAGE_KEY = 'auto-city-theme';

function getPreferredTheme() {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme) return storedTheme;
  return 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    const labelSpan = btn.querySelector('.theme-label-text') || btn.querySelector('#themeLabel') || btn;
    if (labelSpan && labelSpan !== btn) {
      labelSpan.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
    }
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    btn.setAttribute('title', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  });

  // Synchronize with active preview iframe if loaded
  const modalFrame = document.getElementById('previewIframe');
  if (modalFrame && modalFrame.contentDocument && modalFrame.contentDocument.documentElement) {
    try {
      modalFrame.contentDocument.documentElement.setAttribute('data-theme', theme);
    } catch (err) {
      // Cross-origin frame protection
    }
  }
}

// Immediate theme execution to prevent flash of wrong theme
const initialTheme = getPreferredTheme();
applyTheme(initialTheme);

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Button Handlers
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const target = current === 'dark' ? 'light' : 'dark';
      applyTheme(target);
    });
  });

  // Listen for OS system theme changes if user hasn't set an explicit override
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Modal Preview Controller
  const modalBackdrop = document.getElementById('previewModal');
  const modalFrame = document.getElementById('previewIframe');
  const modalTitle = document.getElementById('modalTitle');
  const modalExternalLink = document.getElementById('modalExternalLink');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const viewportButtons = document.querySelectorAll('.viewport-btn');
  const previewTriggers = document.querySelectorAll('[data-preview-url]');

  if (modalBackdrop && modalFrame) {
    const openModal = (url, title) => {
      modalFrame.src = url;
      if (modalTitle) modalTitle.textContent = title;
      if (modalExternalLink) modalExternalLink.href = url;
      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modalBackdrop.classList.remove('active');
      modalFrame.src = 'about:blank';
      document.body.style.overflow = '';
    };

    previewTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const url = btn.getAttribute('data-preview-url');
        const title = btn.getAttribute('data-title') || 'Page Preview';
        openModal(url, title);
      });
    });

    // Synchronize theme on iframe load
    modalFrame.addEventListener('load', () => {
      try {
        const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        if (modalFrame.contentDocument && modalFrame.contentDocument.documentElement) {
          modalFrame.contentDocument.documentElement.setAttribute('data-theme', activeTheme);
        }
      } catch (err) {}
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
        closeModal();
      }
    });

    // Viewport Toggle Handling
    viewportButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        viewportButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const width = btn.getAttribute('data-width') || '100%';
        modalFrame.style.width = width;
      });
    });
  }

  // Tactile Clipboard Copier
  const copyElements = document.querySelectorAll('[data-copy]');
  copyElements.forEach(el => {
    el.addEventListener('click', async () => {
      const text = el.getAttribute('data-copy');
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        const feedbackEl = el.querySelector('.copy-status') || el;
        const previousText = feedbackEl.textContent;
        feedbackEl.textContent = 'Copied!';
        feedbackEl.style.color = '#34d399';

        setTimeout(() => {
          feedbackEl.textContent = previousText;
          feedbackEl.style.color = '';
        }, 1500);
      } catch (err) {
        console.warn('Clipboard write failed:', err);
      }
    });
  });

  // Floating Island Header Controller (Habitline Inward-Closing Scroll Effect)
  const islandHeader = document.getElementById('islandHeader');
  if (islandHeader) {
    let ticking = false;
    const updateScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.pageYOffset || document.documentElement.scrollTop;
          // Smooth hysteresis buffer: close inward once past 45px, reopen above 15px
          if (scrollY > 45) {
            islandHeader.classList.add('scrolled');
          } else if (scrollY < 15) {
            islandHeader.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
  }

  // Desktop Megamenu Controller (Habitline Interactive Floating Panels)
  const islandMegamenu = document.getElementById('islandMegamenu');
  const megamenuTriggers = document.querySelectorAll('[data-megamenu-target]');
  const kebabBtn = document.getElementById('islandKebabBtn');
  const navPill = document.querySelector('.island-nav-pill');

  if (islandMegamenu && megamenuTriggers.length > 0) {
    const panels = islandMegamenu.querySelectorAll('[data-megamenu-panel]');
    let closeTimeout = null;
    let activeTarget = null;

    const openPanel = (targetKey, triggerEl) => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
        closeTimeout = null;
      }

      const targetPanel = islandMegamenu.querySelector(`[data-megamenu-panel="${targetKey}"]`);
      if (!targetPanel) return;

      // Update trigger visual active states
      megamenuTriggers.forEach(btn => {
        btn.classList.remove('megamenu-active');
        btn.setAttribute('aria-expanded', 'false');
      });

      if (triggerEl) {
        triggerEl.classList.add('megamenu-active');
        triggerEl.setAttribute('aria-expanded', 'true');
      }

      // Switch active panel
      panels.forEach(p => {
        if (p === targetPanel) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });

      // Open floating megamenu wrapper
      islandMegamenu.classList.add('open');
      islandMegamenu.setAttribute('aria-hidden', 'false');
      activeTarget = targetKey;

      // Auto-focus search input if kebab 'more' panel is opened
      if (targetKey === 'more') {
        const searchInput = document.getElementById('megamenuSearchInput');
        if (searchInput) {
          setTimeout(() => searchInput.focus(), 60);
        }
      }
    };


    const closeMegamenu = () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
        closeTimeout = null;
      }

      islandMegamenu.classList.remove('open');
      islandMegamenu.setAttribute('aria-hidden', 'true');

      megamenuTriggers.forEach(btn => {
        btn.classList.remove('megamenu-active');
        btn.setAttribute('aria-expanded', 'false');
      });

      // Graceful timeout before hiding panel content to allow opacity fade-out
      setTimeout(() => {
        if (!islandMegamenu.classList.contains('open')) {
          panels.forEach(p => p.classList.remove('active'));
          activeTarget = null;
        }
      }, 250);
    };

    const scheduleClose = () => {
      if (closeTimeout) clearTimeout(closeTimeout);
      closeTimeout = setTimeout(closeMegamenu, 220);
    };

    const cancelClose = () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
        closeTimeout = null;
      }
    };

    // Attach trigger event listeners
    megamenuTriggers.forEach(trigger => {
      const targetKey = trigger.getAttribute('data-megamenu-target');

      // Mouseenter triggers panel opening or switching
      trigger.addEventListener('mouseenter', () => {
        openPanel(targetKey, trigger);
      });

      // Keyboard focus triggers panel opening
      trigger.addEventListener('focus', () => {
        openPanel(targetKey, trigger);
      });

      // Mouseleave schedules delayed close
      trigger.addEventListener('mouseleave', () => {
        scheduleClose();
      });
    });

    // Kebab button toggle on click
    if (kebabBtn) {
      kebabBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (islandMegamenu.classList.contains('open') && activeTarget === 'more') {
          closeMegamenu();
        } else {
          openPanel('more', kebabBtn);
        }
      });
    }

    // Nav anchor links close megamenu upon clicking to scroll to target
    megamenuTriggers.forEach(trigger => {
      if (trigger !== kebabBtn) {
        trigger.addEventListener('click', () => {
          closeMegamenu();
        });
      }
    });

    // Megamenu wrapper keeps itself open on hover
    islandMegamenu.addEventListener('mouseenter', cancelClose);
    islandMegamenu.addEventListener('mouseleave', scheduleClose);

    // Nav pill container keeps megamenu alive
    if (navPill) {
      navPill.addEventListener('mouseenter', cancelClose);
      navPill.addEventListener('mouseleave', scheduleClose);
    }

    // Close megamenu when any internal link is clicked
    islandMegamenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMegamenu();
      });
    });

    // Outside click closes megamenu
    document.addEventListener('click', (e) => {
      if (islandMegamenu.classList.contains('open')) {
        const isInside = islandMegamenu.contains(e.target) || 
                         (islandHeader && islandHeader.contains(e.target));
        if (!isInside) {
          closeMegamenu();
        }
      }
    });

    // Escape key closes megamenu and returns focus to active trigger
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && islandMegamenu.classList.contains('open')) {
        const currentActive = document.querySelector('[data-megamenu-target].megamenu-active');
        closeMegamenu();
        if (currentActive) currentActive.focus();
      }
    });

    // Keyboard shortcut (Cmd+K / Ctrl+K) to instantly open search dropdown
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openPanel('more', kebabBtn);
        const searchInput = document.getElementById('megamenuSearchInput');
        if (searchInput) setTimeout(() => searchInput.focus(), 80);
      }
    });

    // Interactive Search Input Filtering & Quick Suggestion clicks
    const megamenuSearchInput = document.getElementById('megamenuSearchInput');
    if (megamenuSearchInput) {
      megamenuSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const morePanel = islandMegamenu.querySelector('[data-megamenu-panel="more"]');
        if (!morePanel) return;
        const linkItems = morePanel.querySelectorAll('.level-links-list li');
        linkItems.forEach(li => {
          const text = li.textContent.toLowerCase();
          if (!query || text.includes(query)) {
            li.style.display = '';
          } else {
            li.style.display = 'none';
          }
        });
      });

      // Quick links click fills search input
      const quickLinks = islandMegamenu.querySelectorAll('.level-quick-link');
      quickLinks.forEach(ql => {
        ql.addEventListener('click', (e) => {
          e.preventDefault();
          const term = ql.getAttribute('data-search-term') || ql.textContent;
          megamenuSearchInput.value = term;
          megamenuSearchInput.dispatchEvent(new Event('input'));
          megamenuSearchInput.focus();
        });
      });
    }
  }


  const islandMobileToggle = document.getElementById('islandMobileToggle');
  const islandMobileCard = document.getElementById('islandMobileCard') || document.getElementById('islandMobileDrawer');
  const islandMobileOverlay = document.getElementById('islandMobileOverlay');
  if (islandMobileToggle && islandMobileCard) {
    const toggleIslandDrawer = (open) => {
      const isOpen = open !== undefined ? open : !islandMobileCard.classList.contains('open');
      islandMobileCard.classList.toggle('open', isOpen);
      if (islandMobileOverlay) islandMobileOverlay.classList.toggle('open', isOpen);
      islandMobileToggle.classList.toggle('active', isOpen);
      islandMobileToggle.setAttribute('aria-expanded', isOpen);
      islandMobileCard.setAttribute('aria-hidden', !isOpen);
    };

    islandMobileToggle.addEventListener('click', () => toggleIslandDrawer());

    if (islandMobileOverlay) {
      islandMobileOverlay.addEventListener('click', () => toggleIslandDrawer(false));
    }

    islandMobileCard.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => toggleIslandDrawer(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && islandMobileCard.classList.contains('open')) {
        toggleIslandDrawer(false);
      }
    });
  }

  // Lucide Icons Auto-Initialization
  function initLucideIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({
        attrs: {
          'stroke-width': 1.85,
          class: 'lucide-icon'
        }
      });
    }
  }

  initLucideIcons();
  window.refreshIcons = initLucideIcons;
});

