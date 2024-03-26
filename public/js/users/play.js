// Assigning Requested Link And Check Point
const requestedLink = window.location.href.toString().split(window.location.host)[1];
let thisCheckPoint = requestedLink.replace(/\D/g,'');

// Selecting Head And Content Container, Action Elements
const head = document.querySelector('.head');
const contentContainer = document.querySelector('.content-container');
const action = document.querySelector('.action');

// Declaring User Id And Registration Date Constants
const userId = contentContainer.getAttribute('user-id');
const userRegDate = contentContainer.getAttribute('user-reg-date');

// Declaring Global Variables
let curriculumVerion;
let replay;

document.addEventListener('DOMContentLoaded', async function () {
    // Getting Curriculum Version
    const getCurriculumsLink = `/manage/course/curriculums${userRegDate}/get`;
    const fetchGetCurriculums = await fetch(getCurriculumsLink);
    const curriculumsData = await fetchGetCurriculums.json();
    curriculumVerion = curriculumsData['data'][0]['version'];
    
    // Getting User Tests Journey
    const getUserJourneyTestsLink = `/journey/test/${userId}/get`
    const fetchGetUserJourneyTests = await fetch(getUserJourneyTestsLink);
    const userJourneyTestseData = await fetchGetUserJourneyTests.json();

    // If User Requested Lesson
    if (requestedLink.includes('lesson')) {
        // Getting User Course Journey
        const getUserJourneyCourseLink = `/journey/course/${userId}/get`
        const fetchGetUserJourneyCourse = await fetch(getUserJourneyCourseLink);
        const userJourneyCourseData = await fetchGetUserJourneyCourse.json();

        // If User Have No Course Progress
        if (userJourneyCourseData['data'].length === 0) {
            // If User Requested First Lesson
            if (requestedLink === '/section1/unit1/level1/lesson1') {
                // Start Lesson
                startFetching();
            
            // If User Requested A Lesson Other than The First Lesson
            } else {
                // Getting Requested Lesson And Next Lesson From Requested Lesson
                const getNextLessonLink = `/manage/course/curriculum${curriculumVerion}/section${thisCheckPoint[0]}/unit${thisCheckPoint[1]}/level${thisCheckPoint[2]}/lesson${thisCheckPoint[3]}/all/getnext`;
                const fetchGetNextLesson = await fetch(getNextLessonLink);
                const nextLessonData = await fetchGetNextLesson.json();

                // If Requested Lesson Available
                if (nextLessonData['data'].length > 0) {
                    // Assigning This Section Locked
                    // For Every Completed Test
                    const thisSectionLocked = userJourneyTestseData['data'].every(test => {
                        // If Section Test
                        if (test['unitNumber'] === 0) {
                            return thisCheckPoint[0] !== '1' && '' + test['sectionNumber'] !== thisCheckPoint[0];
                        
                        // If Unit Test
                        } else {
                            return thisCheckPoint[0] !== '1'
                        }
                    });

                    // Assigning This Lesson Locked
                    // For Every Completed Test
                    const thisLessonLocked = userJourneyTestseData['data'].every(test => {
                        // If Unit Test
                        if (test['unitNumber'] !== 0) {
                            return '' + test['sectionNumber'] + test['unitNumber'] + '11' !== thisCheckPoint;
                        
                        // If Section Test
                        } else {
                            return true;
                        }
                    });

                    // If Section Or Lesson Locked
                    if (thisSectionLocked || thisLessonLocked) {
                        // You Cant Access This Lesson
                        // Assigning Content Container And Action Inner HTML
                        contentContainer.innerHTML = `
                            <h1>أكمل الدروس السابقة للبدأ في هذا الدرس</h1>
                        `
                        action.innerHTML = `
                            <button class="btn fourth-btn" id="skip-btn" onclick="window.location.href = window.location.protocol + '//' + window.location.host + '/sections'">عودة</button>
                        `
                    
                    // If Section And Lesson Unlocked
                    } else {
                        // Start Lesson
                        startFetching();
                    }
                // If Requested Lesson Not Available
                } else {
                    // Lesson Not Found
                    // Assigning Content Container And Action Inner HTML
                    contentContainer.innerHTML = `
                    <h1>هذا الدرس غير متوفر</h1>
                    `
                    action.innerHTML = `
                        <button class="btn fourth-btn" id="skip-btn" onclick="window.location.href = window.location.protocol + '//' + window.location.host + '/sections'">عودة</button>
                    `
                }
            }
        
        // If User Have Course Progress
        } else {
            // Getting Requested Lesson And Next Lesson From Requested Lesson
            const getNextLessonLink = `/manage/course/curriculum${curriculumVerion}/section${thisCheckPoint[0]}/unit${thisCheckPoint[1]}/level${thisCheckPoint[2]}/lesson${thisCheckPoint[3]}/all/getnext`;
            const fetchGetNextLesson = await fetch(getNextLessonLink);
            const nextLessonData = await fetchGetNextLesson.json();

            // If Requested Lesson Available
            if (nextLessonData['data'].length > 0) {
                // Assigning User Last Check Point
                const lastCourseCheckPoint = userJourneyCourseData['data'][userJourneyCourseData['data'].length - 1]['checkPoint'].toString();
                
                // Getting User Next Lesson
                const getNextLessonLink = `/manage/course/curriculum${curriculumVerion}/section${lastCourseCheckPoint[0]}/unit${lastCourseCheckPoint[1]}/level${lastCourseCheckPoint[2]}/lesson${lastCourseCheckPoint[3]}/all/getnext`;
                const fetchGetNextLesson = await fetch(getNextLessonLink);
                const nextLessonData = await fetchGetNextLesson.json();

                // Getting User Next Requested Lesson From Level
                const getNextLessonFromLevelLink = `/manage/course/curriculum${curriculumVerion}` + requestedLink + '/level/getnext';
                const fetchGetNextLessonFromLevel = await fetch(getNextLessonFromLevelLink);
                const nextLessonFromLevelData = await fetchGetNextLessonFromLevel.json();

                // If User Next Lesson Available
                if (nextLessonData['data'].length === 2) {
                    // Assigning User Next Check Point
                    const nextCheckPoint = '' + nextLessonData['data'][1]['sectionNumber'] + nextLessonData['data'][1]['unitNumber'] + nextLessonData['data'][1]['levelNumber'] + nextLessonData['data'][1]['number'];
                    
                    // If User Next Check Point Equals This Check Point
                    if (thisCheckPoint === nextCheckPoint) {
                        // Start Lesson
                        startFetching();
                    
                    // If User Next Check Point Doesn't Equal This Check Point
                    } else {
                        // If User Next Check Point Greater Than This Check Point
                        if (parseInt(thisCheckPoint) < parseInt(nextCheckPoint)) {
                            // If Requested Lesson Is The Last Level Lesson
                            if (nextLessonFromLevelData['data'].length === 0) {
                                // Start Lesson
                                startFetching();

                                // Assigning Lesson Replayed To True
                                replay = true;
                            
                            // If Requested Lesson Not The Last Level Lesson
                            } else {
                                // Lesson Already Completed
                                // Assigning Content Container And Action Inner HTML
                                contentContainer.innerHTML = `
                                    <h1>لقد أكملت هذا الدرس</h1>
                                `
                                action.innerHTML = `
                                    <button class="btn fourth-btn" id="skip-btn" onclick="window.location.href = window.location.protocol + '//' + window.location.host + '/sections'">عودة</button>
                                `
                            }

                        // If This Check Point Greater Than User Next Check Point
                        } else {
                            // Assigning This Section Locked
                            // For Every Completed Test
                            const thisSectionLocked = userJourneyTestseData['data'].every(test => {
                                // If Section Test
                                if (test['unitNumber'] === 0) {
                                    return thisCheckPoint[0] !== '1' && '' + test['sectionNumber'] !== thisCheckPoint[0];
                                
                                // If Unit Test
                                } else {
                                    return thisCheckPoint[0] !== '1'
                                }
                            });

                            // Assigning This Lesson Locked
                            // For Every Completed Test
                            const thisLessonLocked = userJourneyTestseData['data'].every(test => {
                                // If Unit Test
                                if (test['unitNumber'] !== 0) {
                                    return '' + test['sectionNumber'] + test['unitNumber'] + '11' !== thisCheckPoint;
                                
                                // If Section Test
                                } else {
                                    return true;
                                }
                            });
                            
                            // If Section Or Lesson Locked
                            if (thisSectionLocked || thisLessonLocked) {
                                // You Can't Access This Lesson
                                // Assigning Content Container And Action Inner HTML
                                contentContainer.innerHTML = `
                                    <h1>أكمل الدروس السابقة للبدأ في هذا الدرس</h1>
                                `
                                action.innerHTML = `
                                    <button class="btn fourth-btn" id="skip-btn" onclick="window.location.href = window.location.protocol + '//' + window.location.host + '/sections'">عودة</button>
                                `
                            
                            // If Section And Lesson Unlocked
                            } else {
                                // Start Lesson
                                startFetching();
                            }
                        }
                    }
                
                // If User Next Lesson Not Available
                } else {
                    // If Requested Lesson Is The Last Level Lesson
                    if (nextLessonFromLevelData['data'].length === 0) {
                        // Start Lesson
                        startFetching();

                        // Assigning Lesson Replayed To True
                        replay = true;
                    
                    // If Requested Lesson Not The Last Level Lesson
                    } else {
                        // Lesson Already Completed
                        console.log('Lesson Already Completed');
                        contentContainer.innerHTML = `
                        <h1>لقد أكملت هذا الدرس</h1>
                        `
                        action.innerHTML = `
                            <button class="btn fourth-btn" id="skip-btn" onclick="window.location.href = window.location.protocol + '//' + window.location.host + '/sections'">عودة</button>
                        `
                    }
                }
            } else {
                // Lesson Not Found
                // Assigning Content Container And Action Inner HTML
                contentContainer.innerHTML = `
                <h1>هذا الدرس غير متوفر</h1>
                `
                action.innerHTML = `
                    <button class="btn fourth-btn" id="skip-btn" onclick="window.location.href = window.location.protocol + '//' + window.location.host + '/sections'">عودة</button>
                `
            }
        }
    
    // If User Requested Test
    } else {
        // If User Have No Test Progress
        if (userJourneyTestseData['data'].length === 0) {
            // Start Test
            startFetching();
        
        // If User Have Test Progress
        } else {
            // Getting Test
            let fetchGetTestLink;
            if (requestedLink.includes('unit')) {
                fetchGetTestLink = `/manage/tests/curriculum${curriculumVerion}` + requestedLink.replace('/test', '') + "/getthis";
            } else {
                fetchGetTestLink = `/manage/tests/curriculum${curriculumVerion}` + requestedLink.replace('/test', '') + "/unit0/getthis";
                thisCheckPoint = thisCheckPoint + '0';
            }
            const fetchGetTest = await fetch(fetchGetTestLink);
            const testData = await fetchGetTest.json();
            
            // If Test Available
            if (testData['data'].length !== 0) {
                // Assigning This Section Locked
                // For Every Completed Test
                const thisSectionLocked = userJourneyTestseData['data'].every(test => {
                    // If Section Test
                    if (test['unitNumber'] === 0) {
                        return thisCheckPoint[0] !== '1' && '' + test['sectionNumber'] !== thisCheckPoint[0];
                    
                    // If Unit Test 
                    } else {
                        return thisCheckPoint[0] !== '1'
                    }
                });

                // Assigning This Test Not Completed
                // For every test completed
                const thisTestNotCompleted = userJourneyTestseData['data'].every(test => '' + test['sectionNumber'] + test['unitNumber'] !== thisCheckPoint);
                
                // If This Section Unlocked
                if (!thisSectionLocked) {
                    // If This Test Not Completed
                    if (thisTestNotCompleted) {
                        // Start Test
                        startFetching();
                    
                    // If This Test Completed
                    } else {
                        // Test Already Completed
                        // Assigning Content Container And Action Inner HTML
                        contentContainer.innerHTML = `
                        <h1>لقد نجحت في هذا الإختبار</h1>
                        `
                        action.innerHTML = `
                            <button class="btn fourth-btn" id="skip-btn" onclick="window.location.href = window.location.protocol + '//' + window.location.host + '/sections'">عودة</button>
                        `
                    }
                // If Section Locked
                } else {
                    // If Unit Test
                    if (requestedLink.includes('unit')) {
                        // Section Test Not Completed
                        // Assigning Content Container And Action Inner HTML
                        contentContainer.innerHTML = `
                        <h1>إنجح في إختبار هذا القسم لبدأ هذا الإختبار</h1>
                        `
                        action.innerHTML = `
                            <button class="btn fourth-btn" id="skip-btn" onclick="window.location.href = window.location.protocol + '//' + window.location.host + '/sections'">عودة</button>
                        `
                    
                    // If Section Test
                    } else {
                        // If Test Not Completed
                        if (thisTestNotCompleted) {
                            // Start Test
                            startFetching();
                        }
                    }
                }
            
            // If Test Not Available
            } else {
                // Test Not Found
                // Assigning Content Container And Action Inner HTML
                contentContainer.innerHTML = `
                    <h1>هذا الإختبار غير متوفر</h1>
                `
                action.innerHTML = `
                    <button class="btn fourth-btn" id="skip-btn" onclick="window.location.href = window.location.protocol + '//' + window.location.host + '/sections'">عودة</button>
                `
            }
        }
    }
});

// Start Fetching Function
async function startFetching() {
    let fetchGetContentLink;
    let contentCategory;
    // If User Request Lesson
    if (requestedLink.includes('lesson')) {
        fetchGetContentLink = `/manage/course/curriculum${curriculumVerion}` + requestedLink + "/get";
        contentCategory = 'الدرس';
    
    // If User Request Test
    } else {
        // If Unit Test
        if (requestedLink.includes('unit')) {
            fetchGetContentLink = `/manage/tests/curriculum${curriculumVerion}` + requestedLink.replace('/test', '') + "/get";
        
        // If Section Test
        } else {
            fetchGetContentLink = `/manage/tests/curriculum${curriculumVerion}` + requestedLink.replace('/test', '') + "/unit0/get";
        }
        contentCategory = 'الإختبار';
    }

    // Getting Words
    const fetchGetDictionary = await fetch('/manage/dictionary/get');
    const dictionaryData = await fetchGetDictionary.json();

    // Getting Letters
    const fetchGetLetters = await fetch('/manage/letters/get');
    const lettersData = await fetchGetLetters.json();

    // For Words Length Equals 10
    for (let index = 0; words.length < 11; index++) {
        // Declaring Random And Word
        const random = Math.floor(Math.random() * (dictionaryData['data'].length - 1));
        const word = dictionaryData['data'][random]['word'];

        // If Words Doesn't Include Word
        if (words.indexOf(word) === -1) {
            words.push(word);
        }
    }

    // For Letters Length Equals 10
    for (let index = 0; letters.length < 11; index++) {
        // Declaring Random And Letter
        const random = Math.floor(Math.random() * (lettersData['data'].length - 1));
        const letter = lettersData['data'][random]['letter'];

        // If Letters Doesn't Include Letter
        if (letters.indexOf(letter) === -1) {
            letters.push(letter);
        }
    }

    // Getting Content
    const fetchGetContent = await fetch(fetchGetContentLink);
    const getContentData = await fetchGetContent.json();
    
    // If Content Available
    if (getContentData['data'].length !== 0) {
        // Assigning Head And Action Inner HTML
        head.innerHTML = `
            <i class="fa-solid fa-xmark" onclick="window.location.href = window.location.protocol + '//' + window.location.host + '/section${thisCheckPoint[0]}'"></i>
            <div id="lesson-progress"></div>
        `
        action.innerHTML = `
            <button class="btn locked-btn" id="skip-btn">تخطي</button>
            <button class="btn locked-btn"  id="check-btn">تحقق</button>
        `

        // Start Loading Choices
        loadChoices(getContentData['data']);
    
    // If Content Not Available
    } else {
        // Content Not Found
        // Assigning Content Container And Action Inner HTML
        contentContainer.innerHTML = `
            <h1>المحتوى غير متوفر لهذا ${contentCategory}</h1>
        `
        action.innerHTML = `
            <button class="btn fourth-btn" id="skip-btn" onclick="window.location.href = window.location.protocol + '//' + window.location.host + '/sections'">عودة</button>
        `
    }
};

// Declaring Global Variables
let progressLength;

// Declaring Global Arrays
let contentArray = [];
let words = [];
let letters = [];

// Assigning Global Variables
let currentContent = 0;
let progress = 0;

// Declaring Global Constants
const contentContainerEl = document.querySelector('.content-container');

// Load Content Function
async function loadContent(contentIndex){
    // Declaring Content And Answer Elements
    const contentEl = contentArray[contentIndex]['contentHtml'];
    const answerEl = contentEl.querySelector('.answer');
    
    // If Answer Element Inner HTML Not Empty
    if (answerEl.innerHTML !== "") {
        // Declaring Answer Buttons
        const answerBtns = answerEl.querySelectorAll('button');
        
        // For Every Answer Button
        answerBtns.forEach(btn => {
            // Declaring Constants
            const choiceId = btn.getAttribute('data-id');
            const choiceContainerEl = contentEl.querySelector(`#${choiceId}`);
            const choicePlaceHolderEl = choiceContainerEl.querySelector('.choice-placeholder');
            const choicesEls = contentArray[contentIndex]['choicesHtml'];
            const choiceHtmlIndex = choicesEls.indexOf(choiceContainerEl);
    
            // Append Answer Button To Choices
            choicesEls[choiceHtmlIndex].appendChild(btn);
            
            // Remove Choice Place Holder From Choices
            choicesEls[choiceHtmlIndex].removeChild(choicePlaceHolderEl);
        });
    }

    // Declaring Correct Answer
    let correctAnswer;

    // If User Didn't Completed The Lesson
    if (progress < progressLength) {  
        // Assgning Correct Answer
        correctAnswer = contentArray[contentIndex]['correctAnswer'];
        
        // Declaring Content Element
        const contentEl = contentArray[contentIndex]['contentHtml'];
        contentContainerEl.appendChild(contentEl);

        // Shufeling And Appending Choices To Content
        contentArray[contentIndex]['choicesHtml']
        .map(a => ({ value: a, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(a => a.value)
        .forEach((choiceHtml) => {
            contentEl.childNodes[3].appendChild(choiceHtml);
        });
    }

    // If Not The first Content
    if (contentIndex !== 0) {
        // Declaring Constants
        const contentEl = contentArray[contentIndex]['contentHtml'];
        const previousContentEl = contentArray[contentIndex - 1]['contentHtml'];
        
        // Assigning Styles
        previousContentEl.style.opacity = "0";
        previousContentEl.style.translate = "50px";
        contentEl.style.opacity = "0";
        contentEl.style.translate = "-50px";
        setTimeout(function() {
            contentEl.style.opacity = "1";
            contentEl.style.translate = "0";
          }, 1);
    }

    // Declaring File Index
    let fileIndex = 0;

    // Declaring Constants
    const filesNames = contentArray[contentIndex]['filesNames'];
    const filesDurations = contentArray[contentIndex]['filesDurations'];
    const subTitles = contentArray[contentIndex]['subTitles'];
    
    const signContainerEl = contentArray[contentIndex]['contentHtml'].querySelector('.sign-container');
    const signEl = contentArray[contentIndex]['contentHtml'].querySelector('.sign');
    const subTitlesEl = contentArray[contentIndex]['contentHtml'].querySelector('.sub-titles');
    const replayContainer = contentArray[contentIndex]['contentHtml'].querySelector('.replay-container');
    
    // If Files Names Not Empty
    if (filesNames.length !== 0) {
        changeSign();
    
    // If Files Names Empty
    } else {
        signContainerEl.innerHTML = '<h2 style="color: #ea2b2b;">خطئ في تحميل الملف.</h2>'
    }

    // Sign Handling Function
    function changeSign() {
        // If Files Names Length Grather Than File Index
        if (fileIndex < filesNames.length) {
            // Assigning Styles
            signContainerEl.style.border = "2px solid #fff";
            signEl.style.opacity = "1";
            replayContainer.style.opacity = "0";

            // Assigning Sign Path
            signEl.src = filesNames[fileIndex].src;

            // If SubTitles Available
            if (subTitles.length !== 0) {
                subTitlesEl.style.opacity = "1";
                subTitlesEl.innerHTML = subTitles[fileIndex];
            }
            
            // Declaring File Duration
            const fileDuration = parseFloat(filesDurations[fileIndex]) * 1000;
            
            // Setting Sign Timeout
            setTimeout(() => {
                changeSign();
            }, fileDuration);

            // Incrementing File Index By 1
            fileIndex++;
        
        // If File Index Grather Than Files Names Length
        } else {
            // Assigning Styles
            signContainerEl.style.border = "2px solid #e5e5e5";
            signEl.style.opacity = "0";
            subTitlesEl.style.opacity = "0";
            replayContainer.style.opacity = "1";
        }

        // Replay Sign Button Event Listener
        replayContainer.onclick = function() {
            fileIndex = 0;
            changeSign();
        }

        // Sign Loading Errors Event Listener
        signEl.addEventListener("error", () => {
            signContainerEl.innerHTML = '<h2 style="color: #ea2b2b;">خطئ في تحميل الملف.</h2>'
        })
    }

    // Skip Button Event Listener
    const skipBtn = document.getElementById('skip-btn');
    skipBtn.onclick = async function(){
        if(progress < progressLength - 1) {
            // Incrementing Current Content Index By 1
            currentContent = currentContent + 1;

            // Pushing Current Content After Last Content
            contentArray.push(contentArray[currentContent - 1]);
            
            // Start Loading Content
            loadContent(currentContent);
        }
    }

    // Declaring Action Container Element
    const actionContainer = document.querySelector('.action-container');
    
    // Decalaring Answer Status
    let answerStatus;

    // Check Button Event Listener
    const checkBtn = document.getElementById('check-btn');
    checkBtn.onclick = async function() {
        // Declaring User Answer
        const userAnswer = answer.toString().replace(/[',']/g, ' ');

        // Incrementing Current Content Index By 1
        currentContent = currentContent + 1;

        // If User Answered Correct Answer
        if(correctAnswer === userAnswer){
            // Adding Action Container Correct Class And Assigning Inner HTML
            actionContainer.classList.add('correct');
            actionContainer.innerHTML = `
                <div class="action">
                    <div class="replay correct-message">
                        <i class="fa-solid fa-check"></i>
                        <h2>ممتاز!</h2>
                    </div>
                    <button class="btn first-btn"  id="continue-btn">المتابعة</button>
                </div>
            `;

            // Incrementing Progress By 1
            progress = progress + 1;
            
            // Handling Progress Bar
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

        // If User Answered Wrong Answer
        } else {
            // Adding Action Container Wrong Class And Assigning Inner HTML
            actionContainer.classList.add('wrong');
            actionContainer.innerHTML = `
                <div class="action">
                    <div class="replay wrong-message">
                        <i class="fa-solid fa-xmark"></i>
                        <h2>الحل الصحيح: ${correctAnswer}</h2>
                    </div>
                    <button class="btn third-btn"  id="continue-btn">المتابعة</button>
                </div>
            `;
            answerStatus = "Done";
        }

        // If Continue Button Available
        if (answerStatus) {
            // Continue Button Event Listener
            const continueBtn = document.getElementById('continue-btn');
            continueBtn.onclick = async function(){
                // If User Didn't Complete The Lesson
                if (progress < progressLength) {
                    // If User Answered Correct Answer
                    if (correctAnswer === userAnswer) {
                        actionContainer.classList.remove('correct');
                    
                    // If User Answered Wrong Answer
                    } else {
                        actionContainer.classList.remove('wrong');
                    }

                    // Assigning Action Container Inner HTML
                    actionContainer.innerHTML = `
                        <div class="action">
                            <button class="btn locked-btn" id="skip-btn">تخطي</button>
                            <button class="btn locked-btn" id="check-btn">تحقق</button>
                        </div>
                    `;
                
                // If User Completed The Lesson
                } else {
                    // Declaring Constants
                    const sectionNumber = contentArray[contentIndex]['sectionNumber'];
                    const redirectLink = window.location.protocol + "//" + window.location.host + `/section${sectionNumber}`;

                    // If User Not Replaying Lesson
                    if (!replay) {
                        // Declaring Varibales
                        let category;
                        if (requestedLink.includes('lesson')) {
                            category = 'course';
                        } else {
                            category = 'test';
                        }

                        // Declaring Constants
                        const fetchPostLink = `/journey/` + category + `/${userId}/insert`;
                        const unitNumber = contentArray[contentIndex]['unitNumber'];
                        const levelNumber = contentArray[contentIndex]['levelNumber'];
                        const lessonNumber = contentArray[contentIndex]['lessonNumber'];
                        const fetchDeleteLink = `/journey/` + category + `/${userId}/${sectionNumber}/${unitNumber}/delete`;
                        const checkPoint = "" + sectionNumber + unitNumber + levelNumber + lessonNumber;

                        // Deleting Previous Unit User Journey 
                        await fetch(fetchDeleteLink, {
                            method: 'DELETE'
                        })

                        // Posting New Unit User Journey
                        fetch(fetchPostLink, {
                            headers: {
                                'Content-type': 'application/json'
                            },
                            method: 'POST',
                            body: JSON.stringify({
                                curriculumVerion: curriculumVerion,
                                sectionNumber: sectionNumber,
                                unitNumber: unitNumber,
                                levelNumber : levelNumber,
                                lessonNumber : lessonNumber,
                                checkPoint: checkPoint
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            // If Posting Successful
                            if (data.success) {
                                window.location.href = redirectLink;
                            
                            // If Posting Failed
                            } else {
                                // Assigning Content Container And Action Inner HTML
                                contentContainer.innerHTML = `
                                    <h1>${data.error}</h1>
                                `
                                action.innerHTML = `
                                    <button class="btn fourth-btn" id="skip-btn" onclick="window.location.href = window.location.protocol + '//' + window.location.host + '/sections'">عودة</button>
                                `
                            }
                        });
                    
                    // If User Replaying Lesson
                    } else {
                        window.location.href = redirectLink;
                    }
                }

                // If User Answered Correct Answer
                if (correctAnswer === userAnswer && progress < progressLength) {
                    // Load Next Content
                    loadContent(currentContent);

                // If User Answered Wrong Answer
                } else if (correctAnswer !== userAnswer && progress < progressLength) {
                    // Push Current Content After The Last Content
                    contentArray[currentContent - 1]['answer'] = "wrong";
                    contentArray.push(contentArray[currentContent - 1]);
                    
                    // Load Next Content
                    loadContent(currentContent);
                }

                // Emptying Answer
                answer = [];
            }
        }
    }

    // Check Skip Button Status
    skipBtnStatus();
}

// Load Choices Function
async function loadChoices(data) {
    // For Every Content
    for (let index = 0; index < data.length; index++) {
            // Declaring Content Constant
            const content = data[index]

            // Declaring Variabl
            let forEachSeparatedContent;

            // Creating Content Element
            const contentEl = document.createElement('div');
            contentEl.classList.add('content');
            contentEl.setAttribute('id', `content${index}`);
            
            // Creatting Question Title Element
            const titleEl = document.createElement('h1');
            titleEl.innerHTML = "ما معنى هذه الإشارة؟";
            contentEl.appendChild(titleEl);
    
            // Creating Sign Container Element
            const signContainer = document.createElement('div');
            signContainer.classList.add('sign-container');
            contentEl.appendChild(signContainer);
            
            // Creating Sign Element
            const signEl = document.createElement('img');
            signEl.classList.add('sign');
            signContainer.appendChild(signEl);

            // Creating SubTitles Element
            const subTitlesEl = document.createElement('a');
            subTitlesEl.classList.add('sub-titles');
            signContainer.appendChild(subTitlesEl);

            // Creating Sign Replay Button Container Element
            const replayContainer = document.createElement('div');
            replayContainer.classList.add('replay-container');
            replayContainer.innerHTML = `<i class="fa-solid fa-rotate-right"></i>`;
            signContainer.appendChild(replayContainer);

            // Decaring Arrays
            let filesNames = [];
            let filesDuraions = [];
            let subTitles = [];

            // If Multiple Content
            if (content['content'].includes('&')) {
                // Assgning Separated Content
                const separatedContent = content['content'].split('&')
                
                // For Every Separated Content
                for (let index = 0; index < separatedContent.length; index++) {
                    // Declaring Content Constant
                    const eachSeparatedContent = separatedContent[index];

                    // Declaring Variables
                    let fileName;
                    let fileDuration;
                    let contentType;
    
                    // If Content Is A Letter
                    if (content['content'].length === 1) {
                        contentType = "letters";
                    
                    // If Content Is A Word
                    } else {
                        contentType = "dictionary";
                    }
    
                    // Getting Content File Name
                    const fetchGetFileNameLink = '/manage/' + contentType + '/' + eachSeparatedContent + '/get';
                    const fetchGetFileName = await fetch(fetchGetFileNameLink);
                    const getData = await fetchGetFileName.json();
                    
                    // Assigning Content File Name
                    fileName = getData['data'][0]['file'];
                    
                    // Creating New Image And Assigning Path
                    const sign = new Image();
                    sign.src = '/' + contentType + "/" + fileName;
                    
                    // Puahing Image To Signs
                    filesNames.push(sign);
                    
                    // Assigning And Pushing Content File Duration To File Duratio
                    fileDuration = getData['data'][0]['duration'];
                    filesDuraions.push(fileDuration);

                    // Getting Previous Lessons Same Content
                    const fetchGetPreviousContentsLink = `/manage/course/curriculum${curriculumVerion}/` + eachSeparatedContent + "/" + content['position'] + "/get";
                    const fetchGetPreviousContents = await fetch(fetchGetPreviousContentsLink);
                    const getPreviousContents = await fetchGetPreviousContents.json();
    
                    // If There Is No Previous Lessons Same Content
                    // And User Requested A Lesson
                    if (getPreviousContents['data'].length === 0 && requestedLink.includes('lesson')) {
                        // Pushing Content To SubTitles
                        subTitles.push(eachSeparatedContent);
                    }
                };
            
            // If Single Content
            } else {
                // Declaring Variables
                let fileName;
                let fileDuration;
                let contentType;

                // If Content Is A Letter
                if (content['content'].length === 1) {
                    contentType = "letters";
                
                // If Content Is A Word
                } else {
                    contentType = "dictionary";
                }

                // Getting Content File Name
                const fetchGetFileNameLink = '/manage/' + contentType + '/' + content['content'] + '/get';
                const fetchGetFileName = await fetch(fetchGetFileNameLink);
                const getData = await fetchGetFileName.json();
                
                // Assigning Content File Name
                fileName = getData['data'][0]['file'];
                
                // Creating New Image And Assigning Path
                const sign = new Image();
                sign.src = '/' + contentType + '/' + fileName;
                
                // Puahing Image To Signs
                filesNames.push(sign);
                
                // Assigning And Pushing Content File Duration To File Duratio
                fileDuration = getData['data'][0]['duration'];
                filesDuraions.push(fileDuration);
        
                // Getting Previous Lessons Same Content
                const fetchGetPreviousContentsLink = `/manage/course/curriculum${curriculumVerion}/` + content['content'] + "/" + content['position'] + "/get";
                const fetchGetPreviousContents = await fetch(fetchGetPreviousContentsLink);
                const getPreviousContents = await fetchGetPreviousContents.json();

                // If There Is No Previous Lessons Same Content
                // And User Requested A Lesson
                if (getPreviousContents['data'].length === 0 && requestedLink.includes('lesson')) {
                    // Pushing Content To SubTitles
                    const subTitle = content['content'];
                    subTitles.push(subTitle);
                }
            }
    
            // Creating Answer Element
            const answerEl = document.createElement('div');
            answerEl.classList.add('answer');
            contentEl.appendChild(answerEl);

            // Creating Choices Element
            const choicesEl = document.createElement('div');
            choicesEl.classList.add('choices');
            contentEl.appendChild(choicesEl);
    
            // Declaring Variables
            let dataWithChoices;
            let choiceId;
            let correctAnswer;
            let iteration = 5;

            // Declaring Arrays
            let choices = [];
            let choicesHtml = [];

            // For Seven Iterations
            for (i = 0; i < iteration; i++) {
                // If Choices Length Greater Than 4
                if (choices.length > 4) {
                    break;
                }
                
                // If The First Iteration
                if (i === 0) {
                    choiceId = 1;
                
                // If Not The First Interation
                } else {
                    choiceId++;
                }
                
                // Shufeling Words
                words = words
                .map(a => ({ value: a, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(a => a.value)

                // Declaring Variables
                let choice;
                let separatedContentLength;
                
                // If Multiple Content
                if (content['content'].includes('&')) {
                    // Assigning Correct Answer
                    correctAnswer = content['content'].replace(/&/g, ' ');
                    
                    // Declaring Separated Content
                    const separatedContent = content['content'].split('&');
                    
                    // Assigning Separated Content Length
                    separatedContentLength = separatedContent.length;

                    // If Separated Content Length Greater Than Index
                    if (i < separatedContentLength) {
                        // Assigning Choice
                        choice = separatedContent[i];
                    
                    // If Index Greater Than Separated Content Length
                    } else {
                        // If Word Available
                        if (words[i - separatedContentLength]) {
                            // Assigning Choice
                            choice = words[i - separatedContentLength];
                        
                        // If Word Not Available
                        } else {
                            break;
                        }
                    }
                
                // If Single Content
                } else {
                    // Assigning Correct Answer
                    correctAnswer = content['content']

                    // If The First Iteration
                    if (i === 0) {
                        separatedContentLength = 1;
                        choice = correctAnswer;
                    
                    // If Not The First Iteration
                    } else {
                        // If Correct Answer Is A Letter
                        if (correctAnswer.length === 1) {
                            // If Letter Available
                            if (letters[i - 1]) {
                                // Shufeling Letters
                                letters = letters
                                .map(a => ({ value: a, sort: Math.random() }))
                                .sort((a, b) => a.sort - b.sort)
                                .map(a => a.value)

                                // Assigning Choice
                                choice = letters[i - 1];
                            
                            // If Letter Not Available
                            } else {
                                break;
                            }

                        // If Correct Answer Is A Word
                        } else {
                            // If Word Available
                            if (words[i - 1]) {
                                // Shufeling Words
                                words = words
                                .map(a => ({ value: a, sort: Math.random() }))
                                .sort((a, b) => a.sort - b.sort)
                                .map(a => a.value)

                                // Assigning Choice
                                choice = words[i - 1];
                            
                            // If Word Not Available
                            } else {
                                break;
                            }
                        }
                    }
                }

                // If Choice Have Multiple Words
                if (choice.includes(' ')) {
                    // Declaring Separated Choice Words
                    const multiChoice = choice.split(' ');
                    
                    // For Every Choice Word
                    multiChoice.every((choice, i) => {
                        // If Choices Length Greater Than 4
                        if (choices.length > 4) {
                            return false;
                        }

                        // If Choices Doesn't Include Word
                        if (choices.indexOf(choice) === -1) {
                            // Assigning Choice Id
                            choiceId = choiceId + i;

                            // Creating Choice Button
                            const choiceEl = document.createElement('button');
                            choiceEl.classList.add('btn', 'answer-btn', `choice${choiceId}`);
                            choiceEl.setAttribute('data-id', `choice${choiceId}`);
                            choiceEl.setAttribute('content-index', `${index}`);
                            choiceEl.setAttribute('onclick', `switchBtn(this);`);
                            choiceEl.innerHTML = choice;
        
                            // Creating Choice Container
                            const choiceContainerEl = document.createElement('div');
                            choiceContainerEl.classList.add('choice-container');
                            choiceContainerEl.setAttribute('id', `choice${choiceId}`);
                            choiceContainerEl.appendChild(choiceEl);
        
                            // Pushing Choice And Choice Container
                            choices.push(choice);
                            choicesHtml.push(choiceContainerEl);
                        
                            return true

                        // If Choices Include Word
                        } else {
                            // Increment Iteration
                            iteration++;

                            return true
                        }
                    });
                
                // If Choice Have Single Word
                } else {
                    // If Choices Doesn't Include Word
                    if(choices.indexOf(choice) === -1) {
                        // Creating Choice Button
                        const choiceEl = document.createElement('button');
                        choiceEl.classList.add('btn', 'answer-btn');
                        choiceEl.setAttribute('data-id', `choice${choiceId}`);
                        choiceEl.setAttribute('content-index', `${index}`);
                        choiceEl.setAttribute('onclick', `switchBtn(this);`);
                        choiceEl.innerHTML = choice;
            
                        // Creating Choice Container
                        const choiceContainerEl = document.createElement('div');
                        choiceContainerEl.classList.add('choice-container');
                        choiceContainerEl.setAttribute('id', `choice${choiceId}`);
                        choiceContainerEl.appendChild(choiceEl);
            
                        // Pushing Choice And Choice Container
                        choices.push(choice);
                        choicesHtml.push(choiceContainerEl); 
                    
                    // If Choices Include Word
                    } else {
                        // Increment Iteration
                        iteration++;
                    }      
                }
            }
    
            if (!progressLength) {
                progressLength = 1;
            } else {
                progressLength = progressLength + 1;
            }
    
            // Assigning Values
            dataWithChoices = content;
            dataWithChoices['correctAnswer'] = correctAnswer;
            dataWithChoices['choices'] = choices;
            dataWithChoices['choicesHtml'] = choicesHtml;
            dataWithChoices['contentHtml'] = contentEl;
            dataWithChoices['filesNames'] = filesNames;
            dataWithChoices['filesDurations'] = filesDuraions;
            dataWithChoices['subTitles'] = subTitles;
            
            // Pushing Data With New Values
            contentArray.push(dataWithChoices);
    };

    // Start Loading First Content
    loadContent(0);
}

// Declaring Global Arrays
let answer = [];

// Switch Button From Choices To Answer And Vice Versa
function switchBtn(btn){
    // Declaring Constants
    const parent = btn.parentNode;
    const parentClass = parent.getAttribute('class');
    const choiceId = btn.getAttribute('data-id');
    const contentIndex = btn.getAttribute('content-index');

    // If Button Comming From Choice Container
    if (parentClass === 'choice-container') {
        // Decaring Constants
        const answerEl = contentArray[contentIndex]['contentHtml'].childNodes[2];
        
        // Creating Choice Place Holder
        const NewChoicePlaceHolderEl = document.createElement('div');
        NewChoicePlaceHolderEl.classList.add('choice-placeholder');
        NewChoicePlaceHolderEl.style.height = `${btn.offsetHeight - 2}px`;
        NewChoicePlaceHolderEl.style.width = `${btn.offsetWidth}px`;
        parent.appendChild(NewChoicePlaceHolderEl);
        
        // Pushing Answer
        answer.push(btn.innerHTML);
        
        // Creating Answer Container
        const answerContainer = document.createElement('div');
        answerContainer.classList.add('answer-container');
        answerContainer.setAttribute('draggable', 'true');
        
        // Appending Choice Button To Answer Container
        answerContainer.appendChild(btn);

        // Appending Answer Container To Answer
        answerEl.appendChild(answerContainer);
        
        // Checking Check Button Status
        checkBtnStatus();

        // Answer Drag And Drop Event Listeners
        addEventListeners(answerContainer);
        
        // Check Anwer Height
        answerHeight();
    
    // If Button Comming From Answer Container
    } else {
        // Declaring Constants
        const choiceContainerEl = contentArray[contentIndex]['contentHtml'].childNodes[3].querySelector(`#${choiceId}`);
        const choicePlaceHolderEl = choiceContainerEl.querySelector('.choice-placeholder')
        const choiceHtmlIndex = contentArray[contentIndex]['choicesHtml'].indexOf(choiceContainerEl);
        const answerIndex = answer.indexOf(btn.innerHTML);

        // Appending Answer Button To Choice
        contentArray[contentIndex]['choicesHtml'][choiceHtmlIndex].appendChild(btn);
        contentArray[contentIndex]['choicesHtml'][choiceHtmlIndex].removeChild(choicePlaceHolderEl);
        
        // Splice Choice From Answer
        answer.splice(answerIndex, 1);
        
        // Removing Answer Container
        parent.remove();

        // Checking Check Button Status
        checkBtnStatus();

        // Check Anwer Height
        answerHeight();
    }
}

// Check Button Status Function
function checkBtnStatus() {
    // Selecting Button
    const checkBtn = document.getElementById('check-btn');
    
    // If User Didn't Answer
    if (answer.length !== 0) {
        checkBtn.classList.add('first-btn');
        checkBtn.classList.remove('locked-btn');
    
    // If User Answered
    } else {
        checkBtn.classList.add('locked-btn');
        checkBtn.classList.remove('first-btn');
    }
}

// Skip Button Status Function
function skipBtnStatus(){
    const skipBtn = document.getElementById('skip-btn');
    if(progress !== progressLength - 1){
        skipBtn.classList.add('fourth-btn');
        skipBtn.classList.remove('locked-btn');
    }else{
        skipBtn.classList.add('locked-btn');
        skipBtn.classList.remove('fourth-btn');
    }
}

// Answer Height Function
function answerHeight() {
    const answerEl = document.querySelector('.answer');
    const answerElChilds = answerEl.childNodes;
    const childrensNumber = answerElChilds.length;
    let childrensWidth = 0;
    answerElChilds.forEach(child => {
        childrensWidth = childrensWidth + child.getBoundingClientRect().width;
    });
    childrensWidth = childrensWidth + (childrensNumber * 5);
    const answerElWidth = answerEl.getBoundingClientRect().width;
    if (answerElWidth + 5 < childrensWidth) {
        answerEl.style.height = '120px';
    } else {
        answerEl.style.height = '60px';
    }
}

/// Drag And Drop Functions
// Drag Start Function
function dragStart() {
    // Adding Dragging Class To Dragged Element
    setTimeout(() => this.closest('div').classList.add("dragging"), 0);
}

// Drag Enter Function
function dragEnter(e) {
    // Preveting Default
    e.preventDefault();
}

// Drag Over Function
async function dragOver(e) {
    // Preveting Default
    e.preventDefault();

    // Selecting Elements
    const answerContainer = document.querySelector(".answer");
    const draggingItem = answerContainer.querySelector(".dragging");
    
    // Getting All Items Except Currently Dragging And Making Array Of Them
    const siblings = [...answerContainer.querySelectorAll(".answer-container:not(.dragging)")];
    
    // Finding The Sibling After Which The Dragging Element Should Be Placed
    const nextSibling = await siblings.find(sibling => {
        return e.clientX >= sibling.offsetLeft + sibling.offsetWidth / 2;
    });

    // Inserting The Dragging Element Before The Found Sibling
    answerContainer.insertBefore(draggingItem, nextSibling);
}

// Drag End Function
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

// Add Event Listeners Function
function addEventListeners(item) {
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragend', dragEnd);
    item.addEventListener('dragenter', dragEnter);
    item.addEventListener('dragover', dragOver);
}