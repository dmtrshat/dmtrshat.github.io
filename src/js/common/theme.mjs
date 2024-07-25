export function setupTheme() {
  const themes = {
    hackerLight: "hacker-light",
    hackerDark: "hacker-dark",
  };

  const STORAGE_KEY = "dmtrshat-theme";
  const themeSelectorContainer = document.getElementById("theme-select");

  function updateTheme(newTheme) {
    let themeForUpdate = newTheme;
    if (!Object.values(themes).includes(newTheme)) {
      console.error(`Invalid theme: '${newTheme}'; Using the default one`);
      themeForUpdate = themes.hackerLight;
    }

    localStorage.setItem(STORAGE_KEY, themeForUpdate);
    document.body.setAttribute("data-theme", themeForUpdate);
    themeSelectorContainer.value = themeForUpdate;
  }

  function handleThemeChange(e) {
    if (e.target.id === "hacker-light-btn") {
      updateTheme(themes.hackerDark);
      e.stopPropagation();
    } else if (e.target.id === "hacker-dark-btn") {
      updateTheme(themes.hackerLight);
      e.stopPropagation();
    }
  }

  function initializeTheme() {
    const cachedTheme = localStorage.getItem(STORAGE_KEY);
    const defaultTheme = themes.hackerLight;
    updateTheme(cachedTheme || defaultTheme);
  }

  themeSelectorContainer.addEventListener("click", handleThemeChange);
  initializeTheme();
}
