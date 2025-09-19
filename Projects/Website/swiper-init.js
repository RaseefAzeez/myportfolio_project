// swiper-init.js

const swiper = new Swiper('.mySwiper', {
    // Optional parameters
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,

    // If we need pagination
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },

    // Navigation arrows
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },

    // Responsive breakpoints
    breakpoints: {
        // when window width is >= 768px (md)
        768: {
            slidesPerView: 2,
            spaceBetween: 40,
        },
        // when window width is >= 1024px (lg)
        1024: {
            slidesPerView: 3,
            spaceBetween: 50,
        },
    },
});

const swiper2 = new Swiper('.mySecondSwiper', {
    // Optional parameters
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,

    // If we need pagination
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },

    // Navigation arrows
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },

    // Responsive breakpoints
    breakpoints: {
        // when window width is >= 768px (md)
        768: {
            slidesPerView: 2,
            spaceBetween: 40,
        },
        // when window width is >= 1024px (lg)
        1024: {
            slidesPerView: 3,
            spaceBetween: 50,
        },
    },
});