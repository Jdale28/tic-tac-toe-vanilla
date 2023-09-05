var createBoard;
const humanPlayer = "O";
const aiPlayer = "X";
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
];

const cells = document.querySelectorAll(".cell");
let clicks = 0

startGame();

function startGame() {
    document.querySelector(".endgame").style.display = "none";
    createBoard = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = "";
        cells[i].style.removeProperty("background-color");
        cells[i].addEventListener("click", turnClick, false);
    }
}

let hardmode = false
var clicked = true
function hardMode() {
    clicked = !clicked
    if (!clicked) {
        document.querySelector("body").style.backgroundColor = "red"
        document.querySelector("#hardMode").innerHTML = "Easy Mode"
        hardmode = true
    } else {
        document.querySelector("body").style.backgroundColor = "white"
        document.querySelector("#hardMode").innerHTML = "Hard Mode"
        hardmode = false
    }
}

function turnClick(square) {
  if (typeof createBoard[square.target.id] === "number") {
    turn(square.target.id, humanPlayer);
    // AI turns
    if (hardmode === false){
        if (!checkTie()) turn(bestSpot(), aiPlayer);
    } else {
        if (!checkTie()) turn(bestSpotMin(), aiPlayer);
    }
  }
}

function turn(squareId, player) {
  createBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(createBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == humanPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == humanPlayer ? "You win!" : "You lose.");
}


// Basic AI functions
function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return createBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return emptySquares()[0];
}

// testing edge cases
function betterSpot() {
	return emptySquares()[0];
}


function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

// Minimax function (unbeatable)

function bestSpotMin() {
    return minimax(createBoard, aiPlayer).index
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();
	if (checkWin(newBoard, humanPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;
		if (player == aiPlayer) {
			var result = minimax(newBoard, humanPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}
		newBoard[availSpots[i]] = move.index;
		moves.push(move);
	}
	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove];
}