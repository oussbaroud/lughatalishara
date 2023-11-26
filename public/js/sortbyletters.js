// Load Letters Call To Action
document.addEventListener('DOMContentLoaded', function () {
    fetch('/letters/getAll')
    .then(response => response.json())
    .then(data => {
        loadLetters(data['data']);
    });
});

// Load Letters Function
let lettersHtml;
function loadLetters(data) {
    const letters = document.querySelector('.sort-by-letters');

    lettersHtml = "";

    data.forEach(function ({id, letter, file, clid, lid}) {
        lettersHtml += `<li class="current-page"><a class="sort-link" onclick="">${letter}</a></li>`;
    });

    letters.innerHTML = `<ul>${lettersHtml}</ul>`;

    // Sort Button Call To Action
    let sortValue;
    const sortBtns = document.querySelectorAll('.current-page');
    console.log(sortBtns);
    sortBtns.forEach( function(sortBtn) {
        sortBtn.addEventListener("click", function() {
            console.log("Clicked");
            sortValue = sortBtn.getElementsByClassName("sort-link")[0].textContent;
            console.log(sortValue);
            fetch('/words/sort/' + sortValue)
            .then(response => response.json())
            .then(data => {
                console.log(data['data'].length)
                loadWords(data['data']);
                for(let i = 0; i < data['data'].length; i++){
                    checkWordEl = document.getElementById(data['data'][i]["cwid"]);
                    wordEl = document.getElementById(data['data'][i]["wid"]);
                    word = data['data'][i]["word"]
                    file = data['data'][i]["file"]
                    console.log(file)
                    ifChecked();
                }
            });
        });
    });
}