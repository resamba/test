/* ============================================================
   PREMIUM DARK MINIMALIST PORTFOLIO — MAIN SCRIPT
   ============================================================ */

(function () {
  'use strict';

  // ---- DOM References ----
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');
  const backToTop = document.querySelector('.back-to-top');
  const sections = document.querySelectorAll('section[id]');
  const reveals = document.querySelectorAll('.reveal');

  // ---- Navbar scroll effect ----
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // ---- Active nav link on scroll ----
  function updateActiveLink() {
    const scrollPos = window.scrollY + 200;
    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // ---- Mobile menu toggle ----
  function toggleMobileMenu() {
    mobileToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    mobileToggle.setAttribute(
      'aria-expanded',
      mobileMenu.classList.contains('active').toString()
    );
  }

  function closeMobileMenu() {
    mobileToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
    mobileToggle.setAttribute('aria-expanded', 'false');
  }

  mobileToggle.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll('.nav-link, .mobile-cta').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close mobile menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // ---- Smooth scrolling for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Scroll reveal (Intersection Observer) ----
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  reveals.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ---- Back to top ----
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Contact form validation & submission ----
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(inputId, message) {
    var input = document.getElementById(inputId);
    var errorEl = document.getElementById(inputId + 'Error');
    if (input) input.classList.add('error');
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(inputId) {
    var input = document.getElementById(inputId);
    var errorEl = document.getElementById(inputId + 'Error');
    if (input) input.classList.remove('error');
    if (errorEl) errorEl.textContent = '';
  }

  function clearAllErrors() {
    ['name', 'email', 'subject', 'message'].forEach(clearError);
  }

  function validateForm() {
    var isValid = true;
    clearAllErrors();

    var name = document.getElementById('name').value.trim();
    var email = document.getElementById('email').value.trim();
    var subject = document.getElementById('subject').value.trim();
    var message = document.getElementById('message').value.trim();

    if (!name) {
      showError('name', 'Please enter your name.');
      isValid = false;
    } else if (name.length < 2) {
      showError('name', 'Name must be at least 2 characters.');
      isValid = false;
    }

    if (!email) {
      showError('email', 'Please enter your email address.');
      isValid = false;
    } else if (!validateEmail(email)) {
      showError('email', 'Please enter a valid email address.');
      isValid = false;
    }

    if (!subject) {
      showError('subject', 'Please enter a subject.');
      isValid = false;
    }

    if (!message) {
      showError('message', 'Please enter your message.');
      isValid = false;
    } else if (message.length < 10) {
      showError('message', 'Message must be at least 10 characters.');
      isValid = false;
    }

    return isValid;
  }

  // Clear errors on input
  ['name', 'email', 'subject', 'message'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', function () {
        clearError(id);
      });
    }
  });

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateForm()) return;

      // Show loading state
      var btnText = submitBtn.querySelector('.btn-text');
      var btnLoading = submitBtn.querySelector('.btn-loading');
      var btnIcon = submitBtn.querySelector('svg:last-child');
      submitBtn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnLoading) btnLoading.style.display = 'inline-flex';
      if (btnIcon) btnIcon.style.display = 'none';

      // Prepare form data
      var formData = new FormData(contactForm);

      // Submit via fetch
      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })
        .then(function (response) {
          if (response.ok) {
            formStatus.textContent =
              'Thank you! Your message has been sent successfully. I\'ll get back to you soon.';
            formStatus.className = 'form-status success';
            contactForm.reset();
          } else {
            return response.json().then(function (data) {
              var errorMsg =
                data && data.errors
                  ? data.errors.map(function (err) { return err.message; }).join(', ')
                  : 'Something went wrong. Please try again or email me directly.';
              throw new Error(errorMsg);
            });
          }
        })
        .catch(function (error) {
          formStatus.textContent =
            error.message ||
            'Something went wrong. Please try again or email me directly.';
          formStatus.className = 'form-status error';
        })
        .finally(function () {
          submitBtn.disabled = false;
          if (btnText) btnText.style.display = '';
          if (btnLoading) btnLoading.style.display = 'none';
          if (btnIcon) btnIcon.style.display = '';
        });
    });
  }

  // ---- Scroll event listeners ----
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        handleNavbarScroll();
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  });

  // ---- Initial calls ----
  handleNavbarScroll();
  updateActiveLink();

  // ---- Page entrance: trigger hero reveals immediately ----
  window.addEventListener('load', function () {
    document.querySelectorAll('.hero .reveal').forEach(function (el, index) {
      setTimeout(function () {
        el.classList.add('active');
      }, 150 * (index + 1));
    });
  });
})();
