// ===============================
// ZONES MODULE
// ===============================
export const ZONE_STATES = {
  IDLE: "idle",
  TRIGGERED: "triggered",
  RESTORED: "restored"
};

// Set zone state visually
export function setZoneState(zone, newState, zoneStates, logContainer) {
  const zoneId = zone.dataset.zone;
  if (zoneStates[zoneId] === newState) return;

  zoneStates[zoneId] = newState;

  if (newState === ZONE_STATES.TRIGGERED) {
    zone.style.backgroundColor = "#ff9800";
    import('./logger.js').then(mod => {
      mod.logEvent(logContainer, `ZONE TRIGGERED → ${zone.textContent}`, "ALARM");
    });
  }

  if (newState === ZONE_STATES.RESTORED) {
    zone.style.backgroundColor = "";
    import('./logger.js').then(mod => {
      mod.logEvent(logContainer, `ZONE RESTORED → ${zone.textContent}`, "INFO");
    });
  }
}




