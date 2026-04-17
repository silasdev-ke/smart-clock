// js/modules/view.js
export function initView() {
  const dashboard = document.getElementById("dashboard");
  const clockCard = document.getElementById("clockCard");
  const viewButtons = document.querySelectorAll(".mode-switch .view-option");

  const modeMap = {
    classic: "analog",
    modern: "digital",
    standard: "clock",
    split: "both",
    timerfocus: "timer",
  };

  function setView(viewValue) {
    const mode = modeMap[viewValue];
    if (!mode) return;

    // Reset all dashboard mode classes
    dashboard.classList.remove(
      "analog-mode",
      "digital-mode",
      "clock-mode",
      "timer-mode",
    );
    if (clockCard) {
      clockCard.classList.remove("hide-analog", "hide-digital");
    }

    switch (mode) {
      case "analog":
        dashboard.classList.add("analog-mode");
        if (clockCard) clockCard.classList.add("hide-digital");
        break;
      case "digital":
        dashboard.classList.add("digital-mode");
        if (clockCard) clockCard.classList.add("hide-analog");
        break;
      case "clock":
        dashboard.classList.add("clock-mode");
        break;
      case "both":
        // split view – no extra class
        break;
      case "timer":
        dashboard.classList.add("timer-mode");
        break;
      default:
        break;
    }

    // Update active button styling – ensure all are updated correctly
    viewButtons.forEach((btn) => {
      const btnView = btn.getAttribute("data-view");
      if (btnView === viewValue) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  viewButtons.forEach((btn) => {
    const view = btn.getAttribute("data-view");
    if (view) {
      btn.addEventListener("click", () => setView(view));
    }
  });

  // Default: Split View
  setView("split");
}
