/* ============================================================
   mobile_nav_inject.js
   Is script ko SARE pages ke </body> se pehle add karo:
   <script src="mobile_nav_inject.js"></script>

   Kya karta hai:
   - Mobile (<= 768px) pe custom navbar inject karta hai
   - Logo + Home link + Apply Now button dikhata hai
   - Desktop pe kuch nahi karta
   ============================================================ */

(function () {
  'use strict';

  /* Only run on mobile */
  if (window.innerWidth > 768) return;

  /* Detect current page for "Home" active state */
  var path = window.location.pathname;
  var isHome = path === '/' || path.endsWith('index.html') || path === '';

  /* ── Build the mobile nav HTML ── */
  var nav = document.createElement('div');
  nav.id = 'bc-mobile-nav';
  nav.innerHTML =
    '<a class="bc-nav-logo" href="index.html">' +
      '<img src="logo (1).png" alt="Bhaarat Capital">' +
    '</a>' +
    '<a class="bc-nav-home' + (isHome ? ' active' : '') + '" href="index.html">Home</a>' +
    '<a class="bc-nav-apply" href="contact.html">Apply Now &#8594;</a>';

  /* Insert as very first child of body */
  document.body.insertBefore(nav, document.body.firstChild);

  /* ── Re-run on resize (in case orientation changes) ── */
  window.addEventListener('resize', function () {
    var existing = document.getElementById('bc-mobile-nav');
    if (window.innerWidth > 768) {
      if (existing) existing.style.display = 'none';
    } else {
      if (existing) existing.style.display = 'flex';
    }
  });
})();
