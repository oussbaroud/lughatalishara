// Load Words Call To Action
document.addEventListener('DOMContentLoaded', function () {
    fetch('/words/getAll')
    .then(response => response.json())
    .then(data => {
        loadWords(data['data']);
        tran();
    });
});

// Load Words Function
let wordsHtml;
function loadWords(data) {
    const words = document.querySelector('#dic');

    if (data.length === 0) {
        words.innerHTML = "<div class='container no-data'>لا يوجد محتوى</div>";
        return;
    }

    wordsHtml = "";

    data.forEach(function ({id, word, file, cwid, wid}) {
        wordsHtml += `<input type="checkbox" class="check-word" id="${cwid}" value = "${id}" onchange="tranSituation();">`;
        wordsHtml += `<label for="${cwid}" class="word card" id="${wid}">${word}</label>`;
    });
    words.innerHTML = wordsHtml;
    
    // Calling Pagination
    pagina();

    // Uncheck All Check Boxes If One Is Checked
    let cbs = document.querySelectorAll('.check-word');
    cbs.forEach(
        cb=>
            cb.onclick=ev=>
                cbs.forEach(c=>
                        c.checked=(c==ev.target&&ev.target.checked || false)
                )
    );
}

// Translate Function
let checkWordEl
let wordEl
let word
let file
function tran() {
    fetch('/words/getAll')
    .then(response => response.json())
    .then(data => {
        for(let i = 0; i < data['data'].length; i++){
            checkWordEl = document.getElementById(data['data'][i]["cwid"]);
            wordEl = document.getElementById(data['data'][i]["wid"]);
            word = data['data'][i]["word"]
            file = data['data'][i]["file"]
            ifChecked();
        }
    });
}

// If Check Box Checked Show The Translation
function ifChecked() {
    if(checkWordEl.checked != false){
        wordEl.innerHTML = "";
        wordEl.innerHTML = `<img src="/words/${file}">`;
        wordEl.style.padding = "0px";
    } else {
        wordEl.innerHTML = word;
        if(window.innerWidth >= 600){
            wordEl.style.padding = "30px";
        }else{
            wordEl.style.padding = "15px";
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

    fetch('/words/search/' + searchValue)
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
}

// Translate Search Function
function tranSearch() {
    searchValue = searchInput.value;
    console.log(searchValue)
    fetch('/words/search/' + searchValue)
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