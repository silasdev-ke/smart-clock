// js/modules/settings.js
/**
 * Settings Module: real-time timer configuration
 */

export function initSettings() {
  const settingsBtn = document.getElementById("settingsBtn");
  const modal = document.getElementById("settingsModal");
  const backdrop = document.getElementById("modalBackdrop");
  const closeBtn = document.getElementById("closeSettingsBtn");
  const saveBtn = document.getElementById("saveSettingsBtn");
  const contextInput = document.getElementById("contextInput");
  const subjectInput = document.getElementById("subjectInput");
  const notesInput = document.getElementById("notesInput");
  const contextDisplay = document.getElementById("contextDisplay");
  const subjectDisplay = document.getElementById("subjectDisplay");
  const notesDisplay = document.getElementById("notesDisplay");

  const savedContext = localStorage.getItem("timerContext") || "TIMER CONTROL";
  const savedSubject = localStorage.getItem("timerSubject") || "";
  const savedNotes = localStorage.getItem("timerNotes") || "";
  contextDisplay.textContent = savedContext;
  subjectDisplay.textContent = savedSubject;
  notesDisplay.textContent = savedNotes;
  contextInput.value = savedContext;
  subjectInput.value = savedSubject;
  notesInput.value = savedNotes;

  settingsBtn.addEventListener("click", () => modal.classList.remove("hidden"));
  const closeModal = () => modal.classList.add("hidden");
  backdrop.addEventListener("click", closeModal);
  closeBtn.addEventListener("click", closeModal);

  saveBtn.addEventListener("click", () => {
    const context = contextInput.value.trim() || "TIMER CONTROL";
    const subject = subjectInput.value.trim();
    const notes = notesInput.value.trim();
    localStorage.setItem("timerContext", context);
    localStorage.setItem("timerSubject", subject);
    localStorage.setItem("timerNotes", notes);
    contextDisplay.textContent = context;
    subjectDisplay.textContent = subject;
    notesDisplay.textContent = notes;
    closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  });
}
