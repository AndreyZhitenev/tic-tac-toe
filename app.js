let origBoard,
	touchSound = new Audio("audio/touch.mp3"),
	winSound = new Audio("audio/win.mp3"),
	loseSound = new Audio("audio/lose.mp3");

let who = null;

const huPlayer = `<svg class="circle" width="24" height="24" viewBox="-3 -3 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM12 19.0926C15.9171 19.0926 19.0926 15.9171 19.0926 12C19.0926 8.08287 15.9171 4.90741 12 4.90741C8.08287 4.90741 4.90741 8.08287 4.90741 12C4.90741 15.9171 8.08287 19.0926 12 19.0926Z" fill="white"/>
</svg>`,
	aiPlayer = `
	<svg class="cross" fill="none" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="30px" height="30px">    <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z" fill="#fff"/></svg>`;

const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2],
];

const cells = document.querySelectorAll(".cell");

// AI Game Type

function startAI() {
	document.querySelector(".choose").style.visibility = "hidden";
	document.querySelector(".choose").style.opacity = "0";
	origBoard = Array.from(Array(9).keys());
	for (let i = 0; i < cells.length; i++) {
		cells[i].innerText = "";
		cells[i].addEventListener("click", turnClickAI, false);
	}
}

function turnClickAI(square) {
	if (typeof origBoard[square.target.id] == "number") {
		turnAI(square.target.id, huPlayer);

		if (!checkTieAI())
			setTimeout(() => {
				turnAI(bestSpot(), aiPlayer);
			}, 500);
	}
}

function turnAI(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerHTML = player;
	setTimeout(() => {
		touchSound.play();
	}, 250);
	let gameWon = checkWin(origBoard, player);
	if (gameWon) gameOverAI(gameWon);
}

function gameOverAI(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).querySelector("path").style.fill =
			gameWon.player == huPlayer ? "hsla(211.27deg, 100%, 50%, 0.9)" : "rgba(255, 0, 0, 0.9)";
	}
	for (let i = 0; i < cells.length; i++) {
		cells[i].removeEventListener("click", turnClickAI, false);
	}
	if (gameWon.player == huPlayer) {
		setTimeout(() => {
			declareWinner("You win!", "hsla(211.27deg, 100%, 50%, 0.9)", "ai");
			winSound.play();
		}, 500);
	} else {
		setTimeout(() => {
			declareWinner("You lose.", "rgba(255, 0, 0, 0.9)", "ai");
			loseSound.play();
		}, 500);
	}
}

function checkTieAI() {
	if (emptySquares().length == 0) {
		for (let i = 0; i < cells.length; i++) {
			cells[i].querySelector("path").style.fill = "#aaaaaa";
			cells[i].removeEventListener("click", turnClickAI, false);
		}
		declareWinner("Tie Game!", "#aaaaaa", "ai");
		return true;
	}
	return false;
}

function emptySquares() {
	return origBoard.filter((s) => typeof s == "number");
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function minimax(newBoard, player) {
	let availSpots = emptySquares(newBoard);

	if (checkWin(newBoard, player)) {
		return { score: -10 };
	} else if (checkWin(newBoard, aiPlayer)) {
		return { score: 20 };
	} else if (availSpots.length === 0) {
		return { score: 0 };
	}

	let moves = [];
	for (let i = 0; i < availSpots.length; i++) {
		let move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			let result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			let result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;
		moves.push(move);
	}

	let bestMove;
	if (player === aiPlayer) {
		let bestScore = -10000;
		for (let i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		let bestScore = 10000;
		for (let i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}

// Players Game Type

function startPlayers() {
	document.querySelector(".choose").style.visibility = "hidden";
	document.querySelector(".choose").style.opacity = "0";
	origBoard = Array.from(Array(9).keys());
	for (let i = 0; i < cells.length; i++) {
		cells[i].innerText = "";
		cells[i].addEventListener("click", turnClickPlayers, false);
	}
}

function turnClickPlayers(square) {
	if (typeof origBoard[square.target.id] == "number") {
		if (!checkTiePlayers()) {
			if (who == null || who == 2) {
				turnPlayers(square.target.id, huPlayer);
				who = 1;
			} else if (who == 1) {
				turnPlayers(square.target.id, aiPlayer);
				who = 2;
			}
		}
	}
}

function turnPlayers(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerHTML = player;
	setTimeout(() => {
		touchSound.play();
	}, 250);
	let gameWon = checkWin(origBoard, player);
	if (gameWon) gameOverPlayers(gameWon);
}

function gameOverPlayers(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).querySelector("path").style.fill =
			gameWon.player == huPlayer ? "hsla(211.27deg, 100%, 50%, 0.9)" : "rgba(255, 0, 0, 0.9)";
	}
	for (let i = 0; i < cells.length; i++) {
		cells[i].removeEventListener("click", turnClickPlayers, false);
	}
	if (gameWon.player == huPlayer) {
		setTimeout(() => {
			declareWinner("You win!", "hsla(211.27deg, 100%, 50%, 0.9)", "players");
			winSound.play();
		}, 500);
	} else {
		setTimeout(() => {
			declareWinner("You lose.", "rgba(255, 0, 0, 0.9)", "players");
			loseSound.play();
		}, 500);
	}
}

function declareWinner(who, color, type) {
	document.querySelector(".endgame").style.visibility = "visible";
	document.querySelector(".endgame").style.opacity = "1";

	document.querySelector(".endgame .text").innerText = who;
	document.querySelector(".endgame .text").style.color = color;
	setTimeout(() => {
		document.querySelector(".endgame").style.visibility = "hidden";
		document.querySelector(".endgame").style.opacity = "0";
		if (type == "players") {
			startPlayers();
		} else if (type == "ai") {
			startAI();
		}
	}, 1000);
}

function checkTiePlayers() {
	if (emptySquares().length == 0) {
		for (let i = 0; i < cells.length; i++) {
			cells[i].querySelector("path").style.fill = "#aaaaaa";
			cells[i].removeEventListener("click", turnClickPlayers, false);
		}
		declareWinner("Tie Game!", "#aaaaaa", "players");
		return true;
	}
	return false;
}

// For All Game Types

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every((elem) => plays.indexOf(elem) > -1)) {
			gameWon = { index, player };
			break;
		}
	}
	return gameWon;
}
