// Load Table call To Action
document.addEventListener('DOMContentLoaded', function () {
    fetch('/manage/sections/get')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
});
// Delet And Edit Table Button Call To Action
document.querySelector('table tbody').addEventListener('click', function(event) {
    if (event.target.className === "delete-row-btn") {
        opendwc();
        const deleteBtn = document.querySelector('#delete-btn');
        deleteBtn.onclick = function () {
            deleteRowById(event.target.dataset.id, event.target.dataset.number);
        }
    }
    if (event.target.className === "edit-row-btn") {
        handleEditRow(event.target.dataset.id);
        openURP();
    }
});

// Selecting The Update Button
const updateBtn = document.querySelector('#update-row-btn');

// Delet Row Function
async function deleteRowById(sectionId, sectionNumber) {

    const fetchGet = await fetch(fetchGetLink)
    const getData = await fetchGet.json();

    if(getData['data'].length === 0){
        deleteThis = "Section";
    }else{
        deleteThis = "Section And Units";
    }

    fetch('/manage/sections/delete/' + sectionId, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    });

    let sectionNumbers = [];
    let newSectionNumbers = [];
    const sectionTotalNumbers = dataLength - parseInt(sectionNumber);

    if(sectionTotalNumbers > 0){
        for(let i = 0; i < sectionTotalNumbers; i++){
            let newNumber = i + parseInt(sectionNumber);
            let number = newNumber + 1;
    
            sectionNumbers.push(number);
            newSectionNumbers.push(newNumber);
        }
        console.log(sectionNumbers, newSectionNumbers)
        fetch('/manage/sections/update/numbers', {
            method: 'PATCH',
            headers: {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify({
                sectionNumbers: sectionNumbers,
                newSectionNumbers: newSectionNumbers
            })
        })
        .then(response => response.json())
    }
}

// Edit Row Function
function handleEditRow(sectionNumber) {
    // Update Button Call To Action
    updateBtn.onclick = function() {
        const titleInputUpdate = document.querySelector('#title-input-update').value;

        if(!titleInputUpdate){
            openawf();
        }else{
            fetch('/manage/sections/update/title/' + sectionNumber, {
                method: 'PATCH',
                headers: {
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify({
                    newSectionTitle: titleInputUpdate
                })
                })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    openUpdateSuccess();
                }
            });
        }
    }
}

// Add Button Call To Action
const addBtn = document.querySelector('#add-btn');
addBtn.onclick = function () {
    const titleInput = document.querySelector('#title-input').value;
    const sectionNumber = dataLength + 1;
    if(!titleInput){
        openawf();
    }else{
        fetch('/manage/sections/insert/' + sectionNumber, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                sectionTitle : titleInput
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data['data'].length !== 0) {
                openAddSuccess();
            }
        });
    }
}

// Load Table Function
let dragStartIndex;
let tableItems = [];
let dataLength;
function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');
    dataLength = data.length;

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>لا يوجد محتوى</td></tr>";
        return;
    }

    data.forEach(function ({sectionId, sectionNumber, sectionTitle}) {
        const listItem = document.createElement('tr');

        listItem.classList.add('card');
        listItem.setAttribute('data-id', sectionNumber);
        listItem.setAttribute('draggable', 'true');

        listItem.innerHTML = `
            <td data-number=${sectionNumber}>${sectionNumber}</td>
            <td class="draggable" data-id=${sectionId}><a href=${sectionTitle}>${sectionTitle}</a></td>
            <td class="draggable"><button class="edit-row-btn" data-id=${sectionId}>تعديل</td>
            <td class="draggable"><button class="delete-row-btn" data-id=${sectionId} data-number=${sectionNumber}>حذف</td>
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

const updateOrder = document.querySelector('#update-order')
updateOrder.onclick = function () {
    let sectionNumbers = [];
    let newSectionNumbers = [];

    tableItems.forEach(tableItem => {
        let newSectionNumber = tableItem.querySelectorAll('td')[0].getAttribute('data-number');
        let sectionNumber = tableItem.querySelectorAll('td')[1].getAttribute('data-id');

        newSectionNumber = parseInt(newSectionNumber);
        sectionNumber = parseInt(sectionNumber);

        newSectionNumbers.push(newSectionNumber);
        sectionNumbers.push(sectionNumber);
    })

    fetch('/manage/sections/update/number', {
        method: 'PATCH',
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            sectionNumbers: sectionNumbers,
            newSectionNumbers: newSectionNumbers
        })
    })
    .then(response => response.json())
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