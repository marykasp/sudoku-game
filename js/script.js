// ===================== SELECTORS =============================
const darkModeToggle = document.querySelector("#dark-mode-toggle");
const nameInput = document.querySelector("#input-name");
const btnPlay = document.querySelector("#btn-play");
const errorMsg = document.querySelector(".error-message");
const btnLevel = document.querySelector("#btn-level");
const btnPause = document.querySelector("#btn-pause");
const btnClose = document.querySelector(".close");

// Game Selectors
const cells = document.querySelectorAll(".main-grid-cell");
const playerName = document.querySelector("#player-name");
const gameLevel = document.querySelector("#game-level");
const gameTime = document.querySelector("#game-time");
const numberInputs = document.querySelectorAll(".number");

// Screens
const startScreen = document.querySelector("#start-screen");
const gameScreen = document.querySelector("#game-screen");
const pauseScreen = document.querySelector("#pause-screen");
// ---------------------------

// ===================== INITIAL VALUES =============================
let levelIndex = 0;
let level = CONSTANT.LEVEL[levelIndex];
let timer = null;
let pause = false;
let seconds = 0;

let su = undefined;
let suAnswer = undefined;

// -------------------------

// ===================== FUNCTIONS =============================

// get game property from local storage
const getGameInfo = () => {
  return JSON.parse(localStorage.getItem("game"));
};

const setPlayerName = (name) =>
  localStorage.setItem("playerName", JSON.stringify(name));
const getPlayerName = () => JSON.parse(localStorage.getItem("playerName"));

// calculate and display the time
const showTime = (seconds) => {
  let hour = Math.floor(seconds / 3600);
  let minute = Math.floor(seconds / 60);
  let totalseconds = seconds - (hour * 3600 + minute * 60);

  // display the time
  gameTime.querySelector("#hour").innerHTML = hour;
  gameTime.querySelector("#minute").innerHTML = minute;
  gameTime.querySelector("#seconds").innerHTML = totalseconds;
};

// add space for each 9 cells
const initGamegrid = () => {
  for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
    // row value will remain the same left to right in the row
    let row = Math.floor(i / CONSTANT.GRID_SIZE);
    // column will increase by one going left to right in the row
    let col = i % CONSTANT.GRID_SIZE;
    if (row === 2 || row === 5) {
      cells[i].style.marginBottom = "10px";
    }
    if (col === 2 || col === 5) {
      cells[i].style.marginRight = "10px";
    }
  }
};

const clearSudoku = () => {
  for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
    cells[i].innerHTML = "";
    cells[i].classList.remove("filled");
    cells[i].classList.remove("selected");
  }
};

const initSudoku = () => {
  // clear old sudoku
  clearSudoku();
  // resetBg - removea all hover classes from the cells
  resetBg();
  // generate sudoku puzzle - returns an object with answer and board to play
  su = sudokuGenerate(level);
  console.log(su);
  // make a copy of the board
  suAnswer = [...su.question];

  // show sudoku to div cells - iterate over all the cells and set the data attribute to be the same as the suduku grid
  for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
    let row = Math.floor(i / CONSTANT.GRID_SIZE);
    let col = i % CONSTANT.GRID_SIZE;

    cells[i].setAttribute("data-value", su.question[row][col]);

    if (su.question[row][col] !== 0) {
      // if row is not empty add filled class and add number
      cells[i].classList.add("filled");
      cells[i].innerHTML = su.question[row][col];
    }
  }
};

const hoverBg = (index) => {
  let row = Math.floor(index / CONSTANT.GRID_SIZE);
  let col = index % CONSTANT.GRID_SIZE;

  let boxStartRow = row - (row % 3);
  let boxStartCol = col - (col % 3);

  for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
    for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
      let cell = cells[9 * (boxStartRow + i) + (boxStartCol + j)];
      cell.classList.add("hover");
    }
  }

  let step = 9;
  while (index - step >= 0) {
    cells[index - step].classList.add("hover");
    step += 9;
  }

  step = 9;
  while (index + step < 81) {
    cells[index + step].classList.add("hover");
    step += 9;
  }

  step = 1;
  while (index - step >= 9 * row) {
    cells[index - step].classList.add("hover");
    step += 1;
  }

  step = 1;
  while (index + step < 9 * row + 9) {
    cells[index + step].classList.add("hover");
    step += 1;
  }
};

const resetBg = () => {
  cells.forEach((e) => e.classList.remove("hover"));
};

const initCellsEvent = () => {
  // for each cell add an event listenter
  cells.forEach((e, index) => {
    e.addEventListener("click", () => {
      // if classlist of cell clicked on is not a filled cell
      if (!e.classList.contains("filled")) {
        // then iterate over the cells and remove selected from all
        cells.forEach((e) => e.classList.remove("selected"));

        // add selected class to cell clicked on, get the index of the selected cell
        selectedCell = index;
        e.classList.remove("err");
        e.classList.add("selected");
        // remove hover class from each cell
        resetBg();
        // pass in index of cell selected to change hover
        hoverBg(index);
      }
    });
  });
};

// const initNumberInputEvent = () => {
//   numberInputs.forEach((e, index) => {
//     e.addEventListener("click", () => {
//       if (!cells[selectedCell].classList.contains("filled")) {
//         cells[selectedCell].innerHTML = index + 1;
//         cells[selectedCell].setAttribute("data-value", index + 1);
//       }
//     });
//   });
// };

// ---------------
const startGame = () => {
  startScreen.classList.remove("active");
  gameScreen.classList.add("active");

  // get player name from input
  playerName.querySelector("#player").innerHTML = nameInput.value;
  // save player name in local storage
  setPlayerName(nameInput.value.trim());

  gameLevel.innerHTML = CONSTANT.LEVEL_NAME[levelIndex];

  seconds = 0;
  showTime(seconds);

  timer = setInterval(() => {
    if (!pause) {
      seconds = seconds + 1;
      showTime(seconds);
    }
  }, 1000);
};

// --------------------------

// ===================== EVENT LISTENERS =============================
// toggle on and off dark mode
darkModeToggle.addEventListener("click", () => {
  // toggle on and off dark mode
  document.body.classList.toggle("dark");
  // save theme to local storage
  const isDarkMode = document.body.classList.contains("dark");
  localStorage.setItem("darkmode", isDarkMode);
  // change mobile status bar color
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute("content", isDarkMode ? "#37399a" : "#faf2ef");
});

// change level of game and inner text of button to match
// ---- LEVEL: [29, 38, 47, 56] - Easy, Medium, Hard, Difficult
btnLevel.addEventListener("click", (e) => {
  // change the level index when button is clicked on - reset back to first level if index is greatere than the length of the level array
  levelIndex = levelIndex + 1 > CONSTANT.LEVEL.length - 1 ? 0 : levelIndex + 1;
  level = CONSTANT.LEVEL[levelIndex];
  // change the inner text of the button to reflect the current level name
  e.target.innerText = CONSTANT.LEVEL_NAME[levelIndex];
  // console.log(levelIndex, level, e.target);
});

document.querySelector("#btn-new-game").addEventListener("click", () => {
  clearInterval(timer);
  pause = false;
  seconds = 0;
  gameScreen.classList.remove("active");
  pauseScreen.classList.remove("active");
  startScreen.classList.add("active");
});

// New Game Button - show error if no name
btnPlay.addEventListener("click", () => {
  // change game value from local storage to true
  // hide start screen, display game
  if (nameInput.value.trim().length > 0) {
    initSudoku();
    startGame();
  } else {
    // show error message
    errorMsg.style.display = "block";
    errorMsg.innerText = "Name can't be empty";
    nameInput.classList.add("input-err");
    setTimeout(() => {
      nameInput.classList.remove("input-err");
      errorMsg.style.display = "none";
      nameInput.focus();
    }, 1500);
  }
});

btnPause.addEventListener("click", () => {
  // add active to pause screen
  pauseScreen.classList.add("active");
  gameScreen.classList.remove("active");

  // display name and level
  document.querySelector(".player-info-name").innerHTML = getPlayerName();
  document.querySelector(".player-info-level").innerHTML =
    CONSTANT.LEVEL_NAME[levelIndex];
  const playerLevel = document
    .querySelector(".player-info-level")
    .innerText.toLowerCase();

  let color = `var(--${playerLevel})`;

  // use player level to set background color of span element
  document.querySelector(".player-info-level").style.backgroundColor = color;
  // change pause variable value
  pause = true;
});

document.querySelector("#btn-resume").addEventListener("click", () => {
  pauseScreen.classList.remove("active");
  gameScreen.classList.add("active");
  pause = false;
});

btnClose.addEventListener("click", () => {
  pauseScreen.classList.remove("active");
  gameScreen.classList.add("active");
  pause = false;
});

// --------------------------

// ===================== INITIALIZE GAME =============================
const init = () => {
  // get darkmode boolean value from local storage
  const darkmode = JSON.parse(localStorage.getItem("darkmode"));
  // if true then add dark class to body element
  document.body.classList.add(darkmode ? "dark" : "light");
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute("content", darkmode ? "#37399a" : "#faf2ef");
  // set game info
  const game = getGameInfo();
  // display continue game button if game value is true
  document.querySelector("#btn-continue").style.display = game
    ? "grid"
    : "none";

  // initialize game grid
  initGamegrid();
  initCellsEvent();

  if (getPlayerName()) {
    nameInput.value = getPlayerName();
  } else {
    nameInput.focus();
  }
};

init();
