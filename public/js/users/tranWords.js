// Getting And Loading Dictionary
fetch('/manage/dictionary/get')
.then(response => response.json())
.then(data => {
    loadWords(data['data']);
});

// Selecting Dictionary Container
const words = document.querySelector('#dic');

// Load Dictionary Function
function loadWords(data) {
    // Emptying Dictionary Container
    words.innerHTML = '';

    // If No Content Found
    if (data.length === 0) {
        words.innerHTML = "<div class='no-data-container no-data'>لا يوجد محتوى</div>";
        return;
    }

    // For Every Word
    data.forEach(function ({id, word, file}) {
        // Creating Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = `${word}`;
        checkbox.id = `cb${id}`;
        checkbox.className = 'check-word';
        words.appendChild(checkbox);

        // Creating Label
        const label = document.createElement('label');
        label.htmlFor = `cb${id}`;
        label.id = `w${id}`;
        label.className = 'word card';
        label.innerText = `${word}`;
        words.appendChild(label);

        // Checkbox Event Listener
        checkbox.addEventListener('change', function() {
            // If Check Box Checked
            if (this.checked) {
                // Unchecking Other Checkboxs
                const cbs = document.querySelectorAll('.check-word');
                cbs.forEach(c => {
                    if (c.checked && c !== this) {
                        // Unchecking Checkbox
                        c.checked = false;

                        // Triggering Event Listener
                        c.dispatchEvent(new CustomEvent('change'));
                    }
                })
                
                // Revealing Translation
                label.innerHTML = `<img src="/dictionary/${file}">`;
                label.style.padding = "0px";
            
            // If Check Box Unchecked
            } else {
                // Hidding Translation
                label.innerHTML = word;
                if (window.innerWidth >= 600) {
                    label.style.padding = "30px";
                } else {
                    label.style.padding = "15px";
                }
            }
            });
    });
    
    // Starting Pagination
    pagina();
}

// Search By Enter Button Event Listener
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchBtn.click();
  }
});


// Search Button Event Listener
searchBtn.onclick = function() {
    // Declaring Search Value
    const searchValue = searchInput.value;

    // Getting Words
    fetch('/manage/dictionary/search/' + searchValue)
    .then(response => response.json())
    .then(data => {
        // Loading Words
        loadWords(data['data']);
    });
}