// js/modules/fullscreen.js
export function initFullscreen() {
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  if (!fullscreenBtn) return;

  let hideTimeout = null;
  let isFullscreen = false;

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
      isFullscreen = true;
      document.body.classList.add("fullscreen-enabled");
      setupAutoHide();
    } else {
      fullscreenBtn.innerHTML = "⛶ Fullscreen";
      fullscreenBtn.title = "Enter full screen";
      isFullscreen = false;
      document.body.classList.remove("fullscreen-enabled", "hide-controls");
      removeAutoHide();
    }
  }

  function setupAutoHide() {
    document.removeEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousemove", handleMouseMove);
    clearHideTimeout();
    // Start with controls visible, hide after 2 seconds
    hideTimeout = setTimeout(() => {
      if (isFullscreen) document.body.classList.add("hide-controls");
    }, 2000);
  }

  function handleMouseMove(e) {
    if (!isFullscreen) return;
    const windowHeight = window.innerHeight;
    const mouseY = e.clientY;
    const nearBottom = windowHeight - mouseY < 100;

    clearHideTimeout();
    if (nearBottom) {
      document.body.classList.remove("hide-controls");
      hideTimeout = setTimeout(() => {
        if (isFullscreen) document.body.classList.add("hide-controls");
      }, 2000);
    } else {
      hideTimeout = setTimeout(() => {
        if (isFullscreen) document.body.classList.add("hide-controls");
      }, 1500);
    }
  }

  function clearHideTimeout() {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
  }

  function removeAutoHide() {
    clearHideTimeout();
    document.removeEventListener("mousemove", handleMouseMove);
  }

  fullscreenBtn.addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", updateButtonText);
  updateButtonText();
}
