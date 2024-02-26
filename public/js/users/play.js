const requestedLink = window.location.href.toString().split(window.location.host)[1]
const contentContainer = document.querySelector('.content-container');
const userId = contentContainer.getAttribute('user-id');
let replay;

document.addEventListener('DOMContentLoaded', async function () {
    let thisCheckPoint = requestedLink.replace(/\D/g,'');
    
    const getUserJourneyCourseLink = `/journey/course/${userId}/get`
    const fetchGetUserJourneyCourse = await fetch(getUserJourneyCourseLink);
    const userJourneyCourseData = await fetchGetUserJourneyCourse.json();
    
    const getUserJourneyTestsLink = `/journey/test/${userId}/get`
    const fetchGetUserJourneyTests = await fetch(getUserJourneyTestsLink);
    const userJourneyTestseData = await fetchGetUserJourneyTests.json();
    console.log('This checkpoint ' + thisCheckPoint);

    if (userJourneyCourseData['data'].length === 0 && userJourneyTestseData['data'].length === 0) {
        if (requestedLink === '/section1/unit1/level1/lesson1' || requestedLink.includes('test')) {
            startFetching();
        }
    } else {
        if (userJourneyCourseData['data'].length === 0 && userJourneyTestseData['data'].length !== 0) {
            if (requestedLink.includes('lesson')) {
                if (requestedLink === '/section1/unit1/level1/lesson1') {
                    startFetching();
                } else {
                    // Lesson not available
                    console.log('LESSON NOT AVAILABLE')
                }
            } else {
                    // For every test completed
                    const thisTestNotCompleted = userJourneyTestseData['data'].every(test => '' + test['sectionNumber'] + test['unitNumber'] !== thisCheckPoint);
                    // If this test not completed
                    if (thisTestNotCompleted) {
                        startFetching();
                    }
            }
        } else if (userJourneyCourseData['data'].length !== 0 && userJourneyTestseData['data'].length === 0) {
            if (requestedLink.includes('lesson')) {
                const lastCourseCheckPoint = userJourneyCourseData['data'][userJourneyCourseData['data'].length - 1]['checkPoint'].toString();
                const getNextLessonLink = `/manage/course/section${lastCourseCheckPoint[0]}/unit${lastCourseCheckPoint[1]}/level${lastCourseCheckPoint[2]}/lesson${lastCourseCheckPoint[3]}/all/getnext`;
                const fetchGetNextLesson = await fetch(getNextLessonLink);
                const nextLessonData = await fetchGetNextLesson.json();

                if (nextLessonData['data'].length === 2) {
                    const nextCheckPoint = '' + nextLessonData['data'][0]['sectionNumber'] + nextLessonData['data'][1]['unitNumber'] + nextLessonData['data'][1]['levelNumber'] + nextLessonData['data'][1]['number'];
                    
                    if (thisCheckPoint === nextCheckPoint) {
                        startFetching();
                    } else {
                        const getNextLessonFromLevelLink = '/manage/course' + requestedLink + '/level/getnext';
                        const fetchGetNextLessonFromLevel = await fetch(getNextLessonFromLevelLink);
                        const nextLessonFromLevelData = await fetchGetNextLessonFromLevel.json();
                        // If last lesson
                        if (nextLessonFromLevelData['data'].length === 0) {
                            startFetching();
                            replay = true;
                        } else {
                            // Lesson not available
                            console.log('LESSON NOT AVAILABLE')
                        }
                    }
                } else {
                    // Lesson not found
                    console.log('LESSON NOT FOUND')
                }
            } else {
                startFetching();
            }
        } else if (userJourneyCourseData['data'].length !== 0 && userJourneyTestseData['data'].length !== 0) {
            if (requestedLink.includes('lesson')) {
                const lastCourseCheckPoint = userJourneyCourseData['data'][userJourneyCourseData['data'].length - 1]['checkPoint'].toString();
                const getNextLessonLink = `/manage/course/section${lastCourseCheckPoint[0]}/unit${lastCourseCheckPoint[1]}/level${lastCourseCheckPoint[2]}/lesson${lastCourseCheckPoint[3]}/all/getnext`;
                const fetchGetNextLesson = await fetch(getNextLessonLink);
                const nextLessonData = await fetchGetNextLesson.json();

                if (nextLessonData['data'].length === 2) {
                    const nextCheckPoint = '' + nextLessonData['data'][0]['sectionNumber'] + nextLessonData['data'][1]['unitNumber'] + nextLessonData['data'][1]['levelNumber'] + nextLessonData['data'][1]['number'];
                    
                    if (thisCheckPoint === nextCheckPoint) {
                        startFetching();
                    } else {
                        const getNextLessonFromLevelLink = '/manage/course' + requestedLink + '/level/getnext';
                        const fetchGetNextLessonFromLevel = await fetch(getNextLessonFromLevelLink);
                        const nextLessonFromLevelData = await fetchGetNextLessonFromLevel.json();
                        // If last lesson
                        if (nextLessonFromLevelData['data'].length === 0) {
                            startFetching();
                            replay = true;
                        } else {
                            // Lesson not available
                            console.log('LESSON NOT AVAILABLE')
                        }
                    }
                } else {
                    // Lesson not found
                    console.log('LESSON NOT FOUND')
                    const getNextLessonFromLevelLink = '/manage/course' + requestedLink + '/level/getnext';
                    const fetchGetNextLessonFromLevel = await fetch(getNextLessonFromLevelLink);
                    const nextLessonFromLevelData = await fetchGetNextLessonFromLevel.json();
                    // If last lesson
                    if (nextLessonFromLevelData['data'].length === 0) {
                        startFetching();
                        replay = true;
                    } else {
                        // Lesson not available
                        console.log(nextLessonFromLevelData);
                        console.log('LESSON NOT AVAILABLE');
                    }
                }
            } else {
                // For every test completed
                const thisTestNotCompleted = userJourneyTestseData['data'].every(test => '' + test['sectionNumber'] + test['unitNumber'] !== thisCheckPoint);
                // If this test not completed
                if (thisTestNotCompleted) {
                    startFetching();
                }
            }
        }
    }
});

async function startFetching() {
    let fetchGetContentLink;
    if (requestedLink.includes('lesson')) {
        fetchGetContentLink = "/manage/course" + requestedLink + "/get";
    } else {
        if (requestedLink.includes('unit')) {
            fetchGetContentLink = "/manage/tests" + requestedLink.replace('/test', '') + "/get";
        } else {
            fetchGetContentLink = "/manage/tests" + requestedLink.replace('/test', '') + "/unit0/get";
        }
    }

    await fetch('/manage/dictionary/get')
    .then(response => response.json())
    .then(data => {
        for (let index = 0; index < 51; index++) {
            const random = Math.floor(Math.random() * data['data'].length);
            const word = data['data'][random]['word'];
            if (!(words.indexOf(word) > -1)) {
                words.push(word);
            }
        }
    });

    fetch(fetchGetContentLink)
    .then(response => response.json())
    .then(async (data) => {
        loadChoices(data['data']);
    });
};

let currentContent = 0;
let progress = 0;
let progressLength;
let content = [];
let words = [];
const contentContainerEl = document.querySelector('.content-container');

async function loadContent(contentIndex){
    console.log('Starting loading content ' + contentIndex);

    const contentEl = content[contentIndex]['contentHtml'];
    const answerEl = contentEl.querySelector('.answer');
    if (answerEl.innerHTML !== "") {
        const answerBtns = answerEl.querySelectorAll('button');
        answerBtns.forEach(btn => {
            const choiceId = btn.getAttribute('data-id');
            const choiceContainerEl = contentEl.querySelector(`#${choiceId}`);
            const choicePlaceHolderEl = choiceContainerEl.querySelector('.choice-placeholder');
            const choicesEls = content[contentIndex]['choicesHtml'];
            const choiceHtmlIndex = choicesEls.indexOf(choiceContainerEl);
    
            choicesEls[choiceHtmlIndex].appendChild(btn);
            choicesEls[choiceHtmlIndex].removeChild(choicePlaceHolderEl);
        });
    }

    let correctAnswer;
    if (progress === 0) {
        correctAnswer = content[contentIndex]['correctAnswer'];
        const contentEl = content[contentIndex]['contentHtml'];
        contentContainerEl.appendChild(contentEl);
        content[contentIndex]['choicesHtml']
        .map(a => ({ value: a, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(a => a.value)
        .forEach((choiceHtml) => {
            contentEl.childNodes[3].appendChild(choiceHtml);
        });
    }else if(progress < progressLength){        
        correctAnswer = content[contentIndex]['correctAnswer'];
        const contentEl = content[contentIndex]['contentHtml'];
        contentContainerEl.appendChild(contentEl);
        content[contentIndex]['choicesHtml']
        .map(a => ({ value: a, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(a => a.value)
        .forEach((choiceHtml) => {
            contentEl.childNodes[3].appendChild(choiceHtml);
        });
    }

    if (contentIndex !== 0) {
        const contentEl = content[contentIndex]['contentHtml'];
        const previousContentEl = content[contentIndex - 1]['contentHtml'];
        previousContentEl.style.opacity = "0";
        previousContentEl.style.translate = "50px";
        contentEl.style.opacity = "0";
        contentEl.style.translate = "-50px";
        setTimeout(function() {
            contentEl.style.opacity = "1";
            contentEl.style.translate = "0";
          }, 1);
    }

    let fileIndex = 0;
    const filesNames = content[contentIndex]['filesNames'];
    const filesDurations = content[contentIndex]['filesDurations'];
    const subTitles = content[contentIndex]['subTitles'];
    console.log(filesNames)
    if (filesNames.length !== 0) {
        changeSign();
    }

    function changeSign() {
        console.log('Starting loading sign');
        const signContainerEl = content[contentIndex]['contentHtml'].querySelector('.sign-container');
        const signEl = content[contentIndex]['contentHtml'].querySelector('.sign');
        const subTitlesEl = content[contentIndex]['contentHtml'].querySelector('.sub-titles');
        const replayContainer = content[contentIndex]['contentHtml'].querySelector('.replay-container');
        if (fileIndex <= filesNames.length - 1) {
            signContainerEl.style.border = "2px solid #fff";
            signEl.style.opacity = "1";
            if (subTitles.length !== 0) {
                subTitlesEl.style.opacity = "1";
                subTitlesEl.innerHTML = subTitles[fileIndex];
            }
            replayContainer.style.opacity = "0";
            const fileDuration = parseFloat(filesDurations[fileIndex]) * 1000;
            signEl.src = filesNames[fileIndex].src;
            fileIndex++;
            setTimeout(() => {
                changeSign();
            }, fileDuration);
        } else {
            signContainerEl.style.border = "2px solid #e5e5e5";
            signEl.style.opacity = "0";
            subTitlesEl.style.opacity = "0";
            replayContainer.style.opacity = "1";
        }

        replayContainer.onclick = function() {
            fileIndex = 0;
            changeSign();
        }
    }

    const skipBtn = document.getElementById('skip-btn');
    skipBtn.onclick = async function(){
        if(progress < progressLength - 1) {
            console.log(currentContent);
            currentContent = currentContent + 1;
            content.push(content[currentContent - 1]);
            loadContent(currentContent);
        }
    }

    const checkBtn = document.getElementById('check-btn');
    const actionContainer = document.querySelector('.action-container')
    //console.log(answer.length)
    
    let answerStatus;
    if (!answerStatus) {
        checkBtn.onclick = async function(){
            const userAnswer = answer.toString().replace(/[',']/g, ' ');
    
            currentContent = currentContent + 1;
    
            if(correctAnswer === userAnswer){
                console.log('You are right')
                actionContainer.classList.add('correct');
                actionContainer.innerHTML = `
                    <div class="action">
                        <div class="replay correct-message">
                            <i class="fa-solid fa-check"></i>
                            <h2>ممتاز!</h2>
                        </div>
                        <button class="btn check-unlocked-btn"  id="continue-btn">المتابعة</button>
                    </div>
                `;
    
                progress = progress + 1;
                
                const lessonProgressEl = document.getElementById('lesson-progress');
                const progressPercent = (progress / progressLength) * 100;
                lessonProgressEl.style.background = `
                    linear-gradient(
                        to left,
                        #58cc02 0%,
                        #58cc02 ${progressPercent}%,
                        #e5e5e5 ${progressPercent}%,
                        #e5e5e5 100%
                    )`;
                
                answerStatus = "Done";
    
            }else{
                console.log('You are wrong')
                actionContainer.classList.add('wrong');
                actionContainer.innerHTML = `
                    <div class="action">
                        <div class="replay wrong-message">
                            <i class="fa-solid fa-xmark"></i>
                            <h2>الحل الصحيح: ${correctAnswer}</h2>
                        </div>
                        <button class="btn red-btn"  id="continue-btn">المتابعة</button>
                    </div>
                `;
                answerStatus = "Done";
            }
            if (answerStatus) {
                const continueBtn = document.getElementById('continue-btn');
                continueBtn.onclick = async function(){
                    //console.log("Clicked")
                    if (progress < progressLength) {
                        if(correctAnswer === userAnswer){
                            actionContainer.classList.remove('correct');
                        }else{
                            actionContainer.classList.remove('wrong');
                        }
                        actionContainer.innerHTML = `
                            <div class="action">
                                <button class="btn skip-locked-btn" id="skip-btn">تخطي</button>
                                <button class="btn check-locked-btn" id="check-btn">تحقق</button>
                            </div>
                        `;
                    }else{
                        const sectionNumber = content[contentIndex]['sectionNumber'];
                        const redirectLink = window.location.protocol + "//" + window.location.host + `/section${sectionNumber}`;

                        if (!replay) {
                            let category;
                            if (requestedLink.includes('lesson')) {
                                category = 'course';
                            } else {
                                category = 'test';
                            }
                            const fetchPostLink = `/journey/` + category + `/${userId}/insert`;
                            const unitNumber = content[contentIndex]['unitNumber'];
                            const levelNumber = content[contentIndex]['levelNumber'];
                            const lessonNumber = content[contentIndex]['lessonNumber'];
                            const fetchDeleteLink = `/journey/` + category + `/${userId}/${sectionNumber}/${unitNumber}/delete`;
                            const checkPoint = "" + sectionNumber + unitNumber + levelNumber + lessonNumber;

                            await fetch(fetchDeleteLink, {
                                method: 'DELETE'
                            })

                            fetch(fetchPostLink, {
                                headers: {
                                    'Content-type': 'application/json'
                                },
                                method: 'POST',
                                body: JSON.stringify({
                                    sectionNumber: sectionNumber,
                                    unitNumber: unitNumber,
                                    levelNumber : levelNumber,
                                    lessonNumber : lessonNumber,
                                    checkPoint: checkPoint
                                })
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    console.log(redirectLink);
                                    window.location.href = redirectLink;
                                }
                            });
                        } else {
                            window.location.href = redirectLink;
                        }
                    }
                    if(correctAnswer === userAnswer && progress < progressLength) {
                        loadContent(currentContent);
    
                    }else if(correctAnswer !== userAnswer && progress < progressLength) {
                        content[currentContent - 1]['answer'] = "wrong";
                        content.push(content[currentContent - 1]);
                        loadContent(currentContent);
                    }
                    answer = [];
                }
            }
        }
    }
    skipBtnStatus();
}






async function loadChoices(data) {
    let forEachContent = new Promise((resolve, reject) => {
        data.forEach( async (each, contentIndex, contents) => {
            let forEachSeparatedContent;

            const contentEl = document.createElement('div');
            contentEl.classList.add('content');
            contentEl.setAttribute('id', `content${contentIndex}`);
            
            const titleEl = document.createElement('h1');
            titleEl.innerHTML = "ما معنى هذه الإشارة؟";
            contentEl.appendChild(titleEl);
    
            const signContainer = document.createElement('div');
            signContainer.classList.add('sign-container');
            contentEl.appendChild(signContainer);
            
            let filesNames = [];
            let filesDuraions = [];
            let subTitles = [];
            if (each['content'].includes('&')) {
                const signEl = document.createElement('img');
                signEl.classList.add('sign');
                signContainer.appendChild(signEl);

                const subTitlesEl = document.createElement('a');
                subTitlesEl.classList.add('sub-titles');
                signContainer.appendChild(subTitlesEl);

                const replayContainer = document.createElement('div');
                replayContainer.classList.add('replay-container');
                replayContainer.innerHTML = `<i class="fa-solid fa-rotate-right"></i>`;
                signContainer.appendChild(replayContainer);

                const separatedContent = each['content'].split('&')
                forEachSeparatedContent = new Promise((resolve, reject) => {
                    separatedContent.forEach(async (content, index, array) => {
                        let fileName;
                        let fileDuration;
                        let contentType;
        
                        if (each['content'].length === 1) {
                            contentType = "letters";
                        } else {
                            contentType = "dictionary";
                        }
        
                        const fetchGetFileNameLink = '/manage/' + contentType + "/search/"+ content;
                        const fetchGetFileName = await fetch(fetchGetFileNameLink);
                        const getData = await fetchGetFileName.json();
                        fileName = getData['data'][0]['file'];
                        const sign = new Image();
                        sign.src = contentType + "/" + fileName;
                        filesNames.push(sign);
                        fileDuration = getData['data'][0]['duration'];
                        filesDuraions.push(fileDuration);
                        console.log('Finished geting filename: ' + fileName);
                        console.log(fileDuration);
                        console.log(filesNames);

                        const fetchGetPreviousContentsLink = "/manage/course/" + content + "/" + each['position'] + "/get";
                        const fetchGetPreviousContents = await fetch(fetchGetPreviousContentsLink);
                        const getPreviousContents = await fetchGetPreviousContents.json();
        
                        if (getPreviousContents['data'].length === 0 && requestedLink.includes('lesson')) {
                            console.log(fetchGetPreviousContentsLink);
                            subTitles.push(content);
                        }
    
                        if (index === array.length -1) resolve();
                    });
                });
            } else {
                let fileName;
                let fileDuration;
                let contentType;

                if (each['content'].length === 1) {
                    contentType = "letters";
                } else {
                    contentType = "dictionary";
                }

                const fetchGetFileNameLink = '/manage/' + contentType + "/search/"+ each['content'];
                const fetchGetFileName = await fetch(fetchGetFileNameLink);
                const getData = await fetchGetFileName.json();
                fileName = getData['data'][0]['file'];
                const sign = new Image();
                sign.src = '/' + contentType + '/' + fileName;
                filesNames.push(sign);
                fileDuration = getData['data'][0]['duration'];
                filesDuraions.push(fileDuration);
                console.log('Finished geting filename(else): ' + fileName);
        
                const signEl = document.createElement('img');
                signEl.classList.add('sign');
                signEl.setAttribute('src', contentType + '/' + fileName);
                signContainer.appendChild(signEl);

                const fetchGetPreviousContentsLink = "/manage/course/" + each['content'] + "/" + each['position'] + "/get";
                console.log(fetchGetPreviousContentsLink);
                const fetchGetPreviousContents = await fetch(fetchGetPreviousContentsLink);
                const getPreviousContents = await fetchGetPreviousContents.json();

                const subTitle = each['content'];
                const subTitlesEl = document.createElement('a');
                subTitlesEl.classList.add('sub-titles');
                signContainer.appendChild(subTitlesEl);

                if (getPreviousContents['data'].length === 0 && requestedLink.includes('lesson')) {
                    subTitlesEl.innerHTML = subTitle;
                    subTitles.push(subTitle);
                }

                const replayContainer = document.createElement('div');
                replayContainer.classList.add('replay-container');
                replayContainer.innerHTML = `<i class="fa-solid fa-rotate-right"></i>`;
                signContainer.appendChild(replayContainer);
            }
    
            function handleChoices() {
                const answerEl = document.createElement('div');
                answerEl.classList.add('answer');
                contentEl.appendChild(answerEl);

                const choicesEl = document.createElement('div');
                choicesEl.classList.add('choices');
                contentEl.appendChild(choicesEl);
        
                let dataWithChoices;
                let choices = [];
                let choicesHtml = [];
                let choiceId;
                let correctAnswer;

                for(i = 0; i < words.length; i++){
                    if (choices.length === 7) {
                        break;
                    }

                    if(i === 0){
                        choiceId = i + 1;
                    }else{
                        choiceId = choiceId + 1;
                    }

                    let choice;
                    let separatedContentLength;
                    if (each['content'].includes('&')) {
                        correctAnswer = each['content'].replace(/&/g, ' ');
                        const separatedContent = each['content'].split('&');
                        separatedContentLength = separatedContent.length;

                        if(i < separatedContentLength){
                            choice = separatedContent[i];
                        }else{
                            choice = words[i - separatedContentLength];
                        }
                    } else {
                        correctAnswer = each['content']

                        if(i === 0){
                            separatedContentLength = 1;
                            choice = correctAnswer;
                        }else{
                            choice = words[i - 1];
                        }
                    }
            
                    if(choice.includes(' ')){
                        const multiChoice = choice.split(' ');
                        multiChoice.forEach((choice, index) => {
                            choiceId = choiceId + index;
                            if (i < separatedContentLength) {
                                console.log(i < separatedContentLength)
                                const choiceEl = document.createElement('button');
                                choiceEl.classList.add('btn', 'answer-btn', `choice${choiceId}`);
                                choiceEl.setAttribute('data-id', `choice${choiceId}`);
                                choiceEl.setAttribute('content-index', `${contentIndex}`);
                                choiceEl.setAttribute('onclick', `switchBtn(this);`);
                                choiceEl.innerHTML = choice;
            
                                const choiceContainerEl = document.createElement('div');
                                choiceContainerEl.classList.add('choice-container');
                                choiceContainerEl.setAttribute('id', `choice${choiceId}`);
                                choiceContainerEl.appendChild(choiceEl);
            
                                choices.push(choice);
                                choicesHtml.push(choiceContainerEl);
                            } else {
                                if(!(choices.indexOf(choice) > -1)){
                                    const choiceEl = document.createElement('button');
                                    choiceEl.classList.add('btn', 'answer-btn', `choice${choiceId}`);
                                    choiceEl.setAttribute('data-id', `choice${choiceId}`);
                                    choiceEl.setAttribute('content-index', `${contentIndex}`);
                                    choiceEl.setAttribute('onclick', `switchBtn(this);`);
                                    choiceEl.innerHTML = choice;
                
                                    const choiceContainerEl = document.createElement('div');
                                    choiceContainerEl.classList.add('choice-container');
                                    choiceContainerEl.setAttribute('id', `choice${choiceId}`);
                                    choiceContainerEl.appendChild(choiceEl);
                
                                    choices.push(choice);
                                    choicesHtml.push(choiceContainerEl);
                                }
                            }
                        });
                    }else{
                        const choiceEl = document.createElement('button');
                        choiceEl.classList.add('btn', 'answer-btn');
                        choiceEl.setAttribute('data-id', `choice${choiceId}`);
                        choiceEl.setAttribute('content-index', `${contentIndex}`);
                        choiceEl.setAttribute('onclick', `switchBtn(this);`);
                        choiceEl.innerHTML = choice;
            
                        const choiceContainerEl = document.createElement('div');
                        choiceContainerEl.classList.add('choice-container');
                        choiceContainerEl.setAttribute('id', `choice${choiceId}`);
                        choiceContainerEl.appendChild(choiceEl);
            
                        choices.push(choice);
                        choicesHtml.push(choiceContainerEl);          
                    }
                }
        
                if (!progressLength) {
                    progressLength = 1;
                }else{
                    progressLength = progressLength + 1;
                }
        
                dataWithChoices = each;
                dataWithChoices['correctAnswer'] = correctAnswer;
                dataWithChoices['choices'] = choices;
                dataWithChoices['choicesHtml'] = choicesHtml;
                dataWithChoices['contentHtml'] = contentEl;
                dataWithChoices['filesNames'] = filesNames;
                dataWithChoices['filesDurations'] = filesDuraions;
                dataWithChoices['subTitles'] = subTitles;
                content.push(dataWithChoices);
                console.log('Finished loading choices');
            }

            if (forEachSeparatedContent) {
                forEachSeparatedContent.then(() => {
                    handleChoices();
                    if (contentIndex === contents.length -1) resolve();
                })
            } else {
                handleChoices();
                if (contentIndex === contents.length -1) resolve();
            }

        });
    });
    forEachContent.then(() => {
        console.log('Next')
        loadContent(0);
    })
}

let answer = [];
let answerBtns = [];
function switchBtn(btn){
    const parent = btn.parentNode;
    const parentClass = parent.getAttribute('class');
    const choiceId = btn.getAttribute('data-id');
    const contentIndex = btn.getAttribute('content-index');

    if (parentClass === 'choice-container') {
        const answerEl = content[contentIndex]['contentHtml'].childNodes[2];
        const NewChoicePlaceHolderEl = document.createElement('div');
        NewChoicePlaceHolderEl.classList.add('choice-placeholder');
        NewChoicePlaceHolderEl.style.height = `${btn.offsetHeight - 2}px`;
        NewChoicePlaceHolderEl.style.width = `${btn.offsetWidth}px`;

        parent.appendChild(NewChoicePlaceHolderEl);
        answer.push(btn.innerHTML);
        const answerContainer = document.createElement('div');
        answerContainer.classList.add('answer-container');
        answerContainer.appendChild(btn);
        answerBtns.push(answerContainer);
        const answerBtnIndex = answerBtns.indexOf(answerContainer);
        answerContainer.setAttribute('answer-index', answerBtnIndex);
        answerContainer.setAttribute('draggable', 'true');
        answerEl.appendChild(answerContainer);
        checkBtnStatus();
        addEventListeners(answerContainer);
    }else{
        const choiceContainerEl = content[contentIndex]['contentHtml'].childNodes[3].querySelector(`#${choiceId}`);
        const choicePlaceHolderEl = choiceContainerEl.querySelector('.choice-placeholder')
        const choiceHtmlIndex = content[contentIndex]['choicesHtml'].indexOf(choiceContainerEl);
        const answerIndex = answer.indexOf(btn.innerHTML);
        const answerBtnIndex = answerBtns.indexOf(parent);

        content[contentIndex]['choicesHtml'][choiceHtmlIndex].appendChild(btn);
        content[contentIndex]['choicesHtml'][choiceHtmlIndex].removeChild(choicePlaceHolderEl);
        answer.splice(answerIndex, 1);
        answerBtns.splice(answerBtnIndex, 1);
        parent.remove();
        checkBtnStatus();
    }
}

function checkBtnStatus(){
    const checkBtn = document.getElementById('check-btn');
    if(answer.length !== 0){
        console.log(answer.length);
        if(answer.length < 2){
            checkBtn.classList.add('check-unlocked-btn');
            checkBtn.classList.remove('check-locked-btn');
        }
    }else{
        checkBtn.classList.add('check-locked-btn');
        checkBtn.classList.remove('check-unlocked-btn');
    }
}

function skipBtnStatus(){
    const skipBtn = document.getElementById('skip-btn');
    if(progress !== progressLength - 1){
        skipBtn.classList.add('skip-unlocked-btn');
        skipBtn.classList.remove('skip-locked-btn');
    }else{
        skipBtn.classList.add('skip-locked-btn');
        skipBtn.classList.remove('skip-unlocked-btn');
    }
}

function dragStart() {
    setTimeout(() => this.closest('div').classList.add("dragging"), 0);
}
  
function dragEnter(e) {
    e.preventDefault();
}

async function dragOver(e) {
    const answerContainer = document.querySelector(".answer");
    const draggingItem = answerContainer.querySelector(".dragging");
    e.preventDefault();
    // Getting all items except currently dragging and making array of them
    const siblings = [...answerContainer.querySelectorAll(".answer-container:not(.dragging)")];
    // Finding the sibling after which the dragging item should be placed
    const nextSibling = await siblings.find(sibling => {
        return e.clientX >= sibling.offsetLeft + sibling.offsetWidth / 2;
    });
    // Inserting the dragging item before the found sibling
    answerContainer.insertBefore(draggingItem, nextSibling);
}

function dragEnd() {
    this.closest('div').classList.remove("dragging");

    const answerContainer = document.querySelector(".answer");
    const btns = answerContainer.querySelectorAll("button")

    let newAnswer = [];
    btns.forEach(btn => {
        newAnswer.push(btn.innerHTML);
    });

    answer = newAnswer;
}

function addEventListeners(item) {
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragend', dragEnd);
    item.addEventListener('dragenter', dragEnter);
    item.addEventListener('dragover', dragOver);
}