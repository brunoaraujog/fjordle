document.addEventListener("DOMContentLoaded", () => {
    createSquares();

    let guessedWords = [[]];
    let availableSpace = 1;

    //let word = "fjord";
    const pamonha = ["brisk", "zesty", "fiery", "fjord"];

    let today;
    today = new Date();
    let today_day = today.getDay();
    let selectedWordIndex;

    if (today_day >=1 && today_day <= 10) {

        selectedWordIndex = 0;

      } else if (today_day >= (13-2) && today_day <= (16+1)) {

        selectedWordIndex = 1;

      } else if (today_day >=18 && today_day <= 24) {

        selectedWordIndex = 2;

      } else if (today_day >=25 && today_day <= 31) {

        selectedWordIndex = 3;

    }
 
    let guessedWordCount = 0;

    const keys = document.querySelectorAll(".keyboard-row button");

    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1];
    }

    function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr();

        if (currentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(letter);

            const availableSpaceEl = document.getElementById(String(availableSpace));
            availableSpace = availableSpace + 1;

            availableSpaceEl.textContent = letter;
        }
    }

    function getTileColor(letter, index, selectedWordIndex) {
        const isCorrectLetter = pamonha[selectedWordIndex].includes(letter)

        if (!isCorrectLetter) {
            return "rgb(58, 58, 60)";
        }

        const letterInThatPosition = pamonha[selectedWordIndex].charAt(index)
        const isCorrectPosition = letter === letterInThatPosition

        if (isCorrectPosition) {
            return "rgb(83, 141, 78)";
        }

        return "rgb(181, 159, 59)";
    }

    function handleSubmitWord() {
        const currentWordArr = getCurrentWordArr()
        if (currentWordArr.length !==5) {
            window.alert("Word must be 5 letters");
        }

        const currentWord = currentWordArr.join('')

        const firstLetterId = guessedWordCount * 5 + 1;
        const interval = 200;
        currentWordArr.forEach((letter, index) => {
            setTimeout(() => {
                const tileColor = getTileColor(letter, index, selectedWordIndex);

                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId)
                letterEl.classList.add("animate__flipInX");
                letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
            }, interval * index);
        })

        guessedWordCount += 1;

        /*if (currentWord === word) {
            window.alert("Congratulations!");
        }*/

        //Local storage tutorial: prioridade 1;
        //Validação data: ser atrelado a dia/mês/ano

        if (currentWord === pamonha[0] && (today_day >=1 && today_day <= 10) ) {

            window.alert("Congratulations!");

          } else if (currentWord === pamonha[1] && (today_day >= (13-2) && today_day <= (16+1)) ) {

            window.alert("Congratulations!");

          } else if (currentWord === pamonha[2] && (today_day >=18 && today_day <= 24) ) {

            window.alert("Congratulations!");

          } else if (currentWord === pamonha[3] && (today_day >=25 && today_day <= 31) ) {

            window.alert("Congratulations!");

        }

        if (guessedWords.length === 6) {
            window.alert("Sorry, you have no more guesses. /** The word is ${word}. **/")
        }

        guessedWords.push([]);
    }

    function createSquares() {
        const gameBoard = document.getElementById("board");

        for (let index = 0; index < 30; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
        }
    }

    function handleDeleteLetter() {
        const currentWordArr = getCurrentWordArr()
        const removedLetter = currentWordArr.pop()

        guessedWords[guessedWords.length - 1] = currentWordArr

        const lastLetterEl = document.getElementById(String(availableSpace - 1))

        lastLetterEl.textContent = ''
        availableSpace = availableSpace - 1
    }

    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({ target }) => {
            const letter = target.getAttribute("data-key");

            if (letter ==='enter') {
                handleSubmitWord()
                return;
            }

            if (letter === 'del') {
                handleDeleteLetter()
                return;
            }

            updateGuessedWords(letter);
        };
    }
})