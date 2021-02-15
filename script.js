const rows = 10;
const columns = 10;
let mines, remaining, revealed;
let status = document.getElementById('status');
status.addEventListener('click', init)

let board = new Array(rows);
let picture = new Array(rows);
let tile = new Array(rows);
for (let i = 0; i < board.length; i++) {
  board[i] = new Array(columns);
  picture[i] = new Array(columns);
  tile[i] = new Array(columns)
}

init();

function check(row, column) {
  if (column >= 0 && row >= 0 && column < columns && row < rows)
    return board[row][column];
}

function init() {
  mines = 5;
  remaining = mines;
  revealed = 0;
  status.innerHTML = 'Click on the tiles to reveal them';
  for (let row = 0; row < rows; row++)
    for (let column = 0; column < columns; column++) {
      let index = row * columns + column;
      tile[row][column] = document.createElement('img');
      tile[row][column].src = 'img/hidden.png';
      tile[row][column].style = 'position:absolute;height:30px; width: 30px';
      tile[row][column].style.top = 150 + row * 30;
      tile[row][column].style.left = 50 + column * 30;
      tile[row][column].addEventListener('mousedown', click);
      tile[row][column].id = index;
      document.body.appendChild(tile[row][column]);
      picture[row][column] = 'hidden';
      board[row][column] = '';
    }

  let placed = 0;
  while (placed < mines) {
    let column = Math.floor(Math.random() * columns);
    let row = Math.floor(Math.random() * rows);

    if (board[row][column] != 'mine') {
      board[row][column] = 'mine';
      placed++;
    }
  }

  for (let column = 0; column < columns; column++)
    for (let row = 0; row < rows; row++) {
      if (check(row, column) != 'mine') {
        board[row][column] =
          ((check(row + 1, column) == 'mine') | 0) +
          ((check(row + 1, column - 1) == 'mine') | 0) +
          ((check(row + 1, column + 1) == 'mine') | 0) +
          ((check(row - 1, column) == 'mine') | 0) +
          ((check(row - 1, column - 1) == 'mine') | 0) +
          ((check(row - 1, column + 1) == 'mine') | 0) +
          ((check(row, column - 1) == 'mine') | 0) +
          ((check(row, column + 1) == 'mine') | 0);
      }
    }
}
