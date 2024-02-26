const sectionsContainer = document.querySelector('.sections-container');
const userId = sectionsContainer.getAttribute('user-id');

document.addEventListener('DOMContentLoaded', function () {
    const getSectionsLink = '/manage/course/sections/get';

    fetch(getSectionsLink)
    .then(response => response.json())
    .then(data => loadSections(data['data']));
});

function loadSections(data) {
    data.forEach(async ({number}) => {
        const sectionContainer = document.createElement('div');
        sectionContainer.classList.add('section');
        sectionsContainer.appendChild(sectionContainer);

        let lastCourseCheckPoint;
        let nextLessonSectionNumber;
        let userJourneyCourseDataFromSection = [];
        let nextLessonSectionNumberFromSection;
        let nextLessonUnitNumberFromSection;
        const getUserJourneyCourseLink = `/journey/course/${userId}/get`
        const fetchGetUserJourneyCourse = await fetch(getUserJourneyCourseLink);
        const userJourneyCourseData = await fetchGetUserJourneyCourse.json();
        if (userJourneyCourseData['data'].length !== 0) {
            userJourneyCourseData['data'].forEach(unit => {
                if (unit['sectionNumber'] === number) {
                    userJourneyCourseDataFromSection.push(unit);
                }
            });
            
            lastCourseCheckPoint = userJourneyCourseData['data'][userJourneyCourseData['data'].length - 1]['checkPoint'].toString();
            const getNextLessonLink = `/manage/course/section${lastCourseCheckPoint[0]}/unit${lastCourseCheckPoint[1]}/level${lastCourseCheckPoint[2]}/lesson${lastCourseCheckPoint[3]}/all/getnext`;
            const fetchGetNextLesson = await fetch(getNextLessonLink);
            const nextLessonData = await fetchGetNextLesson.json();
            if (nextLessonData['data'].length === 2) {
                nextLessonSectionNumber = nextLessonData['data'][1]['sectionNumber'];
            }

            if (userJourneyCourseDataFromSection.length !== 0) {
                lastCourseFromSectionCheckPoint = userJourneyCourseDataFromSection[userJourneyCourseDataFromSection.length - 1]['checkPoint'].toString();
                const getNextLessonFromSectionLink = `/manage/course/section${lastCourseFromSectionCheckPoint[0]}/unit${lastCourseFromSectionCheckPoint[1]}/level${lastCourseFromSectionCheckPoint[2]}/lesson${lastCourseFromSectionCheckPoint[3]}/all/getnext`;
                const fetchGetNextLessonFromSection = await fetch(getNextLessonFromSectionLink);
                const nextLessonFromSectionData = await fetchGetNextLessonFromSection.json();
                if (nextLessonFromSectionData['data'].length === 2) {
                    nextLessonSectionNumberFromSection = nextLessonFromSectionData['data'][1]['sectionNumber'];
                    nextLessonUnitNumberFromSection = nextLessonFromSectionData['data'][1]['unitNumber'];
                }
            }
        } else {
            lastCourseCheckPoint = '0000';
        }

        const getUserJourneyTestsLink = `/journey/test/${userId}/get`
        const fetchGetUserJourneyTests = await fetch(getUserJourneyTestsLink);
        const userJourneyTestseData = await fetchGetUserJourneyTests.json();
        const testCompleted = userJourneyTestseData['data'].some(test => {
            return test['unitNumber'] === 0 && test['sectionNumber'] === number;
        });

        const getUnitsLink = `/manage/course/section${number}/get`;
        const fetchGetUnits = await fetch(getUnitsLink);
        const getUnitsData = await fetchGetUnits.json();
        const unitsDataLength = getUnitsData['data'].length;

        // If else section unlocked
        if (number === 1 || testCompleted || nextLessonSectionNumber >= number) {
            let unitNumber
            if (nextLessonSectionNumberFromSection === number) {
                unitNumber = nextLessonUnitNumberFromSection;
            } else if (nextLessonSectionNumberFromSection === number + 1) {
                unitNumber = unitsDataLength;
            } else {
                if (userJourneyCourseDataFromSection.length === 0) {
                    unitNumber = 1;
                } else {
                    unitNumber = parseInt(lastCourseFromSectionCheckPoint[1]) + 1;
                }
            }

            sectionContainer.classList.add('section-unlocked');
            sectionContainer.innerHTML = `
                <h1>القسم ${number}</h1>
                <div class="section-progress">
                    <div id="section-progress"></div>
                    <h3>${parseInt(unitNumber - 1)} / ${unitsDataLength}</h3>
                </div>
                <button>المتابعة</button>
            `

            const progressPercent = ((unitNumber - 1) / unitsDataLength) * 100;
            console.log(1 / unitsDataLength)
            if (progressPercent !== 0) {
                const sectionProgress = sectionContainer.querySelector('#section-progress');
                sectionProgress.style.background = `
                    linear-gradient(
                        to left,
                        #00c696 0%,
                        #00c696 ${progressPercent}%,
                        #008c6a ${progressPercent}%,
                        #008c6a 100%
                    )`;
            }

            const sectionbtn = sectionContainer.querySelector('button');
            sectionbtn.onclick = function() {
                window.location.href = `/section${number}`;
            }
        } else {
            let unitsTotalNumber;
            if (unitsDataLength === 1) {
                unitsTotalNumber = `وحدة واحدة`;
            } else if (unitsDataLength === 2) {
                unitsTotalNumber = `وحدتين`;
            } else if (unitsDataLength >= 3 && unitsDataLength <= 10) {
                unitsTotalNumber = `وحدات ${unitsDataLength}`;
            } else {
                unitsTotalNumber = `وحدة ${unitsDataLength}`;
            }
            sectionContainer.classList.add('section-locked');
            sectionContainer.innerHTML = `
                <h1>القسم ${number}</h1>
                <h3>${unitsTotalNumber}</h3>
                <button>القفز إلى هنا؟</button>
            `

            const sectionbtn = sectionContainer.querySelector('button');
            sectionbtn.onclick = function() {
                window.location.href = `/section${number}/test`;
            }
        }
    });
}