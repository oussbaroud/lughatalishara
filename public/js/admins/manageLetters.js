// Load Table call To Action
document.addEventListener('DOMContentLoaded', function () {
    fetch('/manage/letters/get')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
    
});
// Delet And Edit Table Button Call To Action
document.querySelector('table tbody').addEventListener('click', function(event) {
    if (event.target.className === "delete-row-btn") {
        opendwc();
        const deleteBtn = document.querySelector('#delete-btn');
        deleteBtn.onclick = function () {
            deleteRowById(event.target.dataset.id, event.target.dataset.number, event.target.dataset.file);
        }
    }
    if (event.target.className === "edit-row-btn") {
        handleEditRow(event.target.dataset.id, event.target.dataset.file);
        openURP();
    }
});

// Search Button Call To Action
const searchBtn = document.querySelector('#search-btn');
searchBtn.onclick = function() {
    const searchValue = document.querySelector('#search-input').value;

    fetch('/manage/letters/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

// Delet Row Function
async function deleteRowById(id, number, currentFile) {
    const error = document.getElementById('delete-error');

    const fetchDeleteDetails = await fetch('/manage/letters/delete/details/' + id, {
        method: 'DELETE'
    })
    const fetchDeleteDetailsResponse = await fetchDeleteDetails.json();

    if (fetchDeleteDetailsResponse.success) {
        const fetchDeleteFile = await fetch('/manage/letters/delete/file/' + currentFile, {
            method: 'DELETE'
        })
        const fetchDeleteFileResponse = await fetchDeleteFile.json();

        if (fetchDeleteFileResponse.success) {
            let currentNumbers = [];
            let newNumbers = [];
            const totalNumbers = dataLength - parseInt(number);
            if (totalNumbers > 0) {
                for(let i = 0; i < totalNumbers; i++){
                    let newNumber = i + parseInt(number);
                    let currentNumber = newNumber + 1;
            
                    currentNumbers.push(currentNumber);
                    newNumbers.push(newNumber);
                }

                const fetchPatchGap = await fetch('/manage/letters/update/fillgap', {
                    method: 'PATCH',
                    headers: {
                        'Content-type' : 'application/json'
                    },
                    body: JSON.stringify({
                        currentNumbers: currentNumbers,
                        newNumbers: newNumbers
                    })
                })
                const fetchPatchGapResponse = await fetchPatchGap.json();

                if (fetchPatchGapResponse.success) {
                    location.reload();
                } else {
                    error.style.display = "block";
                    error.innerText = fetchPatchGapResponse.error;
                }
            } else {
                location.reload();
            }
        } else {
            error.style.display = "block";
            error.innerText = fetchDeleteFileResponse.error;
        }
    } else {
        error.style.display = "block";
        error.innerText = fetchDeleteDetailsResponse.error;
    }
}

// Edit Row Function
function handleEditRow(id, file) {
    // Update Button Call To Action
    const addForm = document.getElementById('edit-form');
    addForm.addEventListener('submit', async () => {
        const error = document.getElementById('edit-error');
        const updateFileInput = document.querySelector('#file-update');
        
        const formData = new FormData();
        formData.append('myfile', updateFileInput.files[0]);

        const file = updateFileInput.files[0].name;
        const duration = await calculateDuration(updateFileInput.files[0]);

        const fetchPatchDetails = await fetch('/manage/letters/update/details/' + id, {
            method: 'PATCH',
            headers: {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify({
                file: file,
                duration: duration
            })
        })
        const fetchPatchDetailsResponse = await fetchPatchDetails.json();

        if (fetchPatchDetailsResponse.success) {
            const fetchDeleteFile = await fetch('/manage/letters/delete/file/' + currentFile, {
                method: 'DELETE'
            })
            const fetchDeleteFileResponse = await fetchDeleteFile.json();

            if (fetchDeleteFileResponse.success) {
                const fileName = fetchPatchDetailsResponse.fileName;
                console.log(fileName)
                const fetchPostFile = await fetch('/manage/letters/upload/' + fileName, {
                    method: 'POST',
                    body: formData
                })
                const fetchPostFileResponse = await fetchPostFile.json();
        
                if (fetchPostFileResponse.success) {
                    location.reload();
                } else {
                    error.style.display = "block";
                    error.innerText = fetchPostFileResponse.error;
                }
            } else {
                error.style.display = "block";
                error.innerText = fetchDeleteFileResponse.error;
            }
        } else {
            error.style.display = "block";
            error.innerText = fetchPatchDetailsResponse.error;
        }
    })
}

// Add Button Call To Action
const addForm = document.getElementById('add-form');
addForm.addEventListener('submit', async () => {
    const error = document.getElementById('add-error');
    const letterInput = document.querySelector('#letter-input');
    const fileInput = document.querySelector('#file');
    
    const formData = new FormData();
    formData.append('myfile', fileInput.files[0]);
    
    const number = dataLength + 1;
    const letter = letterInput.value;
    const file = fileInput.files[0].name;
    const duration = await calculateDuration(fileInput.files[0]);

    const fetchPostDetails = await fetch('/manage/letters/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            number: number,
            letter: letter,
            file: file,
            duration: duration
        })
    })
    const fetchPostDetailsResponse = await fetchPostDetails.json();

    if (fetchPostDetailsResponse.success) {
        const fileName = fetchPostDetailsResponse.fileName;
        const fetchPostFile = await fetch('/manage/letters/upload/' + fileName, {
            method: 'POST',
            body: formData
        })
        const fetchPostFileResponse = await fetchPostFile.json();

        if (fetchPostFileResponse.success) {
            location.reload();
        } else {
            error.style.display = "block";
            error.innerText = fetchPostFileResponse.error;
        }
    } else {
        error.style.display = "block";
        error.innerText = fetchPostDetailsResponse.error;
    }
})

// Load Table Function
let tableHtml;
let dataLength;
function loadHTMLTable(data) {
    dataLength = data.length;
    const table = document.querySelector('table tbody');

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>لا يوجد محتوى</td></tr>";
        return;
    }

    tableHtml = "";

    data.forEach(function ({id, number, letter, file}) {
        tableHtml += `<tr class="card">`;
        tableHtml += `<td>${number}</td>`;
        tableHtml += `<td>${letter}</td>`;
        tableHtml += `<td dir="ltr">${file}</td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${id} data-file=${file}>تعديل</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${id} data-number=${number} data-file=${file}>حذف</td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
    pagina();
}

// File Name Functions
function fileAdded(){
    fileName = document.getElementById("file").files[0].name
    document.getElementById("no-file").innerHTML = fileName;
}
function fileAddedUpdate(){
    fileUpdateName = document.getElementById("file-update").files[0].name
    document.getElementById("no-file-update").innerHTML = fileUpdateName;
}

// Alert Popup Functions
let dwc = document.getElementById('dwc');
function opendwc(){
    dwc.classList.add('open-popup');
}
function closeAlert(){
    dwc.classList.remove('open-popup');
}

// Form Popup Functions
const openAWPBtn = document.querySelector('#open-ap-btn');
const addWordPopup = document.querySelector('.add-popup');
openAWPBtn.onclick = function () {
    addWordPopup.classList.add('open-popup');
}
const updateRow = document.querySelector('.update-row');
function openURP(){
    updateRow.classList.add('open-popup');
}

function closeForm(){
    addWordPopup.classList.remove('open-popup');
    updateRow.classList.remove('open-popup');

    const alertContainers = document.querySelectorAll('.alert');
    alertContainers.forEach(alertContainer => {
        alertContainer.style.display = "none";
    });
}

// Search By Enter Button Function Call To Action
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchBtn.click();
  }
});

// calculate gif duration
function calculateDuration(file) {
    return new Promise((resolve, reject) => {
      try {
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = (event) => {
          let arr = new Uint8Array(fileReader.result);
          let duration = 0;
          for (var i = 0; i < arr.length; i++) {
            if (arr[i] == 0x21
              && arr[i + 1] == 0xF9
              && arr[i + 2] == 0x04
              && arr[i + 7] == 0x00) {
              const delay = (arr[i + 5] << 8) | (arr[i + 4] & 0xFF)
              duration += delay < 2 ? 10 : delay;
            }
          }
          resolve(duration / 100);
          console.log('The duration is ' + duration / 100);
        }

      } catch (e) {
        reject(e);
      }
    });
}