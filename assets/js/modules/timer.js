// js/modules/timer.js
import { formatHMS, parseDuration } from "../utils/helpers.js";

/**
 * Timer Module (Timestamp-based for accuracy)
 * Manages countdown state, UI, and prevents drift during background throttling.
 */
export function initTimer() {
  // Core state
  let totalSeconds = 5400; // default 90 mins
  let remainingSeconds = 5400;
  let timerInterval = null;
  let isRunning = false;
  let endTimestamp = null; // absolute time when timer should finish
  let startMoment = null; // actual start time for display

  // DOM elements
  const remainingDisplay = document.getElementById("remainingDisplay");
  const progressFill = document.getElementById("progressFill");
  const progressPercent = document.getElementById("progressPercent");
  const infoDuration = document.getElementById("infoDuration");
  const infoStart = document.getElementById("infoStart");
  const infoEnd = document.getElementById("infoEnd");
  const statusMsg = document.getElementById("statusMsg");
  const durationRow = document.getElementById("durationRow");
  const durationMins = document.getElementById("durationMins");
  const durationSecs = document.getElementById("durationSecs");
  const setDurationBtn = document.getElementById("setDurationBtn");
  const startBtn = document.getElementById("startTimerBtn");
  const pauseBtn = document.getElementById("pauseTimerBtn");
  const resetBtn = document.getElementById("resetTimerBtn");

  // Helper: update UI based on current remainingSeconds
  function refreshUI() {
    if (remainingDisplay)
      remainingDisplay.innerText = formatHMS(remainingSeconds);
    const percent =
      totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0;
    const clamped = Math.min(100, Math.max(0, percent));
    if (progressFill) progressFill.style.width = `${clamped}%`;
    if (progressPercent) progressPercent.innerText = `${Math.round(clamped)}%`;
    if (infoDuration)
      infoDuration.innerText =
        totalSeconds > 0 ? formatHMS(totalSeconds) : "--:--:--";

    // Update ARIA progress value
    if (progressFill)
      progressFill.setAttribute("aria-valuenow", Math.round(clamped));

    // Start time display
    if (
      startMoment &&
      (isRunning || (!isRunning && remainingSeconds < totalSeconds))
    ) {
      infoStart.innerText = startMoment.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } else {
      infoStart.innerText = "--:--:--";
    }

    // End time prediction
    if (
      remainingSeconds > 0 &&
      totalSeconds > 0 &&
      (isRunning || (!isRunning && remainingSeconds < totalSeconds))
    ) {
      const endPrediction = new Date(Date.now() + remainingSeconds * 1000);
      infoEnd.innerText = endPrediction.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } else if (remainingSeconds === 0 && totalSeconds > 0) {
      infoEnd.innerText = "⏰ FINISHED";
    } else {
      infoEnd.innerText = "--:--:--";
    }

    // Status message & button states
    if (remainingSeconds === 0 && totalSeconds > 0) {
      statusMsg.innerText = "⛔ Exam finished. Press RESET to start new.";
      startBtn.disabled = true;
      pauseBtn.disabled = true;
    } else if (isRunning) {
      statusMsg.innerText = "▶ Timer running — exam in progress";
      startBtn.disabled = true;
      pauseBtn.disabled = false;
    } else if (
      !isRunning &&
      remainingSeconds > 0 &&
      remainingSeconds < totalSeconds
    ) {
      statusMsg.innerText = "⏸ Paused — press START to resume";
      startBtn.disabled = false;
      pauseBtn.disabled = true;
    } else if (
      !isRunning &&
      totalSeconds > 0 &&
      remainingSeconds === totalSeconds
    ) {
      statusMsg.innerText = "✅ Ready. Press START to begin exam.";
      startBtn.disabled = false;
      pauseBtn.disabled = true;
    } else {
      statusMsg.innerText = "⚙️ Set duration above & start";
      startBtn.disabled = totalSeconds === 0;
      pauseBtn.disabled = true;
    }

    // Show/hide duration row and disable inputs while running
    const disableWhileRunning = isRunning;
    durationRow.classList.toggle("hidden", isRunning);
    durationMins.disabled = disableWhileRunning;
    durationSecs.disabled = disableWhileRunning;
    setDurationBtn.disabled = disableWhileRunning;
  }

  // Stop timer and clear interval
  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    isRunning = false;
    endTimestamp = null;
    refreshUI();
  }

  // Timer tick based on endTimestamp
  function tick() {
    if (!isRunning || !endTimestamp) return;
    const now = Date.now();
    let remaining = Math.max(0, Math.ceil((endTimestamp - now) / 1000));
    if (remaining !== remainingSeconds) {
      remainingSeconds = remaining;
      refreshUI();
    }
    if (remainingSeconds <= 0) {
      // Timer finished
      stopTimer();
      remainingSeconds = 0;
      refreshUI();
      // Optional: trigger finish effect (visual only)
      statusMsg.innerText = "⏰ TIME'S UP! Exam completed.";
      startBtn.disabled = true;
    }
  }

  function startTimer() {
    if (totalSeconds === 0) {
      statusMsg.innerText = "⚠️ Please set a duration first!";
      return;
    }
    if (remainingSeconds === 0 && totalSeconds > 0) {
      statusMsg.innerText = "Timer expired. Press RESET to restart.";
      return;
    }
    if (isRunning) return;

    // Set start moment if fresh start
    if (!startMoment || remainingSeconds === totalSeconds) {
      startMoment = new Date();
    }

    // Set end timestamp based on current remaining
    endTimestamp = Date.now() + remainingSeconds * 1000;
    isRunning = true;

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(tick, 200); // smoother progress updates
    refreshUI();
  }

  function pauseTimer() {
    if (!isRunning) return;
    // Capture current remaining before clearing
    if (endTimestamp) {
      const now = Date.now();
      remainingSeconds = Math.max(0, Math.ceil((endTimestamp - now) / 1000));
    }
    stopTimer(); // stops interval, sets isRunning false, keeps remainingSeconds
    refreshUI();
  }

  function resetTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    isRunning = false;
    endTimestamp = null;
    remainingSeconds = totalSeconds;
    startMoment = null;
    refreshUI();
  }

  function setDuration() {
    if (isRunning) {
      statusMsg.innerText = "⛔ Pause timer before changing duration.";
      return;
    }
    let mins = parseInt(durationMins.value, 10) || 0;
    let secs = parseInt(durationSecs.value, 10) || 0;
    const newTotal = parseDuration(mins, secs);
    totalSeconds = newTotal;
    remainingSeconds = totalSeconds;
    startMoment = null;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    isRunning = false;
    endTimestamp = null;
    refreshUI();
    // Sync input fields
    durationMins.value = Math.floor(totalSeconds / 60);
    durationSecs.value = totalSeconds % 60;
    statusMsg.innerText = `✅ Duration set to ${formatHMS(totalSeconds)}. Press START.`;
  }

  // Event binding
  setDurationBtn.addEventListener("click", setDuration);
  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);

  // Initial setup
  totalSeconds = 5400;
  remainingSeconds = 5400;
  durationMins.value = 90;
  durationSecs.value = 0;
  refreshUI();
}
