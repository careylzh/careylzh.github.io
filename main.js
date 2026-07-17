const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const symbolColors = [
  "#d98fa8",
  "#b7a0d9",
  "#dfa58c",
  "#8db9ad",
  "#91acd0",
  "#d5ba70",
];

function createSymbolField() {
  const field = document.createElement("div");
  field.className = "symbol-field";
  field.setAttribute("aria-hidden", "true");

  Array.from({ length: 34 }, (_, index) => {
    const symbol = document.createElement("span");
    symbol.className = "floating-symbol";
    symbol.textContent = "ᯅ";
    symbol.style.setProperty("--left", `${(index * 29 + 7) % 101}%`);
    symbol.style.setProperty("--top", `${(index * 41 + 3) % 103}%`);
    symbol.style.setProperty("--size", `${18 + ((index * 13) % 48)}px`);
    symbol.style.setProperty("--duration", `${13 + ((index * 17) % 22)}s`);
    symbol.style.setProperty("--delay", `${-((index * 11) % 25)}s`);
    symbol.style.setProperty("--drift", `${-80 + ((index * 37) % 161)}px`);
    symbol.style.setProperty("--symbol-color", symbolColors[index % symbolColors.length]);
    symbol.style.setProperty("--symbol-opacity", `${0.09 + ((index * 3) % 11) / 100}`);
    field.append(symbol);
  });

  document.body.prepend(field);
}

createSymbolField();

const scrollLayers = [
  ...document.querySelectorAll(
    ".hero-illustration, .hero-copy, .section-heading, .entry, .teaching-entry"
  ),
];

let frameRequested = false;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function smoothstep(edgeStart, edgeEnd, value) {
  const position = clamp((value - edgeStart) / (edgeEnd - edgeStart), 0, 1);
  return position * position * (3 - 2 * position);
}

function updateScrollLayers() {
  const viewportHeight = window.innerHeight;

  scrollLayers.forEach((layer, index) => {
    const bounds = layer.getBoundingClientRect();
    const travel = viewportHeight + bounds.height;
    const progress = clamp((viewportHeight - bounds.top) / travel, 0, 1);
    const fadeIn = smoothstep(0.02, 0.25, progress);
    const fadeOut = 1 - smoothstep(0.56, 0.84, progress);
    const visibility = fadeIn * fadeOut;
    const dissolve = 1 - visibility;
    const isExiting = progress > 0.56;
    const strength = layer.matches(".hero-illustration") ? 36 : 58;
    const direction = index % 2 === 0 ? 1 : 0.82;
    const offset = (0.5 - progress) * strength * direction;
    const blur = Math.pow(dissolve, 1.35) * (isExiting ? 18 : 12);
    const scale = 1 + Math.pow(dissolve, 1.6) * (isExiting ? 0.035 : 0.018);
    const saturation = 1 - dissolve * 0.82;
    const contrast = 1 - dissolve * 0.32;

    layer.style.setProperty("--scroll-opacity", Math.pow(visibility, 1.35).toFixed(3));
    layer.style.setProperty("--scroll-offset", `${offset.toFixed(2)}px`);
    layer.style.setProperty("--scroll-blur", `${blur.toFixed(2)}px`);
    layer.style.setProperty("--scroll-scale", scale.toFixed(4));
    layer.style.setProperty("--scroll-saturation", saturation.toFixed(3));
    layer.style.setProperty("--scroll-contrast", contrast.toFixed(3));
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
