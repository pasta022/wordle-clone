
//DOM Elements 
const tiles = document.querySelector('.tile-container');
const keyboard = document.querySelector('.key-container');
const messageDisplay = document.querySelector('.message-container');



//Variables & Constants 
const keys = [
    'Q','W','E','R','T','Y','U','I','O','P',
    'A','S','D','F','G','H','J','K','L','ENTER',
    'Z','X','C','V','B','N','M','⟵'
];
const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
];
let currentRow = 0, currentTile = 0;
let wordle;
let isGameOver = false;


//API calls

//get Random Word
const getWordle = () => {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '6098e0b300mshd37ac6b22b5725cp14d4f1jsn4ad78f308a92',
            'X-RapidAPI-Host': 'random-words5.p.rapidapi.com'
        }
    };
    
    fetch('https://random-words5.p.rapidapi.com/getMultipleRandom?count=5&wordLength=5', options)
        .then(response => response.json())
        .then(response => {
            wordle = response[(Math.floor(Math.random() * 4))].toUpperCase();
        })
        .catch(err => console.error(err));
}

//check If Word Exists
const confirmWord = (answer) => {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '6098e0b300mshd37ac6b22b5725cp14d4f1jsn4ad78f308a92',
            'X-RapidAPI-Host': 'synonyms-word-info.p.rapidapi.com'
        }
    };
    
    fetch(`https://synonyms-word-info.p.rapidapi.com/v1/synonyms?str=${answer}`, options)
        .then(response => response.json())
        .then(response => {
            if (response.status != 'success') {
                displayMessage('Not in word list')
            } else {
                flipTiles()
                if(answer == wordle) {
                    displayMessage('Game Won');
                    isGameOver = true;
                } else {
                    if (currentRow >= 5) {
                        isGameOver = true;
                        displayMessage(`wordle is ${wordle}`)
                        return
                    } else if (currentRow < 5) {
                        currentRow++;
                        currentTile = 0;
                    }
                }
            }
        })
        .catch(err => console.error(err));
}

getWordle();
guessRows.forEach((guessRow, guessRowIndex) => {
    const row = document.createElement('div');
    row.setAttribute('id', 'row-' + guessRowIndex);
    guessRow.forEach((guess, guessIndex) => {
        const guessElement = document.createElement('div');
        guessElement.classList.add('tile');
        guessElement.setAttribute('id', 'row-' + guessRowIndex + '-tile-' + guessIndex);
        row.appendChild(guessElement);
    })
    tiles.appendChild(row);
})

keys.forEach(key => {
    const keyButton = document.createElement('button');
    keyButton.textContent = key;
    keyButton.setAttribute('id', key);
    keyButton.addEventListener('click', () => handleKeyboard(key));
    keyboard.appendChild(keyButton);
})

//handleKeyboard Function
const handleKeyboard = (letter) => {
    switch (isGameOver) {
        case false:
            if (letter == 'ENTER') {
                checkRow()
                return
            }
            else if (letter == '⟵') {
                deleteLetter();
                return
            } else {
                addLetter(letter);
            }
            break
    }
}

//add Letter Function
const addLetter = (letter) => {
    if (currentTile < 5 && currentRow < 6) {
        const tileContent = document.getElementById(`row-${currentRow}-tile-${currentTile}`);
        tileContent.innerHTML = letter;
        tileContent.setAttribute('data', letter);
        guessRows[currentRow][currentTile] = letter;
        currentTile++;
    }
}


// delete Letter Function
const deleteLetter = () => {
    if (currentTile > 0){
        currentTile--;
        const tileContent = document.getElementById(`row-${currentRow}-tile-${currentTile}`);
        tileContent.innerHTML = '';
        tileContent.removeAttribute('data');
        guessRows[currentRow][currentTile] = '';
    }
}


//check Row Function
const checkRow = () => {
    if (currentTile > 4) {
        const answer = guessRows[currentRow].join('');
        confirmWord(answer);
    }
}

//flip Tiles
const flipTiles = () => {
    const rowTile = document.querySelector(`#row-${currentRow}`).childNodes;
    const rowContent = [];
    let checkWordle = wordle;

    rowTile.forEach(tile => {
        rowContent.push({letter: tile.getAttribute('data'), color: 'grey-tile'});
    })

    rowContent.forEach((content, index) => {
        if (content.letter == wordle[index]) {
            content.color = 'green-tile';
            checkWordle = checkWordle.replace(content.letter,'');
        } else if (checkWordle.includes(content.letter)) {
            content.color = 'yellow-tile';
            checkWordle = checkWordle.replace(content.letter,'');
        }
    })


    rowTile.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip');
            tile.classList.add(rowContent[index].color);
            colorKeyboard(rowContent[index].letter, rowContent[index].color);
        }, 600 * index);
    })
}

// color Keyboard
const colorKeyboard = (letter, color) => {
    const keyLetter = document.getElementById(letter);
    if (keyLetter.classList.contains('yellow-tile')){
        keyLetter.classList.remove('yellow-tile');
        keyLetter.classList.add(color);
    }
    keyLetter.classList.add(color);
}

//display Message
const displayMessage = (message) => {
    const messageElement = document.createElement('p');
    messageElement.innerHTML = message;
    messageDisplay.appendChild(messageElement);
    setTimeout(() => {
       messageDisplay.removeChild(messageElement) 
    }, 1500);
}

