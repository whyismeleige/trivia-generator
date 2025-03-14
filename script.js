const amount = document.querySelector('#trivia_amount');
const category = document.querySelector('select[name="trivia_category"]');
const difficulty = document.querySelector('select[name="trivia_difficulty"]')
const type = document.querySelector('select[name="trivia_type"]');
const generate = document.querySelector("#trivia_generate");
const container = document.querySelector("#form-generation");

let trivia;

let title = document.createElement("h2");
title.className = "form-heading";

let questionBox = document.createElement("div");
let optionBox = document.createElement("div");
optionBox.className = "optionBox";

let nextButton = document.createElement("button");
nextButton.innerText = "Next Question";
nextButton.id = "trivia_generate"; 
let titleText;

let questionIndex;
let score;

let options;

const resetElements = () => {
    questionBox.replaceChildren();
    optionBox.replaceChildren();
}

const addBool = () => {
    let trueEl = document.createElement("span");
    let falseEl = document.createElement("span");
    trueEl.innerText = "True";
    falseEl.innerText = "False";

    if(trivia[questionIndex].correct_answer === "True"){
        trueEl.dataset.correct = "true";
        falseEl.dataset.correct = "false";
    }else{
        trueEl.dataset.correct = "false";
        falseEl.dataset.correct = "false";
    }

    trueEl.className = "button";
    falseEl.className = "button";

    trueEl.classList.add("options");
    falseEl.classList.add("options");

    optionBox.classList.add("bool");

    optionBox.append(trueEl);
    optionBox.append(falseEl);
}

const addMultiple = () => {
    let randomIdx = Math.floor(Math.random() * 4);
    let counter = 0;
    let currQuestion = trivia[questionIndex];

    optionBox.classList.remove("bool");

    let rightOption = document.createElement("span");
    rightOption.innerHTML = currQuestion.correct_answer;
    rightOption.dataset.correct = "true";
    rightOption.className = "button";
    rightOption.classList.add("multiple");
    
    let wrongOptionsArr = currQuestion.incorrect_answers;

    wrongOptionsArr.forEach((question) => {
        if(counter === randomIdx) optionBox.append(rightOption);
        let element = document.createElement("span");
        element.innerHTML= question;
        element.dataset.correct = "false";
        counter++;
        element.className = "button";
        element.classList.add("multiple");
        optionBox.append(element);
    });

    if(counter === randomIdx) optionBox.append(rightOption);
}

const showQuestion = () => {
    resetElements();

    let currQuestion = trivia[questionIndex];
    let question = document.createElement("h2");
    question.className = "question";
    question.innerHTML = `Q${questionIndex+1}. ${currQuestion.question}`;
    questionBox.append(question);

    if(currQuestion.type === "multiple") addMultiple();
    else addBool();

    options = document.querySelectorAll(".button");
    options.forEach((option) => {
        option.onclick = () => {
            checkAnswer(option);
        }
    });
}

const checkAnswer = (selectedOption) => {
    options.forEach((option) => {
        if(option.dataset.correct === "true") option.classList.add("correct-option");
        if(option === selectedOption){
            if(option.dataset.correct === "true") score++;
            else{
                option.classList.add("wrong-option");
                score = Math.max(0,score-1);
            }
        }
    })
}

const startQuiz = () => {
    container.replaceChildren();
    title.innerText = titleText;

    container.append(title);
    container.append(questionBox);
    container.append(optionBox);
    container.append(nextButton);

    questionIndex = 0;
    score = 0;
    showQuestion();
}

const getAPI = async () => {
    let amountVal = `amount=${amount.value}`;

    let categoryVal = `&category=${category.value}`;
    let selectedIndex = category.selectedIndex;
    titleText = `${category[selectedIndex].text} Quiz`;
    if(category.value === "any"){
        categoryVal = "";
        titleText = `Random Quiz`;
    }
    let difficultyVal = `&difficulty=${difficulty.value}`;
    if(difficulty.value === "any") difficultyVal = "";

    let typeVal = `&type=${type.value}`;
    if(type.value === "any") typeVal = "";
    
    let API = `https://opentdb.com/api.php?${amountVal}${categoryVal}${difficultyVal}${typeVal}`;
    let response = await fetch(API);
    let data = await response.json();

    trivia = data.results;
    startQuiz();
}

const finalScore = () => {
    resetElements();
    title.innerText = `Final Score`;
    let scoreText = document.createElement("h2");
    scoreText.className = "question";
    scoreText.innerText = `Congratulations your Final Score is ${score} out of ${trivia.length}`
    let nextText = document.createElement("h2");
    nextText.className = "question";
    nextText.innerText = `Would you like play another quiz?`;
    questionBox.append(scoreText);
    questionBox.append(nextText);

    nextButton.innerText = `New Quiz`;
    nextButton.addEventListener("click",() => {
        location.reload();
    })
}

generate.addEventListener("click", () => {
    if(amount.value.trim() === "" || isNaN(amount.value) || amount.value <= 0){
        alert("Please Enter a Valid Number of Questions");
        return;
    }
    getAPI(); 
});

nextButton.addEventListener("click", () => {
    if(questionIndex < trivia.length-1){
        questionIndex++;
        showQuestion();
    }else{
        finalScore();
    }
})
