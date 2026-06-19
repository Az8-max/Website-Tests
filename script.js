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
  }

  // Form submission mock
  const form = document.getElementById("evaluation-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button");
      const originalText = btn.innerText;
      btn.innerText = "Submitting...";
      btn.disabled = true;
      btn.style.opacity = "0.8";

      setTimeout(() => {
        btn.innerText = "Request Sent successfully";
        btn.style.backgroundColor = "#10b981"; // Success green
        btn.style.borderColor = "#10b981";

        setTimeout(() => {
          form.reset();
          btn.innerText = originalText;
          btn.disabled = false;
          btn.style.backgroundColor = "";
          btn.style.borderColor = "";
          btn.style.opacity = "1";
        }, 3000);
      }, 1500);
    });
  }
});
