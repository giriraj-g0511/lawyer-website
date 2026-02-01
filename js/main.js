/**
 * Sterling Legal - Law Firm Website
 * Main JavaScript - Navigation, Animations, Form Handling
 */

(function () {
  'use strict';

  // --- Navigation ---
  const header = document.querySelector('.header');
  const navToggle = document.querySelector('.nav__toggle');
  const navMenu = document.querySelector('.nav__menu');
  const navLinks = document.querySelectorAll('.nav__link');

  function toggleNav() {
    if (!navMenu || !navToggle) return;
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeNav() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle?.addEventListener('click', toggleNav);

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeNav();
    });
  });

  // Header scroll effect
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // --- Scroll Animations ---
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  animatedElements.forEach((el) => observer.observe(el));

  // --- Counter Animation (Why Choose Us) ---
  const counterElements = document.querySelectorAll('.why-us__number[data-count]');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        counterElements.forEach((el) => animateCounter(el));
      }
    });
  }, { threshold: 0.3 });

  const whyUsSection = document.querySelector('.why-us__grid');
  if (whyUsSection) counterObserver.observe(whyUsSection);

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        el.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(updateCounter);
  }

  // --- Testimonial Slider ---
  const testimonials = document.querySelectorAll('.testimonial');
  const testimonialDots = document.querySelectorAll('.testimonials__dot');
  let currentTestimonial = 0;
  let testimonialInterval;

  function showTestimonial(index) {
    currentTestimonial = (index + testimonials.length) % testimonials.length;

    testimonials.forEach((t, i) => {
      t.classList.toggle('testimonial--active', i === currentTestimonial);
    });

    testimonialDots.forEach((dot, i) => {
      dot.classList.toggle('testimonials__dot--active', i === currentTestimonial);
      dot.setAttribute('aria-pressed', i === currentTestimonial ? 'true' : 'false');
    });
  }

  function nextTestimonial() {
    showTestimonial(currentTestimonial + 1);
  }

  function startTestimonialAutoPlay() {
    testimonialInterval = setInterval(nextTestimonial, 6000);
  }

  function stopTestimonialAutoPlay() {
    clearInterval(testimonialInterval);
  }

  testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showTestimonial(index);
      stopTestimonialAutoPlay();
      startTestimonialAutoPlay();
    });
  });

  if (testimonials.length > 1) {
    startTestimonialAutoPlay();
  }

  // --- Contact Form ---
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formSuccess = document.getElementById('form-success');

  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    phone: {
      required: false,
      pattern: /^[\d\s\-\(\)\+]*$/
    },
    message: {
      required: true,
      minLength: 10,
      maxLength: 2000
    }
  };

  function validateField(field) {
    const value = field.value.trim();
    const name = field.name;
    const rules = validationRules[name];
    if (!rules) return true;

    const errorEl = document.getElementById(`${name}-error`);
    const formGroup = field.closest('.form__group');

    formGroup?.classList.remove('form__group--error');
    if (errorEl) errorEl.textContent = '';

    if (rules.required && !value) {
      formGroup?.classList.add('form__group--error');
      if (errorEl) errorEl.textContent = 'This field is required';
      return false;
    }

    if (!value && !rules.required) return true;

    if (rules.minLength && value.length < rules.minLength) {
      formGroup?.classList.add('form__group--error');
      if (errorEl) errorEl.textContent = `Minimum ${rules.minLength} characters required`;
      return false;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      formGroup?.classList.add('form__group--error');
      if (errorEl) errorEl.textContent = `Maximum ${rules.maxLength} characters allowed`;
      return false;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      formGroup?.classList.add('form__group--error');
      if (errorEl) errorEl.textContent = name === 'email' ? 'Please enter a valid email' : 'Please enter a valid value';
      return false;
    }

    return true;
  }

  function validateForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('input[required], textarea[required], input[name="phone"]');
    fields.forEach((field) => {
      if (!validateField(field)) isValid = false;
    });
    return isValid;
  }

  // Real-time validation on blur
  contactForm?.addEventListener('blur', (e) => {
    if (e.target.matches('input, textarea')) {
      validateField(e.target);
    }
  }, true);

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm(contactForm)) {
      contactForm.querySelector('.form__group--error input, .form__group--error textarea')?.focus();
      return;
    }

    submitBtn?.classList.add('btn--loading');
    submitBtn?.setAttribute('disabled', 'true');
    if (formSuccess) {
      formSuccess.classList.remove('visible', 'form__success--error');
      formSuccess.textContent = '';
    }

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        let successMsg = 'Thank you for your message. We will get back to you within 24 hours.';
        try {
          const data = await response.json();
          if (data.message) successMsg = data.message;
        } catch (_) {
          /* use default message */
        }
        if (formSuccess) {
          formSuccess.classList.remove('form__success--error');
          formSuccess.textContent = successMsg;
          formSuccess.classList.add('visible');
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        contactForm.reset();
        contactForm.querySelectorAll('.form__group--error').forEach((g) => g.classList.remove('form__group--error'));
        contactForm.querySelectorAll('.form__error').forEach((el) => { el.textContent = ''; });
      } else {
        let errorMsg = 'Something went wrong. Please try again or call us directly.';
        try {
          const data = await response.json();
          if (data.error) errorMsg = data.error;
        } catch (_) {
          /* response was not JSON (e.g. HTML error page) */
        }
        if (formSuccess) {
          formSuccess.classList.add('form__success--error');
          formSuccess.textContent = errorMsg;
          formSuccess.classList.add('visible');
        }
      }
    } catch (err) {
      if (formSuccess) {
        formSuccess.classList.add('form__success--error');
        formSuccess.textContent = 'Unable to send message. Please try again or call us at (212) 555-1234.';
        formSuccess.classList.add('visible');
      }
    } finally {
      submitBtn?.classList.remove('btn--loading');
      submitBtn?.removeAttribute('disabled');
    }
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
