const requestedLink = window.location.href.toString().split(window.location.host)[1]

document.addEventListener('DOMContentLoaded', async function () {
    const fetchGetContentLink = "/manage" + requestedLink + "/get";

    await fetch('/words/getAll')
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
});

let currentContent = 0;
let progress = 0;
let progressLength;
let content = [];
let words = [];
const contentContainerEl = document.querySelector('.content-container');

async function loadContent(contentIndex){
    console.log('Starting loading content');
    console.log(content.length);
    let correctAnswer;
    if (progress === 0) {
        correctAnswer = content[0]['content'];
        const contentEl = content[0]['contentHtml'];
        contentContainerEl.appendChild(contentEl);
        content[0]['choicesHtml']
        .map(a => ({ value: a, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(a => a.value)
        .forEach((choiceHtml) => {
            contentEl.childNodes[3].appendChild(choiceHtml);
        });
    }else if(progress < progressLength){
        const answerEl = content[contentIndex]['contentHtml'].childNodes[2];
        if (answerEl.innerHTML !== "") {
            const answerBtns = content[contentIndex]['contentHtml'].childNodes[2].childNodes
            answerBtns.forEach(btn => {
                const choiceId = btn.getAttribute('data-id');
                const choiceContainerEl = content[contentIndex]['contentHtml'].childNodes[3].querySelector(`#${choiceId}`);
                const choicePlaceHolderEl = choiceContainerEl.querySelector('.choice-placeholder')
                const choiceHtmlIndex = content[contentIndex]['choicesHtml'].indexOf(choiceContainerEl);
        
                content[contentIndex]['choicesHtml'][choiceHtmlIndex].appendChild(btn);
                content[contentIndex]['choicesHtml'][choiceHtmlIndex].removeChild(choicePlaceHolderEl);
            });
        }
        
        correctAnswer = content[contentIndex]['content'];
        const previousContentEl = content[contentIndex - 1]['contentHtml'];
        const contentEl = content[contentIndex]['contentHtml'];
        previousContentEl.style.opacity = "0";
        previousContentEl.style.translate = "50px";
        contentEl.style.opacity = "0";
        contentEl.style.translate = "-50px";
        setTimeout(function() {
            contentEl.style.opacity = "1";
            contentEl.style.translate = "0";
          }, 1);
        contentContainerEl.appendChild(contentEl);
        content[contentIndex]['choicesHtml']
        .map(a => ({ value: a, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(a => a.value)
        .forEach((choiceHtml) => {
            contentEl.childNodes[3].appendChild(choiceHtml);
        });
    }

    const checkBtn = document.getElementById('check-btn');
    const actionContainer = document.querySelector('.action-container')
    console.log(answer.length)
    checkBtn.onclick = function(){
        let answerStatus;
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
            continueBtn.onclick = function(){
                console.log("Clicked")
                if (progress < progressLength) {
                    if(correctAnswer === userAnswer){
                        actionContainer.classList.remove('correct');
                    }else{
                        actionContainer.classList.remove('wrong');
                    }
                    actionContainer.innerHTML = `
                        <div class="action">
                            <button class="btn skip-btn">تخطي</button>
                            <button class="btn check-locked-btn"  id="check-btn">تحقق</button>
                        </div>
                    `;
                }else{

                }
                if(correctAnswer === userAnswer){
                    loadContent(currentContent);

                }else{
                    content[currentContent - 1]['answer'] = "wrong";
                    content.push(content[currentContent - 1]);
                    loadContent(currentContent);
                }
                answer = [];
            }
        }
    }

}






async function loadChoices(data){
    let fetchGetChoicesLink;
    let forEach = new Promise((resolve, reject) => {
        data.forEach( async (each, contentIndex, contents) => {
            const contentEl = document.createElement('div');
            contentEl.classList.add('content');
            contentEl.setAttribute('id', `content${contentIndex}`);
            
            const titleEl = document.createElement('h1');
            titleEl.innerHTML = "ما معنى هذه الإشارة؟";
            contentEl.appendChild(titleEl);
    
            const signContainer = document.createElement('div');
            signContainer.classList.add('sign-container');
            contentEl.appendChild(signContainer);
    
            let fileName;
            const fetchGetFileNameLink = "/words/search/" + each['content'];
            const fetchGetFileName = await fetch(fetchGetFileNameLink);
            const getData = await fetchGetFileName.json();
            fileName = getData['data'][0]['file'];
            console.log('Finished geting filename: ' + fileName);
    
            const signEl = document.createElement('img');
            signEl.setAttribute('src', '/words/' + fileName);
            signContainer.appendChild(signEl);

            const fetchGetPreviousContentsLink = `/manage/${each['content']}/${each['position']}/get`;
            const fetchGetPreviousContents = await fetch(fetchGetPreviousContentsLink);
            const getPreviousContents = await fetchGetPreviousContents.json();

            if (getPreviousContents['data'].length === 0) {
                const subTitles = each['content'];
                const subTitlesEl = document.createElement('a');
                subTitlesEl.classList.add('sub-titles');
                subTitlesEl.innerHTML = subTitles;
                signContainer.appendChild(subTitlesEl);
            }
    
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
    
            for(i = 0; i < 3; i++){
                if(i === 0){
                    choiceId = i + 1;
                }else{
                    choiceId = choiceId + 1;
                }
                const correctAnswer = each['content'];
                let choice;
                if(i === 0){
                    choice = correctAnswer;
                }else{
                    choice = words[i - 1];
                }
        
                if(choice.includes(' ')){
                    const multiChoice = choice.split(' ');
                    multiChoice.forEach((choice, index) => {
                        choiceId = choiceId + index;
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
    
            if (each['type'] === 'word') {
                fetchGetChoicesLink = "/words/getAll"
            }
            if (!progressLength) {
                progressLength = 1;
            }else{
                progressLength = progressLength + 1;
            }
    
            dataWithChoices = each;
            console.log(each);
            dataWithChoices['choices'] = choices;
            dataWithChoices['choicesHtml'] = choicesHtml;
            dataWithChoices['contentHtml'] = contentEl;
            content.push(dataWithChoices);
            console.log(content);
            console.log('Finished loading choices');
            
            if (contentIndex === contents.length -1) resolve();
        });
    });
    forEach.then(() => {
        console.log('Next')
        loadContent();
    })
}

let answer = [];
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
        answerEl.appendChild(btn);
        answer.push(btn.innerHTML);
        checkBtnStatus();
    }else{
        const choiceContainerEl = content[contentIndex]['contentHtml'].childNodes[3].querySelector(`#${choiceId}`);
        const choicePlaceHolderEl = choiceContainerEl.querySelector('.choice-placeholder')
        const choiceHtmlIndex = content[contentIndex]['choicesHtml'].indexOf(choiceContainerEl);
        const answerIndex = answer.indexOf(btn.innerHTML);

        content[contentIndex]['choicesHtml'][choiceHtmlIndex].appendChild(btn);
        content[contentIndex]['choicesHtml'][choiceHtmlIndex].removeChild(choicePlaceHolderEl);
        answer.splice(answerIndex, 1);
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