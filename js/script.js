/* =====================================================
   EXCELLENCE ENGLISH ACADEMY
   GRADE -> UNIT -> LESSON -> VIDEO -> QUIZ ENGINE
   11 GRADES x 8 UNITS x 8 LESSONS
===================================================== */


/* =====================================================
   SETTINGS
===================================================== */

const EXAM_TIME = 15;
const PASS_PERCENTAGE = 70;


/* =====================================================
   PROGRESS (localStorage)
   progress[grade] = { passedLessons: { "u1-l1": true, ... } }
===================================================== */

const Progress = {
    _key: "EEA_progress",

    load() {
        try {
            const raw = localStorage.getItem(this._key);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    },

    save(data) {
        localStorage.setItem(this._key, JSON.stringify(data));
    },

    forGrade(grade) {
        const all = this.load();
        if (!all[grade]) all[grade] = { passedLessons: {} };
        return all[grade];
    },

    markLessonPassed(grade, unitNumb, lessonNumb) {
        const all = this.load();
        if (!all[grade]) all[grade] = { passedLessons: {} };
        all[grade].passedLessons[`u${unitNumb}-l${lessonNumb}`] = true;
        this.save(all);
    },

    isLessonPassed(grade, unitNumb, lessonNumb) {
        const g = this.forGrade(grade);
        return !!g.passedLessons[`u${unitNumb}-l${lessonNumb}`];
    }
};


/* =====================================================
   STATE
===================================================== */

let currentGrade = "";
let currentUnit = null;
let currentLesson = null;

let questions = [];
let questionIndex = 0;
let questionCount = 0;
let userScore = 0;

let timer = null;
let timerLine = null;


/* =====================================================
   GET ELEMENTS
===================================================== */

const gradePage = document.getElementById("gradePage");
const gradeSelect = document.getElementById("gradeSelect");
const startGradeExam = document.getElementById("startGradeExam");

const unitPage = document.getElementById("unitPage");
const unitGrid = document.getElementById("unitGrid");
const unitPageTitle = document.getElementById("unitPageTitle");
const backToGradesFromUnits = document.getElementById("backToGradesFromUnits");

const lessonPage = document.getElementById("lessonPage");
const lessonGrid = document.getElementById("lessonGrid");
const lessonPageTitle = document.getElementById("lessonPageTitle");
const backToUnitsFromLessons = document.getElementById("backToUnitsFromLessons");

const lessonDetailPage = document.getElementById("lessonDetailPage");
const lessonDetailTitle = document.getElementById("lessonDetailTitle");
const lessonVideo = document.getElementById("lessonVideo");
const startLessonQuiz = document.getElementById("startLessonQuiz");
const backToLessonsFromDetail = document.getElementById("backToLessonsFromDetail");

const infoBox = document.querySelector(".info_box");
const quizBox = document.querySelector(".quiz_box");
const resultBox = document.querySelector(".result_box");

const optionList = document.querySelector(".option_list");
const questionText = document.querySelector(".que_text");
const nextButton = document.querySelector(".next_btn");
const totalQuestions = document.querySelector(".total_que");
const timerSeconds = document.querySelector(".timer_sec");
const timerLineElement = document.querySelector(".time_line");
const examGrade = document.getElementById("examGrade");

const resultGrade = document.getElementById("resultGrade");
const scoreText = document.querySelector(".score_text");
const resultStatus = document.getElementById("resultStatus");
const questionNumber = document.getElementById("questionNumber");

const replayExam = document.getElementById("replayExam");
const backToGrades = document.getElementById("backToGrades");
const quitButton = document.querySelector(".info_box .quit");


/* =====================================================
   VIEW HELPERS
===================================================== */

function showPage(page) {
    [gradePage, unitPage, lessonPage, lessonDetailPage].forEach(p => {
        p.style.display = "none";
    });
    page.style.display = "flex";
}


/* =====================================================
   START GRADE -> SHOW UNITS
===================================================== */

startGradeExam.addEventListener("click", function () {

    const selectedGrade = gradeSelect.value;

    if (selectedGrade === "") {
        alert("Please select a grade first.");
        return;
    }

    currentGrade = selectedGrade;

    const gradeData = window.curriculum[currentGrade];

    if (!gradeData) {
        alert("There is no content for Grade " + currentGrade + " yet.");
        return;
    }

    renderUnits(gradeData);
    showPage(unitPage);
});


function renderUnits(gradeData) {

    unitPageTitle.textContent = gradeData.title + " — Units";
    unitGrid.innerHTML = "";

    gradeData.units.forEach((unit, ui) => {

        const unlocked = ui === 0 || isUnitUnlocked(gradeData, ui);
        const allPassed = unit.lessons.every(l => Progress.isLessonPassed(currentGrade, unit.numb, l.numb));

        const card = document.createElement("div");
        card.className = "grade_card unit-card" + (unlocked ? "" : " locked-card");
        card.innerHTML = `
            <div class="grade_card_icon"><i class="fas ${allPassed ? 'fa-check-circle' : 'fa-layer-group'}"></i></div>
            <h2>${unit.title}${allPassed ? ' ✅' : ''}</h2>
            <p class="grade_description">${unlocked ? '8 lessons — tap to open' : 'Locked — finish the previous unit first'}</p>
        `;
        if (unlocked) {
            card.addEventListener("click", () => {
                currentUnit = unit;
                renderLessons(gradeData, unit);
                showPage(lessonPage);
            });
        }
        unitGrid.appendChild(card);
    });
}

function isUnitUnlocked(gradeData, unitIndex) {
    if (unitIndex === 0) return true;
    const prevUnit = gradeData.units[unitIndex - 1];
    return prevUnit.lessons.every(l => Progress.isLessonPassed(currentGrade, prevUnit.numb, l.numb));
}


/* =====================================================
   RENDER LESSONS
===================================================== */

function renderLessons(gradeData, unit) {

    lessonPageTitle.textContent = gradeData.title + " — " + unit.title;
    lessonGrid.innerHTML = "";

    unit.lessons.forEach((lesson, li) => {

        const unlocked = li === 0 || Progress.isLessonPassed(currentGrade, unit.numb, unit.lessons[li - 1].numb);
        const passed = Progress.isLessonPassed(currentGrade, unit.numb, lesson.numb);

        const card = document.createElement("div");
        card.className = "grade_card lesson-card" + (unlocked ? "" : " locked-card");
        card.innerHTML = `
            <div class="grade_card_icon"><i class="fas ${passed ? 'fa-check-circle' : unlocked ? 'fa-play-circle' : 'fa-lock'}"></i></div>
            <h2>${lesson.title}${passed ? ' ✅' : ''}</h2>
            <p class="grade_description">${unlocked ? 'Video + quiz' : 'Locked'}</p>
        `;
        if (unlocked) {
            card.addEventListener("click", () => {
                currentLesson = lesson;
                renderLessonDetail(gradeData, unit, lesson);
                showPage(lessonDetailPage);
            });
        }
        lessonGrid.appendChild(card);
    });
}


/* =====================================================
   LESSON DETAIL (VIDEO + START QUIZ)
===================================================== */

function renderLessonDetail(gradeData, unit, lesson) {
    lessonDetailTitle.textContent = gradeData.title + " · " + unit.title + " · " + lesson.title;
    lessonVideo.querySelector("source").src = lesson.video;
    lessonVideo.load();
}

startLessonQuiz.addEventListener("click", function () {

    questions = currentLesson.questions;

    if (!questions || questions.length === 0) {
        alert("No quiz questions for this lesson yet.");
        return;
    }

    examGrade.textContent = currentGrade + " · " + currentUnit.title + " · " + currentLesson.title;

    infoBox.classList.add("activeInfo");
    document.body.classList.add("modal-active");
});


/* =====================================================
   BACK BUTTONS
===================================================== */

backToGradesFromUnits.addEventListener("click", () => showPage(gradePage));
backToUnitsFromLessons.addEventListener("click", () => {
    renderUnits(window.curriculum[currentGrade]);
    showPage(unitPage);
});
backToLessonsFromDetail.addEventListener("click", () => {
    renderLessons(window.curriculum[currentGrade], currentUnit);
    showPage(lessonPage);
});


/* =====================================================
   CONTINUE (INFO BOX) -> OPEN QUIZ MODAL
===================================================== */

document.getElementById("continueExam").addEventListener("click", function () {

    infoBox.classList.remove("activeInfo");
    quizBox.classList.add("activeQuiz");

    questionIndex = 0;
    userScore = 0;
    questionCount = questions.length;

    showQuestion(questionIndex);
    startTimer(EXAM_TIME);
    startTimerLine();
});


/* =====================================================
   SHOW QUESTION
===================================================== */

function showQuestion(index) {

    const currentQuestion = questions[index];
    if (!currentQuestion) return;

    questionNumber.textContent = "Question " + (index + 1);
    questionText.innerHTML = "<p>" + escapeHTML(currentQuestion.question) + "</p>";

    let optionsHTML = "";
    currentQuestion.options.forEach(option => {
        optionsHTML += '<div class="option">' + escapeHTML(option) + "</div>";
    });
    optionList.innerHTML = optionsHTML;

    totalQuestions.textContent = "Question " + (index + 1) + " of " + questionCount;
    nextButton.classList.remove("show");

    optionList.querySelectorAll(".option").forEach(option => {
        option.addEventListener("click", selectOption);
    });
}


/* =====================================================
   SELECT ANSWER
===================================================== */

function selectOption(event) {

    clearInterval(timer);
    clearInterval(timerLine);

    const selectedOption = event.currentTarget;
    const selectedAnswer = selectedOption.textContent.trim();
    const correctAnswer = String(questions[questionIndex].answer).trim();

    const allOptions = optionList.querySelectorAll(".option");
    allOptions.forEach(option => option.classList.add("disabled"));

    if (selectedAnswer === correctAnswer) {
        userScore++;
        selectedOption.classList.add("correct");
    } else {
        selectedOption.classList.add("incorrect");
        allOptions.forEach(option => {
            if (option.textContent.trim() === correctAnswer) {
                option.classList.add("correct");
            }
        });
    }

    nextButton.classList.add("show");
}


/* =====================================================
   NEXT QUESTION
===================================================== */

nextButton.addEventListener("click", function () {

    if (questionIndex < questionCount - 1) {
        questionIndex++;
        showQuestion(questionIndex);
        startTimer(EXAM_TIME);
        startTimerLine();
    } else {
        showResult();
    }
});


/* =====================================================
   TIMER
===================================================== */

function startTimer(seconds) {

    clearInterval(timer);
    let time = seconds;
    timerSeconds.textContent = time;

    timer = setInterval(function () {
        time--;
        timerSeconds.textContent = time;
        if (time < 0) {
            clearInterval(timer);
            timeOver();
        }
    }, 1000);
}

function timeOver() {

    clearInterval(timer);
    clearInterval(timerLine);

    const allOptions = optionList.querySelectorAll(".option");
    allOptions.forEach(option => option.classList.add("disabled"));

    const correctAnswer = String(questions[questionIndex].answer).trim();
    allOptions.forEach(option => {
        if (option.textContent.trim() === correctAnswer) {
            option.classList.add("correct");
        }
    });

    nextButton.classList.add("show");
}

function startTimerLine() {

    clearInterval(timerLine);
    let width = 100;
    timerLineElement.style.width = "100%";

    timerLine = setInterval(function () {
        width -= 100 / (EXAM_TIME * 10);
        timerLineElement.style.width = width + "%";
        if (width <= 0) clearInterval(timerLine);
    }, 100);
}


/* =====================================================
   SHOW RESULT
===================================================== */

function showResult() {

    clearInterval(timer);
    clearInterval(timerLine);

    quizBox.classList.remove("activeQuiz");
    resultBox.classList.add("activeResult");

    const percentage = Math.round((userScore / questionCount) * 100);

    resultGrade.textContent = currentGrade + " · " + currentUnit.title + " · " + currentLesson.title;

    scoreText.innerHTML =
        "You scored <b>" + userScore + "</b> out of <b>" + questionCount + "</b><br>" +
        "Percentage: <b>" + percentage + "%</b>";

    const passed = percentage >= PASS_PERCENTAGE;

    if (passed) {
        resultStatus.textContent = "🎉 PASS";
        resultStatus.className = "result_status pass";
        Progress.markLessonPassed(currentGrade, currentUnit.numb, currentLesson.numb);
    } else {
        resultStatus.textContent = "❌ FAIL";
        resultStatus.className = "result_status fail";
    }
}


/* =====================================================
   REPLAY
===================================================== */

replayExam.addEventListener("click", function () {

    clearInterval(timer);
    clearInterval(timerLine);

    resultBox.classList.remove("activeResult");
    quizBox.classList.add("activeQuiz");

    questionIndex = 0;
    userScore = 0;

    showQuestion(0);
    startTimer(EXAM_TIME);
    startTimerLine();
});


/* =====================================================
   BACK TO GRADES (FROM RESULT) -> BACK TO LESSON LIST
===================================================== */

backToGrades.addEventListener("click", function () {

    clearInterval(timer);
    clearInterval(timerLine);

    resultBox.classList.remove("activeResult");
    document.body.classList.remove("modal-active");

    questions = [];
    questionIndex = 0;
    questionCount = 0;
    userScore = 0;

    renderLessons(window.curriculum[currentGrade], currentUnit);
    showPage(lessonPage);
});


/* =====================================================
   EXIT INSTRUCTIONS
===================================================== */

quitButton.addEventListener("click", function () {
    infoBox.classList.remove("activeInfo");
    document.body.classList.remove("modal-active");
    questions = [];
});


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(text) {
    const element = document.createElement("div");
    element.textContent = String(text);
    return element.innerHTML;
}


/* =====================================================
   INIT
===================================================== */

showPage(gradePage);

console.log("EEA Grade/Unit/Lesson Exam System loaded successfully.");
console.log("Available grades:", window.curriculum ? Object.keys(window.curriculum) : []);
