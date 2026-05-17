// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', function() {
  navLinks.classList.toggle('open');
});

// Close menu when a nav link is clicked (BONUS)
const links = document.querySelectorAll('.nav-links a');
links.forEach(function(link) {
  link.addEventListener('click', function() {
    navLinks.classList.remove('open');
  });
});