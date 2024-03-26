// Selection Elements
const menuCB = document.getElementById('check-menu');
const html = document.querySelector('html');

// Creating Menu Checkbox Event Listener
menuCB.addEventListener('change', function() {
    if (this.checked) {
        html.style.overflow = 'hidden';
    } else {
        html.style.overflow = 'scroll';
    }
  });