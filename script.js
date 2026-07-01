document.addEventListener("DOMContentLoaded", () => {
  // Initialize Swiper
  if (typeof Swiper !== "undefined") {
    new Swiper(".trust-swiper", {
      slidesPerView: 2,
      spaceBetween: 20,
      loop: true,
      speed: 6000,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      breakpoints: {
        640: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 5 },
      },
    });

    // Initialize Testimonials Swiper
    new Swiper(".testimonials-swiper", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: true,
      },
    });

    // Initialize Google Reviews Swiper (Continuous Marquee)
    new Swiper(".google-reviews-swiper", {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      speed: 8000,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1200: { slidesPerView: 4 },
      },
    });

    // Initialize Team Swiper (Continuous Marquee)
    new Swiper(".team-swiper", {
      slidesPerView: 2,
      spaceBetween: 15,
      loop: true,
      speed: 7000,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      breakpoints: {
        640: { slidesPerView: 3, spaceBetween: 20 },
        1024: { slidesPerView: 4, spaceBetween: 20 },
        1200: { slidesPerView: 5, spaceBetween: 20 },
      },
    });
  }

});
