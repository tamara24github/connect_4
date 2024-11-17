"use strict";

class Game {
  constructor(p1, p2, height = 6, width = 7) {
    this.players = [p1, p2];
    this.height = height;
    this.width = width;
    this.currPlayer = p1;
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
  }

  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.height; y++) {
      const emptyRow = Array.from({ length: this.width }).fill(null);
      this.board.push(emptyRow);
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";

    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", `top-${x}`);
      headCell.addEventListener("click", this.handleClick.bind(this));
      top.append(headCell);
    }

    board.append(top);

    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `c-${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.backgroundColor = this.currPlayer.color;

    const spot = document.getElementById(`c-${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
  }

  #win(cells) {
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.height &&
        x >= 0 &&
        x < this.width &&
        this.board[y][x] === this.currPlayer
    );
  }

  checkForWin() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        if (
          this.#win(horiz) ||
          this.#win(vert) ||
          this.#win(diagDR) ||
          this.#win(diagDL)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  handleClick(evt) {
    if (this.gameOver) {
      return;
    }

    const x = Number(evt.target.id.slice("top-".length));

    const y = this.findSpotForCol(x);
    if (y === null) return;

    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    if (this.board[0].every((cell) => cell !== null)) {
      this.gameOver = true;
      return this.endGame("Tie!");
    }

    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`The ${this.currPlayer.color} player won!`);
    }

    this.currPlayer =
      this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }
}

class Player {
  constructor(color) {
    this.color = color;
  }
}

let g;

document
  .getElementById("start-game")
  .addEventListener("submit", function (evt) {
    evt.preventDefault();
    const p1 = new Player(document.getElementById("p1-color").value);
    const p2 = new Player(document.getElementById("p2-color").value);
    g = new Game(p1, p2);
  });
