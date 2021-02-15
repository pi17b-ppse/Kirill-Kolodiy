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
