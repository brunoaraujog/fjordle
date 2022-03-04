createSquares();

let guessedWords = [[]];
let availableSpace = 1;
console.log("Init: availableSpace: " + availableSpace);

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
let newLine = true;

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
document.addEventListener('keydown', (event) => {
	var code = event.code;
	var key = event.key;
	if (code == "Enter") {
		handleSubmitWord()
		return;
	}

	if (code == "Backspace" || code == "Delete") {
		handleDeleteLetter()
		return;
	}

	if (isLetter(key)) {
		updateGuessedWords(key);
	}
}, false);

function isLetter(key) {
	return /^[a-z]$/i.test(key);
}

function handleSubmitWord() {
	const currentWordArr = getCurrentWordArr()

	if (currentWordArr.length !== 5) {
		window.alert("Word must be 5 letters");
		return ;
	}

	const currentWord = currentWordArr.join('')

	fetch(
		`https://api.dictionaryapi.dev/api/v2/entries/en/${currentWord}`,
		{
			method: "GET"
		}
	).then((res) => {
		if (!res.ok) {
			throw Error()
		}
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
		newLine = true;
	
		guessedWordCount += 1;
	
		if (guessIsCorrect(currentWord)) {
			setTimeout(() => {
				window.alert("Congratulations!");
				clearBoard();
			}, interval * 6);
		} 
		else if (guessedWords.length > 5) {
			setTimeout(() => {
				window.alert(`Sorry, you have no more guesses. The word is ${wordOfTheDay}.`)
				clearBoard();
			}, interval * 6);
		}
	
		guessedWords.push([]);
	}).catch(() => {
		window.alert("Word is not recognised");
	})

}

function handleDeleteLetter() {
	const currentWordArr = getCurrentWordArr()
	const removedLetter = currentWordArr.pop()

	guessedWords[guessedWords.length - 1] = currentWordArr

	// availableSpace begins in 1
	if ((availableSpace - 1) % 5 == 0 && newLine == true)
	{
		return;
	}
	const lastLetterEl = document.getElementById(String(availableSpace - 1));
	lastLetterEl.textContent = '';
	availableSpace = availableSpace - 1;
	if ((availableSpace - 1) % 5 == 0)
		newLine = true;
	console.log("handleDeleteLetter: availableSpace: " + availableSpace);
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
		if ((availableSpace - 1) % 5 == 4)
			newLine = false;
		else if ((availableSpace - 1) % 5 == 0 && newLine == false)
			newLine = false;
		else if ((availableSpace - 1) % 5 == 0)
			newLine = true;
		console.log("UpdateGuessedWords: availableSpace + 1: " + availableSpace);
		console.log("UpdateGuessedWords: newLine: " + newLine);


		availableSpaceEl.textContent = letter;
	}
}

function getTileColor(letter, index, word) {
	const isCorrectLetter = word.includes(letter)

	if (!isCorrectLetter) {
		return "rgba(171, 192, 196, 1)";
	}

	const letterInThatPosition = word.charAt(index)
	const isCorrectPosition = letter === letterInThatPosition

	if (isCorrectPosition) {
		return "rgba(62, 163, 101, 1)";
	}

	return "rgba(196, 155, 32, 1)";
	
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

function guessIsCorrect(currentWord) {
	return currentWord === wordOfTheDay
}

function clearBoard() {
	for (let i = 0; i < 30; i++) {
		let square = document.getElementById(i + 1);
		square.textContent = "";
	}

	const keys = document.querySelectorAll("button[data-key]");

	for (const key of keys) {
		key.disabled = true;
	}
  }
