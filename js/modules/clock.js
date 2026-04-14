// js/modules/clock.js
/**
 * Clock Module: real-time analog + digital clock with smooth updates
 */
export function initClock() {
  const hrHand = document.querySelector("#hr");
  const mnHand = document.querySelector("#mn");
  const scHand = document.querySelector("#sc");
  const hoursElem = document.getElementById("hours");
  const minutesElem = document.getElementById("minutes");
  const secondsElem = document.getElementById("seconds");
  const ampmElem = document.getElementById("ampm");

  if (!hrHand || !mnHand || !scHand) return;

  function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Analog rotations (degrees)
    const hrDeg = (hours % 12) * 30 + minutes * 0.5;
    const mnDeg = minutes * 6 + seconds * 0.1;
    const scDeg = seconds * 6;

    hrHand.style.transform = `rotateZ(${hrDeg}deg)`;
    mnHand.style.transform = `rotateZ(${mnDeg}deg)`;
    scHand.style.transform = `rotateZ(${scDeg}deg)`;

    // Digital display
    const displayHours = hours % 12 || 12;
    const ampm = hours < 12 ? "AM" : "PM";
    hoursElem.textContent = displayHours;
    minutesElem.textContent = minutes.toString().padStart(2, "0");
    secondsElem.textContent = seconds.toString().padStart(2, "0");
    ampmElem.textContent = ampm;
  }

  updateClock();
  setInterval(updateClock, 1000);
}
