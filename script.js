// Set some game variables
const WORDLENGTH = 5;
const MAXGUESSES = 5;
let secretWord = ""; 
let puzzleNumber = 0;
let guessWord = "";
let gameOver = false; 
let currentGuessRound = 0;
let letters = [];

// Set API URLs for the secret word
const SECRETWORDURL = "https://words.dev-apis.com/word-of-the-day?random=1";
const VALIDATEGUESSWORDURL = "https://words.dev-apis.com/validate-word";

// Get DOM element handles
const userMsg = document.querySelector('.user-message');
const systemMsg = document.querySelector('.system-message');
systemMsg.style.color = 'var(--color-white)';
const guess0 = document.getElementById('guess0');
const guess1 = document.getElementById('guess1');
const guess2 = document.getElementById('guess2');
const guess3 = document.getElementById('guess3');
const guess4 = document.getElementById('guess4');
const guess5 = document.getElementById('guess5');

function checkGuess(guessWord) {

    const secretArray = [
        {letter: secretWord[0], matched : false},
        {letter: secretWord[1], matched : false},
        {letter: secretWord[2], matched : false},
        {letter: secretWord[3], matched : false},
        {letter: secretWord[4], matched : false},
    ];

    if (guessWord === secretWord) {
        for (let i = currentGuessRound * WORDLENGTH; i < (currentGuessRound * WORDLENGTH) + WORDLENGTH; i++) {
            document.getElementById(i).classList.add('letter-exact');
        }
        gameOver = true;
        return gameOver;
    };
    
    if (guessWord !== secretWord){
        gameOver = false;
        for (let i = currentGuessRound * WORDLENGTH; i < (currentGuessRound * WORDLENGTH) + WORDLENGTH; i++) {
            if (letters[i] === secretArray[i-(currentGuessRound * WORDLENGTH)].letter) {
                document.getElementById(i).classList.add('letter-exact');
                secretArray[i-(currentGuessRound * WORDLENGTH)].matched = true;
            } else {
                for (let j = 0; j < secretArray.length; j++) {
                    if (letters[i] === secretArray[j].letter && secretArray[j].matched === false) {
                        document.getElementById(i).classList.add('letter-nearly'); 
                        secretArray[j].matched = true;
                        } else {
                            document.getElementById(i).classList.add('letter-not');
                        } 
                    }
                }
            }
        };
        return gameOver;
}

function assembleGuessWord() {
    guessWord = "";
    for (let i = currentGuessRound * WORDLENGTH; i < (currentGuessRound * WORDLENGTH) + WORDLENGTH; i++) {
        guessWord += letters[i];
    }
    return guessWord;
}

async function takeAGuess() {
    guessWord =  assembleGuessWord();
    setUserMsg('<h3>Checking your guess...</h3>');

    try {
        const resp = await fetch(VALIDATEGUESSWORDURL, {
            method: 'POST',
            body: JSON.stringify({word : guessWord}),
        });
        if (!resp.ok) {
            throw new Error('Network response was not ok');
        }
        const wordResp = await resp.json();

        if (!wordResp.validWord) {
            setUserMsg('<h3> - ' + guessWord + '- Nope, thats not a word.</h3>');
            return;
        } else if (wordResp.validWord) {
            checkGuess(guessWord);
        }
        
        if (!gameOver && currentGuessRound === MAXGUESSES) {
            setUserMsg('<h3>Waa Waa! Click New to try again. </h3>');
            return;
        } else if (!gameOver && currentGuessRound < MAXGUESSES) {
            currentGuessRound++;
            makeGuessesVisible();
            setUserMsg('<h3>Guess again!</h3>');
            return;
        } else if (gameOver) {
            setUserMsg('<h3>You win! </h3>');
            setSystemMsg('<h3>Refresh your browser to Play Again </h3>');
            return;
        }
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        setUserMsg('<h3>There was a problem validating your Guess Word</h3>');
    }   
}

function handleBackspace(e) {
    const entry = document.getElementById(e.target.id);
    if (entry.readOnly) { return; }
    const index =  parseInt(e.target.id);
    letters[index] = "";
    entry.value = "";
}

function addLetter(letter, id) {
    const entry = document.getElementById(id);
    letter = letter.toUpperCase();
    const index =  parseInt(id);
    letters[index] = letter;
    if (entry.readOnly) {
        return;
    } else if (!entry.readOnly) {
        entry.value = letter;
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
    } else if (currentGuessRound === 2) { 
        // set all the children of id=guess1 to readonly = true
        for (const child of guess1.children) {
            child.readOnly = true;
        };
        guess2.style.visibility = "visible";
    } else if (currentGuessRound === 3) { 
        // set all the children of id=guess2 to readonly = true
        for (const child of guess2.children) {
            child.readOnly = true;
        };
        guess3.style.visibility = "visible";
    } else if (currentGuessRound === 4) {
        // set all the children of id=guess3 to readonly = true
        for (const child of guess3.children) {
            child.readOnly = true;
        };
        guess4.style.visibility = "visible";
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
    setUserMsg('<h3>Anytime someone says the Secret Word...</h3>');

    try {
        const promise = await fetch(SECRETWORDURL);
        if (!promise.ok) {
            throw new Error('Network response was not ok');
        }
        const response = await promise.json();
        secretWord = response.word.toUpperCase();
        puzzleNumber = response.puzzleNumber;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        setUserMsg('<h3>Problem getting the Secret Word</h3>');
    }

    setTimeout(function() {
        console.log("getSecretWord: setTimeout")
        setUserMsg('<h3>TAB to move. ENTER to guess</h3>')
    }, 4000);
    setSystemMsg('<p>Secret Word: ' + secretWord + ' Puzzle: ' + puzzleNumber + '</p>');

}

function revealSecret() {
    console.log("revealSecret: ", systemMsg);
    systemMsg.style.backgroundColor = 'var(--color-gray-light)';
}

function reLoad() {
    location.reload();
}

function initializeMcquerdle() {
    // Initialize the game
    systemMsg.style.color = 'var(--color-white)';
    systemMsg.style.backgroundColor = 'var(--color-white)';
    getSecretWord();
    setUserMsg('<h3>Anytime someone says the Secret Word...</h3>');
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
            if (e.key === "Backspace") {
                e.preventDefault();
                handleBackspace(e);
            } else if (e.key === "Enter") {
                e.preventDefault();
                takeAGuess();
            } else if (!isLetter(e.key)) {
                e.preventDefault();
                setUserMsg('<h3>Only letters [A-Z] are allowed!</h3>') 
            } else if (e.key === "Tab" ) {
                // e.preventDefault(); 
                return;
            } else if (e.key.length > 1) { 
                // ignores 'shift', arrow keys, End, Home, etc.
                e.preventDefault();
                return;
            } else if (isLetter(e.key)) {
                e.preventDefault();
                addLetter(e.key, e.target.id);
                setUserMsg('<h3>Keep going.</h3>');
            } else { 
                // do nothing
                console.log("handleKeyPress ran out of options: ", e.key); 
            }
            
        }
    );
}

// This initializes the game
initializeMcquerdle();