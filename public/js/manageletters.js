// Load Table call To Action
document.addEventListener('DOMContentLoaded', function () {
    fetch('/letters/getAll')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
    
});
// Delet And Edit Table Button Call To Action
document.querySelector('table tbody').addEventListener('click', function(event) {
    if (event.target.className === "delete-row-btn") {
        opendwc();
        const deleteBtn = document.querySelector('#delete-btn');
        deleteBtn.onclick = function () {
            deleteRowById(event.target.dataset.id, event.target.dataset.file);
        }
    }
    if (event.target.className === "edit-row-btn") {
        handleEditRow(event.target.dataset.id, event.target.dataset.file);
        openURP();
    }
});

// Selecting The Update And Search Buttons
const updateBtn = document.querySelector('#update-row-btn');
const searchBtn = document.querySelector('#search-btn');

// Search Button Call To Action
searchBtn.onclick = function() {
    const searchValue = document.querySelector('#search-input').value;

    fetch('/letters/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

// Delet Row Function
function deleteRowById(id, file) {
    fetch('/letters/delete/' + id + '/' + file, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    });
}

// Edit Row Function
function handleEditRow(id, file) {
    document.querySelector('#file-update').dataset.id = id;
    
    // Update Button Call To Action
    updateBtn.onclick = function() {
        const updateFileInput = document.querySelector('#file-update');
        const formData = new FormData();
        formData.append('myfile', updateFileInput.files[0]);

        if(!updateFileInput.files[0]){
            openawf();
        }else{
            fetch('/letters/getAll')
            .then(response => response.json())
            .then(data => {
                let flag = false;

                for (let i in data['data']) {
                    if((updateFileInput.files[0].name == data['data'][i]["file"])){
                        flag = true;
                    }
                };

                if((updateFileInput.files[0].name == file)){
                    flag = false;
                }

                if(flag){
                    openawf2();
                }

                if(!flag){
                    fetch('/letters/update/' + id + '/' + file, {
                        method: 'PATCH',
                        headers: {
                            'Content-type' : 'application/json'
                        },
                        body: JSON.stringify({
                            id: updateFileInput.dataset.id,
                            file: updateFileInput.files[0].name
                        })
                        })
                        .then(response => response.json())
                        .then(() => {
                            openUpdateSuccess();
                        });
            
                        fetch('/letters/upload', {
                            method: 'POST',
                            body: formData
                        })
                        .then(response => response.json());
                }
            });  
        }
    }
}

// Add Button Call To Action
const addBtn = document.querySelector('#add-letter-btn');
addBtn.onclick = function () {
    const letterInput = document.querySelector('#letter-input');
    const fileInput = document.querySelector('#file');
    const formData = new FormData();
    formData.append('myfile', fileInput.files[0]);
    


    if(!letterInput.value || !fileInput.files[0]){
        openawf();
    }else{
        fetch('/letters/getAll')
        .then(response => response.json())
        .then(data => {
            let flag = false;

            for (let i in data['data']) {
                if(letterInput.value == data['data'][i]["letter"] || fileInput.files[0].name == data['data'][i]["file"]){
                    openawf2();
                    flag = true;
                }
            };

            if(!flag){
                const letter = letterInput.value;
                const file = fileInput.files[0].name;

                fetch('/letters/insert', {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        letter : letter,
                        file : file
                    })
                })
                .then(response => response.json())
                .then(() => {
                    openAddSuccess();
                });

                fetch('/letters/upload', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json());
            }
        });  
    } 
}

// Load Table Function
let tableHtml;
function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>لا يوجد محتوى</td></tr>";
        return;
    }

    tableHtml = "";

    data.forEach(function ({id, letter, file}) {
        tableHtml += `<tr class="card">`;
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${letter}</td>`;
        tableHtml += `<td dir="ltr">${file}</td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${id} data-file=${file}>تعديل</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${id} data-file=${file}>حذف</td>`;
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
let addSuccess = document.getElementById('add-success');
function openAddSuccess(){
    addSuccess.classList.add('open-popup');
}
let updateSuccess = document.getElementById('update-success');
function openUpdateSuccess(){
    updateSuccess.classList.add('open-popup');
}
let awf = document.getElementById('awf');
function openawf(){
    awf.classList.add('open-popup');
}
let awf2 = document.getElementById('awf2');
function openawf2(){
    awf2.classList.add('open-popup');
}
let dwc = document.getElementById('dwc');
function opendwc(){
    dwc.classList.add('open-popup');
}
function closeAlert(){
    awf.classList.remove('open-popup');
    awf2.classList.remove('open-popup');
    dwc.classList.remove('open-popup');
}

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
}

// Search By Enter Button Function Call To Action
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchBtn.click();
  }
});