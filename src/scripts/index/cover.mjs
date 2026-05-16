export function setupCover() {
  const meCover = document.getElementById("me-cover");

  const allCovers = Array.from({ length: 34 }, (_, i) =>
    (i + 1).toString()
  ).concat("photo");

  const getRandomCover = () =>
    `assets/${allCovers[Math.floor(Math.random() * allCovers.length)]}.webp`;

  const setBlurEffect = (applyBlur) => {
    meCover.style.filter = applyBlur ? "blur(6px)" : "none";
  };

  let isTouchDevice = false;

  const handleInteractionStart = (event) => {
    if (event.type === "touchstart") {
      isTouchDevice = true;
    } else if (isTouchDevice) {
      return;
    }
    setBlurEffect(true);
    const path = getRandomCover();
    setTimeout(() => {
      meCover.style.backgroundImage = `url(${path})`;
    }, 10);
  };

  const handleInteractionEnd = (event) => {
    if (isTouchDevice && event.type !== "touchend") {
      return;
    }
    setBlurEffect(false);
  };

  meCover.addEventListener("mouseenter", handleInteractionStart);
  meCover.addEventListener("mouseleave", handleInteractionEnd);

  meCover.addEventListener("touchstart", handleInteractionStart);
  meCover.addEventListener("touchend", handleInteractionEnd);
}
