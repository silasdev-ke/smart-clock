// js/modules/theme.js
/**
 * THeme Module: theme toggle with smooth updates
 */

export function initThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  const html = document.documentElement;
  const savedTheme = localStorage.getItem("theme") || "dark";
  if (savedTheme === "light") {
    html.classList.add("light");
    themeToggle.innerHTML = '<i class="fas fa-moon mr-1"></i>Dark';
  }
  themeToggle.addEventListener("click", () => {
    if (html.classList.contains("light")) {
      html.classList.remove("light");
      localStorage.setItem("theme", "dark");
      themeToggle.innerHTML = '<i class="fas fa-sun mr-1"></i>Light';
    } else {
      html.classList.add("light");
      localStorage.setItem("theme", "light");
      themeToggle.innerHTML = '<i class="fas fa-moon mr-1"></i>Dark';
    }
  });
}
