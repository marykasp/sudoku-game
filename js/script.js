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
btnLevel.innerText = CONSTANT.LEVEL_NAME[levelIndex];
// ---------

// get game property from local storage
const getGameInfo = () => {
  return JSON.parse(localStorage.getItem("game"));
};

console.log(levelIndex, level, btnLevel.innerText);
// Event Listeners
btnLevel.addEventListener("click", (e) => {
  // change the level index when button is clicked on - reset back to first level if index is greatere than the length of the level array
  levelIndex = levelIndex + 1 > CONSTANT.LEVEL.length - 1 ? 0 : levelIndex + 1;
  level = CONSTANT.LEVEL[levelIndex];
  // change the inner text of the button to reflect the current level name
  e.target.innerText = CONSTANT.LEVEL_NAME[levelIndex];
  // console.log(levelIndex, level, e.target);
});

btnPlay.addEventListener("click", () => {
  // change game value from local storage to true
  // hide start screen
  if (nameInput.value.trim().length > 0) {
    alert(`level => ${level}`);
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
  // display continue game button if game value is true
  document.querySelector("#btn-continue").style.display = game
    ? "grid"
    : "none";
};

init();
