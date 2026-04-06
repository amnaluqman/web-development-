// =============================================
//  NIKE CLONE — Lab Task 2
//  Vanilla JavaScript — Hamburger Menu
// =============================================

var hamburger = document.getElementById('hamburger');
var mobileMenu = document.getElementById('mobileMenu');

function toggleMenu() {
  var isOpen = mobileMenu.classList.contains('open');
  if (isOpen) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  } else {
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
  }
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
}

document.addEventListener('click', function(event) {
  var navbar = document.querySelector('.navbar');
  if (!navbar.contains(event.target)) {
    closeMenu();
  }
});

window.addEventListener('resize', function() {
  if (window.innerWidth > 768) {
    closeMenu();
  }
});
