// js/modules/fullscreen.js
/**
 * Fullscreen Module: cross-browser fullscreen toggle with dynamic button text
 */
export function initFullscreen() {
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  if (!fullscreenBtn) return;

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Fullscreen error: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  function updateButtonText() {
    if (document.fullscreenElement) {
      fullscreenBtn.innerHTML = "✖ Exit";
      fullscreenBtn.title = "Exit full screen";
    } else {
      fullscreenBtn.innerHTML = "⛶ Fullscreen";
      fullscreenBtn.title = "Enter full screen";
    }
  }

  fullscreenBtn.addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", updateButtonText);
  updateButtonText();
}
