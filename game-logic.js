// game-logic.js

const sounds = {
  X: new Howl({ src: ['https://cdn.jsdelivr.net/gh/jshawl/mario-sounds/x.mp3'] }),
  O: new Howl({ src: ['https://cdn.jsdelivr.net/gh/jshawl/mario-sounds/o.mp3'] }),
  win: new Howl({ src: ['https://cdn.jsdelivr.net/gh/jshawl/mario-sounds/win.mp3'] })
};

function toggleGame(game) {
  document.querySelectorAll('.rules').forEach(r => r.style.display = 'none');
  document.querySelectorAll('.game-container').forEach(g => g.style.display = 'none');
  document.getElementById(game).style.display = 'block';
  if (game === 'tic-tac-toe') initTicTacToe();
  if (game === 'sudoku') initSudoku();
}

function initTicTacToe() {
  const board = document.getElementById('ttt-board');
  const message = document.getElementById('ttt-message');
  const resetBtn = document.getElementById('ttt-reset');
  let currentPlayer = 'X';
  let cells = Array(9).fill('');
  board.innerHTML = '';
  message.textContent = "Your Turn -> X";

  function checkWin() {
    const wins = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    return wins.find(w => cells[w[0]] && cells[w[0]] === cells[w[1]] && cells[w[0]] === cells[w[2]]);
  }

  function isDraw() {
    return cells.every(c => c !== '') && !checkWin();
  }

  function aiMove() {
    let empty = cells.map((v, i) => v === '' ? i : null).filter(v => v !== null);
    let move = empty[Math.floor(Math.random() * empty.length)];
    if (move === undefined) return;
    cells[move] = 'O';
    const cellDiv = board.children[move];
    cellDiv.textContent = 'O';
    cellDiv.classList.add('o');
    sounds['O'].play();

    const winner = checkWin();
    if (winner) {
      message.textContent = "Ai (O) won!";
      sounds.win.play();
      disableBoard();
      return;
    }
    if (isDraw()) {
      message.textContent = "It's a draw!";
      disableBoard();
      return;
    }

    currentPlayer = 'X';
    message.textContent = "Your Turn -> X";
  }

  function disableBoard() {
    for (let i=0; i<board.children.length; i++) {
      board.children[i].style.pointerEvents = 'none';
    }
  }

  function enableBoard() {
    for (let i=0; i<board.children.length; i++) {
      board.children[i].style.pointerEvents = 'auto';
    }
  }

  function resetGame() {
    cells.fill('');
    board.innerHTML = '';
    message.textContent = "Your Turn -> X";
    currentPlayer = 'X';
    enableBoard();
    setupCells();
  }

  function setupCells() {
    cells.forEach((_, i) => {
      const cell = document.createElement('div');
      cell.classList.remove('x', 'o');
      cell.addEventListener('click', () => {
        if (!cells[i] && currentPlayer === 'X' && !checkWin()) {
          cells[i] = 'X';
          cell.textContent = 'X';
          cell.classList.add('x');
          sounds['X'].play();
          const winner = checkWin();
          if (winner) {
            message.textContent = "You won!";
            sounds.win.play();
            disableBoard();
            return;
          }
          if (isDraw()) {
            message.textContent = "It's a draw!";
            disableBoard();
            return;
          }
          currentPlayer = 'O';
          message.textContent = "Ai (O) thinking...";
          disableBoard();
          setTimeout(() => {
            aiMove();
            enableBoard();
          }, 700);
        }
      });
      board.appendChild(cell);
    });
  }

  resetBtn.onclick = resetGame;
  setupCells();
}

function initSudoku() {
  const board = document.getElementById('sudoku-board');
  const message = document.getElementById('sudoku-message');
  const resetBtn = document.getElementById('sudoku-reset');
  board.innerHTML = '';
  message.textContent = "";

  const puzzle = [
    5,3,0, 0,7,0, 0,0,0,
    6,0,0, 1,9,5, 0,0,0,
    0,9,8, 0,0,0, 0,6,0,
    8,0,0, 0,6,0, 0,0,3,
    4,0,0, 8,0,3, 0,0,1,
    7,0,0, 0,2,0, 0,0,6,
    0,6,0, 0,0,0, 2,8,0,
    0,0,0, 4,1,9, 0,0,5,
    0,0,0, 0,8,0, 0,7,9
  ];

  for (let i = 0; i < 81; i++) {
    const input = document.createElement('input');
    input.type = 'number';
    input.min = 1;
    input.max = 9;

    if (puzzle[i] !== 0) {
      input.value = puzzle[i];
      input.disabled = true;
      input.style.color = "#ffd93b";
      input.style.fontWeight = "bold";
      input.style.background = "#222222";
    }

    board.appendChild(input);
  }

  function resetSudoku() {
    const inputs = board.querySelectorAll('input');
    inputs.forEach((input) => {
      if (!input.disabled) input.value = '';
    });
    message.textContent = "";
  }

  resetBtn.onclick = resetSudoku;
}

// PARTICLE BACKGROUND
tsParticles.load("tsparticles", {
  background: { color: { value: "transparent" } },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
      resize: true
    },
    modes: {
      repulse: { distance: 100, duration: 0.4 }
    }
  },
  particles: {
    color: { value: "#ffffff" },
    links: { enable: true, color: "#ffffff", distance: 150, opacity: 0.3, width: 1 },
    collisions: { enable: true },
    move: {
      direction: "none",
      enable: true,
      outModes: "bounce",
      random: false,
      speed: 1,
      straight: false
    },
    number: { density: { enable: true, area: 800 }, value: 50 },
    opacity: { value: 0.5 },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 5 } }
  },
  detectRetina: true
});

// TYPEWRITER EFFECT FOR RULES
function typeRuleText(elementId, contentArray, delay = 300) {
  const container = document.getElementById(elementId);
  container.innerHTML = '';
  let i = 0;

  const interval = setInterval(() => {
    if (i < contentArray.length) {
      const li = document.createElement('li');
      li.textContent = '';
      const words = contentArray[i].split(' ');
      let w = 0;

      const wordInterval = setInterval(() => {
        if (w < words.length) {
          li.innerHTML += words[w] + '&nbsp;';
          w++;
        } else {
          clearInterval(wordInterval);
        }
      }, 200);

      container.appendChild(li);
      i++;
    } else {
      clearInterval(interval);
    }
  }, delay);
}

function toggleRules(game) {
  document.querySelectorAll('.rules').forEach(r => r.style.display = 'none');
  document.querySelectorAll('.game-container').forEach(g => g.style.display = 'none');

  const rulesContainer = document.getElementById(`rules-${game}`);
  const listId = `${game}-rule-list`;
  const rulesText = {
    'tic-tac-toe': [
      "Two players take turns marking spaces in a 3×3 grid with X or O.",
      "The player who succeeds in placing three of their marks in a row wins.",
      "The row can be horizontal, vertical, or diagonal."
    ],
    'sudoku': [
      "Fill the grid so every row, column, and 3×3 box contains digits 1 to 9.",
      "No repeating numbers allowed in any row, column, or box.",
      "Some numbers will be pre-filled to help you start."
    ]
  };

  rulesContainer.style.display = 'block';
  typeRuleText(listId, rulesText[game]);
}
