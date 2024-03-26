// Scroll Event Listener
const nav = document.querySelector('nav');
document.onscroll = function() {
    if (window.scrollY === 0) {
        nav.style.borderBottom = "2px solid #fff"
    } else {
        nav.style.borderBottom = "2px solid #e5e5e5"
    }
}