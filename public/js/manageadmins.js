// Load Table call To Action
document.addEventListener('DOMContentLoaded', function () {
    fetch('/admins/getAll')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
    
});
// Delet And Edit Table Button Call To Action
document.querySelector('table tbody').addEventListener('click', function(event) {
    if (event.target.className === "delete-row-btn") {
        opendwc();
        const deleteBtn = document.querySelector('#delete-btn');
        deleteBtn.onclick = function () {
            deleteRowById(event.target.dataset.id);
        }
    }
    if (event.target.className === "edit-row-btn") {
        handleEditRow(event.target.dataset.id);
        openURP();
    }
});

// Selecting The Update And Search Buttons
const updateBtn = document.querySelector('#update-row-btn');
const searchBtn = document.querySelector('#search-btn');

// Search Button Call To Action
searchBtn.onclick = function() {
    const searchValue = document.querySelector('#search-input').value;

    fetch('/admins/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

// Delet Row Function
function deleteRowById(id) {
    fetch('/admins/delete/' + id, {
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
function handleEditRow(id) {
    const updateCheckBox = document.querySelector('#ufa-cb');
    updateCheckBox.dataset.id = id;
    
    fetch('/admins/getFullAccess/' + id)
    .then(response => response.json())
    .then(data => {
        if(data['data'][0]["fullaccess"] == "Yes"){
            updateCheckBox.checked = true;
        }else{
            updateCheckBox.checked = false;
        }
    });
    // Update Button Call To Action
    updateBtn.onclick = function() {
        let fullAccess;
    
        if(updateCheckBox.checked){
            fullAccess = "Yes";
        }else{
            fullAccess = "No";
        }

        fetch('/admins/update/' + id, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({
                id: updateCheckBox.dataset.id,
                fullAccess: fullAccess
            })
        })
        .then(response => response.json())
        .then(data => {

        }); 
    }
}

// Add Button Call To Action
const addBtn = document.querySelector('#add-btn');
addBtn.onclick = function () {
    const fullName = document.querySelector('#fullname');
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');
    const checkBox = document.querySelector('#fa-cb');
    let fullAccess;

    if(checkBox.checked){
        fullAccess = "Yes";
    }else{
        fullAccess = "No";
    }
    
    fetch('/auth/manage/register', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            name: fullName.value,
            email: email.value,
            password: password.value,
            fullAccess: fullAccess
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.status == "error"){
            success.style.display = "none";
            error.style.display = "block";
            error.innerText = data.error;
        }else{
            error.style.display = "none";
            success.style.display = "block";
            success.innerText = data.success; 
        }
    }); 
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

    data.forEach(function ({id, name, email}) {
        tableHtml += `<tr class="card">`;
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td dir="ltr">${email}</td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${id}>تعديل</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${id}>حذف</td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
    pagina();
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