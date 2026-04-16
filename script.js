/* ============================================================
   FITPULSE — Premium Fitness Tracker JavaScript
   ============================================================
   All interactive features: counters, scroll reveals, tilt cards,
   BMI calculator, water tracker, testimonial slider, form validation,
   localStorage support, charts, particles, and more.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ── Cached DOM Elements ───────────────────────────────────
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinksContainer = document.getElementById('nav-links');
  const spotlight = document.getElementById('mouse-spotlight');
  const heroParticles = document.getElementById('hero-particles');

  // ── LocalStorage Helper ───────────────────────────────────
  const Storage = {
    get(key, fallback) {
      try {
        const val = localStorage.getItem('fitpulse_' + key);
        return val !== null ? JSON.parse(val) : fallback;
      } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem('fitpulse_' + key, JSON.stringify(value)); }
      catch { /* quota exceeded */ }
    }
  };

  // ============================================================
  // 1. NAVBAR — Scroll effect & Active section tracking
  // ============================================================
  let lastScroll = 0;
  function handleScroll() {
    const scrollY = window.scrollY;

    // Navbar background
    navbar.classList.toggle('scrolled', scrollY > 60);

    // Active section
    const sections = document.querySelectorAll('.section');
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 150;
      if (scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });

    lastScroll = scrollY;
  }
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ============================================================
  // 2. MOBILE MENU TOGGLE
  // ============================================================
  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('open');
    navLinksContainer.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('open');
      navLinksContainer.classList.remove('open');
    });
  });

  // ============================================================
  // 3. MOUSE SPOTLIGHT EFFECT
  // ============================================================
  let mouseX = 0, mouseY = 0, spotX = 0, spotY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    spotlight.classList.add('visible');
  });
  document.addEventListener('mouseleave', () => {
    spotlight.classList.remove('visible');
  });
  function animateSpotlight() {
    spotX += (mouseX - spotX) * 0.08;
    spotY += (mouseY - spotY) * 0.08;
    spotlight.style.left = spotX + 'px';
    spotlight.style.top = spotY + 'px';
    requestAnimationFrame(animateSpotlight);
  }
  animateSpotlight();

  // ============================================================
  // 4. HERO PARTICLES
  // ============================================================
  function createParticles() {
    if (!heroParticles) return;
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = (Math.random() * 100 + 50) + '%';
      p.style.width = p.style.height = (Math.random() * 4 + 2) + 'px';
      p.style.animationDuration = (Math.random() * 8 + 6) + 's';
      p.style.animationDelay = (Math.random() * 6) + 's';
      const colors = ['var(--accent)', 'var(--cyan)', 'var(--purple)', 'rgba(255,255,255,0.3)'];
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      heroParticles.appendChild(p);
    }
  }
  createParticles();

  // ============================================================
  // 5. SCROLL REVEAL ANIMATIONS
  // ============================================================
  const revealElements = document.querySelectorAll('.reveal');

  function revealOnScroll() {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight - 80) {
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('visible'), delay);
      }
    });
  }
  window.addEventListener('scroll', revealOnScroll, { passive: true });
  revealOnScroll(); // Initial check

  // ============================================================
  // 6. ANIMATED COUNTERS
  // ============================================================
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ============================================================
  // 7. PROGRESS BARS ANIMATION
  // ============================================================
  const progressBars = document.querySelectorAll('.dash-progress-fill');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.dataset.width;
        setTimeout(() => { fill.style.width = width + '%'; }, 200);
        barObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });
  progressBars.forEach(bar => barObserver.observe(bar));

  // ============================================================
  // 8. BAR CHARTS ANIMATION
  // ============================================================
  const bars = document.querySelectorAll('.bar');
  const barChartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const height = bar.dataset.height;
        setTimeout(() => { bar.style.height = height + '%'; }, 300);
        barChartObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.2 });
  bars.forEach(b => barChartObserver.observe(b));

  // ============================================================
  // 9. LINE CHART ANIMATION
  // ============================================================
  const lineChart = document.getElementById('weight-chart');
  if (lineChart) {
    const lineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const chartLine = lineChart.querySelector('.chart-line');
          const chartArea = lineChart.querySelector('.chart-area');
          const dots = lineChart.querySelectorAll('.chart-dot');
          if (chartLine) chartLine.classList.add('animate');
          if (chartArea) chartArea.classList.add('animate');
          dots.forEach((dot, i) => {
            setTimeout(() => dot.classList.add('animate'), 300 + i * 150);
          });
          lineObserver.unobserve(lineChart);
        }
      });
    }, { threshold: 0.3 });
    lineObserver.observe(lineChart);
  }

  // ============================================================
  // 10. CONSISTENCY GRID (Workout Consistency)
  // ============================================================
  const consistencyGrid = document.getElementById('consistency-grid');
  if (consistencyGrid) {
    const activeDays = [1,2,3,5,6,7,8,10,11,12,13,14,15,17,18,19,20,22,23,24,26,27];
    const moderateDays = [4,9,16,21,25];
    for (let i = 1; i <= 28; i++) {
      const cell = document.createElement('div');
      cell.className = 'consistency-cell';
      if (activeDays.includes(i)) cell.classList.add('active');
      else if (moderateDays.includes(i)) cell.classList.add('moderate');
      consistencyGrid.appendChild(cell);
    }
  }

  // ============================================================
  // 11. TILT / 3D CARD EFFECT ON HOVER
  // ============================================================
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
    });
  });

  // ============================================================
  // 12. WATER INTAKE TRACKER
  // ============================================================
  let waterCount = Storage.get('waterCount', 5);
  const waterGlasses = document.querySelectorAll('.water-glass');
  const waterCountDisplay = document.getElementById('water-count');
  const nutritionWaterCount = document.getElementById('nutrition-water-count');
  const nutritionWaterFill = document.getElementById('nutrition-water-fill');

  function updateWaterUI() {
    waterGlasses.forEach((glass, i) => {
      glass.classList.toggle('filled', i < waterCount);
    });
    if (waterCountDisplay) waterCountDisplay.textContent = waterCount;
    if (nutritionWaterCount) nutritionWaterCount.textContent = waterCount;
    if (nutritionWaterFill) nutritionWaterFill.style.width = (waterCount / 8 * 100) + '%';
    Storage.set('waterCount', waterCount);
  }

  waterGlasses.forEach((glass, index) => {
    glass.addEventListener('click', () => {
      waterCount = index + 1;
      // If clicking same glass that's last filled, toggle off
      if (waterCount === parseInt(glass.dataset.glass) && glass.classList.contains('filled')) {
        const allFilledBefore = Array.from(waterGlasses).filter((g, i) => i < index && g.classList.contains('filled'));
        if (allFilledBefore.length === index) {
          waterCount = index;
        }
      }
      updateWaterUI();
    });
  });
  updateWaterUI();

  // ============================================================
  // 13. WORKOUT COMPLETION TRACKER
  // ============================================================
  const completeBtn = document.getElementById('complete-workout-btn');
  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      const pendingItems = document.querySelectorAll('.wi-badge.pending');
      if (pendingItems.length > 0) {
        const item = pendingItems[0];
        item.classList.remove('pending');
        item.classList.add('done');
        item.textContent = '✓ Done';
        // Animate
        item.parentElement.style.transform = 'scale(1.03)';
        setTimeout(() => { item.parentElement.style.transform = 'scale(1)'; }, 300);

        if (document.querySelectorAll('.wi-badge.pending').length === 0) {
          completeBtn.textContent = 'All Done! 🎉';
          completeBtn.disabled = true;
          completeBtn.style.opacity = '0.6';
        }
      }
    });
  }

  // ============================================================
  // 14. BMI CALCULATOR
  // ============================================================
  const bmiBtn = document.getElementById('bmi-calc-btn');
  const bmiHeightInput = document.getElementById('bmi-height');
  const bmiWeightInput = document.getElementById('bmi-weight');
  const bmiResult = document.getElementById('bmi-result');
  const bmiValueEl = document.getElementById('bmi-value');
  const bmiCategoryEl = document.getElementById('bmi-category');
  const bmiMessageEl = document.getElementById('bmi-message');
  const bmiRingFill = document.getElementById('bmi-ring-fill');

  if (bmiBtn) {
    bmiBtn.addEventListener('click', calculateBMI);
  }

  function calculateBMI() {
    const height = parseFloat(bmiHeightInput.value);
    const weight = parseFloat(bmiWeightInput.value);

    if (!height || !weight || height <= 0 || weight <= 0) {
      shakeElement(bmiHeightInput.parentElement);
      shakeElement(bmiWeightInput.parentElement);
      return;
    }

    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    const bmiRound = Math.round(bmi * 10) / 10;

    let category, message, color;
    if (bmi < 18.5) {
      category = 'Underweight';
      message = 'You might want to focus on nutrient-rich foods and healthy weight gain strategies.';
      color = '#00b0ff';
    } else if (bmi < 25) {
      category = 'Normal';
      message = 'Great job! You\'re in a healthy weight range. Keep maintaining your balanced lifestyle.';
      color = '#00e5a0';
    } else if (bmi < 30) {
      category = 'Overweight';
      message = 'Consider increasing physical activity and adjusting your diet for better health outcomes.';
      color = '#ff6b35';
    } else {
      category = 'Obese';
      message = 'We recommend consulting a healthcare provider and starting with our guided workout plans.';
      color = '#ff4757';
    }

    // Show result
    bmiResult.style.display = 'block';
    bmiValueEl.textContent = bmiRound;
    bmiCategoryEl.textContent = category;
    bmiCategoryEl.style.color = color;
    bmiMessageEl.textContent = message;

    // Animate ring
    const percentage = Math.min((bmi / 40) * 100, 100);
    const circumference = 2 * Math.PI * 60; // r=60
    const offset = circumference - (circumference * percentage / 100);
    bmiRingFill.style.stroke = color;
    setTimeout(() => {
      bmiRingFill.style.strokeDashoffset = offset;
    }, 100);

    // Highlight active scale
    document.querySelectorAll('.bmi-scale-item').forEach(item => item.classList.remove('active'));
    const cat = category.toLowerCase();
    const activeItem = document.querySelector(`.bmi-scale-item.${cat}`);
    if (activeItem) activeItem.classList.add('active');

    // Save to localStorage
    Storage.set('lastBMI', { height, weight, bmi: bmiRound, category });

    // Scroll to result
    bmiResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function shakeElement(el) {
    el.style.animation = 'shake 0.5s';
    el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
  }

  // Add shake keyframes dynamically
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  // Load saved BMI
  const savedBMI = Storage.get('lastBMI', null);
  if (savedBMI) {
    bmiHeightInput.value = savedBMI.height;
    bmiWeightInput.value = savedBMI.weight;
  }

  // ============================================================
  // 15. TESTIMONIAL SLIDER
  // ============================================================
  const track = document.getElementById('testimonial-track');
  const cards = track ? track.querySelectorAll('.testimonial-card') : [];
  const dotsContainer = document.getElementById('slider-dots');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  let currentSlide = 0;
  let autoSlideInterval;

  if (track && cards.length > 0) {
    // Create dots
    cards.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
      currentSlide = index;
      track.style.transform = `translateX(-${index * 100}%)`;
      document.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.classList.toggle('active', i === index);
      });
    }

    prevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + cards.length) % cards.length;
      goToSlide(currentSlide);
      resetAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % cards.length;
      goToSlide(currentSlide);
      resetAutoSlide();
    });

    // Auto-rotate
    function startAutoSlide() {
      autoSlideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % cards.length;
        goToSlide(currentSlide);
      }, 5000);
    }
    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    }
    startAutoSlide();
  }

  // ============================================================
  // 16. CONTACT FORM VALIDATION
  // ============================================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const name = document.getElementById('contact-name');
      const email = document.getElementById('contact-email');
      const message = document.getElementById('contact-message');
      const nameError = document.getElementById('name-error');
      const emailError = document.getElementById('email-error');
      const messageError = document.getElementById('message-error');

      // Reset
      [name, email, message].forEach(el => el.classList.remove('error'));
      [nameError, emailError, messageError].forEach(el => el.textContent = '');

      if (!name.value.trim()) {
        name.classList.add('error');
        nameError.textContent = 'Please enter your name';
        valid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        email.classList.add('error');
        emailError.textContent = 'Please enter a valid email';
        valid = false;
      }

      if (!message.value.trim()) {
        message.classList.add('error');
        messageError.textContent = 'Please enter a message';
        valid = false;
      }

      if (valid) {
        // Simulate send
        const successMsg = document.getElementById('form-success');
        successMsg.style.display = 'block';
        contactForm.reset();
        setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
      }
    });
  }

  // ============================================================
  // 17. NEWSLETTER SUBSCRIPTION
  // ============================================================
  const newsletterBtn = document.getElementById('newsletter-btn');
  if (newsletterBtn) {
    newsletterBtn.addEventListener('click', () => {
      const email = document.getElementById('newsletter-email');
      const success = document.getElementById('newsletter-success');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (emailRegex.test(email.value.trim())) {
        success.style.display = 'block';
        email.value = '';
        Storage.set('newsletter', true);
        setTimeout(() => { success.style.display = 'none'; }, 4000);
      } else {
        shakeElement(email);
      }
    });
  }

  // ============================================================
  // 18. DAILY STEP COUNTER SIMULATION
  // ============================================================
  // Simulate step updates every few seconds in dashboard
  let currentSteps = Storage.get('dailySteps', 8542);
  const dashSteps = document.getElementById('dash-steps');

  function simulateSteps() {
    if (!dashSteps) return;
    const add = Math.floor(Math.random() * 30) + 5;
    currentSteps = Math.min(currentSteps + add, 15000);
    dashSteps.textContent = currentSteps.toLocaleString();
    dashSteps.dataset.target = currentSteps;
    Storage.set('dailySteps', currentSteps);

    // Update progress bar
    const stepsBar = dashSteps.closest('.dash-card')?.querySelector('.dash-progress-fill');
    if (stepsBar) {
      const pct = Math.min((currentSteps / 10000) * 100, 100);
      stepsBar.style.width = pct + '%';
    }

    setTimeout(simulateSteps, Math.random() * 5000 + 3000);
  }
  setTimeout(simulateSteps, 5000);

  // ============================================================
  // 19. GOAL TRACKER (LocalStorage)
  // ============================================================
  // Save goal progress
  const goals = Storage.get('goals', { weightLoss: 72, muscleGain: 58, flexibility: 45 });
  const goalBars = document.querySelectorAll('.goal-item');
  if (goalBars.length >= 3) {
    const vals = [goals.weightLoss, goals.muscleGain, goals.flexibility];
    goalBars.forEach((item, i) => {
      const fill = item.querySelector('.dash-progress-fill');
      const info = item.querySelector('.goal-info span:last-child');
      if (fill) fill.dataset.width = vals[i];
      if (info) info.textContent = vals[i] + '%';
    });
  }

  // ============================================================
  // 20. PLAN BUTTONS (Interactive)
  // ============================================================
  document.querySelectorAll('.plan-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.textContent === 'Start Plan') {
        btn.textContent = 'Plan Active ✓';
        btn.style.background = 'var(--purple)';
        btn.style.color = '#fff';
        const planName = btn.closest('.plan-card').querySelector('h3').textContent;
        Storage.set('activePlan', planName);
      } else {
        btn.textContent = 'Start Plan';
        btn.style.background = '';
        btn.style.color = '';
        Storage.set('activePlan', null);
      }
    });
  });

  // Restore active plan
  const activePlan = Storage.get('activePlan', null);
  if (activePlan) {
    document.querySelectorAll('.plan-card h3').forEach(h3 => {
      if (h3.textContent === activePlan) {
        const btn = h3.closest('.plan-card').querySelector('.plan-btn');
        btn.textContent = 'Plan Active ✓';
        btn.style.background = 'var(--purple)';
        btn.style.color = '#fff';
      }
    });
  }

  // ============================================================
  // 21. SMOOTH SECTION NAV LINKS
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ============================================================
  // 22. PARALLAX EFFECT — Hero Glow
  // ============================================================
  const heroGlow = document.querySelector('.hero-glow');
  window.addEventListener('scroll', () => {
    if (heroGlow) {
      const scrollY = window.scrollY;
      heroGlow.style.transform = `translate(${scrollY * 0.1}px, ${scrollY * 0.15}px) scale(${1 + scrollY * 0.0003})`;
    }
  }, { passive: true });

  // ============================================================
  // 23. KEYBOARD ACCESSIBILITY — Enter/Space on buttons
  // ============================================================
  document.querySelectorAll('.water-glass, .slider-btn, .slider-dot').forEach(el => {
    el.setAttribute('tabindex', '0');
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });

  // ============================================================
  // INITIALIZATION COMPLETE
  // ============================================================
  console.log('%c⚡ FitPulse loaded successfully', 'color: #00e5a0; font-weight: bold; font-size: 14px;');
});
