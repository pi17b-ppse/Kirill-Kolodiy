/**
 * Количество строк игрового поля.
 * @const {integer} - количество строк.
 */
const rows = 10;
/**
 * Количество столбцов игрового поля.
 * @const {integer} - количество столбцов.
 */
const columns = 10;
/**
 * Переменные для отслеживания количества плиток:
 * 1) заминированые
 * 2) оставшиеся
 * 3) открытые
 */
let mines, remaining, revealed;
/**
 * Ожидание нажатия кнопки мыши.
 */
let status = document.getElementById('status');
status.addEventListener('click', init)

/**
 * Массивы для игрового поля и изображений.
 */
let board = new Array(rows);
let picture = new Array(rows);
let tile = new Array(rows);
for (let i = 0; i < board.length; i++) {
  board[i] = new Array(columns);
  picture[i] = new Array(columns);
  tile[i] = new Array(columns)
}
/**
 * Вызов функции инициализации.
 */
init();

/**
 * Функция проверяет, что координаты не выходят за пределы доски.<br>
 * Значение плитки в координатах (column, row).<br>
 * Координата (0,0) находится в верхнем левом углу.
 *
 * @param {integer} row - индекс массива.
 * @param {integer} column - индекс массива.
 * @returns {Array} -  координаты поля.
 */
function check(row, column) {
  if (column >= 0 && row >= 0 && column < columns && row < rows)
    return board[row][column];
}

/**
 * Функция инициализирует игровое поле.<br>
 * Задается количесво мин и переменная для<br>
 * определения сколько ещё надо найти.<br>
 * Мины расставляются случайным образом.<br>
 * Каждая плитка это картинка, также сделана<br>
 * привязка к нажатию кнопки мыши.
 *
 * @returns {void}
 */
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

/**
 * Функция обработки нажатий правой<br>
 * и левой кнопок мыши.<br>
 * При нажатии любой кнопки меняется<br>
 * свойство плитки, обращение к плиткам<br>
 * происходит через их ID.
 *
 * @returns {void}
 */
function click(event) {
  let source = event.target;
  let id = source.id;
  let row = Math.floor(id / columns);
  let column = id % columns;

  if (event.which == 3) {
    switch (picture[row][column]) {
      case 'hidden':
        tile[row][column].src = 'img/flag.png';
        remaining--;
        picture[row][column] = 'flag';
        break;
      case 'flag':
        tile[row][column].src = 'img/question.png';
        remaining++;
        picture[row][column] = 'question';
        break;
      case 'question':
        tile[row][column].src = 'img/hidden.png';
        picture[row][column] = 'hidden';
        break;
    }
    event.preventDefault();
  }
  status.innerHTML = 'Mines remaining: ' + remaining;

  if (event.which == 1 && picture[row][column] != 'flag') {
    if (board[row][column] == 'mine') {
      for (let row = 0; row < rows; row++)
        for (let column = 0; column < columns; column++) {
          if (board[row][column] == 'mine') {
            tile[row][column].src = 'img/mine.png';
          }
          if (board[row][column] != 'mine' && picture[row][column] == 'flag') {
            tile[row][column].src = 'img/misplaced.png';
          }
        }
      status.innerHTML = 'GAME OVER<br><br>Click here to restart';
    } else
    if (picture[row][column] == 'hidden') reveal(row, column);
  }

  if (revealed == rows * columns - mines)
    status.innerHTML = 'YOU WIN!<br><br>Click here to restart';
}

/**
 * Функция вызывается для обнаружения<br>
 * всех соседних нулевых плиток.
 *
 * @param  {integer} row - индекс массива.
 * @param {integer} column - индекс массива.
 * @returns {void}
 */
function reveal(row, column) {
  tile[row][column].src = 'img/' + board[row][column] + '.png';
  if (board[row][column] != 'mine' && picture[row][column] == 'hidden')
    revealed++;
  picture[row][column] = board[row][column];

  if (board[row][column] == 0) {
    if (column > 0 && picture[row][column - 1] == 'hidden') reveal(row, column - 1);
    if (column < (columns - 1) && picture[row][+column + 1] == 'hidden') reveal(row, +column + 1);
    if (row < (rows - 1) && picture[+row + 1][column] == 'hidden') reveal(+row + 1, column);
    if (row > 0 && picture[row - 1][column] == 'hidden') reveal(row - 1, column);
    if (column > 0 && row > 0 && picture[row - 1][column - 1] == 'hidden') reveal(row - 1, column - 1);
    if (column > 0 && row < (rows - 1) && picture[+row + 1][column - 1] == 'hidden') reveal(+row + 1, column - 1);
    if (column < (columns - 1) && row < (rows - 1) && picture[+row + 1][+column + 1] == 'hidden') reveal(+row + 1, +column + 1);
    if (column < (columns - 1) && row > 0 && picture[row - 1][+column + 1] == 'hidden') reveal(row - 1, +column + 1);
  }
}
