let currentSection;
let lastCheckPoint;
let sectionTitle;
let getUnitsLink;
let unitRoadMap;
let userJourneySection = [];
const sectionContainer = document.querySelector('.section-container');
const userId = sectionContainer.getAttribute('user-id');
const requestedLink = window.location.href.toString().split(window.location.host)[1];

let lastCheckPointSection;
let unlockedSection;
let unlockedUnits = [];
async function getUserJourney(){
    const getUserJourneyCourseLink = `/journey/course/${userId}/get`;
    const fetchGetUserJourneyCourse = await fetch(getUserJourneyCourseLink);
    const userJourneyCourseData = await fetchGetUserJourneyCourse.json();
    const userJourneyCourseDataLength = userJourneyCourseData['data'].length;

    const getUserJourneyTestsLink = `/journey/test/${userId}/get`;
    const fetchGetUserJourneyTests = await fetch(getUserJourneyTestsLink);
    const userJourneyTestseData = await fetchGetUserJourneyTests.json();

    lastCourseCheckPoint = userJourneyCourseData['data'][userJourneyCourseData['data'].length - 1]['checkPoint'].toString();
    const getNextLessonLink = `/manage/course/section${lastCourseCheckPoint[0]}/unit${lastCourseCheckPoint[1]}/level${lastCourseCheckPoint[2]}/lesson${lastCourseCheckPoint[3]}/all/getnext`;
    const fetchGetNextLesson = await fetch(getNextLessonLink);
    const nextLessonData = await fetchGetNextLesson.json();
    const nextLessonDataLength = nextLessonData['data'].length;
    
    if (userJourneyCourseDataLength !== 0) {
        lastCheckPointSection = userJourneyCourseData['data'][userJourneyCourseDataLength - 1]['sectionNumber'];
    } else {
        lastCheckPointSection = 0;
    }

    if (!currentSection) {
        if (userJourneyCourseDataLength !== 0) {
            if (nextLessonDataLength > 1) {
                currentSection = nextLessonData['data'][nextLessonDataLength - 1]['sectionNumber'];

                userJourneyCourseData['data'].forEach(async unit => {
                    if (unit['sectionNumber'] === currentSection) {
                        const lastCourseUnitCheckPoint = unit['checkPoint'].toString();
                        const getNextLessonLink = `/manage/course/section${lastCourseUnitCheckPoint[0]}/unit${lastCourseUnitCheckPoint[1]}/level${lastCourseUnitCheckPoint[2]}/lesson${lastCourseUnitCheckPoint[3]}/all/getnext`;
                        const fetchGetNextLesson = await fetch(getNextLessonLink);
                        const nextLessonData = await fetchGetNextLesson.json();
                        const nextLessonDataLength = nextLessonData['data'].length;
                        const nextLessonCheckPoint = '' + nextLessonData['data'][1]['sectionNumber'] + nextLessonData['data'][1]['unitNumber'] + nextLessonData['data'][1]['levelNumber'] + nextLessonData['data'][1]['number'];
                        
                        userJourneySection.push(nextLessonCheckPoint);
                    }
                });
            } else {
                currentSection = userJourneyCourseData['data'][userJourneyCourseDataLength - 1]['sectionNumber'];

                userJourneyCourseData['data'].forEach(async unit => {
                    if (unit['sectionNumber'] === currentSection) {
                        const lastCourseUnitCheckPoint = unit['checkPoint'];
                        let nextLessonCheckPoint = lastCourseUnitCheckPoint + 10;
                        nextLessonCheckPoint = nextLessonCheckPoint.toString();

                        userJourneySection.push(nextLessonCheckPoint);
                    }
                });
            }
        } else {
            currentSection = 1;
            //lastCheckPoint = "1000";
        }
    } else {
        if (userJourneyCourseDataLength !== 0) {
            if (nextLessonDataLength > 1) {
                userJourneyCourseData['data'].forEach(async unit => {
                    if (unit['sectionNumber'] === currentSection) {
                        const lastCourseUnitCheckPoint = unit['checkPoint'].toString();
                        const getNextLessonLink = `/manage/course/section${lastCourseUnitCheckPoint[0]}/unit${lastCourseUnitCheckPoint[1]}/level${lastCourseUnitCheckPoint[2]}/lesson${lastCourseUnitCheckPoint[3]}/all/getnext`;
                        const fetchGetNextLesson = await fetch(getNextLessonLink);
                        const nextLessonData = await fetchGetNextLesson.json();
                        const nextLessonDataLength = nextLessonData['data'].length;
                        const nextLessonCheckPoint = '' + nextLessonData['data'][1]['sectionNumber'] + nextLessonData['data'][1]['unitNumber'] + nextLessonData['data'][1]['levelNumber'] + nextLessonData['data'][1]['number'];
                        
                        userJourneySection.push(nextLessonCheckPoint);
                    }
                });
            } else {
                userJourneyCourseData['data'].forEach(async unit => {
                    if (unit['sectionNumber'] === currentSection) {
                        const lastCourseUnitCheckPoint = unit['checkPoint'];
                        let nextLessonCheckPoint = lastCourseUnitCheckPoint + 10;
                        nextLessonCheckPoint = nextLessonCheckPoint.toString();

                        userJourneySection.push(nextLessonCheckPoint);
                    }
                });
            }
            if (userJourneySection.length === 0) {
                //lastCheckPoint = "" + currentSection + "000";
            }
        } else {
            //lastCheckPoint = "" + currentSection + "000";
        }
    }

    for (let i = 0; i < userJourneyTestseData['data'].length; i++) {
        if (userJourneyTestseData['data'][i]['sectionNumber'] === currentSection) {
            if (userJourneyTestseData['data'][i]['unitNumber'] === 0) {
                unlockedSection = true;
            } else {
                const checkPoint = '' + userJourneyTestseData['data'][i]['sectionNumber'] + userJourneyTestseData['data'][i]['unitNumber'] + '11';
                unlockedUnits.push(checkPoint);
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    if(requestedLink === '/learn'){
        await getUserJourney();
        getUnitsLink = `/manage/course/section${currentSection}/get`;
    }else{
        currentSection = parseInt(requestedLink.replace(/^\D+/g, ''));
        await getUserJourney();
        getUnitsLink = "/manage/course" + requestedLink + "/get";
    }

    const fetchGetSections = await fetch("/manage/course/sections/get");
    const getSectionsData = await fetchGetSections.json();
    const sectionHead = document.createElement('div');
    sectionHead.classList.add('section-head');
    sectionTitle = getSectionsData['data'][currentSection - 1]['title'];
    sectionHead.innerHTML = `
        <i class="fa-solid fa-arrow-right"></i>
        <h2>القسم ${currentSection}: ${sectionTitle}</h2>
    `;
    sectionContainer.appendChild(sectionHead);
    const backBtn = sectionHead.querySelector('i');
    backBtn.onclick = function() {
        window.location.href = '/sections';
    }

    let previousUnitStatus;
    fetchGetUnits = await fetch(getUnitsLink);
    const getUnitsData = await fetchGetUnits.json();
    for (let i = 0; i < getUnitsData['data'].length; i++) {
        //console.log('Starting Units');
        let previousLevelStatus;

        const unitNumber = getUnitsData['data'][i]['number'];
        const unitTitle = getUnitsData['data'][i]['title'];

        if (userJourneySection[i]) {
            lastCheckPoint = userJourneySection[i];
        } else {
            lastCheckPoint = "" + currentSection + unitNumber + "11";
            console.log('lastcheckpoint updated ' + lastCheckPoint);
        }
        console.log(previousUnitStatus);

        const unitContainer = document.createElement('div')
        unitContainer.classList.add('unit-container');

        const unitHead = document.createElement('div');
        unitHead.classList.add('unit-head');
        unitHead.innerHTML = `
            <h1>الوحدة ${unitNumber}</h1>
            <h2>${unitTitle}</h2>
        `;
        unitContainer.appendChild(unitHead);

        unitRoadMap = document.createElement('div');
        unitRoadMap.classList.add('unit-road-map');
        unitContainer.appendChild(unitRoadMap);
        //unitContainer.setAttribute('onclick', `hideLessonsConter(element);`);

        const getLevelsLink = getUnitsLink.replace('get', '') + `unit${unitNumber}/get`;
        const fetchGetlevels = await fetch(getLevelsLink);
        const getLevelsData = await fetchGetlevels.json();
        //console.log('Starting levels');
        for (let i = 0; i < getLevelsData['data'].length; i++) {
            const levelNumber = getLevelsData['data'][i]['number'];
            let thisCheckPoint = "" + currentSection + unitNumber + levelNumber;
            const levelContainer = document.createElement('div');
            levelContainer.classList.add('level-container');
            unitRoadMap.appendChild(levelContainer);

            const progress = document.createElement('div');
            progress.classList.add('level-btn-container');
            levelContainer.appendChild(progress);

            const levelBtn = document.createElement('button');
            levelBtn.classList.add('level');
            progress.appendChild(levelBtn);

            const jumpHere = document.createElement('div');
            jumpHere.classList.add('jump-here');

            const lessonsConterParent =  document.createElement('div');
            lessonsConterParent.classList.add('lessons-conter-parent');
            levelContainer.appendChild(lessonsConterParent);

            const lessonsConter = document.createElement('div');
            lessonsConter.classList.add('lessons');
            lessonsConterParent.appendChild(lessonsConter);

            [levelContainer, levelBtn].forEach(el => {
                el.addEventListener('click', function(){
                    console.log('click');
                    levelBtn.scrollIntoView();
                    lessonsConterParent.classList.add('open-popup');
                    lessonsConterParent.classList.remove('close-popup');
                });
            });
            ['click', 'scroll'].forEach(event => {
                document.addEventListener(event, function(el) {
                    const target = el.target;
                    if (event === 'click') {
                        if ((target !== levelBtn || !levelBtn.contains(target)) && target !== levelContainer && target !== progress && target !== document) {
                            console.log(target)
                            lessonsConterParent.classList.remove('open-popup');
                            lessonsConterParent.classList.add('close-popup');
                        }
                    } else {
                        if (levelBtn.getBoundingClientRect().top > 5 || levelBtn.getBoundingClientRect().top < -5) {
                            console.log('Removing class ' + levelBtn.getBoundingClientRect().top)
                            lessonsConterParent.classList.remove('open-popup');
                            lessonsConterParent.classList.add('close-popup');
                        }
                    }
                });
            });

            const getLessonsLink = getLevelsLink.replace('get', '') + `level${levelNumber}/get`;
            const fetchGetLessons = await fetch(getLessonsLink);
            const getLessonsData = await fetchGetLessons.json();
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
            } else {
                getLessonsData['data'].every((lesson, index) => {
                    const totalLessons = getLessonsData['data'].length;
                    const lessonNumber = index + 1;

                    if (index === 0) {
                        thisCheckPoint = thisCheckPoint + lessonNumber;
                    } else {
                        thisCheckPoint = thisCheckPoint.slice(0, -1) + lessonNumber;
                    }

                    function btnOnClick(thisLessonNumber){
                        let startLessonLink;
                        const startLessonBtn = lessonsConter.querySelector('button');

                        if (thisLessonNumber === 'Jump Unit') {
                            startLessonLink = `/section${currentSection}/unit${unitNumber}/test`;
                        } else {
                            startLessonLink = getLessonsLink.replace('/manage/course', '').replace('get', '') +`lesson${thisLessonNumber}`;
                        }

                        startLessonBtn.onclick = function(){
                            window.location.href = startLessonLink;
                        }
                    }

                    console.log('This' + parseInt(lastCheckPoint) + ' ' + parseInt(thisCheckPoint.slice(0, -1) + totalLessons))
                    if (parseInt(lastCheckPoint) > parseInt(thisCheckPoint.slice(0, -1) + totalLessons)) {
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
                        && (lastCheckPoint === '' + currentSection + '111' && levelNumber === 1)
                        || (lastCheckPoint === '' + currentSection + unitNumber + '11' && levelNumber === 1 && previousUnitStatus === "Completed")
                        || (thisCheckPoint === unlockedUnits[i])
                        || (parseInt(lastCheckPoint) === parseInt(thisCheckPoint) && lessonNumber === 1 && previousLevelStatus === "Completed")){
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
                    && (parseInt(lastCheckPoint) === parseInt(thisCheckPoint))
                    && lessonNumber > 1) {
                        const progressPercent = ((lessonNumber - 1) / totalLessons) * 100;
                        console.log('lesson number ' + lessonNumber)
                        levelBtn.classList.add('unlocked');
                        progress.classList.add('progress');
                        lessonsConter.classList.add('lesson-unlocked');
                        levelBtn.innerHTML = `<i class="fa-solid fa-star level${levelNumber}"></i>`;
                        lessonsConter.innerHTML = `
                            <h2>${getLessonsData['data'][lessonNumber - 1]['title']}</h2>
                            <p>درس ${lessonNumber} من ${totalLessons}</p>
                            <button class="start-lesson-btn" onclick="">إبدأ</button>
                        `;
                        progress.style.background = `conic-gradient(from 0deg, #58cc02 0%, #58cc02 0% ${progressPercent}%, #e5e5e5 ${progressPercent}%, #e5e5e5 100%)`;
                        btnOnClick(getLessonsData['data'][lessonNumber - 1]['number']);
                        previousLevelStatus = "Not Completed";
                        jumpHere.innerHTML = `
                            <h3>إبدأ</h3>
                        `;
                        jumpHere.style.width = '80px';
                        jumpHere.style.right = '13%';
                        jumpHere.style.top = '-35px';

                        progress.appendChild(jumpHere);
                        if (levelNumber === 1) {
                            unitHead.style.marginBottom = '80px';
                        }
                        return false;
                    } else if ((currentSection === 1 || unlockedSection)
                    && (unitNumber !== 1 && levelNumber === 1)
                    &&(lastCheckPoint === currentSection + "111" || lastCheckPoint === "" + currentSection + unitNumber + "11")) {
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
                    }else if(parseInt(lastCheckPoint) < parseInt(thisCheckPoint)) {
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
                });
            }
        };

        sectionContainer.appendChild(unitContainer);
        roadCurving(unitNumber);
    };

    totalSections = getSectionsData['data'].length;
    lastSectionNumber = getSectionsData['data'][totalSections - 1]['number'].toString();
    if (currentSection !== lastSectionNumber) {
        nextSectionTitle = getSectionsData['data'][currentSection]['title'];
        nextSectionDescription = getSectionsData['data'][currentSection]['description'];
        const nextSectionContainer = document.createElement('div');
        nextSectionContainer.classList.add('next-section-container');

        let buttonText;
        let nextSectionLink;
        if (lastCheckPointSection < lastSectionNumber) {
            nextSectionContainer.classList.add('next-section-locked');
            buttonText = 'القفز إلى هنا؟';
            nextSectionLink = `/section${currentSection + 1}/test`;
        } else {
            nextSectionContainer.classList.add('next-section-unlocked');
            buttonText = 'المتابعة';
            nextSectionLink = `/section${currentSection + 1}`;
        }
        nextSectionContainer.innerHTML = `
            <h3>التالي</h3>
            <h1>القسم ${currentSection + 1}: ${nextSectionTitle}</h1>
            <h2>${nextSectionDescription}</h2>
            <button id="next-section-btn" onclick="">${buttonText}</button>
        `;
        sectionContainer.appendChild(nextSectionContainer);

        const nextSectionBtn = document.getElementById('next-section-btn');
        nextSectionBtn.onclick = function() {
            window.location.href = nextSectionLink;
        }
    }
});

function roadCurving(unitNumber){
    let directionA;
    let directionB;
    if ((unitNumber / 2) % 1 !== 0) {
        directionA = "left";
        directionB = "right";
    } else {
        directionA = "right";
        directionB = "left";
    }

    const levels = unitRoadMap.querySelectorAll('.level-btn-container');
    const lessonsConterParent = unitRoadMap.querySelectorAll('.lessons-conter-parent');
    const lessonsConter = unitRoadMap.querySelectorAll('.lessons');

    levels.forEach((level, index) => {
        const totalLevelsNumber = levels.length;
        const levelsInThreeCurves = ((totalLevelsNumber - 4) / 3)
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
        } else if (totalLevelsNumber === 8 || totalLevelsNumber === 7) {
            curveOfFive(direction(directionA), round(1));
            if (totalLevelsNumber === 8) {
                lastOne(direction(directionA));
            }
        } else if (totalLevelsNumber === 6 || totalLevelsNumber === 5) {
            curveOfThree(direction(directionA), round(1));
            if (totalLevelsNumber === 6) {
                lastOne(direction(directionA));
            }
        } else if (totalLevelsNumber === 4 || totalLevelsNumber === 3) {
            curveOfOne(direction(directionA), round(1));
            if (totalLevelsNumber === 4) {
                lastOne(direction(directionA));
            }
        } else {
            lessonsConterParent[index].style.setProperty('--left', `150px`);
        }

        function round(round) {
            if (round === 1) {
                return 0;
            } else if (round === 2) {
                return 4;
            } else if (round === 3) {
                return 8;
            }
        }

        function direction(dir) {
            if (dir === 'left') {
                return -1;
            } else {
                return 1;
            }
        }
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
        function curveOfFive(sign, add) {
            if (index === 1 + add) {
                level.style.translate = `${sign * 45}px`;
            } else if (index === 2 + add) {
                level.style.translate = `${sign * 70}px`;
            } else if (index === 3 + add) {
                level.style.translate = `${sign * 82}px`;
            } else if (index === 4 + add) {
                level.style.translate = `${sign * 70}px`;
            } else if (index === 5 + add) {
                level.style.translate = `${sign * 45}px`;
            }
        }

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
        function lastTwo(sign) {
            if (index === totalLevelsNumber - 2) {
                level.style.translate = `${sign * 25}px`;
                lessonsConterParent[index].style.setProperty('--left', `${sign * 25 + 150}px`);
            } else if (index === totalLevelsNumber - 1) {
                lessonsConterParent[index].style.setProperty('--left', `150px`);
            }
        }
        function lastOne(sign) {
            if (index === totalLevelsNumber - 2) {
                level.style.translate = `${sign * 20}px`;
                lessonsConterParent[index].style.setProperty('--left', `${sign * 20 + 150}px`);
            } else if (index === totalLevelsNumber - 1) {
                lessonsConterParent[index].style.setProperty('--left', `150px`);
            }
        }
    /*    if (!(index === 0) && !(index + 1 === levels.length)) {
            if (index + 1 <= levels.length / 3) {
                //console.log('Trnaslate By ' + translateA1)
                consecutive1 = consecutive1 + 1;
                if (translateValue === 0) {
                    translateValue = translateValue + translateA1;
                } else {
                    translateValue = translateValue + translateA2;
                }
                if(consecutive1 === 3){
                    level.style.translate = `${translateValue + translateDeferenceA}px`;
                    lessonsConter[index].style.setProperty('--left', `${translateValue + leftDeferenceA}px` );
                }else{
                    level.style.translate = `${translateValue}px`;
                    lessonsConter[index].style.setProperty('--left', `${translateValue + 150}px` );

                }
            }else if(levels.length / 3 < index + 1 && index + 1 <= levels.length / 1.5){
                consecutive2 = consecutive2 + 1;

                if (translateValue === 0 && index === 1) {
                    translateA = translateA1 * -1;
                    translateA = translateA2 * -1;
                    translateB = translateB1 * -1;
                    translateB = translateB2 * -1;
                    translateDeferenceA = translateDeferenceA * -1;
                    translateDeferenceB = translateDeferenceB * -1;
                }
                if (translateValue === 0) {
                    translateValue = translateValue + translateB1;
                } else {
                    translateValue = translateValue + translateB2;
                }

                if(consecutive2 === 4){
                    level.style.translate = `${translateValue + translateDeferenceB}px`;
                    lessonsConter[index].style.setProperty('--left', `${translateValue + leftDeferenceB}px` );
                }else{
                    level.style.translate = `${translateValue}px`;
                    lessonsConter[index].style.setProperty('--left', `${translateValue + 150}px` );
                }
            }else if(levels.length / 1.5 < index + 1 && index + 1 <= levels.length){
                consecutive3 = consecutive3 + 1;

                let previousLevelSign;
                const previousLevelTranslateValue = translateValue;
                if (translateValue > 0) {
                    previousLevelSign = "Positive"
                } else {
                    previousLevelSign = "Negative"
                }

                if (translateValue === 0) {
                    translateValue = translateValue + translateA1;
                } else {
                    translateValue = translateValue + translateA2;
                }
                //console.log('Unit number ' + unitNumber + ' Translate ' + translateValue)
                if ((translateValue > 0 && translateValue > 35 && index + 2 === levels.length)
                || (translateValue > 0 && translateValue < 35 && index + 2 === levels.length)) {
                    translateValue = 35;
                } else if ((translateValue < 0 && translateValue > -35 && index + 2 === levels.length)
                || (translateValue < 0 && translateValue < -35 && index + 2 === levels.length)) {
                    translateValue = -35;
                }

                if ((translateValue === 0 || translateValue === 35 || translateValue === -35) && index + 2 === levels.length) {
                    translateValue = (translateA1 / 2) * -1;
                }
                if(consecutive3 === 10){
                    level.style.translate = `${translateValue + translateDeferenceA}px`;
                    lessonsConter[index].style.setProperty('--left', `${translateValue + leftDeferenceA}px` );
                }else{
                    level.style.translate = `${translateValue}px`;
                    lessonsConter[index].style.setProperty('--left', `${translateValue + 150}px` );
                }            
            }
        } else {
            lessonsConter[index].style.setProperty('--left', `150px` )
        }*/
    });
}