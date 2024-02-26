let requestedLink = window.location.href.toString().split(window.location.host)[1]
// Load Table call To Action
document.addEventListener('DOMContentLoaded', function () {
    const fetchLink = requestedLink + "/get";

    fetch(fetchLink)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));

    if (requestedLink.replace(/[0-9]/g, '') === '/manage/tests/section') {
        const fetchGetUnitsLink = requestedLink.replace('/tests', '/course') + '/get';
        fetch(fetchGetUnitsLink)
        .then(response => response.json())
        .then(data => loadAddTestSelection(data['data']));
    }
    
});

function loadAddTestSelection(data) {
    const sectionNumber = parseInt(requestedLink.replace(/^\D+/g, ''));
    const testSelection = document.getElementById('test-selection');
    let testSelectionHtml = '';
    if (availableTests.indexOf(0) === -1 && sectionNumber !== 1) {
        testSelectionHtml = `<option value="0">القسم ${sectionNumber}</option>`;
    }
    data.forEach(unit => {
        const unitNumber = unit['number'];
        if (availableTests.indexOf(unitNumber) === -1 && unitNumber !== 1) {
            testSelectionHtml += `<option value="${unitNumber}">الوحدة ${unitNumber}</option>`;
        }
    });
    testSelection.innerHTML = testSelectionHtml;
}

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
    const fetchDeleteLink = requestedLink + "/delete/";

    function checkFetchStatus(){
        if(fetchDeleteStatus && fetchPatchStatus){
            location.reload();
        }else{
            console.log("Can't delete server error");
        }
    }

    let fetchDeleteStatus;
    let fetchPatchStatus;
    async function startDeleting(){
        console.log("Starting deleting");
        let target;
        if ((requestedLink.includes("unit") && requestedLink.includes("level") && requestedLink.includes("lesson") && requestedLink.includes("course")) 
        || (requestedLink.includes("unit") && requestedLink.includes("tests"))) {
            target = id;
        } else {
            target = number;
        }

        fetch(fetchDeleteLink + target, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Done deleting');
                fetchDeleteStatus = "Done";
                beforeUpdating();
            }
        });
    }

    let currentNumbers = [];
    let newNumbers = [];
    const totalNumbers = dataLength - parseInt(number);
    async function beforeUpdating() {
        if (totalNumbers > 0 && requestedLink.replace(/[0-9]/g, '') !== "/manage/tests/section") {
            console.log('Before updating');
            for(let i = 0; i < totalNumbers; i++){
                let newNumber = i + parseInt(number);
                let currentNumber = newNumber + 1;
        
                currentNumbers.push(currentNumber);
                newNumbers.push(newNumber);
            }

            startUpdating();
        } else {
            console.log('Done');
            fetchPatchStatus = "Not applicable";
            checkFetchStatus();
        }
    }

    async function startUpdating() {
        console.log("Starting updating");
        const fetchPatchLink = requestedLink + "/update/fillgap";
        fetch(fetchPatchLink, {
            method: 'PATCH',
            headers: {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify({
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

    startDeleting();
}

// Edit Row Function
const editForm = document.getElementById('edit-form');
editForm.addEventListener('submit', () => {
    if ((requestedLink.includes("unit") && requestedLink.includes("level") && requestedLink.includes("lesson") && requestedLink.includes("course")) 
    || (requestedLink.includes("unit") && requestedLink.includes("tests"))) {
        const contentUpdateInput = document.querySelector('#content-update-input').value;
        const newType = document.querySelector('#type-update').value;

        if(!contentUpdateInput){
            error.style.display = "block";
            error.innerText = 'يرجى إدخال جميع المعلومات.';
        }else{
            const fetchLink = requestedLink + "/update/title/";

            fetch(fetchLink + id, {
                method: 'PATCH',
                headers: {
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify({
                    newContent: contentUpdateInput,
                    newType: newType
                })
                })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                }
            });
        }
    } else {
        const titleUpdateInput = document.querySelector('#title-update-input').value;

        if(!titleUpdateInput){
            error.style.display = "block";
            error.innerText = 'يرجى إدخال جميع المعلومات.';
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
                    location.reload();
                }
            });
        }
    }
})
function handleEditRow(id) {
    // Update Button Call To Action
    updateBtn.onclick = function() {
        
    }
}

// Add Button Call To Action
const addForm = document.getElementById('add-form');
addForm.addEventListener('submit', () => {
    const fetchLink = requestedLink + "/insert";

    if ((requestedLink.includes("unit") && requestedLink.includes("level") && requestedLink.includes("lesson") && requestedLink.includes("course")) 
    || (requestedLink.includes("unit") && requestedLink.includes("tests"))) {
        const contentInput = document.querySelector('#content-input').value;
        const number = dataLength + 1;
        const type = document.querySelector('#type').value;
        
        let category;
        if (requestedLink.includes("course")) {
            category = 'course';
        } else {
            category = 'test';
        }

        if (!contentInput) {
            error.style.display = "block";
            error.innerText = 'يرجى إدخال جميع المعلومات.';
        } else {
            fetch(fetchLink, {
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    number: number,
                    category: category,
                    type: type,
                    content : contentInput
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                }
            });
        }
    } else if (requestedLink.replace(/[0-9]/g, '') === '/manage/tests/section') {
        let unitNumber = document.getElementById('test-selection').value;
        unitNumber = parseInt(unitNumber);

        fetch(fetchLink, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                unitNumber: unitNumber
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        });
    } else {
        const titleInput = document.querySelector('#title-input').value;
        const number = dataLength + 1;

        if (!titleInput) {
            error.style.display = "block";
            error.innerText = 'يرجى إدخال جميع المعلومات.';
        } else {
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
                    location.reload();
                }
            });
        }
    }
})

// Load Table Function
let tableItems = [];
let dataLength;
let hrefLink;
let availableTests = [];
function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');
    dataLength = data.length;

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>لا يوجد محتوى</td></tr>";
        return;
    }

    data.forEach(function ({id, number, title, content, sectionNumber, unitNumber}) {
        const listItem = document.createElement('tr');
        listItem.classList.add('card');

        if (!number) {
            number = unitNumber;
        }

        if(requestedLink === "/manage/course/sections" || requestedLink === "/manage/tests/sections"){
            hrefLink = requestedLink.substring(0, requestedLink.length - 1) + number;
        }else if(requestedLink.replace(/[0-9]/g, '') === "/manage/course/section" || requestedLink.replace(/[0-9]/g, '') === "/manage/tests/section"){
            hrefLink = requestedLink + "/unit" + number;
        }else if(requestedLink.includes("unit") && !requestedLink.includes("level")){
            hrefLink = requestedLink + "/level" + number;
        }else if(requestedLink.includes("unit") && requestedLink.includes("level") && !requestedLink.includes("lesson")){
            hrefLink = requestedLink + "/lesson" + number;
        }else if(requestedLink.includes("unit") && requestedLink.includes("level") && requestedLink.includes("lesson")){
            hrefLink = "";
        }

        if(!title && content){
            title = content;
        } else if (!title && !content) {
            if (unitNumber === 0) {
                title = `إختبار القسم ${sectionNumber}`;
            } else {
                title = `إختبار الوحدة ${unitNumber}`;
            }
        }

        if (requestedLink === '/manage/tests/sections') {
            listItem.innerHTML = `
                <td data-number=${number}>${number}</td>
                <td class="draggable" data-id=${id}><a href=${hrefLink}>${title}</a></td>
            `
        } else if (requestedLink.replace(/[0-9]/g, '') === "/manage/tests/section") {
            listItem.innerHTML = `
                <td data-number=${number}>${number}</td>
                <td class="draggable" data-id=${id}><a href=${hrefLink}>${title}</a></td>
                <td class="draggable"><button class="delete-row-btn" data-id=${id} data-number=${number}>حذف</td>
            `
            availableTests.push(number);
        } else {
            listItem.innerHTML = `
                <td data-number=${number}>${number}</td>
                <td class="draggable" data-id=${id}><a href=${hrefLink}>${title}</a></td>
                <td class="draggable"><button class="edit-row-btn" data-id=${id}>تعديل</td>
                <td class="draggable"><button class="delete-row-btn" data-id=${id} data-number=${number}>حذف</td>
            `
        }

        tableItems.push(listItem);
        table.appendChild(listItem);
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

// Form Popup Functions
if (document.querySelector('#open-ap-btn')) {
    const openAWPBtn = document.querySelector('#open-ap-btn');
    const addWordPopup = document.querySelector('.add-popup');
    openAWPBtn.onclick = function () {
        addWordPopup.classList.add('open-popup');
}
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

if (document.querySelector('.table-first-head')) {
    const backbtn = document.querySelector('.table-first-head');
    backbtn.onclick = function() {
        if (requestedLink.replace(/[0-9]/g, '') === '/manage/course/section' || requestedLink.replace(/[0-9]/g, '') === '/manage/tests/section') {
            const backLink = requestedLink.replace(/[0-9]/g, '') + 's';
            window.location.href = backLink;
        } else {
            let lastForwardSlashIndex;
            for (let index = requestedLink.length - 1; index >= 0; index--) {
                if (requestedLink[index] === '/') {
                    lastForwardSlashIndex = index;
                    break;
                }            
            }
    
            const backLink = requestedLink.substring(0, lastForwardSlashIndex);
            window.location.href = backLink;
        }
    }
}