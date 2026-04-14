// js/main.js
import { initClock } from "./modules/clock.js";
import { initTimer } from "./modules/timer.js";
import { initView } from "./modules/view.js";
import { initFullscreen } from "./modules/fullscreen.js";
import { initSettings } from "./modules/settings.js";
import { initThemeToggle } from "./modules/theme.js";

/**
 * Main entry point: initializes all modules after DOM is ready
 */
document.addEventListener("DOMContentLoaded", () => {
  initClock();
  initTimer();
  initView();
  initFullscreen();
  initSettings();
  initThemeToggle();
});
