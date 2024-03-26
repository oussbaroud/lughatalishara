document.body.onload = function() {
    // Selecting Loader Element
    const loader = document.querySelector('.loader');

    // Hidding Loader Element
    loader.classList.add('loader-hidden');

    // Removing Loader Element
    loader.addEventListener('transitionend', function() {
        loader.remove();
    })
};