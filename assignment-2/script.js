// =============================================
//  NIKE CLONE — Assignment 2
//  Vanilla JavaScript — Hamburger Menu
//  No frameworks or libraries used
// =============================================

// Get elements
var hamburger = document.getElementById('hamburger');
var mobileMenu = document.getElementById('mobileMenu');

// Toggle menu open/close
function toggleMenu() {
  var isOpen = mobileMenu.classList.contains('open');

  if (isOpen) {
    // Close the menu
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  } else {
    // Open the menu
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
  }
}

// Close menu (called when a nav link is clicked — Bonus requirement)
function closeMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
}

// Close menu when clicking outside of navbar
document.addEventListener('click', function(event) {
  var navbar = document.querySelector('.navbar');
  var clickedInsideNavbar = navbar.contains(event.target);

  if (!clickedInsideNavbar) {
    closeMenu();
  }
});

// Close menu on window resize if screen goes back to desktop size
window.addEventListener('resize', function() {
  if (window.innerWidth > 768) {
    closeMenu();
  }
});
