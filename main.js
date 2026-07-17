const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const scrollLayers = [
  ...document.querySelectorAll(
    ".hero-illustration, .hero-copy, .section-heading, .entry, .teaching-entry"
  ),
];

let frameRequested = false;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateScrollLayers() {
  const viewportHeight = window.innerHeight;

  scrollLayers.forEach((layer, index) => {
    const bounds = layer.getBoundingClientRect();
    const travel = viewportHeight + bounds.height;
    const progress = clamp((viewportHeight - bounds.top) / travel, 0, 1);
    const visibility = Math.pow(Math.sin(progress * Math.PI), 0.55);
    const distanceFromFocus = Math.abs(progress - 0.5) * 2;
    const strength = layer.matches(".hero-illustration") ? 22 : 38;
    const direction = index % 2 === 0 ? 1 : 0.82;
    const offset = (0.5 - progress) * strength * direction;

    layer.style.setProperty("--scroll-opacity", visibility.toFixed(3));
    layer.style.setProperty("--scroll-offset", `${offset.toFixed(2)}px`);
    layer.style.setProperty(
      "--scroll-blur",
      `${(Math.max(0, distanceFromFocus - 0.46) * 3.2).toFixed(2)}px`
    );
  });

  frameRequested = false;
}

function requestScrollUpdate() {
  if (!frameRequested) {
    window.requestAnimationFrame(updateScrollLayers);
    frameRequested = true;
  }
}

function setMotionPreference() {
  document.documentElement.classList.toggle("scroll-motion", !reduceMotion.matches);

  if (reduceMotion.matches) {
    scrollLayers.forEach((layer) => layer.removeAttribute("style"));
    return;
  }

  requestScrollUpdate();
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
reduceMotion.addEventListener("change", setMotionPreference);
setMotionPreference();
