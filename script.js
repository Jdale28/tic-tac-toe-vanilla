var createBoard;
const humanPlayer = "0";
const aiPlayer = "X";
const winCombos = [
  [0, 1, 2],
  [3, 5, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
];

const cells = document.querySelectorAll(".cell");