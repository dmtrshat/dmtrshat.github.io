export function setupNavigation() {
  const elements = {
    hamburger: document.getElementById("hamburger"),
    navLinks: document.getElementById("nav-links"),
  };

  function toggleNavLinks() {
     if (elements.navLinks.classList.contains("display=grid")) {
      elements.navLinks.classList.replace("display=grid", "display=none");
    } else {
      elements.navLinks.classList.replace("display=none", "display=grid");
    }
  }

  function handleClickOutside(event) {
    const isClickInside =
      elements.hamburger.contains(event.target) ||
      elements.navLinks.contains(event.target);

    if (!isClickInside && window.innerWidth < 768) {
        elements.navLinks.classList.replace("display=grid", "display=none");
    }
  }

  function handleResize() {
    if (window.innerWidth >= 768) {
        elements.navLinks.classList.replace("display=grid", "display=none");
    }
  }

  elements.hamburger.addEventListener("click", toggleNavLinks);
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", handleResize);
}
