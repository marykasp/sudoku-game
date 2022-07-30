// Selectors
const darkModeToggle = document.querySelector("#dark-mode-toggle");

// Event Listeners
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
};

init();
