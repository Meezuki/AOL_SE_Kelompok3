const menuButton = document.querySelector('.menu-button');
const navlinks = document.querySelector('.navlink');

menuButton.addEventListener('click', () => {
    navlinks.classList.toggle('mobile-menu')
});