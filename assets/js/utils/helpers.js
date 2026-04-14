// js/utils/helpers.js
/**
 * Utility functions for time formatting and validation
 */

/**
 * Format seconds as HH:MM:SS
 * @param {number} secs - total seconds (non-negative)
 * @returns {string} formatted time string
 */
export function formatHMS(secs) {
  const safeSecs = Math.max(0, Math.floor(secs));
  const hrs = Math.floor(safeSecs / 3600);
  const mins = Math.floor((safeSecs % 3600) / 60);
  const secsLeft = safeSecs % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secsLeft.toString().padStart(2, "0")}`;
}

/**
 * Parse minutes and seconds into total seconds with validation
 * @param {number} mins
 * @param {number} secs
 * @returns {number} total seconds clamped to valid range (min 60, max 43200)
 */
export function parseDuration(mins, secs) {
  let total = Math.max(0, mins) * 60 + Math.max(0, secs);
  if (total < 60) total = 60; // minimum 1 minute
  if (total > 43200) total = 43200; // max 12 hours
  return total;
}
