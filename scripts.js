// Global Variables

var correct = true
var isPlaying = false
var timeVar = 0.9
var timeVarB = 0.9 //timeVar ke liye buffer
var score = 0
var startTime
var gamesCounter = 0


// DOM Sectiion initialization
const timer = document.getElementById('timer')
const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const scoreDisplay = document.querySelector("#score")
const startGameBtn = document.querySelector("#startGameBtn")
const stopGameBtn = document.querySelector("#stopGameBtn")
const chooseLevel = document.querySelector("#chooseLevel")
const yourScoresModal = document.querySelector("#yourScoresModal")
const yourScoresTbody = document.querySelector("#yourScoresTbody")
const bestScoreModal = document.querySelector("#bestScoreModal")
const bestscore = document.querySelector("#bestScore")
const bestscoreEm = document.querySelector("#bestscoreEm")
const bestScoreModalBody = document.querySelector("#bestScoreModalBody")


/*----------------Sound Effect section----------------------------*/
var clockSound1 = document.getElementById('clockSound1')
var clockSound2 = document.getElementById('clockSound2')
var gameOverSound = document.getElementById('gameOverSound')



// Event Listner section That listens if any change or click is pressed or executed
startGameBtn.addEventListener("click", startGame)
stopGameBtn.addEventListener("click", stopGame)
chooseLevel.addEventListener("change", changeLevel)
quoteInputElement.addEventListener('input', input)



/*------------------- Local session values---------------------*/
//settig bestScore
bestscore.innerHTML = localStorage.getItem("bestScore") || 0;
chooseLevel.value = localStorage.getItem('defaultLevel') || 'easy';

// function to initialize game Everytime user Starts the game
function init() {
    isPlaying = true
    timeVar = timeVarB
    score = 0;
    scoreDisplay.innerHTML = 0;
    document.getElementById('quoteInput').focus()
}


/*----------------Event listner Function section----------------------------*/

// Function that listens to start game button 
function startGame() {
    if (!isPlaying) {
        init();
        startGameBtn.classList.add("d-none");
        stopGameBtn.classList.remove("d-none");
        chooseLevel.disabled = true;
        // playAudio(startingSound);
        renderNewQuote();
    } else {

    }
}

//function that listens to input section
function input() {
    const arrayQuote = quoteDisplayElement.querySelectorAll('span')
    const arrayValue = quoteInputElement.value.split('')
    const update = check(arrayQuote, arrayValue)
    if (update) {
        score += 5
        renderNewQuote()
    }
}

//function that listens to chnage in levels value
function changeLevel() {
    if (chooseLevel.value == 'easy') timeVarB = 0.9
    else if (chooseLevel.value == 'medium') timeVarB = 0.776
    else if (chooseLevel.value == 'hard') timeVarB = 0.6
    localStorage.setItem('defaultLevel', chooseLevel.value);
}

//Function to stop game
function stopGame() {
    if (isPlaying) {
        gamesCounter++;
        stopGameBtn.classList.add("d-none");
        startGameBtn.classList.remove("d-none");
        chooseLevel.disabled = false;
        isPlaying = false;
        //Register score in local storage if is the best
        if (score > localStorage.getItem("bestScore")) {
            newBestScore();
        }
        addNewScore(score)
    }
}



/*----------------Controller section----------------------------*/


//Function to check and update styles
function check(arrayQuote, arrayValue) {
    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index]
        if (character == null) {
            characterSpan.classList.remove('correct')
            characterSpan.classList.remove('incorrect')
            correct = false
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correct')
            characterSpan.classList.remove('incorrect')
        } else {
            characterSpan.classList.remove('correct')
            characterSpan.classList.add('incorrect')
            correct = false
        }
    })
    return correct
}


// A asynchronous function to Render New quote

async function renderNewQuote() {
    if (isPlaying) {
        const quote = await getRandomQuote();
        const words = countWords(quote)
        time = updateTime(words)
        quoteDisplayElement.innerHTML = ''
        quote.split('').forEach(character => {
            const characterSpan = document.createElement('span')
            characterSpan.innerText = character
            quoteDisplayElement.appendChild(characterSpan)
        })
        quoteInputElement.value = null
        startTimer()
        scoreDisplay.innerHTML = score
    }
}

// To fetch a Random Quote from Api

function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
        .then(response => response.json())
        .then(data => data.content)
}

// It helps to count words
function countWords(str) {
    str = str.replace(/(^\s*)|(\s*$)/gi, "");
    str = str.replace(/[ ]{2,}/gi, " ");
    str = str.replace(/\n /, "\n");
    return str.split(' ').length;
}

//  function to change levels object value 
function updateTime(words) {
    return (Math.floor(words * timeVar))
}

//function to add Best score
function newBestScore() {
    //set new best score
    localStorage.setItem("bestScore", score);
    //show message
    $(bestScoreModal).modal("toggle");
    bestscoreEm.innerHTML = score;
    bestscore.innerHTML = score;
}


//function to add score to your score
function addNewScore(score) {
    //first col
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    var tempLevel = chooseLevel.value;
    tempLevel = tempLevel[0].toUpperCase() + tempLevel.slice(1, tempLevel.length)
    let content = document.createTextNode(String(gamesCounter) + " " + tempLevel);
    td.appendChild(content);
    tr.appendChild(td);
    //second col
    td = document.createElement("td");
    content = document.createTextNode(score);
    td.appendChild(content);
    tr.appendChild(td);
    yourScoresTbody.prepend(tr);
}

// starts the timer 
function startTimer() {
    startTime = new Date()
    var temp = setInterval(() => {
        var x = 5 + time - getTimerTime()

        if (x <= 0 || !isPlaying) {
            gameOverSound.play()
            timer.innerText = 'GAME OVER !';
            stopGame()
            clearInterval(temp)
        } else {
            if (x % 2) clockSound1.play()
            else clockSound2.play()
            timer.innerText = x;
        }
    }, 1000)
}

// In Javscript there is some error with setInterval
// To confirm that it gives a perfect time interval
//this function is used
function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000)
}