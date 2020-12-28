'use strict';

const $game = document.getElementById('game');

const size = 4;

const getRandomNumber = (max, min = 0) => Math.floor(Math.random() * (max - min) + min);

const generateNumber = (squares) => {
	const random = {
		x: getRandomNumber(size),
		y: getRandomNumber(size)
	}

	if (!squares[random.y][random.x]) {
		squares[random.y][random.x] = getRandomNumber(4) ? 2 : 4;
	} else generateNumber();
}

const createSquares = () => {
	const squares = []

	for (let i = 0; i < size; i++) {
		squares[i] = [];
		for (let j = 0; j < size; j++) {
			squares[i][j] = null;
		}
	}

	generateNumber(squares);
	
	return squares;
}

const squares = createSquares();

const displaySquare = () => {
	[...$game.children].forEach((item, i) => {
		item.textContent = squares[Math.floor(i / 4)][i % 4]
	})
}

displaySquare();