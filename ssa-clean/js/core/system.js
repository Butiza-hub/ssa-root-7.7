export const SYSTEM_STATES = {
  DISARMED: "disarmed",
  EXIT_DELAY: "exit_delay",
  ARMED_AWAY: "armed_away",
  ARMED_HOME: "armed_home",
  ENTRY_DELAY: "entry_delay",
  ALARM: "alarm"
};

export let systemState = SYSTEM_STATES.DISARMED;
export let exitTimer = null;
export let entryTimer = null;

export function clearTimers() {
  clearInterval(exitTimer);
  clearInterval(entryTimer);
  exitTimer = null;
  entryTimer = null;
}



