let arr = [];
let questionsAnswered = 0;
let currentTab;
let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "X", "Y", "W", "Z"];
let isSubmit = false;

window.onload=function (){
    // let url = "json/GeographyQuiz.json";
    // Part 4
    let url = "json/deAndradePart4.json";
    //let url = "json/test2.json";
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
        {
            loadHtml(xhr.responseText);
            loadMenu();
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
}

function loadHtml(content){
    let title = JSON.parse(content).title;
    document.querySelector("#title").innerHTML = title;
    loadObject(content);

    if(title === "The Office Quiz")
        document.querySelector("#logo").innerHTML = "<img src='images/logo.jpg'>";

    loadQuestion();

    let submit = "<a id='btnSubmit' class='btn btn-primary disabled'>Submit</a>";
    document.querySelector("#submit").innerHTML = submit;
}

function loadObject(content)
{
    let temp = JSON.parse(content).questions;
    let id = 1;

    temp.forEach(e => {
        arr.push({
            id: id++,
            question: e.questionText,
            answers: e.choices,
            correct: e.answer,
            choice: null
        });
    });
}

function loadMenu()
{
    let tab = "<div class='row p-3 py-5'>";

    for(let i = 0; i < arr.length; i++)
    {
        tab += "<div class='col-3 p-2 text-center'>";
        tab += "<div id='tab" + i + "' class='tab'>Question " + (i + 1) + "</div>";
        tab += "</div>";
    }
    
    tab += "</div>";

    document.querySelector("#menu").innerHTML = tab;
    document.querySelector("#tab0").classList.add("tabSelected");
    currentTab = 0;

    // the eventListener should by load only after creation of html
    for(let i = 0; i < arr.length; i++)
        document.querySelector("#tab"+i).addEventListener("click", e => changeTab(i));
}

function changeTab(id)
{
    let previousTab = currentTab;
    currentTab = id;

    // previousTab
    document.querySelector("#tab"+ previousTab).classList.remove("tabSelected");
    document.querySelector("#q"+ previousTab).classList.add("displayQuestion");

    // currentTab
    document.querySelector("#tab"+ id).classList.add("tabSelected");
    document.querySelector("#q"+ id).classList.remove("displayQuestion");
}

function loadQuestion()
{
    let q = "<div>";

    for(let i = 0; i < arr.length; i++)
    {
        q += "<div id='q" + i + "' class='" + (i !== 0 ? "displayQuestion" : "") + " question'>";
        q += "<div class='p-5 fw-bolder text-white text-center questionTitle'>" + arr[i].question + "</div>";
        q += "<div class='p-5'>";
    
        for(let j = 0; j < arr[i].answers.length; j++)
        {
            q += "<div class='row p-2'>"
            q += "<div id='answer-" + i + "-" + j + "' class='py-3 row rounded-pill answer active'>";
            q += "<input type='radio' id='rad-" + i + "-" + j + "' name='answers" + i + "' value='" + i + "-" + j + "'> ";
            q += "<div class='col-1 py-2 text-center'><div class='badgeAnswer'>" + letters[j] + "</div></div>";
            q += "<div class='col-10 py-2'>" + arr[i].answers[j] + "</div>";
            q += "<div id='icon-" + i + "-" + j + "' class='col-1 px-0 icon'></div>";
            q += "</div></div>";
        }

        q += "</div></div>";
    }

    q += "</div>";

    document.querySelector("#output").innerHTML = q;

    // the eventListener should by load only after creation of html
    for(let i = 0; i < arr.length; i++)
    {
        for(let j = 0; j < arr[i].answers.length; j++)
        {
            document.querySelector("#answer-" + i + "-" + j).addEventListener("click", e => recordAnswer(i, j));
        }
    }
}

function recordAnswer(i, j)
{
    if(!isSubmit)
    {
        document.querySelector("#rad-"+i+"-"+j).checked = true;
        if(arr[i].choice === null)
            questionsAnswered++;
        else
            document.querySelector("#answer-" + i + "-" + arr[i].choice).classList.remove("answerSelected");
    
        arr[i].choice = j;
        document.querySelector("#answer-" + i + "-" + j).classList.add("answerSelected");
    
        let isDisabled = document.querySelector("#btnSubmit").classList.contains("disabled");
        if(quizComplete() && isDisabled)
            enableSubmit();
    }
}

function quizComplete()
{
    let res = false;
    if(arr.length === questionsAnswered)
        res = true;

    return res;
}

function enableSubmit()
{
    let s = document.querySelector("#btnSubmit");
    s.classList.remove("disabled");
    s.addEventListener("click", e => submitQuiz());
}

function submitQuiz(){
    let s = document.querySelector("#btnSubmit");
    s.classList.add("disabled");
    isSubmit = true;

    disableAnswers();
    fillChoices();
    showResult();
}

function disableAnswers()
{
    let rad = document.querySelectorAll("input[type='radio']");

    for(let i = 0; i < rad.length; i++)
    {
        rad[i].disabled = true;
        document.querySelector("#answer-" + rad[i].value).classList.remove("active");
        document.querySelector("#answer-" + rad[i].value).classList.add("inactive");
    }
}

function fillChoices()
{
    for(let i = 0; i < arr.length; i++)
    {
        if(arr[i].correct === arr[i].choice)
        {
            document.querySelector("#answer-" + i + "-" + arr[i].choice).classList.add("correct");
            document.querySelector("#icon-" + i + "-" + arr[i].choice).innerHTML = "&#x2713;";
        }
        else
        {
            document.querySelector("#answer-" + i + "-" + arr[i].correct).classList.add("correct");
            document.querySelector("#answer-" + i + "-" + arr[i].choice).classList.add("wrong");
            document.querySelector("#icon-" + i + "-" + arr[i].choice).innerHTML = "&#x2717;";
        }
    }
}

function showResult()
{
    let count = 0;
    for(let i = 0; i < arr.length; i++)
    {
        if(arr[i].correct === arr[i].choice)
            count++;
    }
    let mark = Math.round((count / arr.length) * 100);

    let r = "<div class='py-5'>";
    r += "<div class='row py-4 px-3'>";
    r += "<div class='text-center'>Your score is</div>";
    r += "<div class='text-center fs-1'>"+ mark +"%</div>";
    r += "<div class='text-center'>"+ count +" of "+ arr.length +"</div>";
    r += "</div>";

    r += "<div class='row border rounded-3'>";
    r += "<div class='col-1 py-3 border text-center fw-bolder'>#</div>";
    r += "<div class='col-6 py-3 border fw-bolder'>Question</div>";
    r += "<div class='col-2 py-3 border fw-bolder'>Correct Answer</div>";
    r += "<div class='col-2 py-3 border fw-bolder'>Your Answer</div>";
    r += "<div class='col-1 py-3 border text-center fw-bolder'>Score</div>";

    for(let i = 0; i < arr.length; i++)
    {
        let icon = (arr[i].choice === arr[i].correct ? 1 : 0);
        let incorrect = (arr[i].choice === arr[i].correct ? "" : "incorrect");

        r+= "<div class='py-3 border col-1 text-center "+ incorrect +"'>"+ arr[i].id +"</div>";
        r+= "<div class='py-3 border col-6 "+ incorrect +"'>"+ arr[i].question +"</div>";
        r+= "<div class='py-3 border col-2 "+ incorrect +"'>"+ arr[i].answers[arr[i].correct] +"</div>";
        r+= "<div class='py-3 border col-2 "+ incorrect +"'>"+ arr[i].answers[arr[i].choice] +"</div>";
        r+= "<div class='py-3 border col-1 text-center "+ incorrect +"'>"+ icon +"</div>";
    }

    r += "</div></div>";

    document.querySelector("#result").innerHTML = r;
}