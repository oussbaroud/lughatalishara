let currentSection;
let currentUnit;
let currentLevel;
let currentLesson;
let lastCheckPoint;
let sectionTitle;
let units = [];
let getUnitsLink;
let unitRoadMap;
let userJourneySection = [];
const sectionContainer = document.querySelector('.section-container');
const userId = sectionContainer.getAttribute('user-id');
const requestedLink = window.location.href.toString().split(window.location.host)[1]
const getUserJourneyLink = `/manage/user${userId}/journey/get`

async function getUserJourney(){
    await fetch(getUserJourneyLink)
    .then(response => response.json())
    .then(data => {
        const dataLength = data['data'].length;
        if (!currentSection) {
            if (dataLength !== 0) {
                currentSection = data['data'][dataLength - 1]['sectionId'];
                currentUnit = data['data'][dataLength - 1]['unitId'];
                currentLevel = data['data'][dataLength - 1]['levelId'];
                currentLesson = data['data'][dataLength - 1]['lessonId'];
                lastCheckPoint = "" + currentSection + currentUnit + currentLevel + currentLesson;
            } else {
                currentSection = 1;
                lastCheckPoint = "1000";
            }
        } else {
            if (dataLength !== 0) {
                data['data'].forEach(section => {
                    if (section['sectionId'] === currentSection) {
                        userJourneySection.push(section);
                    } else {
                        if (userJourneySection.length === 0) {
                            lastCheckPoint = "" + currentSection + "000";
                        } else {
                            if (userJourneySection.length === 1) {
                                currentUnit = userJourneySection[0]['unitId'];
                                currentLevel = userJourneySection[0]['levelId'];
                                currentLesson = userJourneySection[0]['lessonId'];
                                lastCheckPoint = "" + currentSection + currentUnit + currentLevel + currentLesson;
                            } else {
                                currentUnit = userJourneySection[-1]['unitId'];
                                currentLevel = userJourneySection[-1]['levelId'];
                                currentLesson = userJourneySection[-1]['lessonId'];
                                lastCheckPoint = "" + currentSection + currentUnit + currentLevel + currentLesson;
                            }
                        }
                    }
                });
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', async function () {
    if(requestedLink === '/learn'){
        await getUserJourney();
        getUnitsLink = `/manage/section${currentSection}/get`;
    }else{
        currentSection = requestedLink.replace(/^\D+/g, '');
        await getUserJourney();
        getUnitsLink = "/manage" + requestedLink + "/get";
    }

    await fetch("/manage/sections/get")
    .then(response => response.json())
    .then(data => {
        const sectionHead = document.createElement('div');
        sectionHead.classList.add('section-head');
        sectionTitle = data['data'][currentSection - 1]['title'];
        sectionHead.innerHTML = `
            <i class="fa-solid fa-arrow-right"></i>
            <h2>الباب ${currentSection}: ${sectionTitle}</h2>
        `;
        sectionContainer.appendChild(sectionHead);
    });

    await fetch(getUnitsLink)
    .then(response => response.json())
    .then(async data => {
        data['data'].forEach(async (unit, index) => {
            const unitContainer = document.createElement('div')
            unitContainer.classList.add('unit-container');
            sectionContainer.appendChild(unitContainer);

            const unitNumber = index + 1;
            const unitTitle = unit['title'];
            const unitHead = document.createElement('div');
            unitHead.classList.add('unit-head');
            unitHead.innerHTML = `
                <h2>الوحدة ${unitNumber}</h2>
                <p>${unitTitle}</p>
            `;
            unitContainer.appendChild(unitHead);

            unitRoadMap = document.createElement('div');
            unitRoadMap.classList.add('unit-road-map');
            unitContainer.appendChild(unitRoadMap);
            //unitContainer.setAttribute('onclick', `hideLessonsConter(element);`);

            const getLevelsLink = getUnitsLink.replace('get', '') + `unit${unitNumber}/get`;
            await fetch(getLevelsLink)
            .then(response => response.json())
            .then(async data => {
                data['data'].forEach(async (level, index) => {
                    const levelNumber = index + 1;
                    let thisCheckPoint = "" + currentSection + unitNumber + levelNumber;
                    const levelContainer = document.createElement('div');
                    levelContainer.classList.add('level-container');
                    unitRoadMap.appendChild(levelContainer);

                    const progress = document.createElement('div');
                    levelContainer.appendChild(progress);

                    const levelBtn = document.createElement('button');
                    levelBtn.classList.add('level');
                    levelBtn.setAttribute('onclick', `this.parentNode.parentNode.querySelector('.lessons').classList.add('open-popup')`);
                    if (parseInt(lastCheckPoint.slice(0, -1)) > parseInt(thisCheckPoint)) {
                        levelBtn.classList.add('unlocked');
                    } else if (lastCheckPoint === currentSection + "000" && levelNumber === 1) {
                        levelBtn.classList.add('unlocked');
                    } else if (parseInt(lastCheckPoint.slice(0, -1)) === parseInt(thisCheckPoint)) {
                        levelBtn.classList.add('unlocked');
                    } else {
                        levelBtn.classList.add('locked');
                    }
                    progress.appendChild(levelBtn);

                    const lessonsConter = document.createElement('div');
                    lessonsConter.classList.add('lessons');
                    if (parseInt(lastCheckPoint.slice(0, -1)) > parseInt(thisCheckPoint)) {
                        lessonsConter.classList.add('lesson-unlocked');
                    }else if (lastCheckPoint === currentSection + "000" && levelNumber === 1){
                        lessonsConter.classList.add('lesson-unlocked');
                    } else if (parseInt(lastCheckPoint.slice(0, -1)) === parseInt(thisCheckPoint)) {
                        lessonsConter.classList.add('lesson-unlocked');
                    } else {
                        lessonsConter.classList.add('lesson-locked');
                    }
                    levelContainer.appendChild(lessonsConter);


                    /*levelBtn.addEventListener('click', function(){
                        lessonsConter.classList.add('open-popup');

                    });*/
                    ['click', 'scroll'].forEach(event => {
                        document.addEventListener(event, function(el) {
                            const target = el.target;
                            if (!(target === levelBtn) || !(levelBtn.contains(target))) {
                                lessonsConter.classList.remove('open-popup');
                            }
                        });
                    });

                    const getLessonsLink = getLevelsLink.replace('get', '') + `level${levelNumber}/get`;
                    await fetch(getLessonsLink)
                    .then(response => response.json())
                    .then(data => {
                        if (data['data'].length === 0) {
                            progress.classList.add('no-progress');
                            levelBtn.innerHTML = `<i class="fa-solid fa-star"></i>`;
                            lessonsConter.innerHTML = `
                                <h2>لا يوجد عنوان</h2>
                                <p>أكمل جميع المستويات أعلاه لفتح هذا المستوى</p>
                                <button class="locked-btn">مقفل</button>
                            `;
                        } else {
                            data['data'].every((lesson, index) => {
                                const lessonNumber = index + 1;
                                const progressLength = data['data'].length;
                                if (index === 0) {
                                    thisCheckPoint = thisCheckPoint + lessonNumber;
                                } else {
                                    thisCheckPoint = thisCheckPoint.slice(0, -1) + lessonNumber;
                                }
    
                                function btnOnClick(){
                                    const startLessonBtn = lessonsConter.querySelector('button');
                                    const startLessonLink = getLessonsLink.replace('/manage', '').replace('get', '') +`lesson${lessonNumber}`;
                                    startLessonBtn.onclick = function(){
                                        window.location.href = startLessonLink;
                                    }
                                }
    
                                if (parseInt(lastCheckPoint) > parseInt(thisCheckPoint)) {
                                    progress.classList.add('no-progress');
                                    levelBtn.innerHTML = `<i class="fa-solid fa-check"></i>`;
                                    lessonsConter.innerHTML = `
                                        <h2>${data['data'][-1]['title']}</h2>
                                        <p>تمرن من جديد لإنعاش ذاكرتك</p>
                                        <button class="start-lesson-btn">تمرن</button>
                                    `;
                                    btnOnClick();
                                    return false;
                                }else if (lastCheckPoint === currentSection + "000" && levelNumber === 1){
                                    progress.classList.add('no-progress');
                                    levelBtn.innerHTML = `<i class="fa-solid fa-star"></i>`;
                                    lessonsConter.innerHTML = `
                                        <h2>${data['data'][0]['title']}</h2>
                                        <p>درس 1 من 4</p>
                                        <button class="start-lesson-btn">إبدأ</button>
                                    `;
                                    btnOnClick();
                                    return false;
                                }else if (parseInt(lastCheckPoint) === parseInt(thisCheckPoint)) {
                                    const progressPercent = ((lessonNumber - 1) / progressLength) * 100;
                                    progress.classList.add('progress');
                                    levelBtn.innerHTML = `<i class="fa-solid fa-star"></i>`;
                                    lessonsConter.innerHTML = `
                                        <h2>${data['data'][lessonNumber + 1]['title']}</h2>
                                        <p>درس ${lessonNumber} من 4</p>
                                        <button id="start-lesson-btn" onclick="">إبدأ</button>
                                    `;
                                    progress.style.background = `conic-gradient(from 0deg, #58cc02 0%, #58cc02 0% ${progressPercent}%, #e5e5e5 ${progressPercent}%, #e5e5e5 100%)`;
                                    btnOnClick();
                                    return false;
                                }else {
                                    progress.classList.add('no-progress');
                                    levelBtn.innerHTML = `<i class="fa-solid fa-star"></i>`;
                                    lessonsConter.innerHTML = `
                                        <h2>${data['data'][0]['title']}</h2>
                                        <p>أكمل جميع المستويات أعلاه لفتح هذا المستوى</p>
                                        <button class="locked-btn">مقفل</button>
                                    `;
                                    return false;
                                }
                            });
                        }
                    });
                    console.log('Done')


                });
            });

            const unitWithHtml = unit;
            unitWithHtml['html'] = unitContainer;
            units.push(unitWithHtml);
            roadCurving();
            console.log('Starting')

        });

    });
    

});

function roadCurving(){
    let translateValue = 0;
    let consecutive1 = 0;
    let consecutive2 = 0;
    let consecutive3 = 0;
    const levels = unitRoadMap.querySelectorAll('.level');
    const lessonsConter = unitRoadMap.querySelectorAll('.lessons');
    levels.forEach((level, index) => {
        if (!(index === 0) && !(index + 1 === levels.length)) {
            if (index + 1 <= levels.length / 3) {
                consecutive1 = consecutive1 + 1;
                translateValue = translateValue - 30;
                if(consecutive1 === 3){
                    level.style.translate = `${translateValue + 15}px`;
                    lessonsConter[index].style.setProperty('--left', `${translateValue + 165}px` );
                }else{
                    level.style.translate = `${translateValue}px`;
                    lessonsConter[index].style.setProperty('--left', `${translateValue + 150}px` );

                }
            }else if(levels.length / 3 < index + 1 && index + 1 <= levels.length / 1.5){
                consecutive2 = consecutive2 + 1;
                translateValue = translateValue + 30;
                if(consecutive2 === 4){
                    level.style.translate = `${translateValue - 15}px`;
                    lessonsConter[index].style.setProperty('--left', `${translateValue + 135}px` );
                }else{
                    level.style.translate = `${translateValue}px`;
                    lessonsConter[index].style.setProperty('--left', `${translateValue + 150}px` );
                }
            }else if(levels.length / 1.5 < index + 1 && index + 1 <= levels.length){
                consecutive3 = consecutive3 + 1;
                translateValue = translateValue - 30;
                if(consecutive3 === 3){
                    level.style.translate = `${translateValue + 15}px`;
                    lessonsConter[index].style.setProperty('--left', `${translateValue + 165}px` );
                }else{
                    level.style.translate = `${translateValue}px`;
                    lessonsConter[index].style.setProperty('--left', `${translateValue + 150}px` );
                }            
            }
        } else {
            lessonsConter[index].style.setProperty('--left', `150px` )
        }
    });
}

function hideLessonsConter(element) {
    const target = element.target;
    if (!(target.tagName == 'DIV')) {
        lessonsConter.classList.remove('open-popup');
    }
}