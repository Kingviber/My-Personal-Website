/* =============================================
   Gift Tsima Portfolio — Main JavaScript
   1. Navigation (section switching)
   2. Custom cursor (dot + ring)
   3. Nav scroll shrink effect
   4. Scroll reveal animations
   5. Mobile hamburger menu
   6. Portfolio filter buttons
   7. Contact form (Formspree)
   8. Team photo lightbox
============================================= */

(function() {

  /* ============================================================
     1. SECTION NAVIGATION — fully JS-driven, no CSS conflicts
  ============================================================ */
  var sections = ['home','about','portfolio','skills','team','contact'];

  function showSection(id) {
    sections.forEach(function(sid) {
      var el = document.getElementById(sid);
      if (!el) return;
      if (sid === id) {
        el.style.display = (sid === 'home') ? 'flex' : 'block';
        el.style.opacity = '1';
      } else {
        el.style.display = 'none';
      }
    });
    // scroll to top instantly
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // close mobile menu
    var mm = document.getElementById('mobileMenu');
    if (mm) mm.classList.remove('open');
    // run reveal check after paint
    setTimeout(triggerReveals, 120);
  }

  // Make navigateTo global
  window.navigateTo = function(id) {
    showSection(id);
  };

  // Init on load
  function init() {
    // Hide all, show home
    sections.forEach(function(sid) {
      var el = document.getElementById(sid);
      if (el) el.style.display = 'none';
    });
    var home = document.getElementById('home');
    if (home) home.style.display = 'flex';
    setTimeout(triggerReveals, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ============================================================
     2. CUSTOM CURSOR
  ============================================================ */
  var cursorDot  = document.getElementById('cursor');
  var cursorRing = document.getElementById('cursor-ring');
  var mouseX = -200, mouseY = -200;
  var ringX  = -200, ringY  = -200;
  var rafRunning = false;

  // Hide until first mouse move
  if (cursorDot)  { cursorDot.style.opacity  = '0'; cursorDot.style.left  = '-200px'; cursorDot.style.top  = '-200px'; }
  if (cursorRing) { cursorRing.style.opacity = '0'; cursorRing.style.left = '-200px'; cursorRing.style.top = '-200px'; }

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.left    = mouseX + 'px';
      cursorDot.style.top     = mouseY + 'px';
      cursorDot.style.opacity = '1';
    }
    if (cursorRing) cursorRing.style.opacity = '1';
    if (!rafRunning) { rafRunning = true; animateRing(); }
  });

  document.addEventListener('mouseleave', function() {
    if (cursorDot)  cursorDot.style.opacity  = '0';
    if (cursorRing) cursorRing.style.opacity = '0';
  });

  document.addEventListener('mouseenter', function() {
    if (cursorDot)  cursorDot.style.opacity  = '1';
    if (cursorRing) cursorRing.style.opacity = '1';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    if (cursorRing) {
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
    }
    requestAnimationFrame(animateRing);
  }

  /* ============================================================
     3. NAV SCROLL EFFECT
  ============================================================ */
  window.addEventListener('scroll', function() {
    var nav = document.getElementById('mainNav');
    if (nav) {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
    triggerReveals();
  });

  /* ============================================================
     4. SCROLL REVEAL
  ============================================================ */
  function triggerReveals() {
    var els = document.querySelectorAll('.reveal');
    els.forEach(function(el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) {
        el.classList.add('visible');
      }
    });
  }

  /* ============================================================
     5. MOBILE HAMBURGER
  ============================================================ */
  window.toggleMobileMenu = function() {
    var mm = document.getElementById('mobileMenu');
    if (mm) mm.classList.toggle('open');
  };

  /* ============================================================
     6. PORTFOLIO FILTER BUTTONS
  ============================================================ */
  document.addEventListener('DOMContentLoaded', function() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
      });
    });
  });

  /* ============================================================
     7. CONTACT FORM
  ============================================================ */
  document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      var btn = form.querySelector('.form-submit');
      var successMsg = document.getElementById('formSuccess');
      btn.textContent = 'Sending...';
      btn.disabled = true;
      try {
        var res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          form.reset();
          btn.style.display = 'none';
          if (successMsg) successMsg.style.display = 'block';
        } else {
          btn.textContent = 'Try Again';
          btn.disabled = false;
        }
      } catch(err) {
        btn.textContent = 'Send Message →';
        btn.disabled = false;
      }
    });
  });

  /* ============================================================
     8. TEAM LIGHTBOX
  ============================================================ */
  var lbPhotos = [];
  var lbCurrent = 0;

  document.addEventListener('DOMContentLoaded', function() {
    var imgs = document.querySelectorAll('.team-photo-item img');
    imgs.forEach(function(img, i) {
      lbPhotos.push(img.src);
    });
    var lb = document.getElementById('teamLightbox');
    if (lb) {
      lb.addEventListener('click', function(e) {
        if (e.target === lb) closeLightbox();
      });
    }
  });

  window.openLightbox = function(i) {
    lbCurrent = i;
    var lb  = document.getElementById('teamLightbox');
    var img = document.getElementById('lightboxImg');
    var cap = document.getElementById('lightboxCaption');
    if (!lb || !lbPhotos[i]) return;
    img.src = lbPhotos[i];
    if (cap) cap.textContent = 'Team Photo ' + (i + 1) + ' — March 2026';
    lb.classList.add('open');
  };

  window.closeLightbox = function() {
    var lb = document.getElementById('teamLightbox');
    if (lb) lb.classList.remove('open');
  };

  window.lightboxNav = function(dir) {
    lbCurrent = (lbCurrent + dir + lbPhotos.length) % lbPhotos.length;
    var img = document.getElementById('lightboxImg');
    var cap = document.getElementById('lightboxCaption');
    if (img) img.src = lbPhotos[lbCurrent];
    if (cap) cap.textContent = 'Team Photo ' + (lbCurrent + 1) + ' — March 2026';
  };

})();
