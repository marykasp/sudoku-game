// Selectors
const darkModeToggle = document.querySelector("#dark-mode-toggle");
const nameInput = document.querySelector("#input-name");
const startScreen = document.querySelector("#start-screen");
const btnPlay = document.querySelector("#btn-play");
const errorMsg = document.querySelector(".error-message");
const btnLevel = document.querySelector("#btn-level");

// initial values
let levelIndex = 0;
let level = CONSTANT.LEVEL[levelIndex];

// ---------

// get game property from local storage
const getGameInfo = () => {
  return JSON.parse(localStorage.getItem("game"));
};

// Event Listeners
btnLevel.addEventListener("click", (e) => {
  console.log(levelIndex, level, e.target);
  // change the level index when button is clicked on - reset back to first level if index is greatere than the length of the level array
  levelIndex = levelIndex === CONSTANT.LEVEL.length - 1 ? 0 : levelIndex + 1;
  level = CONSTANT.LEVEL[levelIndex];
  e.target.innerText = CONSTANT.LEVEL_NAME[levelIndex];
});

btnPlay.addEventListener("click", () => {
  // change game value from local storage to true
  // hide start screen
  if (nameInput.value.trim().length > 0) {
    alert("start game");
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
  document.querySelector("#btn-continue").style.display = game
    ? "grid"
    : "none";
};

init();
