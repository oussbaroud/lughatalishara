// Load Table call To Action
document.addEventListener('DOMContentLoaded', function () {
    fetch('/words/getAll')
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

// Selecting The Update Button
const updateBtn = document.querySelector('#update-row-btn');

// Delet Row Function
function deleteRowById(id, file) {
    fetch('/words/delete/' + id + '/' + file, {
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

        if(!updateFileInput.files[0]){
            openawf();
        }else{
            fetch('/words/update/' + id + '/' + file, {
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
        }
    }
}

// Add Button Call To Action
const addBtn = document.querySelector('#add-btn');
addBtn.onclick = function () {
    const wordInput = document.querySelector('#word-input');
    
    if(!wordInput.value){
        openawf();
    }else{
        const word = wordInput.value;

        fetch('/words/insert', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                word : word,
            })
        })
        .then(response => response.json())
        .then(() => {
            openAddSuccess();
        });
    }
}

// Load Table Function
let dragStartIndex;
let tableItems = [];
function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>لا يوجد محتوى</td></tr>";
        return;
    }

    data.forEach(function ({id, word, file}) {
        const listItem = document.createElement('tr');

        listItem.classList.add('card');
        listItem.setAttribute('data-id', id);
        listItem.setAttribute('draggable', 'true');

        listItem.innerHTML = `
            <td>${id}</td>
            <td class="draggable">${word}</td>
            <td dir="ltr" class="draggable">${file}</td>
            <td class="draggable"><button class="edit-row-btn" data-id=${id}>تعديل</td>
            <td class="draggable"><button class="delete-row-btn" data-id=${id}>حذف</td>
        `

        tableItems.push(listItem);
        table.appendChild(listItem);
    });
    addEventListeners();
}

function dragStart() {
    // console.log('Event: ', 'dragstart');
    dragStartIndex = +this.closest('tr').getAttribute('data-id') - 1;
}
  
function dragEnter() {
    // console.log('Event: ', 'dragenter');
    this.classList.add('over');
}

function dragLeave() {
    // console.log('Event: ', 'dragleave');
    this.classList.remove('over');
}

function dragOver(e) {
    // console.log('Event: ', 'dragover');
    e.preventDefault();
}

function dragDrop() {
    // console.log('Event: ', 'drop');
    const dragEndIndex = +this.getAttribute('data-id') - 1;
    console.log(dragStartIndex, dragEndIndex);
    swapItems(dragStartIndex, dragEndIndex);

    this.classList.remove('over');
}

// Swap table items that are drag and drop
function swapItems(fromIndex, toIndex) {
    const allItemOne = tableItems[fromIndex].querySelectorAll('.draggable');
    const allItemTwo = tableItems[toIndex].querySelectorAll('.draggable');

    allItemTwo.forEach(itemTwo => {
        tableItems[fromIndex].appendChild(itemTwo);
    })
    allItemOne.forEach(itemOne => {
        tableItems[toIndex].appendChild(itemOne);
    })
}

function addEventListeners() {
    const dragListItems = document.querySelectorAll('.card');
  
    dragListItems.forEach(item => {
        item.addEventListener('dragstart', dragStart);
        item.addEventListener('dragover', dragOver);
        item.addEventListener('drop', dragDrop);
        item.addEventListener('dragenter', dragEnter);
        item.addEventListener('dragleave', dragLeave);
    });
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