'use strict';

const size = 4;
const $game = document.getElementById('game');

let score = 0;
const $score = document.getElementById('score');

const getRandomNumber = (max, min = 0) => Math.floor(Math.random() * (max - min) + min);

let grid = [];

const addNumber = () => {
	let options = [];
	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			if (!grid[y][x]) {
				options.push({y, x})
			}
		}
	} 
	
	if (options.length) {
		const spot = options[getRandomNumber(options.length)];
		grid[spot.y][spot.x] = getRandomNumber(4) ? 2 : 4;
	}
}

const update = () => {
	[...$game.children].forEach((li, i) => {
		li.textContent = grid[Math.floor(i/size)][i % size]
	})
}

const setup = () => {
	$game.innerHTML = '';
	$game.className = '';
	grid = [];
	for (let i = 0; i < size; i++) {
		const tmp = []
		for (let j = 0; j < size; j++) {
			tmp.push(null);
			const li = document.createElement('li');
			$game.append(li);
		}
	
		grid.push(tmp);
	}

	addNumber();
	addNumber();
	
	update();
}

setup();

const $start = document.getElementById('start');
$start.addEventListener('click', () => {
	setup();
	$score.textContent = 0;
	score = 0;
})

const slideLeft = column => {
	const numbers = column.filter(cell => cell);
	const missing = size - numbers.length;
	const emptys = Array(missing).fill(null);
	return [...numbers, ...emptys]
}

const slideRight = column => {
	const numbers = column.filter(cell => cell);
	const missing = size - numbers.length;
	const emptys = Array(missing).fill(null);
	return [...emptys, ...numbers]
}

const combineLeft = column => {
	for (let i = 0; i < size - 1; i++) {
		const a = column[i];
		const b = column[i + 1];
		if (a === b && a) {
			column[i] = a + b;
			score += column[i];
			column[i + 1] = null;
		}
	}
	
	return column;
}

const combineRight = column => {
	for (let i = size - 1; i > 0; i--) {
		const a = column[i];
		const b = column[i - 1];
		if (a === b && a) {
			column[i] = a + b;
			score += column[i];
			column[i - 1] = null;
		}
	}
	
	return column;
}

const operateLeft = column => {
	column = slideLeft(column);
	column = combineLeft(column);
	column = slideLeft(column);
	$score.textContent = score;
	
	return column;
}

const operateRight = column => {
	column = slideRight(column);
	column = combineRight(column);
	column = slideRight(column);
	$score.textContent = score;
	
	return column;
}

const compare = (a, b) => {
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			if (a[i][j] !== b[i][j]) {
				return true;
			}
		}
	}
	
	return false;
}

const rotate = () => {
	const tmp = [
		[],
		[],
		[],
		[]
	]
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			tmp[i][j] = grid[j][i];
		}
	}

	return tmp;
}

const gameOver = () => {
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			if (!grid[i][j]) return false;
			if (i !== 3 && grid[i][j] === grid[i + 1][j]) return false;
			if (j !== 3 && grid[i][j] === grid[i][j + 1]) return false;
		}
	}

	return true;
}

const onKey = evt => {
	let past;
	switch (evt.keyCode) {
		case 37:
			past = grid.slice();
			for (let i = 0; i < size; i++) {
				grid[i] = operateLeft(grid[i]);
			}
			
			if (compare(grid, past)) {
				addNumber();
				update();
			} else {
				if (gameOver()) {
					$game.classList.add('gameover');
				}
			}
			break;
		case 38:
			past = grid.slice();
			grid = rotate();
			for (let i = 0; i < size; i++) {
				grid[i] = operateLeft(grid[i]);
			}
			grid = rotate();

			if (compare(grid, past)) {
				addNumber();
				update();
			} else {
				if (gameOver()) {
					$game.classList.add('gameover');
				}
			}
			break;
		case 39:
			past = grid.slice();
			for (let i = 0; i < size; i++) {
				grid[i] = operateRight(grid[i]);
			}
			
			if (compare(grid, past)) {
				addNumber();
				update();
			} else {
				if (gameOver()) {
					$game.classList.add('gameover');
				}
			}
			break;
		case 40:
			past = grid.slice();
			grid = rotate();
			for (let i = 0; i < size; i++) {
				grid[i] = operateRight(grid[i]);
			}
			grid = rotate();

			if (compare(grid, past)) {
				addNumber();
				update();
			} else {
				if (gameOver()) {
					$game.classList.add('gameover');
				}
			}
			break;
	}
}

document.addEventListener('keydown', onKey);
