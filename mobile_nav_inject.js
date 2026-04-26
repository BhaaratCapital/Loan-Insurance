(function () {
  'use strict';

  if (window.innerWidth > 900) return;

  var path = window.location.pathname;
  var isHome = path === '/' || path.endsWith('index.html') || path === '';

  var nav = document.createElement('div');
  nav.setAttribute('id', 'bc-mobile-nav');
  nav.innerHTML =
    '<a class="bc-nav-logo" href="index.html">' +
      '<img src="logo (1).png" alt="Bhaarat Capital">' +
    '</a>' +
    '<a class="bc-nav-home' + (isHome ? ' active' : '') + '" href="index.html">Home</a>' +
    '<a class="bc-nav-apply" href="contact.html">Apply Now &#8594;</a>';

  document.body.insertBefore(nav, document.body.firstChild);

  window.addEventListener('resize', function () {
    var existing = document.getElementById('bc-mobile-nav');
    if (!existing) return;
    existing.style.display = window.innerWidth > 900 ? 'none' : 'flex';
  });

})();
