export function setupNavigation() {
  const elements = {
    hamburger: document.getElementById("hamburger"),
    navLinks: document.getElementById("nav-links"),
  };

  function toggleNavLinks() {
    if (elements.navLinks.classList.contains("g!display=grid;")) {
      elements.navLinks.classList.replace("g!display=grid;", "g!display=none;");
    } else {
      elements.navLinks.classList.replace("g!display=none;", "g!display=grid;");
    }
  }

  function handleClickOutside(event) {
    const isClickInside =
      elements.hamburger.contains(event.target) ||
      elements.navLinks.contains(event.target);

    if (!isClickInside && window.innerWidth < 768) {
      elements.navLinks.classList.replace("g!display=grid;", "g!display=none;");
    }
  }

  function handleResize() {
    if (window.innerWidth >= 768) {
      elements.navLinks.classList.replace("g!display=grid;", "g!display=none;");
    }
  }

  elements.hamburger.addEventListener("click", toggleNavLinks);
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", handleResize);
}
