const requestedLink = window.location.href.toString().split(window.location.host)[1]
// Load Table call To Action
document.addEventListener('DOMContentLoaded', function () {
    const fetchLink = requestedLink + "/get";

    fetch(fetchLink)
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
async function deleteRowById(id, number) {
    let deleteThis;
    let updateThis;
    let allUpdateThis = [];
    let fetchGetLink;
    let checkDataStep = 0;
    let allDeleteThis = [];
    const fetchDeleteLink = requestedLink + "/delete/";

    async function fetchGet(link, forWhat, currentNumber){
        checkDataStep = checkDataStep + 1;

        await fetch(link)
        .then(response => response.json())
        .then(data => checkData(data['data'], link, forWhat, currentNumber));

        //startDeleting();
    }

    async function checkAllDone(){
        if (allDeleteThis.length === checkDataStep && !fetchDeleteStatus) {
            deleteThis = allDeleteThis.reduce(
                function (a, b) {
                    return a.length > b.length ? a : b;
                }
            );
            console.log("Delete " + deleteThis);
            await startDeleting();
            checkDataStep = 0;
            beforeUpdating();
        }

        if (allUpdateThis.length === checkDataStep && totalNumbers > 0 && !fetchPatchStatus) {
            updateThis = allUpdateThis.reduce(
                function (a, b) {
                    if(a.replace(/^\D+/g, '') === b.replace(/^\D+/g, '')){
                        return a.length > b.length ? a : b;
                    }else{
                        return a + "/" + b;
                    }
                }
            );
            updateThis = updateThis.split("/").map(a => ({ value: a.replace(/[0-9]/g, ''), sort: parseInt(a.replace(/^\D+/g, '')) })).sort((a, b) => a.sort - b.sort).map(a => a.value)
            console.log(allUpdateThis);
            console.log(updateThis);
            startUpdating();
            checkDataStep = 0;
        }
    }

    function checkFetchStatus(){
        if(fetchDeleteStatus && fetchPatchStatus){
            location.reload();
        }else{
            console.log("Can't delete server error");
        }
    }

    async function checkData(data, link, forWhat, currentNumber){
        //console.log("Hey I'm working " + link);
        if(data.length === 0 && link.replace(/[0-9]/g, '') === "/manage/section/get"){
            checkBeforeDeleteThis(link, data.length, forWhat, currentNumber);
            checkAllDone();
        }else if(data.length !== 0 && link.replace(/[0-9]/g, '') === "/manage/section/get"){
            checkDataStep = checkDataStep - 1;
            data.forEach(unit => {
                fetchGet(link.replace('get', '') + "unit" + unit['number'] + "/get", forWhat, currentNumber);
            })
        }else if(data.length === 0 && link.includes("unit") && !link.includes("level") && !link.includes("lesson")){
            checkBeforeDeleteThis(link, data.length, forWhat, currentNumber);
            checkAllDone();
        }else if(data.length !== 0 && link.includes("unit") && !link.includes("level") && !link.includes("lesson")){
            checkDataStep = checkDataStep - 1;
            data.forEach(level => {
                fetchGet(link.replace('get', '') + "level" + level['number'] + "/get", forWhat, currentNumber);
            })
        }else if(data.length === 0 && link.includes("unit") && link.includes("level") && !link.includes("lesson")){
            checkBeforeDeleteThis(link, data.length, forWhat, currentNumber);
            checkAllDone();
        }else if(data.length !== 0 && link.includes("unit") && link.includes("level") && !link.includes("lesson")){
            checkDataStep = checkDataStep - 1;
            data.forEach(lesson => {
                fetchGet(link.replace('get', '') + "lesson" + lesson['number'] + "/get", forWhat, currentNumber);
            })
        }else if(data.length === 0 && link.includes("unit") && link.includes("level") && link.includes("lesson")){
            checkBeforeDeleteThis(link, data.length, forWhat, currentNumber);
            checkAllDone();
        }else if(data.length !== 0 && link.includes("unit") && link.includes("level") && link.includes("lesson")){
            checkBeforeDeleteThis(link, data.length, forWhat, currentNumber);
            checkAllDone();
        }
    }

    async function checkBeforeDeleteThis(link, dataLength, forWhat, currentNumber){
        if(requestedLink === "/manage/sections"){
            if(link.replace(/[0-9]/g, '') === "/manage/section/get"){
                if (forWhat === "Deleting") {
                    allDeleteThis.push("Section");
                }else {
                    allUpdateThis.push("Section" + currentNumber);
                }
            }else if(link.includes("unit") && !link.includes("level") && !link.includes("lesson")){
                if (forWhat === "Deleting") {
                    allDeleteThis.push("Section And Units");
                }else {
                    allUpdateThis.push("Section And Units" + currentNumber);
                }
            }else if(link.includes("unit") && link.includes("level") && !link.includes("lesson")){
                if (forWhat === "Deleting") {
                    allDeleteThis.push("Section, Units And Levels");
                }else {
                    allUpdateThis.push("Section, Units And Levels" + currentNumber);
                }
            }else if(link.includes("unit") && link.includes("level") && link.includes("lesson")){
                if(dataLength === 0){
                    if (forWhat === "Deleting") {
                        allDeleteThis.push("Section, Units, Levels And Lessons");
                    }else {
                        allUpdateThis.push("Section, Units, Levels And Lessons" + currentNumber);
                    }
                }else{
                    if (forWhat === "Deleting") {
                        allDeleteThis.push("Section, Units, Levels, Lessons And Contents");
                    }else {
                        allUpdateThis.push("Section, Units, Levels, Lessons And Contents" + currentNumber);
                    }
                }
            }
        }else if(requestedLink.replace(/[0-9]/g, '') === "/manage/section"){
            if(link.includes("unit") && !link.includes("level") && !link.includes("lesson")){
                if (forWhat === "Deleting") {
                    allDeleteThis.push("Unit");
                }else {
                    allUpdateThis.push("Unit" + currentNumber);
                }
            }else if(link.includes("unit") && link.includes("level") && !link.includes("lesson")){
                if (forWhat === "Deleting") {
                    allDeleteThis.push("Unit And Levels");
                }else {
                    allUpdateThis.push("Unit And Levels" + currentNumber);
                }
            }else if(link.includes("unit") && link.includes("level") && link.includes("lesson")){
                if(dataLength === 0){
                    if (forWhat === "Deleting") {
                        allDeleteThis.push("Unit, Levels And Lessons");
                    }else {
                        allUpdateThis.push("Unit, Levels And Lessons" + currentNumber);
                    }
                }else{
                    if (forWhat === "Deleting") {
                        allDeleteThis.push("Unit, Levels, Lessons And Contents");
                    }else {
                        allUpdateThis.push("Unit, Levels, Lessons And Contents" + currentNumber);
                    }
                }
            }
        }else if(requestedLink.includes("unit") && !requestedLink.includes("level")){
            if(link.includes("unit") && link.includes("level") && !link.includes("lesson")){
                if (forWhat === "Deleting") {
                    allDeleteThis.push("Level");
                }else {
                    allUpdateThis.push("Level" + currentNumber);
                }
            }else if(link.includes("unit") && link.includes("level") && link.includes("lesson")){
                if(dataLength === 0){
                    if (forWhat === "Deleting") {
                        allDeleteThis.push("Level And Lessons");
                    }else {
                        allUpdateThis.push("Level And Lessons" + currentNumber);
                    }
                }else{
                    if (forWhat === "Deleting") {
                        allDeleteThis.push("Level, Lessons And Contents");
                    }else {
                        allUpdateThis.push("Level, Lessons And Contents" + currentNumber);
                    }
                }
            }
        }else if(requestedLink.includes("unit") && requestedLink.includes("level")){
            if(link.includes("unit") && link.includes("level") && link.includes("lesson")){
                if(dataLength === 0){
                    if (forWhat === "Deleting") {
                        allDeleteThis.push("Lesson");
                    }else {
                        allUpdateThis.push("Lesson" + currentNumber);
                    }
                }else{
                    if (forWhat === "Deleting") {
                        allDeleteThis.push("Lesson And Contents");
                    }else {
                        allUpdateThis.push("Lesson And Contents" + currentNumber);
                    }
                }
            }
        }
    }

    let fetchDeleteStatus;
    let fetchPatchStatus;
    async function startDeleting(){
        if(deleteThis){
            console.log("Starting deleting");
            await fetch(fetchDeleteLink + number + '/' + deleteThis, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchDeleteStatus = "Done";
                }
            });
        }
    }

    let currentNumbers = [];
    let newNumbers = [];
    const totalNumbers = dataLength - parseInt(number);
    async function beforeUpdating(){
        if(totalNumbers > 0){
            for(let i = 0; i < totalNumbers; i++){
                let newNumber = i + parseInt(number);
                let currentNumber = newNumber + 1;
        
                currentNumbers.push(currentNumber);
                newNumbers.push(newNumber);
    
                if(requestedLink === "/manage/sections"){
                    fetchGetLink = "/manage/section" + currentNumber + "/get";
                }else if(requestedLink.replace(/[0-9]/g, '') === "/manage/section"){
                    fetchGetLink = requestedLink + "/unit" + currentNumber  + "/get";
                }else if(requestedLink.includes("unit") && !requestedLink.includes("level")){
                    fetchGetLink = requestedLink + "/level" + currentNumber + "/get";
                }else if(requestedLink.includes("level") && requestedLink.includes("level")){
                    fetchGetLink = requestedLink + "/lesson" + currentNumber + "/get";
                }
    
                fetchGet(fetchGetLink, "Updating", currentNumber);
            }
        }else{
            fetchPatchStatus = "Not applicable";
            checkFetchStatus();
        }
    }

    async function startUpdating(){
        console.log("Starting updating");
        const fetchPatchLink = requestedLink + "/update/fillgap";
        await fetch(fetchPatchLink, {
            method: 'PATCH',
            headers: {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify({
                updateThis: updateThis,
                currentNumbers: currentNumbers,
                newNumbers: newNumbers
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchPatchStatus = "Done";
                checkFetchStatus();
            }
        });
    }

    if(requestedLink === "/manage/sections"){
        fetchGetLink = "/manage/section" + number + "/get";
    }else if(requestedLink.replace(/[0-9]/g, '') === "/manage/section"){
        fetchGetLink = requestedLink + "/unit" + number  + "/get";
    }else if(requestedLink.includes("unit") && !requestedLink.includes("level")){
        fetchGetLink = requestedLink + "/level" + number + "/get";
    }else if(requestedLink.includes("level") && requestedLink.includes("level")){
        fetchGetLink = requestedLink + "/lesson" + number + "/get";
    }

    if(requestedLink.includes("unit") && requestedLink.includes("level") && requestedLink.includes("lesson")){
        deleteThis = "Content";
        startDeleting();
    }else{
        fetchGet(fetchGetLink, "Deleting");
    }
}

// Edit Row Function
function handleEditRow(id) {
    // Update Button Call To Action
    updateBtn.onclick = function() {
        const titleUpdateInput = document.querySelector('#title-input-update').value;

        if(!titleUpdateInput){
            openawf();
        }else{
            const fetchLink = requestedLink + "/update/title/";

            fetch(fetchLink + id, {
                method: 'PATCH',
                headers: {
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify({
                    newTitle: titleUpdateInput
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
    const number = dataLength + 1;
    if(!titleInput){
        openawf();
    }else{
        const fetchLink = requestedLink + "/insert";

        if(requestedLink.includes("unit") && requestedLink.includes("level") && requestedLink.includes("lesson")){
            const type = document.querySelector('#type').value;
            const category = document.querySelector('#category').value;

            fetch(fetchLink, {
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    number: number,
                    type: type,
                    category: category,
                    title : titleInput
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data['data'].length !== 0) {
                    openAddSuccess();
                }
            });
        }else{
            fetch(fetchLink, {
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    number: number,
                    title : titleInput
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
}

// Load Table Function
let dragStartIndex;
let tableItems = [];
let dataLength;
let hrefLink;
function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');
    dataLength = data.length;

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>لا يوجد محتوى</td></tr>";
        return;
    }

    data.forEach(function ({id, number, title, content}) {
        const listItem = document.createElement('tr');

        listItem.classList.add('card');
        listItem.setAttribute('data-number', number);
        listItem.setAttribute('draggable', 'true');

        if(requestedLink === "/manage/sections"){
            hrefLink = "/manage/section" + number;
        }else if(requestedLink.replace(/[0-9]/g, '') === "/manage/section"){
            hrefLink = requestedLink + "/unit" + number;
        }else if(requestedLink.includes("unit") && !requestedLink.includes("level")){
            hrefLink = requestedLink + "/level" + number;
        }else if(requestedLink.includes("unit") && requestedLink.includes("level") && !requestedLink.includes("lesson")){
            hrefLink = requestedLink + "/lesson" + number;
        }else if(requestedLink.includes("unit") && requestedLink.includes("level") && requestedLink.includes("lesson")){
            hrefLink = "";
        }

        if(!title){
            title = content;
        }

        listItem.innerHTML = `
            <td data-number=${number}>${number}</td>
            <td class="draggable" data-id=${id}><a href=${hrefLink}>${title}</a></td>
            <td class="draggable"><button class="edit-row-btn" data-id=${id}>تعديل</td>
            <td class="draggable"><button class="delete-row-btn" data-id=${id} data-number=${number}>حذف</td>
        `

        tableItems.push(listItem);
        table.appendChild(listItem);
    });
    addEventListeners();
}

function dragStart() {
    // console.log('Event: ', 'dragstart');
    dragStartIndex = +this.closest('tr').getAttribute('data-number') - 1;
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
    const dragEndIndex = +this.getAttribute('data-number') - 1;
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
    const fetchLink = requestedLink + "/update/order/";
    let ids = [];
    let newNumbers = [];

    tableItems.forEach(tableItem => {
        let newNumber = tableItem.querySelectorAll('td')[0].getAttribute('data-number');
        let id = tableItem.querySelectorAll('td')[1].getAttribute('data-id');

        newNumber = parseInt(newNumber);
        id = parseInt(id);

        newNumbers.push(newNumber);
        ids.push(id);
    })

    fetch(fetchLink, {
        method: 'PATCH',
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            ids: ids,
            newNumbers: newNumbers
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
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