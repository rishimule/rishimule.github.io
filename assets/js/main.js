/* ============================================================
   main.js — Editorial Portfolio
   ============================================================ */

(function () {
  'use strict';

  /* --- Roman numeral helper --- */
  var ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];

  /* ==========================================================
     Renderers — each populates a section from JSON data
     ========================================================== */

  function renderHero(personal) {
    var parts = personal.name.split(' ');
    document.getElementById('hero-text').innerHTML =
      '<h1>' + parts.join('<br>') + '</h1>' +
      '<p class="hero-subtitle">' + personal.title + '</p>' +
      '<div class="hero-links">' +
        '<a href="#work" class="link-gold">View Selected Work &darr;</a>' +
        '<a href="./' + personal.resumePath + '" target="_blank" class="link-gold">Download Resume &rarr;</a>' +
      '</div>';

    document.getElementById('hero-portrait').innerHTML =
      '<div class="portrait-frame">' +
        '<img src="' + personal.profileImage + '" alt="' + personal.name + '" width="356" height="475">' +
      '</div>';
  }

  function renderAbout(personal) {
    document.getElementById('about-content').innerHTML =
      personal.about.map(function (p) { return '<p>' + p + '</p>'; }).join('');
  }

  function renderExperience(entries) {
    document.getElementById('experience-content').innerHTML =
      entries.map(function (entry) {
        var desc = Array.isArray(entry.description)
          ? entry.description.map(function (d) { return '<p>' + d + '</p>'; }).join('')
          : '<p>' + entry.description + '</p>';
        return (
          '<div class="entry-row">' +
            '<div class="entry-meta">' +
              '<span class="meta">' + entry.startDate + ' &ndash; ' + entry.endDate + '</span>' +
              '<h3>' + entry.company + '</h3>' +
            '</div>' +
            '<div class="entry-detail">' +
              '<h3>' + entry.role + '</h3>' +
              '<span class="meta">' + entry.location + '</span>' +
              desc +
            '</div>' +
          '</div>'
        );
      }).join('');
  }

  function renderEducation(entries) {
    document.getElementById('education-content').innerHTML =
      entries.map(function (entry) {
        var metaParts = [entry.location];
        if (entry.gpa) metaParts.push('GPA: ' + entry.gpa);
        var meta = metaParts.join(' &middot; ');

        var extra = '';
        if (entry.coursework) {
          extra += '<p class="coursework"><strong>Coursework:</strong> ' + entry.coursework + '</p>';
        }
        if (entry.description) {
          extra += '<p>' + entry.description + '</p>';
        }

        return (
          '<div class="entry-row">' +
            '<div class="entry-meta">' +
              '<span class="meta">' + entry.startDate + ' &ndash; ' + entry.endDate + '</span>' +
              '<h3>' + entry.degree + '</h3>' +
            '</div>' +
            '<div class="entry-detail">' +
              '<h3>' + entry.institution + '</h3>' +
              '<span class="meta">' + meta + '</span>' +
              extra +
            '</div>' +
          '</div>'
        );
      }).join('');
  }

  function renderProjects(projects) {
    var container = document.getElementById('work-content');
    var html = '<div class="projects-container">';
    var buffer = [];
    var index = 0;

    function flushBuffer() {
      if (buffer.length === 0) return '';
      var out = '<div class="project-pair">';
      buffer.forEach(function (item) {
        out += buildCard(item.project, item.num);
      });
      if (buffer.length === 1) out += '<div></div>';
      out += '</div>';
      buffer = [];
      return out;
    }

    function buildFeatured(project, num) {
      return (
        '<div class="project-featured reveal">' +
          '<div>' +
            '<div class="project-number">' + num + '</div>' +
            '<h3 class="project-title"><a href="' + project.link + '" target="_blank" rel="noopener">' + project.title + '</a></h3>' +
            '<p class="project-desc">' + project.description + '</p>' +
            buildTags(project.tags) +
            '<a href="' + project.link + '" target="_blank" rel="noopener" class="project-link">' + (project.linkText || 'View Project') + ' &rarr;</a>' +
          '</div>' +
          '<div>' +
            '<div class="project-number"></div>' +
          '</div>' +
        '</div>'
      );
    }

    function buildCard(project, num) {
      return (
        '<div class="project-card reveal">' +
          '<div class="project-number">' + num + '</div>' +
          '<h3 class="project-title"><a href="' + project.link + '" target="_blank" rel="noopener">' + project.title + '</a></h3>' +
          '<p class="project-desc">' + project.description + '</p>' +
          buildTags(project.tags) +
          '<a href="' + project.link + '" target="_blank" rel="noopener" class="project-link">' + (project.linkText || 'View on GitHub') + ' &rarr;</a>' +
        '</div>'
      );
    }

    function buildTags(tags) {
      return '<div class="project-tags">' +
        tags.map(function (t) { return '<span class="project-tag">' + t + '</span>'; }).join('') +
        '</div>';
    }

    projects.forEach(function (project) {
      var num = ROMAN[index] || String(index + 1);
      if (project.featured) {
        html += flushBuffer();
        html += buildFeatured(project, num);
      } else {
        buffer.push({ project: project, num: num });
        if (buffer.length === 2) {
          html += flushBuffer();
        }
      }
      index++;
    });

    html += flushBuffer();
    html += '</div>';
    container.innerHTML = html;
  }

  function renderSkills(categories) {
    document.getElementById('skills-content').innerHTML =
      categories.map(function (cat) {
        var items = cat.items.map(function (item) {
          return '<code>' + item + '</code>';
        }).join(', ');
        return (
          '<div class="skill-row">' +
            '<div class="skill-category">' + cat.category + '</div>' +
            '<div class="skill-list">' + items + '</div>' +
          '</div>'
        );
      }).join('');
  }

  function renderPublications(pubs) {
    document.getElementById('publication-content').innerHTML =
      pubs.map(function (pub) {
        return (
          '<div class="citation">' +
            '<p class="citation-title">' + pub.title + '</p>' +
            '<p class="citation-journal">' + pub.journal + ' &mdash; ' + pub.volume + ' &mdash; ' + pub.date + '</p>' +
            '<a href="' + pub.link + '" target="_blank" rel="noopener" class="link-gold">View Publication &rarr;</a>' +
          '</div>'
        );
      }).join('');
  }

  function renderCertifications(certs) {
    document.getElementById('certifications-content').innerHTML =
      '<ol class="cert-list">' +
      certs.map(function (cert) {
        return (
          '<li>' +
            '<span class="cert-name">' + cert.name + '</span> &mdash; ' +
            '<span class="cert-provider">' + cert.provider + ', ' + cert.date + '</span> &mdash; ' +
            '<a href="' + cert.link + '" target="_blank" rel="noopener" class="cert-link">Verify</a>' +
          '</li>'
        );
      }).join('') +
      '</ol>';
  }

  function renderFooter(personal) {
    document.getElementById('footer-contact').innerHTML =
      '<a href="mailto:' + personal.email + '">' + personal.email + '</a>' +
      '<a href="tel:+1' + personal.phone.replace(/-/g, '') + '">' + personal.phone + '</a>';

    var socialHTML = '';
    if (personal.social.github) {
      socialHTML += '<a href="' + personal.social.github + '" target="_blank" rel="noopener">GitHub</a>';
    }
    if (personal.social.linkedin) {
      socialHTML += '<a href="' + personal.social.linkedin + '" target="_blank" rel="noopener">LinkedIn</a>';
    }
    document.getElementById('footer-social').innerHTML = socialHTML;
  }

  function renderResumeModal(personal) {
    var path = './' + personal.resumePath;

    document.getElementById('resumeFallback').innerHTML =
      '<p>Resume preview is not available on this device.</p>' +
      '<a href="' + path + '" target="_blank" class="btn-modal btn-modal-primary">Open Resume</a>';

    document.getElementById('resumeFooter').innerHTML =
      '<a href="' + path + '" target="_blank" class="btn-modal btn-modal-primary">Open in New Tab</a>' +
      '<a href="' + path + '" download class="btn-modal">Download</a>';
  }

  /* ==========================================================
     Interactions — theme, nav, modal, scroll reveal
     ========================================================== */

  function initScrollReveal() {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      if (!el.classList.contains('visible')) {
        revealObserver.observe(el);
      }
    });
  }

  function initNavigation() {
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

    /* Nav scroll state */
    var nav = document.getElementById('navbar');
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  function initMobileMenu() {
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
  }

  function initThemeToggle() {
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
  }

  function initResumeModal(resumePath) {
    var modal = document.getElementById('resumeModal');
    var iframe = document.getElementById('resumeIframe');
    var closeBtn = document.getElementById('resumeClose');
    var toggle = document.getElementById('navToggle');
    var mobileMenu = document.getElementById('mobileMenu');
    var iframeLoaded = false;
    var url = './' + resumePath;

    function openResume(e) {
      if (e) e.preventDefault();
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (!iframeLoaded) {
        iframe.src = url;
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
        if (mobileMenu) mobileMenu.classList.remove('open');
        if (toggle) toggle.textContent = 'Menu';
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
  }

  /* ==========================================================
     Data Loading — fetch all JSON, render, init interactions
     ========================================================== */

  async function loadData() {
    try {
      var responses = await Promise.all([
        fetch('data/personal.json').then(function (r) { return r.json(); }),
        fetch('data/experience.json').then(function (r) { return r.json(); }),
        fetch('data/education.json').then(function (r) { return r.json(); }),
        fetch('data/projects.json').then(function (r) { return r.json(); }),
        fetch('data/skills.json').then(function (r) { return r.json(); }),
        fetch('data/publications.json').then(function (r) { return r.json(); }),
        fetch('data/certifications.json').then(function (r) { return r.json(); })
      ]);

      var personal       = responses[0];
      var experience     = responses[1];
      var education      = responses[2];
      var projects       = responses[3];
      var skills         = responses[4];
      var publications   = responses[5];
      var certifications = responses[6];

      renderHero(personal);
      renderAbout(personal);
      renderExperience(experience);
      renderEducation(education);
      renderProjects(projects);
      renderSkills(skills);
      renderPublications(publications);
      renderCertifications(certifications);
      renderFooter(personal);
      renderResumeModal(personal);

      initScrollReveal();
      initNavigation();
      initResumeModal(personal.resumePath);
    } catch (error) {
      console.error('Failed to load portfolio data:', error);
    }
  }

  /* ==========================================================
     Bootstrap — init non-data-dependent features immediately,
     then load data
     ========================================================== */

  initThemeToggle();
  initMobileMenu();
  loadData();

})();
