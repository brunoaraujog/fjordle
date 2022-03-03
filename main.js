createSquares();

let guessedWords = [[]];
let availableSpace = 1;

//let word = "fjord";
const allWords = ["brisk", "zesty", "fiery", "fjord"];

let today;
today = new Date();
let today_day = today.getDay();
let wordOfTheDay;

if (today_day >= 1 && today_day <= 10) {

	wordOfTheDay = allWords[0];

} else if (today_day >= (13 - 2) && today_day <= (16 + 1)) {

	wordOfTheDay = allWords[1];

} else if (today_day >= 18 && today_day <= 24) {

	wordOfTheDay = allWords[2];

} else if (today_day >= 25 && today_day <= 31) {

	wordOfTheDay = allWords[3];
}

let guessedWordCount = 0;

const keys = document.querySelectorAll(".keyboard-row button");


for (let i = 0; i < keys.length; i++) {
	keys[i].onclick = ({ target }) => {
		const letter = target.getAttribute("data-key");

		if (letter === 'enter') {
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


// incorporating peter's suggestions
// Add event listener on keydown for keyboard entry
document.addEventListener('keyup', (event) => {
	var code = event.code;
	var letter = event.key;
	// console.log(event.code);
	// console.log(event.key);
	if (code == "Enter") {
		handleSubmitWord()
		return;
	}

	if (code == "Backspace" || code == "Delete") {
		handleDeleteLetter()
		return;
	}

	if (letter >= 'a' && letter <= 'z'
		|| letter >= 'A' && letter <= 'Z') {
		// console.log("é uma letra válida");
		updateGuessedWords(letter);
	}
}, false);

function handleSubmitWord() {
	const currentWordArr = getCurrentWordArr()

	if (currentWordArr.length !== 5) {
		window.alert("Word must be 5 letters");
	}

	const currentWord = currentWordArr.join('')

	const firstLetterId = guessedWordCount * 5 + 1;
	const interval = 200;
	currentWordArr.forEach((letter, index) => {
		setTimeout(() => {
			const tileColor = getTileColor(letter, index, wordOfTheDay);

			const letterId = firstLetterId + index;
			const letterEl = document.getElementById(letterId)
			letterEl.classList.add("animate__flipInX");
			letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
		}, interval * index);
	})

	guessedWordCount += 1;

	if (currentWord === allWords[0] && (today_day >= 1 && today_day <= 10)) {

		window.alert("Congratulations!");

	} else if (currentWord === allWords[1] && (today_day >= (13 - 2) && today_day <= (16 + 1))) {

		window.alert("Congratulations!");

	} else if (currentWord === allWords[2] && (today_day >= 18 && today_day <= 24)) {

		window.alert("Congratulations!");

	} else if (currentWord === allWords[3] && (today_day >= 25 && today_day <= 31)) {

		window.alert("Congratulations!");

	}

	if (guessedWords.length > 5) {
		window.alert(`Sorry, you have no more guesses. The word is ${wordOfTheDay}.`)
	}

	guessedWords.push([]);
}

function handleDeleteLetter() {
	const currentWordArr = getCurrentWordArr()
	const removedLetter = currentWordArr.pop()

	guessedWords[guessedWords.length - 1] = currentWordArr

	const lastLetterEl = document.getElementById(String(availableSpace - 1))

	lastLetterEl.textContent = ''
	availableSpace = availableSpace - 1
}

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

function getTileColor(letter, index, word) {
	const isCorrectLetter = word.includes(letter)

	if (!isCorrectLetter) {
		return "rgba(29, 53, 62, 1)";
	}

	const letterInThatPosition = word.charAt(index)
	const isCorrectPosition = letter === letterInThatPosition

	if (isCorrectPosition) {
		return "rgba(233, 58, 101, 1)";
	}

	return "rgba(218, 166, 9, 1)";
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
