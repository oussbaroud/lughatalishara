// Selecting Elements
const sortBtnContainer = document.querySelector('.sort');
const sortBtn = document.getElementById('sort-btn');
const sortPopup = document.querySelector('.sort-by-letters');

// Reveal Popup Event Listener
sortBtn.addEventListener('click', function(el) {
    el.stopPropagation()
    sortPopup.classList.add('open-popup');
});

// Hide Sort Popup Event Listener
document.addEventListener('click', function(el) {
    el.stopPropagation()
    const target = el.target;
    if (target !== sortBtn && target !== sortBtnContainer) {
        console.log(target);
        sortPopup.classList.remove('open-popup');
    }
})

document.addEventListener('DOMContentLoaded', function () {
    // Getting And Loading Letters
    fetch('/manage/letters/get')
    .then(response => response.json())
    .then(data => {
        loadLetters(data['data']);
    });
});

// Declaring Letters HTML
let lettersHtml;

// Load Letters Function
function loadLetters(data) {
    // Assigning Letters HTML
    lettersHtml = '';

    // For Every Letter
    data.forEach(function ({id, letter}) {
        lettersHtml += `<li class="current-page"><a class="sort-link" value="${id}">${letter}</a></li>`;
    });

    // Assigning Sort Popup Inner HTML
    sortPopup.innerHTML = `<ul>${lettersHtml}</ul>`;

    // Declaring Sort Value
    let sortValue;

    // Selecting Every Letter Button
    const sortBtns = document.querySelectorAll('.current-page');

    // For Every Letter Button
    sortBtns.forEach( function(sortBtn) {
        // Letter Button Event Listener
        sortBtn.addEventListener("click", function() {
            // Removing Active Class From All Letters Buttons
            sortBtns.forEach( function(sortBtn) {
                sortBtn.classList.remove('active');
            });

            // Adding Active Class To Clicked Button
            sortBtn.classList.add('active');

            // Getting Letter From Letter Button
            sortValue = sortBtn.getElementsByClassName("sort-link")[0].textContent;

            // Getting Words That Start With Letter
            fetch('/manage/dictionary/sort/' + sortValue)
            .then(response => response.json())
            .then(data => {
                // Loading Dictionary
                loadWords(data['data']);
                for(let i = 0; i < data['data'].length; i++){
                    checkWordEl = document.getElementById('cb' + data['data'][i]['id']);
                    wordEl = document.getElementById('w' + data['data'][i]['id']);
                    word = data['data'][i]["word"]
                    file = data['data'][i]["file"]
                    
                    // Check If Checkbox Checked
                    ifChecked();
                }
            });
        });
    });
}