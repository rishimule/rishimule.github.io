/* ============================================================
   main.js — Editorial Portfolio
   ============================================================ */

(function () {
  'use strict';

  var RESUME_URL = './assets/Rishi_Mule_Resume.pdf';

  /* --- Scroll Reveal --- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* --- Active Nav Highlighting --- */
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  var sections = document.querySelectorAll('section[id], footer[id]');

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.15, rootMargin: '-60px 0px -40% 0px' });

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  /* --- Nav Scroll State --- */
  var nav = document.getElementById('navbar');
  var lastScroll = 0;

  window.addEventListener('scroll', function () {
    var currentScroll = window.scrollY;
    if (currentScroll > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  /* --- Mobile Menu --- */
  var toggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      toggle.textContent = isOpen ? 'Close' : 'Menu';
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        toggle.textContent = 'Menu';
      });
    });
  }

  /* --- Theme Toggle --- */
  var themeToggles = document.querySelectorAll('.theme-option');
  var currentTheme = document.documentElement.getAttribute('data-theme') || 'light';

  function setTheme(theme) {
    document.documentElement.classList.add('theme-transitioning');
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    themeToggles.forEach(function (btn) {
      var isActive = btn.getAttribute('data-theme') === theme;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    setTimeout(function () {
      document.documentElement.classList.remove('theme-transitioning');
    }, 600);
  }

  themeToggles.forEach(function (btn) {
    var isActive = btn.getAttribute('data-theme') === currentTheme;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  themeToggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setTheme(btn.getAttribute('data-theme'));
    });
  });

  /* --- Resume Modal --- */
  var modal = document.getElementById('resumeModal');
  var iframe = document.getElementById('resumeIframe');
  var closeBtn = document.getElementById('resumeClose');
  var iframeLoaded = false;

  function openResume(e) {
    if (e) e.preventDefault();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (!iframeLoaded) {
      iframe.src = RESUME_URL;
      iframeLoaded = true;
    }
  }

  function closeResume() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('resumeOpen').addEventListener('click', openResume);

  var resumeOpenMobile = document.getElementById('resumeOpenMobile');
  if (resumeOpenMobile) {
    resumeOpenMobile.addEventListener('click', function (e) {
      openResume(e);
      mobileMenu.classList.remove('open');
      toggle.textContent = 'Menu';
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeResume);

  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeResume();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeResume();
    }
  });

})();
