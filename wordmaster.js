// Set some game variables
let secretWord = ""; 
let puzzleNumber = 0;
let guessWord = "";
let gameOver = false; 
let currentGuessRound = 0;
let letters = [];
let secretArray = [];

// Set API URLs for the secret word
let secretWordURL = "https://words.dev-apis.com/word-of-the-day?random=1";
let validateGuessWordURL = "https://words.dev-apis.com/validate-word";

// Get DOM element handles
let userMsg = document.querySelector('.user-message');
let systemMsg = document.querySelector('.system-message');
systemMsg.style.color = 'var(--color-white)';
let guess0 = document.getElementById('guess0');
let guess1 = document.getElementById('guess1');
let guess2 = document.getElementById('guess2');
let guess3 = document.getElementById('guess3');
let guess4 = document.getElementById('guess4');
let guess5 = document.getElementById('guess5');

function checkGuess(guessWord) {
    const secretArray = [
        {letter: secretWord[0], matched : false},
        {letter: secretWord[1], matched : false},
        {letter: secretWord[2], matched : false},
        {letter: secretWord[3], matched : false},
        {letter: secretWord[4], matched : false},
    ]

    if (guessWord === secretWord) {
        for (let i = currentGuessRound * 5; i < (currentGuessRound * 5) + 5; i++) {
            document.getElementById(i).style.backgroundColor = 'var(--color-green-main)';
            document.getElementById(i).style.color = 'var(--color-white)';
        }
        gameOver = true;
        return gameOver;
    };
    
    if (guessWord !== secretWord){
        gameOver = false;
        for (let i = currentGuessRound * 5; i < (currentGuessRound * 5) + 5; i++) {
            if (letters[i] === secretArray[i-(currentGuessRound*5)].letter) {
                document.getElementById(i).style.backgroundColor = 'var(--color-green-main)';
                document.getElementById(i).style.color = 'var(--color-white)';
                secretArray[i-(currentGuessRound*5)].matched = true;
            } else {
                for (let j = 0; j < secretArray.length; j++) {
                    if (letters[i] !== secretArray[j].letter) {
                    } else if (letters[i] === secretArray[j].letter && secretArray[j].matched === true) {
                    } else if (letters[i] === secretArray[j].letter && secretArray[j].matched === false) {
                        document.getElementById(i).style.backgroundColor = 'var(--color-gold-main)';
                        document.getElementById(i).style.color = 'var(--color-white)';
                        secretArray[j].matched = true;
                    } else {
                        console.log("something else");
                    }
                }
            }
        }
        return gameOver;
    }
}

function assembleGuessWord() {
    let guessWord = "";
    for (let i = currentGuessRound * 5; i < (currentGuessRound * 5) + 5; i++) {
        guessWord += letters[i];
    }
    return guessWord;
}

async function takeAGuess() {

    const guessWord =  assembleGuessWord();
    setUserMsg('<h3>Checking your guess...</h3>');

    const resp = await fetch(validateGuessWordURL, {
        method: 'POST',
        body: JSON.stringify({word : guessWord}),
    });
    const wordResp = await resp.json();
    
    if (!wordResp.validWord) {
        setUserMsg('<h3>Nope, thats not a word.</h3>');
        return;
    } else if (wordResp.validWord) {
        checkGuess(guessWord);
    }
    if (!gameOver && currentGuessRound === 5) {
        setUserMsg('<h3>Waa Waa! Refresh your browser... </h3>');
    } else if (!gameOver && currentGuessRound < 5) {
        currentGuessRound++;
        makeGuessesVisible();
        setUserMsg('<h3>Guess again!</h3>');
    } else if (gameOver) {
        setUserMsg('<h3>You win! </h3>');
        setSystemMsg('<h3>Refresh your browser to Play Again </h3>');
        return;
    }
}

function handleBackspace(e) {
    let entry = document.getElementById(e.target.id);
    if (entry.readOnly) { return; }
    const index =  parseInt(e.target.id);
    letters[index] = "";
    entry.value = "";
    console.log("letters: ",letters);
}

function addLetter(letter, id) {
    let entry = document.getElementById(id);
    letter = letter.toUpperCase();
    const index =  parseInt(id);
    letters[index] = letter;
    if (entry.readOnly) {
        console.log("addLetter entry.readOnly: ", entry.value);
        return;
    } else if (!entry.readOnly) {
        entry.value = letter;
        console.log("addLetter !entry.readOnly: ",entry.value);
    }
}

function isLetter (char) {
    return char.match(/[A-Z]/i);
}

function makeGuessesVisible() {
    console.log("makeGuessesVisible currentGuessRound : ", currentGuessRound)
    // Guess 0 is always visible
    if (currentGuessRound === 0) {
        guess0.style.visibility = "visible";
        guess1.style.visibility = "hidden";
        guess2.style.visibility = "hidden";
        guess3.style.visibility = "hidden";
        guess4.style.visibility = "hidden";
        guess5.style.visibility = "hidden";
    } else if (currentGuessRound === 1) { 
        // set all the children of id=guess0 to readonly = true
        for (const child of guess0.children) {
            child.readOnly = true;
        };
        guess1.style.visibility = "visible"; 
        guess2.style.visibility = "hidden";
        guess3.style.visibility = "hidden";
        guess4.style.visibility = "hidden";
        guess5.style.visibility = "hidden";
    } else if (currentGuessRound === 2) { 
        // set all the children of id=guess1 to readonly = true
        for (const child of guess1.children) {
            child.readOnly = true;
        };
        guess2.style.visibility = "visible";
        guess3.style.visibility = "hidden";
        guess4.style.visibility = "hidden";
        guess5.style.visibility = "hidden";
    } else if (currentGuessRound === 3) { 
        // set all the children of id=guess2 to readonly = true
        for (const child of guess2.children) {
            child.readOnly = true;
        };
        guess3.style.visibility = "visible";
        guess4.style.visibility = "hidden";
        guess5.style.visibility = "hidden";
    } else if (currentGuessRound === 4) {
        // set all the children of id=guess3 to readonly = true
        for (const child of guess3.children) {
            child.readOnly = true;
        };
        guess4.style.visibility = "visible";
        guess5.style.visibility = "hidden";
    } else if (currentGuessRound === 5) {
        // set all the children of id=guess4 to readonly = true
        for (const child of guess4.children) {
            child.readOnly = true;
        };
        guess5.style.visibility = "visible";
    } else if (currentGuessRound > 5) {
        console.log("makeGuessesVisible: currentGuessRound is out of range: ", currentGuessRound);
    }
}

function setSystemMsg(msg) {
    systemMsg.innerHTML = msg;
}

function setUserMsg(msg) {
    userMsg.innerHTML = msg;
}

async function getSecretWord() {
    // Instead of a waiting spinner, how about a user msg?
    setUserMsg('<h3>Anytime some says the Secret Word...</h3>');
    const promise = await fetch(secretWordURL);
    const response = await promise.json();
    secretWord = response.word.toUpperCase();
    puzzleNumber = response.puzzleNumber;

    setTimeout(function() {
        console.log("getSecretWord: setTimeout")
        setUserMsg('<h3>TAB to move. ENTER to guess</h3>')
    }, 4000);

    setSystemMsg('<p>Secret Word: ' + secretWord + ' Puzzle: ' + puzzleNumber + '</p>');
//    setUserMsg('<h3>TAB to move. ENTER to guess</h3>');
}

function revealSecret() {
    console.log("revealSecret: ", systemMsg);
    systemMsg.style.backgroundColor = '#ddd';
}

function reLoad() {
    location.reload();
}

function initializeWordMaster() {
    systemMsg.style.color = '#fff';
    systemMsg.style.backgroundColor = '#fff';
    getSecretWord();
    setUserMsg('<h3>Anytime some says the Secret Word...</h3>');
    makeGuessesVisible();

    document
        .getElementById('btn-new-game')
        .addEventListener('click', function handleNewGame(e) {
            e.preventDefault();
            reLoad();
        });

    document
        .getElementById('btn-secret')
        .addEventListener('click', function handleSecret(e) {
            e.preventDefault(); 
            revealSecret();
        });

    /* Add the event listener to the entire document */
    document
        .addEventListener('keydown', function handleKeyPress(e) {
            //if gameOver do nothing after a keypress
            if (gameOver) { return; } 

            //if key press is ENTER then assemble the guess word and check it
            if (e.key === "Tab" || e.key === "Shift" || e.key === "Alt" || e.key === "Control"  ) {
                return;
            } else if (e.key === "Escape" || e.key === "Delete" || e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") {
                return; 
            } else if (e.key === "Backspace") {
                handleBackspace(e);
            } else if (e.key === "Enter") {
                e.preventDefault();
                takeAGuess();
            } else if (!isLetter(e.key)) {
                e.preventDefault();
                setUserMsg('<h3>Only letters [A-Z] are allowed!</h3>') 
            } else if (isLetter(e.key)) {
                addLetter(e.key, e.target.id);
                setUserMsg('<h3>Keep going.</h3>');
                }
            }
    );
}

initializeWordMaster();