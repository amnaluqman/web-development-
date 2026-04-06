// =============================================
//  NIKE.COM CLONE
//  SP26 Web Technologies — SP24-BCS-B
//
//  PART 1 — Assignment 2
//  Responsive Navbar using Vanilla JS only
//  (No jQuery / Bootstrap / frameworks)
//
//  PART 2 — Midterm Lab
//  Interactive Carousel using jQuery + Slick
// =============================================


// ==============================================
//  PART 1: HAMBURGER MENU — Vanilla JS only
// ==============================================

var hamburger = document.getElementById('hamburger');
var mobileMenu = document.getElementById('mobileMenu');

// Toggle open / close
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

// Close menu — called when a nav link is clicked (Bonus)
function closeMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
}

// Close when user clicks anywhere outside the navbar
document.addEventListener('click', function (event) {
  var navbar = document.querySelector('.navbar');
  if (navbar && !navbar.contains(event.target)) {
    closeMenu();
  }
});

// Close when screen resizes back to desktop width
window.addEventListener('resize', function () {
  if (window.innerWidth > 768) {
    closeMenu();
  }
});


// ==============================================
//  PART 2: CAROUSEL — jQuery + Slick
// ==============================================

$(document).ready(function () {

  // Count total real product cards (not Slick clones)
  var totalSlides = $('.iconic-carousel .iconic-card').length;

  // --------------------------------------------------
  // REQUIREMENT 1: Slick library initialisation
  // REQUIREMENT 2: infinite loop + responsive breakpoints
  // REQUIREMENT 4: autoplay every 5 seconds (AI-Enhanced)
  // --------------------------------------------------
  $('.iconic-carousel').slick({

    // ② Infinite loop — never stops at last card
    infinite: true,

    // Scroll one card at a time
    slidesToScroll: 1,

    // ④ AI-Enhanced: auto-play every 5 seconds
    autoplay: true,
    autoplaySpeed: 5000,

    // Hide Slick's built-in arrows (we use custom buttons)
    arrows: false,

    // Show dot navigation
    dots: true,

    // Slide transition speed in ms
    speed: 450,

    // ② Desktop default: show 3 cards
    slidesToShow: 3,

    // ② Responsive breakpoints
    responsive: [
      {
        breakpoint: 1024,   // Tablet ≤ 1024px
        settings: {
          slidesToShow: 2,  // Show 2 cards
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,    // Mobile ≤ 768px
        settings: {
          slidesToShow: 1,  // Show 1 card
          slidesToScroll: 1
        }
      }
    ]
  });

  // --------------------------------------------------
  // REQUIREMENT 3a: Slide Counter — updates on change
  // --------------------------------------------------
  function updateCounter(currentIndex) {
    // Slick uses 0-based index; display as 1-based
    var displayNum = currentIndex + 1;
    $('#slideCounter').text('Showing ' + displayNum + ' of ' + totalSlides);
  }

  // Initialise counter on page load
  updateCounter(0);

  // Update counter every time a new slide becomes active
  $('.iconic-carousel').on('afterChange', function (event, slick, currentSlide) {
    updateCounter(currentSlide);
  });

  // --------------------------------------------------
  // REQUIREMENT 3b: Previous / Next buttons via jQuery
  // --------------------------------------------------
  $('#prev-btn').on('click', function () {
    $('.iconic-carousel').slick('slickPrev');
  });

  $('#next-btn').on('click', function () {
    $('.iconic-carousel').slick('slickNext');
  });

  // --------------------------------------------------
  // REQUIREMENT 4: AI-Enhanced — pause on hover, resume on leave
  // --------------------------------------------------
  $(document).on('mouseenter', '.iconic-carousel .iconic-card', function () {
    $('.iconic-carousel').slick('slickPause');   // Pause autoplay
  });

  $(document).on('mouseleave', '.iconic-carousel .iconic-card', function () {
    $('.iconic-carousel').slick('slickPlay');    // Resume autoplay
  });

});
