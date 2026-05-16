export function setupTheme() {
  const themes = {
    hackerLight: "hacker-light",
    hackerDark: "hacker-dark",
    system: "system",
  };

  const STORAGE_KEY = "dmtrshat-theme";
  const themeSelectorContainer = document.getElementById("theme-select");
  const systemQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function getSystemResolvedTheme() {
    return systemQuery.matches ? themes.hackerDark : themes.hackerLight;
  }

  function updateTheme(newMode) {
    let modeForUpdate = newMode;
    if (!Object.values(themes).includes(newMode)) {
      console.error(`Invalid theme: '${newMode}'; Using the default one`);
      modeForUpdate = themes.system;
    }

    localStorage.setItem(STORAGE_KEY, modeForUpdate);
    document.body.setAttribute("data-theme-mode", modeForUpdate);

    const resolvedTheme =
      modeForUpdate === themes.system ? getSystemResolvedTheme() : modeForUpdate;
    document.body.setAttribute("data-theme", resolvedTheme);
  }

  function handleThemeChange(e) {
    if (e.target.id === "hacker-light-btn") {
      updateTheme(themes.hackerDark);
      e.stopPropagation();
    } else if (e.target.id === "hacker-dark-btn") {
      updateTheme(themes.system);
      e.stopPropagation();
    } else if (e.target.id === "system-btn") {
      updateTheme(themes.hackerLight);
      e.stopPropagation();
    }
  }

  function initializeTheme() {
    const cachedTheme = localStorage.getItem(STORAGE_KEY);
    updateTheme(cachedTheme || themes.system);
  }

  systemQuery.addEventListener("change", () => {
    if (document.body.getAttribute("data-theme-mode") === themes.system) {
      document.body.setAttribute("data-theme", getSystemResolvedTheme());
    }
  });

  themeSelectorContainer.addEventListener("click", handleThemeChange);
  initializeTheme();
}
