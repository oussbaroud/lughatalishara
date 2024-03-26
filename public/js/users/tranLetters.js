// Getting And Loading Letters
fetch('/manage/letters/get')
.then(response => response.json())
.then(data => {
    loadLetters(data['data']);
});

// Selecting Letters Container
const letters = document.querySelector('.letters');

// Load Letters Function
function loadLetters(data) {
    // Emptying Letters Container
    letters.innerHTML = '';

    // If No Letter Found
    if (data.length === 0) {
        letters.innerHTML = "<p class='no-data'>لا يوجد محتوى</p>";
        return;
    }

    // For Every Letter
    data.forEach(function ({id, letter, file}) {        
        // Creating Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = `${letter}`;
        checkbox.id = `cb${id}`;
        checkbox.className = 'check-letter';
        letters.appendChild(checkbox);

        // Creating Label
        const label = document.createElement('label');
        label.htmlFor = `cb${id}`;
        label.id = `l${id}`;
        label.className = 'letter card';
        label.innerText = `${letter}`;
        letters.appendChild(label);

        // Checkbox Event Listener
        checkbox.addEventListener('change', function() {
            // If Check Box Checked
            if (this.checked) {
                // Unchecking Other Checkboxs
                const cbs = document.querySelectorAll('.check-letter');
                cbs.forEach(c => {
                    if (c.checked && c !== this) {
                        // Unchecking Checkbox
                        c.checked = false;

                        // Triggering Event Listener
                        c.dispatchEvent(new CustomEvent('change'));
                    }
                })
                
                // Revealing Translation
                label.innerHTML = `<img src="/letters/${file}">`;
            
            // If Check Box Unchecked
            } else {
                // Hidding Translation
                label.innerHTML = letter;
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

    // Getting Letter
    fetch('/manage/letters/search/' + searchValue)
    .then(response => response.json())
    .then(data => {
        // Loading Letter
        loadLetters(data['data']);
    });
}