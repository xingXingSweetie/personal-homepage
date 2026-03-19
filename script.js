/* =====================================================
   SWEET KOALA PERSONAL HOMEPAGE - script.js
===================================================== */

(function () {
  'use strict';

  // ---- Custom Cursor ----
  const cursor = document.getElementById('cursor');
  let cursorEmojis = ['🐾', '🍓', '🥧', '🐨'];
  let cursorIndex = 0;

  // Only activate the custom cursor on devices with a precise pointer (mouse)
  var hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (hasFinePointer) {
    document.body.classList.add('custom-cursor-active');
  } else {
    // Hide the emoji cursor element on touch/coarse-pointer devices
    if (cursor) cursor.style.display = 'none';
  }

  document.addEventListener('mousemove', function (e) {
    if (!hasFinePointer) return;
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  // Cycle cursor emoji on click
  document.addEventListener('click', function () {
    if (!hasFinePointer) return;
    cursorIndex = (cursorIndex + 1) % cursorEmojis.length;
    cursor.textContent = cursorEmojis[cursorIndex];
    cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
    setTimeout(function () {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 200);
  });

  // Change cursor on hover of interactive elements
  document.querySelectorAll('a, button, [tabindex="0"]').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      if (!hasFinePointer) return;
      cursor.textContent = '🍓';
      cursor.style.transform = 'translate(-50%, -50%) scale(1.3)';
    });
    el.addEventListener('mouseleave', function () {
      if (!hasFinePointer) return;
      cursor.textContent = cursorEmojis[cursorIndex];
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });

  // ---- Floating Decorations ----
  var decoContainer = document.getElementById('floatingDeco');
  var decoItems = ['🍓', '🥧', '🐨', '💛', '🌸', '🍓', '🥧', '🍓'];

  function spawnDeco() {
    var el = document.createElement('span');
    el.className = 'deco-item';
    el.textContent = decoItems[Math.floor(Math.random() * decoItems.length)];
    var size = 0.9 + Math.random() * 0.8;
    var duration = 12 + Math.random() * 14;
    var left = Math.random() * 100;
    el.style.left = left + '%';
    el.style.fontSize = size + 'rem';
    el.style.animationDuration = duration + 's';
    el.style.animationDelay = '0s';
    decoContainer.appendChild(el);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, duration * 1000 + 500);
  }

  // Spawn initial decorations
  for (var i = 0; i < 6; i++) {
    setTimeout(spawnDeco, i * 1800);
  }
  setInterval(spawnDeco, 2500);

  // =====================================================
  // INTRO / OPENING ANIMATION
  // =====================================================
  var introScreen = document.getElementById('introScreen');
  var mainPage = document.getElementById('mainPage');
  var koalaMouth = document.getElementById('koalaMouth');
  var tartStrawberry = document.getElementById('tartStrawberry');
  var dropStrawberry = document.getElementById('dropStrawberry');
  var welcomeText = document.getElementById('welcomeText');
  var enterBtn = document.getElementById('enterBtn');
  var koalaWrap = document.getElementById('koalaWrap');
  var tartHold = document.getElementById('tartHold');

  // Timeline of intro animation
  // t=0.3s: koala rolls in (via CSS animation)
  // t=1.5s: ears wiggle (via CSS animation-delay)
  // t=2.2s: yawn
  // t=2.8s: strawberry drops
  // t=3.6s: koala rolls off / welcome text appears

  // Step 1: yawn at t=2.2s
  setTimeout(function () {
    if (koalaMouth) koalaMouth.classList.add('yawn');
    setTimeout(function () {
      if (koalaMouth) koalaMouth.classList.remove('yawn');
    }, 700);
  }, 2200);

  // Step 2: strawberry drops at t=2.8s
  setTimeout(function () {
    // Position the drop strawberry relative to intro stage
    var tartRect = tartHold ? tartHold.getBoundingClientRect() : null;
    if (tartStrawberry) tartStrawberry.style.opacity = '0';

    if (dropStrawberry && tartRect) {
      dropStrawberry.style.left = (tartRect.left + tartRect.width / 2) + 'px';
      dropStrawberry.style.top = (tartRect.top - 10) + 'px';
      dropStrawberry.style.position = 'fixed';
      dropStrawberry.classList.add('animate');
    }
  }, 2800);

  // Step 3: koala rolls away, welcome text appears at t=3.8s
  setTimeout(function () {
    if (koalaWrap) {
      koalaWrap.style.transition = 'all 0.9s cubic-bezier(0.4, 0, 0.8, 0.5)';
      koalaWrap.style.left = '120%';
      koalaWrap.style.transform = 'translateY(-50%) rotate(20deg)';
    }
  }, 3800);

  setTimeout(function () {
    if (welcomeText) welcomeText.classList.add('visible');
  }, 4600);

  // Step 4: Enter button click
  function enterMain() {
    introScreen.classList.add('hidden');
    mainPage.classList.add('visible');
    document.body.style.overflow = 'auto';
    startSkillAnimations();
  }

  if (enterBtn) {
    enterBtn.addEventListener('click', enterMain);
  }

  // Auto-enter after 9s if user hasn't clicked
  setTimeout(function () {
    if (!mainPage.classList.contains('visible')) {
      enterMain();
    }
  }, 9000);

  // =====================================================
  // NAVBAR
  // =====================================================
  var navbar = document.getElementById('navbar');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
  });

  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
    });
  });

  // Active nav link based on scroll position
  function updateActiveNav() {
    var sections = ['home', 'portfolio', 'about', 'resume', 'contact'];
    var scrollPos = window.scrollY + 120;
    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var link = document.querySelector('.nav-link[data-section="' + id + '"]');
      if (!link) return;
      if (el.offsetTop <= scrollPos && el.offsetTop + el.offsetHeight > scrollPos) {
        document.querySelectorAll('.nav-link').forEach(function (l) { l.classList.remove('active'); });
        link.classList.add('active');
      }
    });
  }

  // =====================================================
  // SCROLL REVEAL
  // =====================================================
  var revealEls = [];

  function setupReveal() {
    document.querySelectorAll('.section-header, .portfolio-card, .about-content, .resume-paper, .contact-content').forEach(function (el) {
      el.classList.add('reveal');
      revealEls.push(el);
    });
  }

  function checkReveal() {
    var windowHeight = window.innerHeight;
    revealEls.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < windowHeight - 80) {
        el.classList.add('revealed');
      }
    });
  }

  // =====================================================
  // SKILL BARS
  // =====================================================
  function startSkillAnimations() {
    setupReveal();
    window.addEventListener('scroll', checkReveal);
    checkReveal();
  }

  // =====================================================
  // CONTACT FORM
  // =====================================================
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = contactForm.querySelector('[name="name"]').value.trim();
      var email = contactForm.querySelector('[name="email"]').value.trim();
      var message = contactForm.querySelector('[name="message"]').value.trim();

      if (!name || !email || !message) {
        showToast('请填写所有字段哦～ 🥧');
        return;
      }
      // Basic email format check
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('邮箱格式好像不对呢～ 🍓');
        return;
      }

      showToast('消息已发送！小考拉收到啦 🐨🍓');
      contactForm.reset();
    });
  }

  // =====================================================
  // TOAST
  // =====================================================
  function showToast(msg) {
    var existing = document.querySelector('.toast');
    if (existing) document.body.removeChild(existing);

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.classList.add('show');
      });
    });
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 500);
    }, 3000);
  }

  // =====================================================
  // PORTFOLIO CARDS - hover sparkle effect
  // =====================================================
  document.querySelectorAll('.portfolio-card').forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      var stickers = card.querySelectorAll('.card-sticker');
      stickers.forEach(function (s) {
        s.style.animationPlayState = 'running';
        s.style.transform = 'scale(1.3) rotate(10deg)';
      });
    });
    card.addEventListener('mouseleave', function () {
      var stickers = card.querySelectorAll('.card-sticker');
      stickers.forEach(function (s) {
        s.style.transform = '';
      });
    });
  });

  // =====================================================
  // DOWNLOAD RESUME button
  // =====================================================
  var dlBtn = document.querySelector('.btn-download');
  if (dlBtn) {
    dlBtn.addEventListener('click', function (e) {
      e.preventDefault();
      showToast('简历准备中... 🥧 敬请期待！');
    });
  }

  // =====================================================
  // HERO KOALA: extra click interactions
  // =====================================================
  var heroKoalaScene = document.querySelector('.hero-koala-scene');
  if (heroKoalaScene) {
    heroKoalaScene.addEventListener('click', function () {
      showToast('嗷呜！你点到我了！🐨💛');
    });
  }

})();
