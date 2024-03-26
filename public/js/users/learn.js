// Declaring Global Variables
let curriculumVerion;
let currentSection;
let userNextCheckPoint;
let sectionTitle;
let getUnitsLink;
let unitRoadMap;
let lastCheckPointSection;
let unlockedSection;

// Declaring Global Constants
const requestedLink = window.location.href.toString().split(window.location.host)[1];
const sectionContainer = document.querySelector('.section-container');
const userId = sectionContainer.getAttribute('user-id');
const userRegDate = sectionContainer.getAttribute('user-reg-date');

// Declaring Global Arrays
let userJourneySection = [];
let unlockedUnits = [];

// Get User Journey Function
async function getUserJourney() {
    // Getting Curriculum Version
    const getCurriculumsLink = `/manage/course/curriculums${userRegDate}/get`;
    const fetchGetCurriculums = await fetch(getCurriculumsLink);
    const curriculumsData = await fetchGetCurriculums.json();
    curriculumVerion = curriculumsData['data'][0]['version'];

    // Getting User Course Journey
    const getUserJourneyCourseLink = `/journey/course/${userId}/get`;
    const fetchGetUserJourneyCourse = await fetch(getUserJourneyCourseLink);
    const userJourneyCourseData = await fetchGetUserJourneyCourse.json();
    const userJourneyCourseDataLength = userJourneyCourseData['data'].length;

    // Getting User Tests Journey
    const getUserJourneyTestsLink = `/journey/test/${userId}/get`;
    const fetchGetUserJourneyTests = await fetch(getUserJourneyTestsLink);
    const userJourneyTestseData = await fetchGetUserJourneyTests.json();

    // Declaring User Last Course Check Point
    let lastCourseCheckPoint;

    // If User Have Course Progress
    if (userJourneyCourseDataLength !== 0) {
        // Assigning User Last Course Check Point
        lastCourseCheckPoint = userJourneyCourseData['data'][userJourneyCourseData['data'].length - 1]['checkPoint'].toString();
    
    // If User Doesn't Have Course Progress
    } else {
        // Assigning User Last Course Check Point
        lastCourseCheckPoint = curriculumVerion + '0000';
    }
    
    // Getting User Next Lesson
    const getNextLessonLink = `/manage/course/curriculum${curriculumVerion}/section${lastCourseCheckPoint[0]}/unit${lastCourseCheckPoint[1]}/level${lastCourseCheckPoint[2]}/lesson${lastCourseCheckPoint[3]}/all/getnext`;
    const fetchGetNextLesson = await fetch(getNextLessonLink);
    const nextLessonData = await fetchGetNextLesson.json();
    const nextLessonDataLength = nextLessonData['data'].length;
    
    // If Requested Section Number Not Assigned (User Request Learn Page)
    if (!currentSection) {
        // If User Have Course Progress
        if (userJourneyCourseDataLength !== 0) {
            // If User Next Lesson Available
            if (nextLessonDataLength > 1) {
                // Assigning Requested Section Number
                currentSection = nextLessonData['data'][nextLessonDataLength - 1]['sectionNumber'];

            // If User Next Lesson Not Available
            } else {
                // Assigning Requested Section Number
                currentSection = userJourneyCourseData['data'][userJourneyCourseDataLength - 1]['sectionNumber'];
            }

        // If User Doesn't Have Course Progress
        } else {
            // Assigning Requested Section Number
            currentSection = 1;
        }
    }

    // If User Have Course Progress
    if (userJourneyCourseDataLength !== 0) {
        // Assigning User Last Check Point Section Number
        lastCheckPointSection = userJourneyCourseData['data'][userJourneyCourseDataLength - 1]['sectionNumber'];

        // For Every User Course Journey Unit Check Point
        userJourneyCourseData['data'].forEach(async unit => {
            // If Unit Section Number Equals Requested Section Number
            if (unit['sectionNumber'] === currentSection) {
                // Assigning User Last Unit Check Point
                const lastCourseUnitCheckPoint = unit['checkPoint'].toString();

                // Getting User Next Lesson Check Point
                const getNextLessonLink = `/manage/course/curriculum${curriculumVerion}/section${lastCourseUnitCheckPoint[0]}/unit${lastCourseUnitCheckPoint[1]}/level${lastCourseUnitCheckPoint[2]}/lesson${lastCourseUnitCheckPoint[3]}/all/getnext`;
                const fetchGetNextLesson = await fetch(getNextLessonLink);
                const nextLessonData = await fetchGetNextLesson.json();
                const nextLessonDataLength = nextLessonData['data'].length;

                // If User Next Lesson Available
                if (nextLessonDataLength > 1) {
                    // Assigning User Next Lesson Check Point
                    const nextLessonCheckPoint = '' + nextLessonData['data'][1]['sectionNumber'] + nextLessonData['data'][1]['unitNumber'] + nextLessonData['data'][1]['levelNumber'] + nextLessonData['data'][1]['number'];
                    
                    // Puching Next Lesson Check Point To User Journey
                    userJourneySection.push(nextLessonCheckPoint);
                    
                // If User Next Lesson Not Available
                } else {
                    // Assigning User Next Lesson Check Point
                    let nextLessonCheckPoint = lastCourseUnitCheckPoint + 10;
                    nextLessonCheckPoint = nextLessonCheckPoint.toString();

                    // Puching Next Lesson Check Point To User Journey
                    userJourneySection.push(nextLessonCheckPoint);
                }

                
            }
        });
        
    // If User Doesn't Have Course Progress
    } else {
        // Assigning User Last Check Point Section Number
        lastCheckPointSection = 0;
    }

    // For Every Completed Test
    for (let i = 0; i < userJourneyTestseData['data'].length; i++) {
        // If The Test Section Number Equals The Requested Section Number
        if (userJourneyTestseData['data'][i]['sectionNumber'] === currentSection) {
            // If Section Test
            if (userJourneyTestseData['data'][i]['unitNumber'] === 0) {
                // Assign Unlocked Section to True
                unlockedSection = true;
            
            // If Unit Test
            } else {
                // If Test Section Number Equals Requested Section Number
                if (userJourneyTestseData['data'][i]['sectionNumber'] === currentSection) {
                    // Assigning Unlocked Unit Check Point
                    const checkPoint = '' + userJourneyTestseData['data'][i]['curriculumVersion'] + userJourneyTestseData['data'][i]['sectionNumber'] + userJourneyTestseData['data'][i]['unitNumber'] + '11';

                    // Puching Check Point To Unlocked Units
                    unlockedUnits.push(checkPoint);
                }
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    // If User Request Learn Page
    if (requestedLink === '/learn') {
        // Calling Get User Journey Function
        await getUserJourney();

        // Assigning Get Units Link
        getUnitsLink = `/manage/course/curriculum${curriculumVerion}/section${currentSection}/get`;
    
    // If User Request Section Page
    } else {
        // Assigning Requested Section Number
        currentSection = parseInt(requestedLink.replace(/^\D+/g, ''));
        
        // Calling Get User Journey Function
        await getUserJourney();

        // Assigning Get Units Link
        getUnitsLink = `/manage/course/curriculum${curriculumVerion}/section${currentSection}/get`;
    }

    // Getting Section Title
    const getSectionLink = `/manage/course/curriculum${curriculumVerion}/get`;
    const fetchGetSections = await fetch(getSectionLink);
    const getSectionsData = await fetchGetSections.json();
    sectionTitle = getSectionsData['data'][currentSection - 1]['title'];

    // Creating Section Head
    const sectionHead = document.createElement('div');
    sectionHead.classList.add('section-head');
    sectionHead.innerHTML = `
        <i class="fa-solid fa-arrow-right"></i>
        <h2>القسم ${currentSection}: ${sectionTitle}</h2>
    `;
    sectionContainer.appendChild(sectionHead);

    // Back Button Event Listener
    const backBtn = sectionHead.querySelector('i');
    backBtn.onclick = function() {
        window.location.href = '/sections';
    }

    // Getting Units
    let previousUnitStatus;
    fetchGetUnits = await fetch(getUnitsLink);
    const getUnitsData = await fetchGetUnits.json();

    // For Every Unit
    for (let i = 0; i < getUnitsData['data'].length; i++) {
        // Assigning This Unit Number And Check Point
        const unitNumber = getUnitsData['data'][i]['number'];
        const UnitCheckPoint = '' + currentSection + unitNumber + '11';

        // If User Journey Doesn't Include This Unit
        if (userJourneySection.findIndex(checkPoint => checkPoint[1] == unitNumber) === -1) {
            // Puching Check Point To User Journey
            userJourneySection.push(UnitCheckPoint);
        }

        // If Unlocked Units Doesn't Include This Unit
        if (unlockedUnits.indexOf(UnitCheckPoint) === -1) {
            // Assigning This Unit Check Point To Level And Lesson 0
            const checkPoint = '' + currentSection + unitNumber + '00';
            
            // Puching Check Point To Unlocked Units
            unlockedUnits.push(checkPoint);
        }
    }
    
    // Sort User Journey
    userJourneySection.sort(function(a, b){
        if(a < b) { return -1; }
        if(a > b) { return 1; }
        return 0;
    })

    // Sort Unlocked Units
    unlockedUnits.sort(function(a, b){
        if(a < b) { return -1; }
        if(a > b) { return 1; }
        return 0;
    })

    // For Every Unit
    for (let i = 0; i < getUnitsData['data'].length; i++) {
        let previousLevelStatus;

        // Assigning Unit Number And Unit Title
        const unitNumber = getUnitsData['data'][i]['number'];
        const unitTitle = getUnitsData['data'][i]['title'];

        // Assigning Next Check Point
        userNextCheckPoint = userJourneySection[i];

        // Creating Unit Container
        const unitContainer = document.createElement('div')
        unitContainer.classList.add('unit-container');

        // Creating Unit Head
        const unitHead = document.createElement('div');
        unitHead.classList.add('unit-head');
        unitHead.innerHTML = `
            <h1>الوحدة ${unitNumber}</h1>
            <h2>${unitTitle}</h2>
        `;
        unitContainer.appendChild(unitHead);

        // Creating Unit Road Map
        unitRoadMap = document.createElement('div');
        unitRoadMap.classList.add('unit-road-map');
        unitContainer.appendChild(unitRoadMap);

        // Getting Levels
        const getLevelsLink = getUnitsLink.replace('get', '') + `unit${unitNumber}/get`;
        const fetchGetlevels = await fetch(getLevelsLink);
        const getLevelsData = await fetchGetlevels.json();

        // For Every Level
        for (let i = 0; i < getLevelsData['data'].length; i++) {
            // Assigning Level Number
            const levelNumber = getLevelsData['data'][i]['number'];

            // Creating Level Container
            const levelContainer = document.createElement('div');
            levelContainer.classList.add('level-container');
            unitRoadMap.appendChild(levelContainer);

            // Creating Level Button Container
            const progress = document.createElement('div');
            progress.classList.add('level-btn-container');
            levelContainer.appendChild(progress);

            // Creating Level Button
            const levelBtn = document.createElement('button');
            levelBtn.classList.add('level');
            progress.appendChild(levelBtn);

            // Creating Jump Here
            const jumpHere = document.createElement('div');
            jumpHere.classList.add('jump-here');

            // Creating Lesson Counter Container
            const lessonsConterParent =  document.createElement('div');
            lessonsConterParent.classList.add('lessons-conter-parent');
            levelContainer.appendChild(lessonsConterParent);

            // Creating Lesson Counter
            const lessonsConter = document.createElement('div');
            lessonsConter.classList.add('lessons');
            lessonsConterParent.appendChild(lessonsConter);

            // Revealing Lesson Counter Event Listener
            [levelContainer, levelBtn].forEach(el => {
                el.addEventListener('click', function(ev){
                    // Stoping Propagation
                    ev.stopPropagation();

                    // Scroling To Level Button
                    levelBtn.scrollIntoView();

                    // Revealing Lesson Counter
                    lessonsConterParent.classList.add('open-popup');
                    lessonsConterParent.classList.remove('close-popup');
                });
            });

            // Hidding Lesson Counter Event Listener
            ['click', 'scroll'].forEach(event => {
                document.addEventListener(event, function(ev) {
                    // Stoping Propagation
                    ev.stopPropagation();

                    // Assigning Target Constant
                    const target = ev.target;

                    // If Click Event
                    if (event === 'click') {
                        if ((target !== levelBtn || !levelBtn.contains(target)) && target !== levelContainer && target !== progress && target !== document) {
                            // Hidding Lesson Counter
                            lessonsConterParent.classList.remove('open-popup');
                            lessonsConterParent.classList.add('close-popup');
                        }

                    // If Scroll Event
                    } else {
                        if (levelBtn.getBoundingClientRect().top > 5 || levelBtn.getBoundingClientRect().top < -5) {
                            // Hidding Lesson Counter
                            lessonsConterParent.classList.remove('open-popup');
                            lessonsConterParent.classList.add('close-popup');
                        }
                    }
                });
            });

            // Getting Lessons
            const getLessonsLink = getLevelsLink.replace('get', '') + `level${levelNumber}/get`;
            const fetchGetLessons = await fetch(getLessonsLink);
            const getLessonsData = await fetchGetLessons.json();

            // If Lessons Not Available
            if (getLessonsData['data'].length === 0) {
                levelBtn.classList.add('locked');
                progress.classList.add('no-progress');
                lessonsConter.classList.add('lesson-locked');
                levelBtn.innerHTML = `<i class="fa-solid fa-star level${levelNumber}"></i>`;
                lessonsConter.innerHTML = `
                    <h2>لا يوجد عنوان</h2>
                    <p>الدروس غير متوفرة لهاذا المستوى</p>
                    <button class="locked-btn">مقفل</button>
                `;
            
            // If Lessons Available
            } else {
                // Declaring This Chek Point
                let thisCheckPoint;

                // Declaring Total Lessons
                const totalLessons = getLessonsData['data'].length;

                // For Every Lesson
                getLessonsData['data'].every((lesson, index) => {
                    // Assigning Lesson Number
                    const lessonNumber = index + 1;

                    // Assigning This Check Point
                    if (index === 0) {
                        thisCheckPoint = '' + currentSection + unitNumber + levelNumber + lessonNumber;
                    } else {
                        thisCheckPoint = thisCheckPoint.slice(0, -1) + lessonNumber;
                    }

                    // Start Lesson/Test Function
                    function btnOnClick(thisLessonNumber){
                        // Assigning Lesson Link
                        let startLessonLink;
                        if (thisLessonNumber === 'Jump Unit') {
                            startLessonLink = `/section${currentSection}/unit${unitNumber}/test`;
                        } else {
                            startLessonLink = `/section${currentSection}/unit${unitNumber}/level${levelNumber}/lesson${thisLessonNumber}`;
                        }

                        // Start Lesson Button Event Listener
                        const startLessonBtn = lessonsConter.querySelector('button');
                        startLessonBtn.onclick = function(){
                            window.location.href = startLessonLink;
                        }
                    }

                    // If User Next CheckPoint Greater Than Last Lesson Check Point
                    if (parseInt(userNextCheckPoint) > parseInt(thisCheckPoint.slice(0, -1) + totalLessons)) {
                        // Hiding Progress
                        progress.classList.add('no-progress');
                        
                        // Unlocking Level Button
                        levelBtn.classList.add('unlocked');
                        levelBtn.innerHTML = `<i class="fa-solid fa-check level${levelNumber}"></i>`;

                        // Unlocking Lesson Counter
                        lessonsConter.classList.add('lesson-unlocked');
                        lessonsConter.innerHTML = `
                            <h2>${getLessonsData['data'][totalLessons - 1]['title']}</h2>
                            <p>تمرن من جديد لإنعاش ذاكرتك</p>
                            <button class="btn fifth-btn">تمرن</button>
                        `;

                        // Calling Start Lesson/Test Function
                        btnOnClick(getLessonsData['data'][totalLessons - 1]['number']);

                        // Assigning Previous Level Status(This Level) To Completed
                        previousLevelStatus = "Completed";

                        // If Last Level
                        if (levelNumber === getLevelsData['data'].length) {
                            // Assigning Previous Unit Status To Completed
                            previousUnitStatus = "Completed";
                        }

                        // Break The For Every Lesson Loop
                        return false;
                    
                    } else if (
                        // If Section Unlocked Ans User Have No Section Progress
                        (currentSection === 1 || unlockedSection)
                        && (userNextCheckPoint === '' + currentSection + '111' && levelNumber === 1)

                        // If Unit Unlocked By Completing Previous Unit And User Have No Unit Progress
                        || (userNextCheckPoint === '' + currentSection + unitNumber + '11' && levelNumber === 1 && previousUnitStatus === "Completed")
                        
                        // If Unit Unlocked By Passing The Unit Test And User Have No Unit Progress
                        || (thisCheckPoint === unlockedUnits[i])

                        // If User Next Check Point Equals This Check Point And Have No Lesson Pregress
                        || (userNextCheckPoint === thisCheckPoint && lessonNumber === 1 && previousLevelStatus === "Completed")) {

                        // Hiding Progress
                        progress.classList.add('no-progress');

                        // Revealing Start Animation
                        jumpHere.innerHTML = `
                            <h3>إبدأ</h3>
                        `;
                        jumpHere.style.width = '80px';
                        jumpHere.style.right = '-5%';
                        progress.appendChild(jumpHere);

                        // If Level Number Equals 1 And Jump Here Animation Visible
                        if (levelNumber === 1) {
                            // Assigning Unit Head Margin Bottom To 80px
                            unitHead.style.marginBottom = '80px';
                        }

                        // Unlocking Level Button
                        levelBtn.classList.add('unlocked');
                        levelBtn.innerHTML = `<i class="fa-solid fa-star level${levelNumber}"></i>`;

                        // Unlocking Lesson Counter
                        lessonsConter.classList.add('lesson-unlocked');
                        lessonsConter.innerHTML = `
                            <h2>${getLessonsData['data'][0]['title']}</h2>
                            <p>درس 1 من ${totalLessons}</p>
                            <button class="btn fifth-btn">إبدأ</button>
                        `;

                        // Calling Start Lesson/Test Function
                        btnOnClick(getLessonsData['data'][0]['number']);

                        // Assigning Previous Level Status(This Level) To Not Completed
                        previousLevelStatus = "Not Completed";

                        // Break The For Every Lesson Loop
                        return false;
                    } else if (
                        // If Section Unlocked
                        (currentSection === 1 || unlockedSection)
                        // And User Next Check Point Equals This Check Point
                        && (parseInt(userNextCheckPoint) === parseInt(thisCheckPoint))
                        // And Lesson Number Greater Than 1
                        && lessonNumber > 1) {
                        // Assigning Progress Percent
                        const progressPercent = ((lessonNumber - 1) / totalLessons) * 100;
                        
                        // Revealing Progress
                        progress.classList.add('progress');
                        progress.style.background = `conic-gradient(from 0deg, #58cc02 0%, #58cc02 0% ${progressPercent}%, #e5e5e5 ${progressPercent}%, #e5e5e5 100%)`;

                        // Revealing Start Animation
                        jumpHere.innerHTML = `
                            <h3>إبدأ</h3>
                        `;
                        jumpHere.style.width = '80px';
                        jumpHere.style.right = '13%';
                        jumpHere.style.top = '-35px';
                        progress.appendChild(jumpHere);

                        // If Level Number Equals 1 And Jump Here Animation Visible
                        if (levelNumber === 1) {
                            // Assigning Unit Head Margin Bottom To 80px
                            unitHead.style.marginBottom = '80px';
                        }

                        // Unlocking Level Button
                        levelBtn.classList.add('unlocked');
                        levelBtn.innerHTML = `<i class="fa-solid fa-star level${levelNumber}"></i>`;
                        
                        // Unlocking Lesson Counter
                        lessonsConter.classList.add('lesson-unlocked');
                        lessonsConter.innerHTML = `
                            <h2>${getLessonsData['data'][lessonNumber - 1]['title']}</h2>
                            <p>درس ${lessonNumber} من ${totalLessons}</p>
                            <button class="btn fifth-btn" onclick="">إبدأ</button>
                        `;

                        // Calling Start Lesson/Test Function
                        btnOnClick(getLessonsData['data'][lessonNumber - 1]['number']);

                        // Assigning Previous Level Status(This Level) To Not Completed
                        previousLevelStatus = "Not Completed";
                        
                        // Break The For Every Lesson Loop
                        return false;
                    } else if (
                        // If Section Unlocked
                        (currentSection === 1 || unlockedSection)
                        // And Not First Unit, First Level 
                        && (unitNumber !== 1 && levelNumber === 1)
                        // And User Have No Unit Progress
                        && (userNextCheckPoint === currentSection + "111" || userNextCheckPoint === "" + currentSection + unitNumber + "11")) {
                            // Hiding Progress
                            progress.classList.add('no-progress');

                            // Revealing Jump Here Animation
                            jumpHere.innerHTML = `
                                <h3>القفز إلى هنا؟</h3>
                            `;
                            jumpHere.style.width = '120px';
                            jumpHere.style.right = '-34.5%';
                            progress.appendChild(jumpHere);
                            
                            // If Level Number Equals 1 And Jump Here Animation Visible
                            if (levelNumber === 1) {
                                // Assigning Unit Head Margin Bottom To 80px
                                unitHead.style.marginBottom = '80px';
                            }

                            // Unlocking Level Button
                            levelBtn.classList.add('unlocked');
                            levelBtn.innerHTML = `<i class="fa-solid fa-forward"></i>`;

                            // Unlocking Lesson Counter
                            lessonsConter.classList.add('lesson-unlocked');
                            lessonsConter.innerHTML = `
                                <h2>القفز إلى هنا؟</h2>
                                <p>إنجح في هذا الإختبار للقفز إلى الوحدة ${unitNumber}</p>
                                <button class="btn fifth-btn">إبدأ</button>
                            `;
                            
                            // Calling Start Lesson/Test Function
                            btnOnClick('Jump Unit');
                            
                            // Assigning Previous Level Status(This Level) To Not Completed
                            previousLevelStatus = "Not Completed";
                            
                            // Break The For Every Lesson Loop
                            return false; 
                    
                    // If This Check Point Greater Than User Next Check Point
                    } else if (parseInt(userNextCheckPoint) < parseInt(thisCheckPoint)) {
                        // Hiding Progress
                        progress.classList.add('no-progress');

                        // Locking Level Button
                        levelBtn.classList.add('locked');
                        levelBtn.innerHTML = `<i class="fa-solid fa-star level${levelNumber}"></i>`;

                        // Locking Lesson Counter
                        lessonsConter.classList.add('lesson-locked');

                        // If Section Unlocked
                        if (currentSection === 1 || unlockedSection) {
                            lessonsConter.innerHTML = `
                                <h2>${getLessonsData['data'][0]['title']}</h2>
                                <p>أكمل جميع المستويات أعلاه لفتح هذا المستوى</p>
                                <button class="btn locked-btn">مقفل</button>
                            `;

                        // If Section Locked
                        } else {
                            lessonsConter.innerHTML = `
                                <h2>${getLessonsData['data'][0]['title']}</h2>
                                <p>إنجح في إختبار القسم لفتح هذاالقسم</p>
                                <button class="btn locked-btn">مقفل</button>
                            `;
                        }

                        // Assigning Previous Level Status(This Level) To Not Completed
                        previousLevelStatus = "Not Completed";

                        // Break The For Every Lesson Loop
                        return false;   
                    } else {
                        // Continue The For Every Lesson Loop
                        return true;
                    }
                });
            }
        };

        // Appending The Unit Container To The Section Container
        sectionContainer.appendChild(unitContainer);

        // Calling Unit Road Map Curving Function
        roadCurving(unitNumber);
    };

    // Assigning Total Sections Number
    const totalSections = getSectionsData['data'].length;

    // Assigning Last Section Number
    const lastSectionNumber = getSectionsData['data'][totalSections - 1]['number'].toString();

    // If Current Section Is Not The Last Section
    if (currentSection !== lastSectionNumber) {
        // Assigning Next Section Number And Title, Description
        const nextSectionNumber = getSectionsData['data'][currentSection]['number'];
        const nextSectionTitle = getSectionsData['data'][currentSection]['title'];
        const nextSectionDescription = getSectionsData['data'][currentSection]['description'];

        // Creating Next Section Container
        const nextSectionContainer = document.createElement('div');
        nextSectionContainer.classList.add('next-section-container');

        // Declaring Next Section Button Inner Text And Redirect Link
        let buttonText;
        let nextSectionLink;

        // If Next Section Number Greater Than Last Check Point Section Number
        if (lastCheckPointSection < nextSectionNumber) {
            // Locking Next Section Container
            nextSectionContainer.classList.add('next-section-locked');

            // Assigning Next Section Button Inner Text And Redirect Link
            buttonText = 'القفز إلى هنا؟';
            nextSectionLink = `/section${currentSection + 1}/test`;

        // If Last Check Point Section Number Greater Than Next Section Number
        } else {
            // Unlocking Next Section Container
            nextSectionContainer.classList.add('next-section-unlocked');

            // Assigning Next Section Button Inner Text And Redirect Link
            buttonText = 'المتابعة';
            nextSectionLink = `/section${currentSection + 1}`;
        }

        // Assgning Next Section Container Inner HTML
        nextSectionContainer.innerHTML = `
            <h3>التالي</h3>
            <h1>القسم ${currentSection + 1}: ${nextSectionTitle}</h1>
            <h2>${nextSectionDescription}</h2>
            <button class="btn" id="next-section-btn" onclick="">${buttonText}</button>
        `;

        // Appending Next Section Container To Section Container
        sectionContainer.appendChild(nextSectionContainer);

        // Next Section Button Event Listener
        const nextSectionBtn = document.getElementById('next-section-btn');
        nextSectionBtn.onclick = function() {
            window.location.href = nextSectionLink;
        }
    }
});


// Unit Road Curving Function
function roadCurving(unitNumber){
    // Declaring Direction Variables
    let directionA;
    let directionB;

    // If Unit Number Is A Odd Number
    if ((unitNumber / 2) % 1 !== 0) {
        directionA = "left";
        directionB = "right";

    // If Unit Number Is A Even Number
    } else {
        directionA = "right";
        directionB = "left";
    }

    // Assigning Levels And Lesson Counter Container
    const levels = unitRoadMap.querySelectorAll('.level-btn-container');
    const lessonsConterParent = unitRoadMap.querySelectorAll('.lessons-conter-parent');
    const lessonsConter = unitRoadMap.querySelectorAll('.lessons');

    // Assigning Levels Total Number
    const totalLevelsNumber = levels.length;

    // For Every Level
    levels.forEach((level, index) => {
        // If Levels Total Number Between 13 And 16
        if (totalLevelsNumber >= 13 && totalLevelsNumber <= 16) {
            curveOfThree(direction(directionA), round(1));
            curveOfThree(direction(directionB), round(2));
            curveOfThree(direction(directionA), round(3));
            
            if (totalLevelsNumber === 16) {
                lastThree(direction(directionB));
            } else if (totalLevelsNumber === 15) {
                lastTwo(direction(directionB));
            } else if (totalLevelsNumber === 14) {
                lastOne(direction(directionA));
            }
        
        // If Levels Total Number Between 9 And 12
        } else if (totalLevelsNumber >= 9 && totalLevelsNumber <= 12) {
            curveOfThree(direction(directionA), round(1));
            curveOfThree(direction(directionB), round(2));

            if (totalLevelsNumber === 12) {
                lastThree(direction(directionA));
            } else if (totalLevelsNumber === 11) {
                lastTwo(direction(directionA));
            } else if (totalLevelsNumber === 10) {
                lastOne(direction(directionB));
            }
        
        // If Levels Total Number Equals 8 Or 7
        } else if (totalLevelsNumber === 8 || totalLevelsNumber === 7) {
            curveOfFive(direction(directionA), round(1));
            
            if (totalLevelsNumber === 8) {
                lastOne(direction(directionA));
            }

        // If Levels Total Number Equals 6 Or 5
        } else if (totalLevelsNumber === 6 || totalLevelsNumber === 5) {
            curveOfThree(direction(directionA), round(1));
            
            if (totalLevelsNumber === 6) {
                lastOne(direction(directionA));
            }
        
        // If Levels Total Number Equals 4 Or 3
        } else if (totalLevelsNumber === 4 || totalLevelsNumber === 3) {
            curveOfOne(direction(directionA), round(1));
            
            if (totalLevelsNumber === 4) {
                lastOne(direction(directionA));
            }
        } else {
            lessonsConterParent[index].style.setProperty('--left', `150px`);
        }

        // Curve Round Function
        function round(round) {
            if (round === 1) {
                return 0;
            } else if (round === 2) {
                return 4;
            } else if (round === 3) {
                return 8;
            }
        }

        // Curve Direction Function
        function direction(dir) {
            if (dir === 'left') {
                return -1;
            } else {
                return 1;
            }
        }

        // Curve Of One Function
        function curveOfOne(sign, add) {
            if (index === 0 + add) {
                lessonsConterParent[index].style.setProperty('--left', `150px`);
            } else if (index === 1 + add) {
                level.style.translate = `${sign * 45}px`;
                lessonsConterParent[index].style.setProperty('--left', `${sign * 45 + 150}px`);
            }else if (index === 2 + add) {
                lessonsConterParent[index].style.setProperty('--left', `150px`);
            }
        }

        // Curve Of Three Function
        function curveOfThree(sign, add) {
            if (index === 0 + add) {
                lessonsConterParent[index].style.setProperty('--left', `150px`);
            } else if (index === 1 + add) {
                level.style.translate = `${sign * 45}px`;
                lessonsConterParent[index].style.setProperty('--left', `${sign * 45 + 150}px`);
            } else if (index === 2 + add) {
                level.style.translate = `${sign * 70}px`;
                lessonsConterParent[index].style.setProperty('--left', `${sign * 70 + 150}px`);
            } else if (index === 3 + add) {
                level.style.translate = `${sign * 45}px`;
                lessonsConterParent[index].style.setProperty('--left', `${sign * 45 + 150}px`);
            } else if (index === 4 + add) {
                lessonsConterParent[index].style.setProperty('--left', `150px`);
            }
        }

        // Curve Of Five Function
        function curveOfFive(sign, add) {
            if (index === 0 + add) {
                lessonsConterParent[index].style.setProperty('--left', `150px`);
            } else if (index === 1 + add) {
                level.style.translate = `${sign * 45}px`;
                lessonsConterParent[index].style.setProperty('--left', `${sign * 45 + 150}px`);
            } else if (index === 2 + add) {
                level.style.translate = `${sign * 70}px`;
                lessonsConterParent[index].style.setProperty('--left', `${sign * 70 + 150}px`);
            } else if (index === 3 + add) {
                level.style.translate = `${sign * 82}px`;
                lessonsConterParent[index].style.setProperty('--left', `${sign * 82 + 150}px`);
            } else if (index === 4 + add) {
                level.style.translate = `${sign * 70}px`;
                lessonsConterParent[index].style.setProperty('--left', `${sign * 70 + 150}px`);
            } else if (index === 5 + add) {
                level.style.translate = `${sign * 45}px`;
                lessonsConterParent[index].style.setProperty('--left', `${sign * 45 + 150}px`);
            } else if (index === 6 + add) {
                lessonsConterParent[index].style.setProperty('--left', `150px`);
            }
        }

        // Last Three Levels From Curve
        function lastThree(sign) {
            if (index === totalLevelsNumber - 3) {
                level.style.translate = `${sign * 45}px`;
                lessonsConterParent[index].style.setProperty('--left', `${sign * 45 + 150}px`);
            } else if (index === totalLevelsNumber - 2) {
                level.style.translate = `${sign * 25}px`;
                lessonsConterParent[index].style.setProperty('--left', `${sign * 25 + 150}px`);
            } else if (index === totalLevelsNumber - 1) {
                lessonsConterParent[index].style.setProperty('--left', `150px`);
            }
        }

        // Last Two Levels From Curve
        function lastTwo(sign) {
            if (index === totalLevelsNumber - 2) {
                level.style.translate = `${sign * 25}px`;
                lessonsConterParent[index].style.setProperty('--left', `${sign * 25 + 150}px`);
            } else if (index === totalLevelsNumber - 1) {
                lessonsConterParent[index].style.setProperty('--left', `150px`);
            }
        }

        // Last Level From Curve
        function lastOne(sign) {
            if (index === totalLevelsNumber - 2) {
                level.style.translate = `${sign * 20}px`;
                lessonsConterParent[index].style.setProperty('--left', `${sign * 20 + 150}px`);
            } else if (index === totalLevelsNumber - 1) {
                lessonsConterParent[index].style.setProperty('--left', `150px`);
            }
        }
    });
}