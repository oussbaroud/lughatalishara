// Load Table
document.addEventListener('DOMContentLoaded', function () {
    fetch('/manage/admins/get')
    .then(response => response.json())
    .then(data => loadHTMLTable(data));
    
});

// Delet And Edit Table Buttons Event Listener
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

// Search Button Event Listener
const searchBtn = document.querySelector('#search-btn');
searchBtn.onclick = function() {
    const searchValue = document.querySelector('#search-input').value;

    fetch('/manage/admins/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

// Search By Enter Button Event Listener
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchBtn.click();
  }
});

// Delet Row Function
function deleteRowById(id) {
    fetch('/manage/admins/delete/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        } else {
            error.style.display = "block";
            error.innerText = data.error;
        }
    });
}

// Update Row Function
function handleEditRow(id) {
    // Get Access
    fetch('/manage/admins/getAccess/' + id)
    .then(response => response.json())
    .then(data => {
        if (data['data']) {
            if (data['data'][0]["access"] === "stats") {
                editStatsCB.checked = true;
            }

            if (data['data'][0]["access"] === "content") {
                editContentCB.checked = true;
            }

            if (data['data'][0]["access"] === "stats, content") {
                editStatsCB.checked = true;
                editContentCB.checked = true;
            }

            if (data['data'][0]["access"] === "fullaccess") {
                editFullAccessCB.checked = true;
                editStatsCB.checked = true;
                editContentCB.checked = true;
            }
        } else {
            error.style.display = "block";
            error.innerText = data.error;
        }
    });

    // Update Row Form Button Event Listener
    const addForm = document.getElementById('edit-form');
    addForm.addEventListener('submit', async () => {    
        let access;
        if(editFullAccessCB.checked) {
            access = "fullaccess";
        } else {
            if (editStatsCB.checked && editContentCB.checked) {
                access = "stats, content";
            } else {
                if (editStatsCB.checked) {
                    access = "stats";
                } else if (editContentCB.checked) {
                    access = "content";
                }
            }
        }

        fetch('/manage/admins/update/' + id, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({
                access: access
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            } else {
                error.style.display = "block";
                error.innerText = data.error;
            }
        }); 
    })
}

// Add Row Button Event Listener
const addForm = document.getElementById('add-form');
addForm.addEventListener('submit', async () => {
    const fullName = document.querySelector('#fullname');
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');

    let access;
    if(fullAccessCB.checked) {
        access = "fullaccess";
    } else {
        if (statsCB.checked && contentCB.checked) {
            access = "stats, content";
        } else {
            if (statsCB.checked) {
                access = "stats";
            } else if (contentCB.checked) {
                access = "content";
            }
        }
    }
    
    fetch('/manage/admins/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            name: fullName.value,
            email: email.value,
            password: password.value,
            access: access
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        } else {
            error.style.display = "block";
            error.innerText = data.error;
        }
    }); 
})

// Load Table Function
let tableHtml;
function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');

    if (data.error) {
        table.innerHTML = `<tr><td class='no-data' colspan='5'>${data.error}</td></tr>`;
        return;
    } else if (data['data'].length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>لا يوجد محتوى</td></tr>";
        return;
    }

    tableHtml = "";

    data['data'].forEach(function ({id, name, email, access}) {
        if (access === 'fullaccess') {
            access = 'كامل الصلاحيات'
        } else {
            if (access === 'stats, content') {
                access = 'الإحصائيات و المحتوى'
            } else {
                if (access === 'stats') {
                    access = 'الإحصائيات'
                } else if (access === 'content') {
                    access = 'المحتوى'
                }
            }
        }
        tableHtml += `<tr class="card">`;
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td dir="ltr">${email}</td>`;
        tableHtml += `<td>${access}</td>`;
        tableHtml += `<td><button class="btn fourth-btn edit-row-btn" data-id=${id}>تعديل</td>`;
        tableHtml += `<td><button class="btn fourth-btn delete-row-btn" data-id=${id}>حذف</td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
    pagina();
}

// Alert Popups Functions
let dwc = document.getElementById('dwc');
function opendwc(){
    dwc.classList.add('open-popup');
}
function closeAlert(){
    dwc.classList.remove('open-popup');
}

// Form Popups Functions
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

// Check All Checkboxes If Full Access Checkbox Checked Evenet Listeners
// For Add Row
const statsCB = document.getElementById('stats-cb');
const contentCB = document.getElementById('content-cb');
const fullAccessCB = document.getElementById('fa-cb');

fullAccessCB.addEventListener('change', function() {
    if (this.checked) {
        statsCB.checked = true;
        contentCB.checked = true;
    } else {
        statsCB.checked = false;
        contentCB.checked = false;
    }
});

// For Update Row
const editStatsCB = document.getElementById('edit-stats-cb');
const editContentCB = document.getElementById('edit-content-cb');
const editFullAccessCB = document.getElementById('edit-fa-cb');

editFullAccessCB.addEventListener('change', function() {
    if (this.checked) {
        editStatsCB.checked = true;
        editContentCB.checked = true;
    } else {
        editStatsCB.checked = false;
        editContentCB.checked = false;
    }
});