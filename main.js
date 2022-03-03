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
	if (key == 'a' || key == 'b' || key == 'c' || key == 'd' || key == 'e'
	|| key == 'f' || key == 'g' || key == 'h' || key == 'i' || key == 'j'
	|| key == 'k' || key == 'l' || key == 'm' || key == 'n' || key == 'o'
	|| key == 'p' || key == 'q' || key == 'r' || key == 's' || key == 't'
	|| key == 'u' || key == 'v' || key == 'w' || key == 'x' || key == 'y'
	|| key == 'z'
	|| key == 'A' || key == 'B' || key == 'C' || key == 'D' || key == 'E'
	|| key == 'F' || key == 'G' || key == 'H' || key == 'I' || key == 'J'
	|| key == 'K' || key == 'L' || key == 'M' || key == 'N' || key == 'O'
	|| key == 'P' || key == 'Q' || key == 'R' || key == 'S' || key == 'T'
	|| key == 'U' || key == 'V' || key == 'W' || key == 'X' || key == 'Y'
	|| key == 'Z') {
		return true;
	}
	else {
		return false;
	}
}

function handleSubmitWord() {
	const currentWordArr = getCurrentWordArr()

	if (currentWordArr.length !== 5) {
		window.alert("Word must be 5 letters");
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
	
		guessedWordCount += 1;
	
		if (guessIsCorrect(currentWord)) {
			setTimeout(() => {
				window.alert("Congratulations!");
			}, interval * 6);
		} 
		else if (guessedWords.length > 5) {
			setTimeout(() => {
				window.alert(`Sorry, you have no more guesses. The word is ${wordOfTheDay}.`)
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

function guessIsCorrect(currentWord) {
	if ((currentWord === allWords[0] && (today_day >= 1 && today_day <= 10))
		|| (currentWord === allWords[1] && (today_day >= (13 - 2) && today_day <= (16 + 1)))
		|| (currentWord === allWords[2] && (today_day >= 18 && today_day <= 24))
		|| (currentWord === allWords[3] && (today_day >= 25 && today_day <= 31)))
		return true;
	else
		return false;
}