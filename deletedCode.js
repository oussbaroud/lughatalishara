const deleteSection = (request, response) => {
    let { sectionId, deleteThis } = request.params;
    async function deleteData(){
        try {
            sectionId = parseInt(sectionId, 10); 
            const response = await new Promise((resolve, reject) => {
                let query;
                if(deleteThis === "Section"){
                    console.log(deleteThis);
                    query = "DELETE FROM sections WHERE number = ?";
                }else if(deleteThis === "Section And Units"){
                    query = "DELETE sections, units FROM sections INNER JOIN units ON units.sectionId = sections.number WHERE sections.number = ?";
                }else if(deleteThis === "Section, Units And Levels"){
                    query = "DELETE sections, units, levels FROM sections INNER JOIN units ON units.sectionId = sections.number INNER JOIN levels ON levels.sectionId = sections.number WHERE sections.number = ?";
                }else if(deleteThis === "Section, Units, Levels And Lessons"){
                    query = "DELETE sections, units, levels, lessons FROM sections INNER JOIN units ON units.sectionId = sections.number INNER JOIN levels ON levels.sectionId = sections.number INNER JOIN lessons ON lessons.sectionId = sections.number WHERE sections.number = ?";
                }else if(deleteThis === "Section, Units, Levels, Lessons And Contents"){
                    query = "DELETE sections, units, levels, lessons, contents FROM sections INNER JOIN units ON units.sectionId = sections.number INNER JOIN levels ON levels.sectionId = sections.number INNER JOIN lessons ON lessons.sectionId = sections.number INNER JOIN contents ON contents.sectionId = sections.number WHERE sections.number = ?";
                }
    
                connection.query(query, [sectionId] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response >= 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    deleteData()
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
}

async function fetchGet(link, forWhat, currentNumber){
    checkDataStep = checkDataStep + 1;

    fetch(link)
    .then(response => response.json())
    .then(data => checkData(data['data'], link, forWhat, currentNumber));
}

async function checkAllDone(){
    console.log(allDeleteThis.length + ' ' + checkDataStep)
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

async function checkData(data, link, forWhat, currentNumber){
    //console.log("Hey I'm working " + link);
    if(data.length === 0 && link.replace(/[0-9]/g, '') === "/manage/course/section/get"){
        checkBeforeDeleteThis(link, data.length, forWhat, currentNumber);
        checkAllDone();
    }else if(data.length !== 0 && link.replace(/[0-9]/g, '') === "/manage/course/section/get"){
        checkDataStep = checkDataStep - 1;
        data.forEach(unit => {
            fetchGet(link.replace('get', '') + "unit" + unit['number'] + "/get", forWhat, currentNumber);
        })
    }else if(data.length === 0 && link.includes("unit") && !link.includes("level") && !link.includes("lesson")){
        checkBeforeDeleteThis(link, data.length, forWhat, currentNumber);
        checkAllDone();
    }else if(data.length !== 0 && link.includes("unit") && !link.includes("level") && !link.includes("lesson")){
        if (link.includes("course")) {
            checkDataStep = checkDataStep - 1;
            data.forEach(level => {
                fetchGet(link.replace('get', '') + "level" + level['number'] + "/get", forWhat, currentNumber);
            })
        } else {
            checkBeforeDeleteThis(link, data.length, forWhat, currentNumber);
            checkAllDone();
        }
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
    if(requestedLink === "/manage/course/sections"){
        if(link.replace(/[0-9]/g, '') === "/manage/course/section/get"){
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
    }else if(requestedLink.replace(/[0-9]/g, '') === "/manage/course/section" || requestedLink.replace(/[0-9]/g, '') === "/manage/tests/section"){
        if(link.includes("unit") && !link.includes("level") && !link.includes("lesson")){
            if (dataLength === 0) {
                if (forWhat === "Deleting") {
                    allDeleteThis.push("Unit");
                }else {
                    allUpdateThis.push("Unit" + currentNumber);
                }
            } else {
                if (forWhat === "Deleting") {
                    allDeleteThis.push("Unit And Content");
                }
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

async function beforeUpdating(){
    if(totalNumbers > 0){
        console.log('Before updating');
        for(let i = 0; i < totalNumbers; i++){
            let newNumber = i + parseInt(number);
            let currentNumber = newNumber + 1;
    
            currentNumbers.push(currentNumber);
            newNumbers.push(newNumber);

            if(requestedLink === "/manage/course/sections"){
                fetchGetLink = "/manage/course/section" + currentNumber + "/get";
            }else if(requestedLink.replace(/[0-9]/g, '') === "/manage/course/section"){
                fetchGetLink = requestedLink + "/unit" + currentNumber  + "/get";
            }else if(requestedLink.includes("unit") && !requestedLink.includes("level") && !requestedLink.includes("lesson") && requestedLink.includes("course")){
                fetchGetLink = requestedLink + "/level" + currentNumber + "/get";
            }else if(requestedLink.includes("unit") && requestedLink.includes("level") && !requestedLink.includes("lesson") && requestedLink.includes("course")){
                fetchGetLink = requestedLink + "/lesson" + currentNumber + "/get";
            }
            
            if (fetchGetLink) {
                fetchGet(fetchGetLink, "Updating", currentNumber);
            }
        }
    }else{
        console.log('Done');
        fetchPatchStatus = "Not applicable";
        checkFetchStatus();
    }
}

if(requestedLink === "/manage/course/sections"){
    fetchGetLink = "/manage/course/section" + number + "/get";
}else if(requestedLink.replace(/[0-9]/g, '') === "/manage/course/section" || requestedLink.replace(/[0-9]/g, '') === "/manage/tests/section"){
    fetchGetLink = requestedLink + "/unit" + number  + "/get";
}else if(requestedLink.includes("unit") && !requestedLink.includes("level") && !requestedLink.includes("lesson") && requestedLink.includes("course")){
    fetchGetLink = requestedLink + "/level" + number + "/get";
}else if(requestedLink.includes("unit") && requestedLink.includes("level") && !requestedLink.includes("lesson") && requestedLink.includes("course")){
    fetchGetLink = requestedLink + "/lesson" + number + "/get";
}

if((requestedLink.includes("unit") && requestedLink.includes("level") && requestedLink.includes("lesson") && requestedLink.includes("course")) 
|| (requestedLink.includes("unit") && requestedLink.includes("tests"))){
    deleteThis = "Content";
    await startDeleting();
    beforeUpdating();

    if (totalNumbers > 0) {
        updateThis = "Content";
        startUpdating();
    } else {
        checkFetchStatus();
    }
} else {
    fetchGet(fetchGetLink, "Deleting");
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

                    //console.log('This' + parseInt(lastCheckPoint) + parseInt(thisCheckPoint.slice(0, -1) + totalLessons))
                    if (parseInt(lastCheckPoint) >= parseInt(thisCheckPoint.slice(0, -1) + totalLessons)) {
                        levelBtn.classList.add('unlocked');
                        progress.classList.add('no-progress');
                        lessonsConter.classList.add('lesson-unlocked');
                        levelBtn.innerHTML = `<i class="fa-solid fa-check level${levelNumber}"></i>`;
                        lessonsConter.innerHTML = `
                            <h2>${getLessonsData['data'][totalLessons - 1]['title']}</h2>
                            <p>تمرن من جديد لإنعاش ذاكرتك</p>
                            <button class="start-lesson-btn">تمرن</button>
                        `;
                        btnOnClick(getLessonsData['data'][totalLessons - 1]['number']);
                        previousLevelStatus = "Completed";
                        if (levelNumber === getLevelsData['data'].length) {
                            previousUnitStatus = "Completed";
                        }
                        return false;
                    }else if ((currentSection === 1 || unlockedSection)
                        && (lastCheckPoint === '' + currentSection + '100' && levelNumber === 1)
                        || (lastCheckPoint === '' + currentSection + unitNumber + '00' && levelNumber === 1 && previousUnitStatus === "Completed")
                        || (thisCheckPoint === unlockedUnits[i])  
                        || (parseInt(lastCheckPoint.slice(0, -1)) + 1 === parseInt(thisCheckPoint.slice(0, -1)) && previousLevelStatus === "Completed")){
                        console.log((thisCheckPoint === unlockedUnits[i]))
                        levelBtn.classList.add('unlocked');
                        progress.classList.add('no-progress');
                        lessonsConter.classList.add('lesson-unlocked');
                        levelBtn.innerHTML = `<i class="fa-solid fa-star level${levelNumber}"></i>`;
                        lessonsConter.innerHTML = `
                            <h2>${getLessonsData['data'][0]['title']}</h2>
                            <p>درس 1 من ${totalLessons}</p>
                            <button class="start-lesson-btn">إبدأ</button>
                        `;
                        btnOnClick(getLessonsData['data'][0]['number']);
                        previousLevelStatus = "Not Completed";
                        jumpHere.innerHTML = `
                            <h3>إبدأ</h3>
                        `;
                        jumpHere.style.width = '80px';
                        jumpHere.style.right = '-5%';
                        progress.appendChild(jumpHere);
                        if (levelNumber === 1) {
                            unitHead.style.marginBottom = '80px';
                        }
                        return false;
                    }else if ((currentSection === 1 || unlockedSection)
                    && (parseInt(lastCheckPoint) + 1 === parseInt(thisCheckPoint))) {
                        const progressPercent = ((lessonNumber - 1) / totalLessons) * 100;
                        levelBtn.classList.add('unlocked');
                        progress.classList.add('progress');
                        lessonsConter.classList.add('lesson-unlocked');
                        levelBtn.innerHTML = `<i class="fa-solid fa-star level${levelNumber}"></i>`;
                        lessonsConter.innerHTML = `
                            <h2>${getLessonsData['data'][lessonNumber - 1]['title']}</h2>
                            <p>درس ${lessonNumber} من ${totalLessons}</p>
                            <button id="start-lesson-btn" onclick="">إبدأ</button>
                        `;
                        progress.style.background = `conic-gradient(from 0deg, #58cc02 0%, #58cc02 0% ${progressPercent}%, #e5e5e5 ${progressPercent}%, #e5e5e5 100%)`;
                        btnOnClick(getLessonsData['data'][lessonNumber - 1]['number']);
                        previousLevelStatus = "Not Completed";
                        jumpHere.innerHTML = `
                            <h3>إبدأ</h3>
                        `;
                        jumpHere.style.width = '80px';
                        jumpHere.style.right = '-5%';
                        progress.appendChild(jumpHere);
                        if (levelNumber === 1) {
                            unitHead.style.marginBottom = '80px';
                        }
                        return false;
                    } else if ((currentSection === 1 || unlockedSection)
                    && (unitNumber !== 1 && levelNumber === 1)
                    &&(lastCheckPoint === currentSection + "000" || lastCheckPoint === "" + currentSection + unitNumber + "00")) {
                            levelBtn.classList.add('unlocked');
                            progress.classList.add('no-progress');
                            lessonsConter.classList.add('lesson-unlocked');
                            levelBtn.innerHTML = `<i class="fa-solid fa-forward"></i>`;
                            lessonsConter.innerHTML = `
                                <h2>القفز إلى هنا؟</h2>
                                <p>إنجح في هذا الإختبار للقفز إلى الوحدة ${unitNumber}</p>
                                <button class="start-lesson-btn">إبدأ</button>
                            `;
                            btnOnClick('Jump Unit');
                            previousLevelStatus = "Not Completed";
                            jumpHere.innerHTML = `
                                <h3>القفز إلى هنا؟</h3>
                            `;
                            jumpHere.style.width = '120px';
                            jumpHere.style.right = '-34.5%';
                            progress.appendChild(jumpHere);
                            if (levelNumber === 1) {
                                unitHead.style.marginBottom = '80px';
                            }
                            return false; 
                    }else if(parseInt(lastCheckPoint.slice(0, -1)) < parseInt(thisCheckPoint.slice(0, -1))) {
                        levelBtn.classList.add('locked');
                        progress.classList.add('no-progress');
                        lessonsConter.classList.add('lesson-locked');
                        levelBtn.innerHTML = `<i class="fa-solid fa-star level${levelNumber}"></i>`;
                        if (currentSection === 1 || unlockedSection) {
                            lessonsConter.innerHTML = `
                                <h2>${getLessonsData['data'][0]['title']}</h2>
                                <p>أكمل جميع المستويات أعلاه لفتح هذا المستوى</p>
                                <button class="locked-btn">مقفل</button>
                            `;
                        } else {
                            lessonsConter.innerHTML = `
                                <h2>${getLessonsData['data'][0]['title']}</h2>
                                <p>إنجح في إختبار القسم لفتح هذاالقسم</p>
                                <button class="locked-btn">مقفل</button>
                            `;
                        }
                        previousLevelStatus = "Not Completed";
                        return false;   
                    } else{
                        return true;
                    }