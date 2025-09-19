// mobile-menu.js
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mainNavMenu = document.getElementById('main-nav-menu');

    mobileMenuButton.addEventListener('click', () => {
        mainNavMenu.classList.toggle('hidden');
    });
});