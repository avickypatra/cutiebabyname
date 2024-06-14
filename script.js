const boysSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSiuoZePU6anRM_K4l1POthgFCnsf4IMwnPH4-_BLK2o-hgMZSnQaZwsWbiPcTUNDCYqANQOIw0wesK/pub?output=csv&gid=0';
const girlsSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSiuoZePU6anRM_K4l1POthgFCnsf4IMwnPH4-_BLK2o-hgMZSnQaZwsWbiPcTUNDCYqANQOIw0wesK/pub?output=csv&gid=363693936';

let currentGender = 'boy';
let currentLetter = 'A';
let namesList = [];
let currentIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letterButtonsContainer = document.querySelector('.letter-buttons');
    
    // Splitting letters into two rows
    const firstRowLetters = letters.slice(0, 13);
    const secondRowLetters = letters.slice(13);
    
    // Creating buttons for each letter
    createLetterButtons(letterButtonsContainer, firstRowLetters);
    createLetterButtons(letterButtonsContainer, secondRowLetters);

    // Event listeners for gender buttons
    document.getElementById('boyBtn').addEventListener('click', () => {
        currentGender = 'boy';
        highlightGenderButton('boyBtn');
        generateNames(currentGender, currentLetter);
    });

    document.getElementById('girlBtn').addEventListener('click', () => {
        currentGender = 'girl';
        highlightGenderButton('girlBtn');
        generateNames(currentGender, currentLetter);
    });

    // Event listeners for letter buttons
    letterButtonsContainer.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            currentLetter = button.textContent;
            generateNames(currentGender, currentLetter);
            highlightLetterButton(currentLetter);
        });
    });

    // Navigation buttons
    document.getElementById('prevBtn').addEventListener('click', showPreviousName);
    document.getElementById('nextBtn').addEventListener('click', showNextName);

    // Initial load
    highlightGenderButton('boyBtn');
    generateNames(currentGender, currentLetter);

    // Suggestion button click event
    document.getElementById('suggestionBtn').addEventListener('click', () => {
        window.open('https://docs.google.com/spreadsheets/d/1pyMD0nvSZiQC3gPQrAKRfkqxZznDFZY7RGco5H3Tkvg/edit?usp=sharing', '_blank');
    });
});

function highlightGenderButton(buttonID) {
    document.querySelectorAll('.gender-btn').forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById(buttonID).classList.add('active');
}

function highlightLetterButton(letter) {
    document.querySelectorAll('.letter-buttons button').forEach(button => {
        button.classList.remove('active');
        if (button.textContent === letter) {
            button.classList.add('active');
        }
    });
}

function showPreviousName() {
    if (namesList.length > 0) {
        currentIndex = (currentIndex - 1 + namesList.length) % namesList.length;
        displayCurrentName();
    }
}

function showNextName() {
    if (namesList.length > 0) {
        currentIndex = (currentIndex + 1) % namesList.length;
        displayCurrentName();
    }
}

function displayCurrentName() {
    if (namesList.length > 0) {
        const nameObj = namesList[currentIndex];
        document.getElementById('name').textContent = nameObj.name;
        document.getElementById('meaning').textContent = `${nameObj.meaning}`;
        document.getElementById('suggestionLink').innerHTML = ''; // Clear previous content

    } else {
        document.getElementById('name').textContent = `Why would you name the cutie with "${currentLetter}" ?? 😔😭`;
        document.getElementById('meaning').textContent = 'If you want to add your suggestion';

        // Create a button for the suggestion link
        const suggestionBtn = document.createElement('button');
        suggestionBtn.textContent = 'Please update it here';
        suggestionBtn.addEventListener('click', () => {
            window.open('https://docs.google.com/spreadsheets/d/1pyMD0nvSZiQC3gPQrAKRfkqxZznDFZY7RGco5H3Tkvg/edit?usp=sharing', '_blank');
        });

        // Append the button to the suggestionLink element
        const suggestionLink = document.getElementById('suggestionLink');
        suggestionLink.innerHTML = ''; // Clear previous content
        suggestionLink.appendChild(document.createTextNode(''));
        suggestionLink.appendChild(suggestionBtn);
    }
}

function generateNames(gender, startingLetter) {
    const sheetURL = gender === 'boy' ? boysSheetURL : girlsSheetURL;

    fetch(sheetURL)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').slice(1);  // Skip header row
            namesList = rows.map(row => {
                const [letter, name, meaning] = row.split(',');
                return { letter, name, meaning };
            }).filter(entry => entry.letter === startingLetter);

            currentIndex = 0;
            displayCurrentName();

            // Highlight the active letter button
            document.querySelectorAll('.letter-buttons button').forEach(button => {
                button.classList.toggle('active', button.textContent === startingLetter);
            });
        });
}

function createLetterButtons(container, letters) {
    const letterRow = document.createElement('div');
    letterRow.classList.add('letter-row');

    letters.split('').forEach(letter => {
        const button = document.createElement('button');
        button.textContent = letter;
        button.addEventListener('click', () => {
            currentLetter = letter;
            generateNames(currentGender, letter);
        });
        letterRow.appendChild(button);
    });

    container.appendChild(letterRow);
}
