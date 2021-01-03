'use strict';

const size = 4;
const $game = document.getElementById('game')

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
	for (let i = 0; i < size; i++) {
		const tmp = []
		for (let j = 0; j < size; j++) {
			tmp.push(null);
		}
	
		grid.push(tmp);
	}

	addNumber();
	addNumber();
	
	update();
}

setup();

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

const combine = column => {
	for (let i = 0; i < size; i++) {
		const a = column[i];
		const b = column[i + 1];
		if (a === b && a) {
			column[i] = a + b;
			column[i + 1] = null;
		}
	}
	
	return column;
}

const operate = (column, dir) => {
	column = dir ? slideLeft(column) : slideRight(column);
	column = combine(column);
	column = dir ? slideLeft(column) : slideRight(column);
	
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
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	]
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			tmp[i][j] = grid[j][i];
		}
	}

	return tmp;
}

const onKey = evt => {
	let past;
	switch (evt.keyCode) {
		case 37:
			past = grid.slice();
			for (let i = 0; i < size; i++) {
				grid[i] = operate(grid[i], 1);
			}
			
			if (compare(grid, past)) {
				addNumber();
				update();
			}
			break;
		case 38:
			past = grid.slice();
			grid = rotate();
			for (let i = 0; i < size; i++) {
				grid[i] = operate(grid[i], 1);
			}
			grid = rotate();

			if (compare(grid, past)) {
				addNumber();
				update();
			}
			break;
		case 39:
			past = grid.slice();
			for (let i = 0; i < size; i++) {
				grid[i] = operate(grid[i], 0);
			}
			
			if (compare(grid, past)) {
				addNumber();
				update();
			}
			break;
		case 40:
			past = grid.slice();
			grid = rotate();
			for (let i = 0; i < size; i++) {
				grid[i] = operate(grid[i], 0);
			}
			grid = rotate();

			if (compare(grid, past)) {
				addNumber();
				update();
			}
			break;
	}
}

document.addEventListener('keydown', onKey);
