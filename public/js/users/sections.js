// Selection Sections Container Element
const sectionsContainer = document.querySelector('.sections-container');

// Declaring User Id And Registration Date Constants
const userId = sectionsContainer.getAttribute('user-id');
const userRegDate = sectionsContainer.getAttribute('user-reg-date');

// Declaring Curriculum Version
let curriculumVerion;

document.addEventListener('DOMContentLoaded', async function () {
    // Getting Curriculum Version
    const getCurriculumsLink = `/manage/course/curriculums${userRegDate}/get`;
    const fetchGetCurriculums = await fetch(getCurriculumsLink);
    const curriculumsData = await fetchGetCurriculums.json();
    curriculumVerion = curriculumsData['data'][0]['version'];
    
    // Getting And Loading Sections
    const getSectionsLink = `/manage/course/curriculum${curriculumVerion}/get`;
    const fetchGetSections = await fetch(getSectionsLink)
    const sectionsData = await fetchGetSections.json();
    loadSections(sectionsData['data']);
});

// Load Sections Function
function loadSections(data) {
    // For Every Section
    data.forEach(async ({number}) => {
        // Creating Section Container Element
        const sectionContainer = document.createElement('div');
        sectionContainer.classList.add('section');
        sectionsContainer.appendChild(sectionContainer);

        // Declaring Variables
        let lastCourseCheckPoint;
        let nextLessonSectionNumber;
        let userJourneyCourseDataFromSection = [];
        let nextLessonSectionNumberFromSection;
        let nextLessonUnitNumberFromSection;
        
        // Getting User Course Journey
        const getUserJourneyCourseLink = `/journey/course/${userId}/get`
        const fetchGetUserJourneyCourse = await fetch(getUserJourneyCourseLink);
        const userJourneyCourseData = await fetchGetUserJourneyCourse.json();
        
        // If User Have Course Progress
        if (userJourneyCourseData['data'].length !== 0) {
            // For Every User Course Journey Unit Check Point
            userJourneyCourseData['data'].forEach(unit => {
                // If Unit Section Number Equals This Section Number
                if (unit['sectionNumber'] === number) {
                    // Pushing Unit Check Point
                    userJourneyCourseDataFromSection.push(unit);
                }
            });
            
            // Assigning User Course Last Check Point
            lastCourseCheckPoint = userJourneyCourseData['data'][userJourneyCourseData['data'].length - 1]['checkPoint'].toString();
            
            // Getting User Next Lesson From Last Course Check Point
            const getNextLessonLink = `/manage/course/curriculum${curriculumVerion}/section${lastCourseCheckPoint[0]}/unit${lastCourseCheckPoint[1]}/level${lastCourseCheckPoint[2]}/lesson${lastCourseCheckPoint[3]}/all/getnext`;
            const fetchGetNextLesson = await fetch(getNextLessonLink);
            const nextLessonData = await fetchGetNextLesson.json();
            
            // If Next Lesson Available
            if (nextLessonData['data'].length === 2) {
                // Assigning Next Lesson Section Number
                nextLessonSectionNumber = nextLessonData['data'][1]['sectionNumber'];
            }

            // If User Have Course Progress In This Section
            if (userJourneyCourseDataFromSection.length !== 0) {
                // Assigning User Last Check Point From Section
                lastCourseFromSectionCheckPoint = userJourneyCourseDataFromSection[userJourneyCourseDataFromSection.length - 1]['checkPoint'].toString();
                
                // Getting User Next Lesson From This Section Last Course Check Point
                const getNextLessonFromSectionLink = `/manage/course/curriculum${curriculumVerion}/section${lastCourseFromSectionCheckPoint[0]}/unit${lastCourseFromSectionCheckPoint[1]}/level${lastCourseFromSectionCheckPoint[2]}/lesson${lastCourseFromSectionCheckPoint[3]}/all/getnext`;
                const fetchGetNextLessonFromSection = await fetch(getNextLessonFromSectionLink);
                const nextLessonFromSectionData = await fetchGetNextLessonFromSection.json();
                
                // If Next Lesson Available
                if (nextLessonFromSectionData['data'].length === 2) {
                    // Assigning Next Lesson Section And Unit Number From This Section
                    nextLessonSectionNumberFromSection = nextLessonFromSectionData['data'][1]['sectionNumber'];
                    nextLessonUnitNumberFromSection = nextLessonFromSectionData['data'][1]['unitNumber'];
                }
            }

        // If User Doesn't Have Course Progress
        } else {
            // Assigning Last Course Check Point
            lastCourseCheckPoint = '0000';
        }

        // Getting User Tests Journey
        const getUserJourneyTestsLink = `/journey/test/${userId}/get`
        const fetchGetUserJourneyTests = await fetch(getUserJourneyTestsLink);
        const userJourneyTestseData = await fetchGetUserJourneyTests.json();
        
        // Assigning Test Completed
        // For Every Completed Test
        const testCompleted = userJourneyTestseData['data'].some(test => {
            return test['unitNumber'] === 0 && test['sectionNumber'] === number;
        });

        // Getting Units
        const getUnitsLink = `/manage/course/curriculum${curriculumVerion}/section${number}/get`;
        const fetchGetUnits = await fetch(getUnitsLink);
        const getUnitsData = await fetchGetUnits.json();
        const unitsDataLength = getUnitsData['data'].length;

        // If Section Unlocked
        if (number === 1 || testCompleted || nextLessonSectionNumber >= number) {
            // Declaring Unit Number
            let unitNumber;
            
            // If Next Lesson Section Number From Section Equals This Section Number
            if (nextLessonSectionNumberFromSection === number) {
                // Assigning Unit Number
                unitNumber = nextLessonUnitNumberFromSection;
            
            // If Next Lesson Section Number From Section Equals Next Section To This Section Number
            } else if (nextLessonSectionNumberFromSection === number + 1) {
                // Assigning Unit Number
                unitNumber = unitsDataLength;
            
            // If Else
            } else {
                // If User Doesn't Have Section Progress
                if (userJourneyCourseDataFromSection.length === 0) {
                    // Assigning Unit Number
                    unitNumber = 1;
                
                // If User Have Section Progress
                } else {
                    // Assigning Unit Number
                    unitNumber = parseInt(lastCourseFromSectionCheckPoint[1]) + 1;
                }
            }

            // Adding Section Unlocked Class To Section Contaner
            sectionContainer.classList.add('section-unlocked');
            
            // Assigning Section Container Inner HTML
            sectionContainer.innerHTML = `
                <h1>القسم ${number}</h1>
                <div class="section-progress">
                    <div id="section-progress"></div>
                    <h3>${parseInt(unitNumber - 1)} / ${unitsDataLength}</h3>
                </div>
                <button class="btn">المتابعة</button>
            `

            // Declaring Progress Percent
            const progressPercent = ((unitNumber - 1) / unitsDataLength) * 100;
            
            // If User Have Section Progress
            if (progressPercent !== 0) {
                // Selecting Section Progress Bar
                const sectionProgress = sectionContainer.querySelector('#section-progress');
                
                // Assigning Style To Progress Bar
                sectionProgress.style.background = `
                    linear-gradient(
                        to left,
                        #00c696 0%,
                        #00c696 ${progressPercent}%,
                        #008c6a ${progressPercent}%,
                        #008c6a 100%
                    )`;
            }

            // Section Button Event Listener
            const sectionbtn = sectionContainer.querySelector('button');
            sectionbtn.onclick = function() {
                window.location.href = `/section${number}`;
            }

        // If Section Locked
        } else {
            // Declaring Units Total Number
            let unitsTotalNumber;

            // If For Every Case
            if (unitsDataLength === 1) {
                unitsTotalNumber = `وحدة واحدة`;
            } else if (unitsDataLength === 2) {
                unitsTotalNumber = `وحدتين`;
            } else if (unitsDataLength >= 3 && unitsDataLength <= 10) {
                unitsTotalNumber = `وحدات ${unitsDataLength}`;
            } else {
                unitsTotalNumber = `وحدة ${unitsDataLength}`;
            }

            // Adding Section Locked Class To Section Contaner
            sectionContainer.classList.add('section-locked');
            
            // Assigning Section Container Inner HTML
            sectionContainer.innerHTML = `
                <h1>القسم ${number}</h1>
                <h3>${unitsTotalNumber}</h3>
                <button class="btn">القفز إلى هنا؟</button>
            `

            // Section Button Event Listener
            const sectionbtn = sectionContainer.querySelector('button');
            sectionbtn.onclick = function() {
                window.location.href = `/section${number}/test`;
            }
        }
    });
}