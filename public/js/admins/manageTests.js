// Declaring Requested Link
let requestedLink = window.location.href.toString().split(window.location.host)[1]

document.addEventListener('DOMContentLoaded', async function () {
    // Getting Data
    const fetchGetDataLink = requestedLink + "/get";
    const fetchGetData = await fetch(fetchGetDataLink);
    const fetchGetDataResponse = await fetchGetData.json();

    // If Requested Link Not Curriculums Page
    if (!requestedLink.includes("curriculums")) {
        // Assigning Fourth Forward Slash Index
        const startIndex = requestedLink.indexOf('curriculum');
        let fourthForwardSlashIndex;
        for (let index = startIndex; index < requestedLink.length; index++) {
            if (requestedLink[index] === '/') {
                fourthForwardSlashIndex = index;
                break;
            }            
        }

        // Getting Curriculum Released
        const fetchGetReleasedLink = requestedLink.substring(0, fourthForwardSlashIndex) + '/getReleased';
        const fetchGetReleased = await fetch(fetchGetReleasedLink);
        const fetchGetReleasedResponse = await fetchGetReleased.json();
        
        // Loading Table
        loadHTMLTable(fetchGetDataResponse['data'], fetchGetReleasedResponse.released);

    // If Requested Link Curriculums Page
    } else {
        // Loading Table
        loadHTMLTable(fetchGetDataResponse['data']);
    }
    

    // If Requested Link Tests Page
    if (requestedLink.includes("section") && !requestedLink.includes("unit") && requestedLink.includes("tests")) {
        // Getting Units
        const fetchGetUnitsLink = requestedLink.replace('/tests', '/course') + '/get';
        const fetchGetUnits = await fetch(fetchGetUnitsLink);
        const fetchGetUnitsResponse = await fetchGetUnits.json();

        // Loading Test Selection
        loadAddTestSelection(fetchGetUnitsResponse['data']);
    }
    
});

// Load Test Add Selection Function
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

// Delet And Update Table Buttons Event Listener
document.querySelector('table tbody').addEventListener('click', function(event) {
    console.log(event.target.id);
    if (event.target.id === "delete-row-btn") {
        opendwc();
        const deleteBtn = document.querySelector('#delete-btn');
        deleteBtn.onclick = function () {
            deleteRowById(event.target.dataset.id, event.target.dataset.number);
        }
    } else if (event.target.id === "edit-row-btn") {
        handleEditRow(event.target.dataset.id);
        openURP();
    } else if (event.target.id === "release-row-btn") {
        openRCC();
        const releaseBtn = document.querySelector('#release-btn');
        releaseBtn.onclick = function () {
            releaseRow(event.target.dataset.id);
        }
        
    }
});

// Release Row Function
async function releaseRow(version) {
    const error = document.getElementById('release-error');
    const fetchLink = requestedLink + "/update/released/";
    const released = 'true';

    fetch(fetchLink + version, {
        method: 'PATCH',
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            released : released
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
}

// Delet Row Function
async function deleteRowById(id, number) {
    const error = document.getElementById('delete-error');

    let target;
    if ((requestedLink.includes("lesson") && requestedLink.includes("course")) 
    || (requestedLink.includes("unit") && requestedLink.includes("tests"))) {
        target = id;
    } else {
        target = number;
    }
    
    const fetchDeleteLink = requestedLink + "/delete/";
    const fetchDelete = await fetch(fetchDeleteLink + target, {
        method: 'DELETE'
    });
    const fetchDeleteResponse = await fetchDelete.json();
    
    if (fetchDeleteResponse.success) {
        let currentNumbers = [];
        let newNumbers = [];
        const totalNumbers = dataLength - parseInt(number);
        
        if (totalNumbers > 0 && requestedLink.replace(/[0-9]/g, '') !== "/manage/tests/section") {
            for(let i = 0; i < totalNumbers; i++){
                let newNumber = i + parseInt(number);
                let currentNumber = newNumber + 1;
        
                currentNumbers.push(currentNumber);
                newNumbers.push(newNumber);
            }

            const fetchPatchLink = requestedLink + "/update/fillgap";
            const fetchPatch = await fetch(fetchPatchLink, {
                method: 'PATCH',
                headers: {
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify({
                    currentNumbers: currentNumbers,
                    newNumbers: newNumbers
                })
            });
            const fetchPatchResponse = await fetchPatch.json();
            
            if (fetchPatchResponse.success) {
                location.reload();
            } else {
                error.style.display = "block";
                error.innerText = fetchPatchResponse.error;
            }
        } else {
            location.reload();
        }
    } else {
        error.style.display = "block";
        error.innerText = fetchDeleteResponse.error;
    }
}

// Update Row Function
if (!requestedLink.includes("curriculum") && !requestedLink.includes("test")
|| requestedLink.includes("course")) {
    function handleEditRow(id) {
        // Update Form Button Event Listener
        const editForm = document.getElementById('edit-form');
        editForm.addEventListener('submit', () => {
            const error = document.getElementById('edit-error');
    
            let fetchLink;
            let body;
            if ((requestedLink.includes("unit") && requestedLink.includes("level") && requestedLink.includes("lesson") && requestedLink.includes("course")) 
            || (requestedLink.includes("unit") && requestedLink.includes("tests"))) {
                const contentUpdateInput = document.querySelector('#content-update-input').value;
                const newType = document.querySelector('#type-update').value;
    
                fetchLink = requestedLink + "/update/content/";
                body = {
                    newContent: contentUpdateInput,
                    newType: newType
                };
            } else {
                const titleUpdateInput = document.querySelector('#title-update-input').value;
    
                fetchLink = requestedLink + "/update/title/";
                body = {
                    newTitle: titleUpdateInput
                };
            }
    
            fetch(fetchLink + id, {
                method: 'PATCH',
                headers: {
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify(body)
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
}

// Add Row Form Button Event Listener
if (!requestedLink.includes("curriculum") && !requestedLink.includes("test")
|| requestedLink.includes("unit") && requestedLink.includes("test")
|| requestedLink.includes("course")) {
    const addForm = document.getElementById('add-form');
    addForm.addEventListener('submit', () => {
        const fetchLink = requestedLink + "/insert";
        const error = document.getElementById('add-error');

        let body;
        if (requestedLink === "/manage/course/curriculums") {
            const titleInput = document.querySelector('#title-input').value;

            body = {
                title : titleInput,
                released : 'false'
            };

        } else if (requestedLink.includes("section") && !requestedLink.includes("unit") && requestedLink.includes("tests")) {
            let unitNumber = document.getElementById('test-selection').value;
            unitNumber = parseInt(unitNumber);

            body = {
                unitNumber: unitNumber
            };
            
        } else if ((requestedLink.includes("lesson") && requestedLink.includes("course")) 
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

            body = {
                number: number,
                category: category,
                type: type,
                content : contentInput
            };

        } else {
            const titleInput = document.querySelector('#title-input').value;
            const number = dataLength + 1;

            body = {
                number: number,
                title : titleInput
            };
        }
        
        fetch(fetchLink, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(body)
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

// Load Table Function
let tableItems = [];
let dataLength;
let hrefLink;
let availableTests = [];
function loadHTMLTable(data, dataReleased) {
    const table = document.querySelector('table tbody');
    dataLength = data.length;

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>لا يوجد محتوى</td></tr>";
        return;
    }

    data.forEach(function ({ id, number, title, content, type, sectionNumber, unitNumber, version, released, releaseDate }) {
        const listItem = document.createElement('tr');
        listItem.classList.add('card');

        if (requestedLink.includes("curriculums")) {
            hrefLink = requestedLink.substring(0, requestedLink.length - 1) + version;
        } else if (requestedLink.replace(/[0-9]/g, '') === "/manage/course/curriculum"
        || requestedLink.replace(/[0-9]/g, '') === "/manage/tests/curriculum") {
            hrefLink = requestedLink + "/section" + number;
        } else if (requestedLink.includes("section") && !requestedLink.includes("unit")) {
            if (requestedLink.includes("course")) {
                hrefLink = requestedLink + "/unit" + number;
            } else {
                hrefLink = requestedLink + "/unit" + unitNumber;
            }
        } else if (requestedLink.includes("unit") && !requestedLink.includes("level")) {
            hrefLink = requestedLink + "/level" + number;
        } else if (requestedLink.includes("level") && !requestedLink.includes("lesson")) {
            hrefLink = requestedLink + "/lesson" + number;
        }

        if (released === 'false') {
            releaseDate = 'غير محرر';
        } else if (requestedLink.includes("section") && !requestedLink.includes("unit") && requestedLink.includes("tests")) {
            if (unitNumber === 0) {
                title = `إختبار القسم ${sectionNumber}`;
            } else {
                title = `إختبار الوحدة ${unitNumber}`;
            }
        } else if (requestedLink.includes("lesson")
        || (requestedLink.includes("unit") && requestedLink.includes("tests"))) {
            if (type === 'selecting words') {
                type = 'إختيار الكلمات';
            } else if (type === 'selecting sign') {
                type = 'إختيار الإشارة';
            }
        }

        if (requestedLink.includes("curriculums") && requestedLink.includes("course")) {
            listItem.setAttribute('draggable', 'false');

            if (released === 'false') {
                listItem.innerHTML = `
                    <td><a href=${hrefLink}>${version}</a></td>
                    <td><a href=${hrefLink}>${title}</a></td>
                    <td><a href=${hrefLink}>${releaseDate}</a></td>
                    <td><button class="btn fourth-btn" id="edit-row-btn" data-id=${version}>تعديل</td>
                    <td><button class="btn fourth-btn" id="release-row-btn" data-id=${version}>تحرير</td>
                `
            } else {
                listItem.innerHTML = `
                    <td><a href=${hrefLink}>${version}</a></td>
                    <td><a href=${hrefLink}>${title}</a></td>
                    <td><a href=${hrefLink}>${releaseDate}</a></td>
                    <td><button class="btn locked-btn" id="edit-row-btn" data-id=${version}>تعديل</td>
                    <td><button class="btn locked-btn" id="release-row-btn" data-id=${version}>تحرير</td>
                `
            }

        } else if (requestedLink.includes("curriculums") && requestedLink.includes("tests")) {
            listItem.setAttribute('draggable', 'false');

            listItem.innerHTML = `
                <td><a href=${hrefLink}>${version}</a></td>
                <td><a href=${hrefLink}>${title}</a></td>
                <td><a href=${hrefLink}>${releaseDate}</a></td>
            `
        } else if (requestedLink.includes("curriculum") && !requestedLink.includes("section") && requestedLink.includes("tests")) {
            listItem.classList.add('drag');

            listItem.setAttribute('draggable', 'true');
            listItem.setAttribute('data-number', number);

            listItem.innerHTML = `
                <td data-number=${number}><a href=${hrefLink}>${number}</a></td>
                <td class="draggable" data-number=${number}><a href=${hrefLink}>${title}</a></td>
            `
        } else if (requestedLink.includes("section") && !requestedLink.includes("unit") && requestedLink.includes("tests")) {
            listItem.setAttribute('draggable', 'false');

            if (dataReleased === 'false') {
                listItem.innerHTML = `
                    <td><a href=${hrefLink}>${unitNumber}</a></td>
                    <td><a href=${hrefLink}>${title}</a></td>
                    <td><button class="btn fourth-btn" id="delete-row-btn" data-id=${id} data-number=${number}>حذف</td>
                `
            } else {
                listItem.innerHTML = `
                    <td><a href=${hrefLink}>${unitNumber}</a></td>
                    <td><a href=${hrefLink}>${title}</a></td>
                    <td><button class="btn locked-btn" id="delete-row-btn" data-id=${id} data-number=${number}>حذف</td>
                `
            }

            availableTests.push(unitNumber);
        } else if (requestedLink.includes("lesson")
        || (requestedLink.includes("unit") && requestedLink.includes("tests"))) {
            listItem.classList.add('drag');

            listItem.setAttribute('draggable', 'true');
            listItem.setAttribute('data-number', number);

            if (dataReleased === 'false') {
                listItem.innerHTML = `
                    <td data-number=${number}>${number}</td>
                    <td class="draggable" data-number=${number}>${content}</td>
                    <td class="draggable" data-number=${number}>${type}</td>
                    <td class="draggable"><button class="btn fourth-btn" id="edit-row-btn" data-id=${id}>تعديل</td>
                    <td class="draggable"><button class="btn fourth-btn" id="delete-row-btn" data-id=${id} data-number=${number}>حذف</td>
                ` 
            } else {
                listItem.innerHTML = `
                    <td data-number=${number}>${number}</td>
                    <td class="draggable" data-number=${number}>${content}</td>
                    <td class="draggable" data-number=${number}>${type}</td>
                    <td class="draggable"><button class="btn locked-btn" id="edit-row-btn" data-id=${id}>تعديل</td>
                    <td class="draggable"><button class="btn locked-btn" id="delete-row-btn" data-id=${id} data-number=${number}>حذف</td>
                `  
            }

        } else {
            listItem.classList.add('drag');

            listItem.setAttribute('draggable', 'true');
            listItem.setAttribute('data-number', number);

            if (dataReleased === 'false') {
                listItem.innerHTML = `
                    <td data-number=${number}><a href=${hrefLink}>${number}</a></td>
                    <td class="draggable" data-number=${number}><a href=${hrefLink}>${title}</a></td>
                    <td class="draggable"><button class="btn fourth-btn" id="edit-row-btn" data-id=${id}>تعديل</td>
                    <td class="draggable"><button class="btn fourth-btn" id="delete-row-btn" data-id=${id} data-number=${number}>حذف</td>
                `
            } else {
                listItem.innerHTML = `
                    <td data-number=${number}><a href=${hrefLink}>${number}</a></td>
                    <td class="draggable" data-number=${number}><a href=${hrefLink}>${title}</a></td>
                    <td class="draggable"><button class="btn locked-btn" id="edit-row-btn" data-id=${id}>تعديل</td>
                    <td class="draggable"><button class="btn locked-btn" id="delete-row-btn" data-id=${id} data-number=${number}>حذف</td>
                `
            }

        }

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
    swapItems(dragStartIndex, dragEndIndex);

    this.classList.remove('over');

    const updateOrderContainer = document.querySelector('.update-order-container')
    updateOrderContainer.style.display = 'block';
}

// Swap list items that are drag and drop
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
    const dragListItems = document.querySelectorAll('.drag');

    dragListItems.forEach(item => {
        item.addEventListener('dragstart', dragStart);
        item.addEventListener('dragover', dragOver);
        item.addEventListener('drop', dragDrop);
        item.addEventListener('dragenter', dragEnter);
        item.addEventListener('dragleave', dragLeave);
    });
}

const updateOrderBtn = document.querySelector('#update-order-btn')
updateOrderBtn.onclick = function () {
    let currentNumbers = [];
    let newNumbers = [];

    tableItems.forEach((tableItem, index) => {
        const pendingNumber = dataLength + index + 1;
        let currentNumber = tableItem.querySelectorAll('td')[1].getAttribute('data-number');

        currentNumber = parseInt(currentNumber);

        newNumbers.push(pendingNumber);
        currentNumbers.push(currentNumber);
    });

    tableItems.forEach((tableItem, index) => {
        const pendingNumber = dataLength + index + 1;
        let newNumber = tableItem.querySelectorAll('td')[0].getAttribute('data-number');

        newNumber = parseInt(newNumber);

        newNumbers.push(newNumber);
        currentNumbers.push(pendingNumber);
    });

    const fetchLink = requestedLink + "/update/order";
    const error = document.getElementById('update-order-error');

    fetch(fetchLink, {
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
            location.reload();
        } else {
            error.style.display = "block";
            error.innerText = data.error;
        }
    });
}

// Alert Popups Functions
const dwc = document.getElementById('dwc');
function opendwc(){
    dwc.classList.add('open-popup');
}

const rCC = document.getElementById('rcc');
function openRCC(){
    rCC.classList.add('open-popup');
}

function closeAlert(){
    dwc.classList.remove('open-popup');
    rCC.classList.remove('open-popup');
}

// Form Popups Functions
const addWordPopup = document.querySelector('.add-popup');
if (document.querySelector('#open-ap-btn')) {
    const openAWPBtn = document.querySelector('#open-ap-btn');
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

// Back Button Event Listener
if (document.querySelector('.table-first-head i')) {
    const backbtn = document.querySelector('.table-first-head i');
    backbtn.onclick = function() {
        if (requestedLink.replace(/[0-9]/g, '') === '/manage/course/curriculum'
        || requestedLink.replace(/[0-9]/g, '') === '/manage/tests/curriculum') {
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