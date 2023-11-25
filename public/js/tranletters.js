// Load Words Call To Action
document.addEventListener('DOMContentLoaded', function () {
    fetch('/letters/getAll')
    .then(response => response.json())
    .then(data => {
        loadLetters(data['data']);
        tran();
    });
});

// Load Letters Function
let lettersHtml;
function loadLetters(data) {
    const letters = document.querySelector('.letters');

    if (data.length === 0) {
        letters.innerHTML = "<p class='no-data'>لا يوجد محتوى</p>";
        return;
    }

    lettersHtml = "";

    data.forEach(function ({id, letter, file, clid, lid}) {
        lettersHtml += `<input type="checkbox" class="check-letter" id="${clid}" value = "${id}" onchange="tranSituation()">`;
        lettersHtml += `<label for="${clid}" class="letter card" id="${lid}">${letter}</label>`;
    });
    letters.innerHTML = lettersHtml;
    
    // Calling Pagination
    pagina();

    // Uncheck All Check Boxes If One Is Checked
    let cbs = document.querySelectorAll('.check-letter');
    cbs.forEach(
        cb=>
            cb.onclick=ev=>
                cbs.forEach(c=>
                        c.checked=(c==ev.target&&ev.target.checked || false)
                )
    );
}

// Translate Function
let checkLetterEl
let letterEl
let letter
let file
function tran() {
    fetch('/letters/getAll')
    .then(response => response.json())
    .then(data => {
        for(let i = 0; i < data['data'].length; i++){
            checkLetterEl = document.getElementById(data['data'][i]["clid"]);
            letterEl = document.getElementById(data['data'][i]["lid"]);
            letter = data['data'][i]["letter"]
            file = data['data'][i]["file"]
            ifChecked();
        }
    });
}

// If Check Box Checked Show The Transation
function ifChecked() {
    if(checkLetterEl.checked != false){
        letterEl.innerHTML = "";
        letterEl.innerHTML = `<img src="/letters/${file}">`;
        letterEl.style.padding = "0px";
    } else {
        letterEl.innerHTML = letter;
        if(window.innerWidth >= 600){
            letterEl.style.padding = "30px";
        }else{
            letterEl.style.padding = "15px";
        }
    }
}

// Search By Enter Button Function Call To Action
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById("sb");
searchInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchBtn.click();
  }
});

// Search Button Call To Action
let searchValue;
let searchBtnClicked;

searchBtn.onclick = function() {
    searchValue = searchInput.value;
    searchBtnClicked = true;

    fetch('/letters/search/' + searchValue)
    .then(response => response.json())
    .then(data => {
        loadLetters(data['data']);
        for(let i = 0; i < data['data'].length; i++){
            checkLetterEl = document.getElementById(data['data'][i]["clid"]);
            letterEl = document.getElementById(data['data'][i]["lid"]);
            letter = data['data'][i]["letter"]
            file = data['data'][i]["file"]
            ifChecked();
        }
    });
}

// Translate Search Function
function tranSearch() {
    searchValue = searchInput.value;
    console.log(searchValue)
    fetch('/letters/search/' + searchValue)
    .then(response => response.json())
    .then(data => {
        console.log(data['data'].length)
        for(let i = 0; i < data['data'].length; i++){
            checkWordEl = document.getElementById(data['data'][i]["cwid"]);
            wordEl = document.getElementById(data['data'][i]["wid"]);
            word = data['data'][i]["word"]
            file = data['data'][i]["file"]
            console.log(file)
            ifChecked();
        }
    });
}

// Translate Situation Function
function tranSituation() {
    if(searchBtnClicked){
        tranSearch();
    }else{
        tran();
    }
}