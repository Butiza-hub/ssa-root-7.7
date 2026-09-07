// ===============================
// CLOCK & DATE
// ===============================
const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");

function updateDateTime() {
  const now = new Date();

  // Date in format: 19 Jan 2026
  const day = now.getDate().toString().padStart(2, "0");
  const month = now.toLocaleString("default", { month: "short" });
  const year = now.getFullYear();

  dateEl.textContent = `${day} ${month} ${year}`;

  // Time in format: 15h35:22
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  timeEl.textContent = `${hours}h${minutes}:${seconds}`;
}

updateDateTime();
setInterval(updateDateTime, 1000);

// ===============================
// SYSTEM STATES
// ===============================
const SYSTEM_STATES = {
  DISARMED: "disarmed",
  EXIT_DELAY: "exit_delay",
  ARMED_AWAY: "armed_away",
  ARMED_HOME: "armed_home",
  ENTRY_DELAY: "entry_delay",
  ALARM: "alarm"
};

let systemState = SYSTEM_STATES.DISARMED;
let exitTimer = null;
let entryTimer = null;

// ===============================
// AUDIO
// ===============================
let audioContext = null;
let alarmSoundTimer = null;

function ensureAudioReady() {
  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function playArmConfirmation() {
  if (!audioContext) {
    return;
  }

  const now = audioContext.currentTime;

  function createSweep(startTime) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "square";

    oscillator.frequency.setValueAtTime(
      900,
      startTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
      1600,
      startTime + 0.16
    );

    gainNode.gain.setValueAtTime(
      0.07,
      startTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      startTime + 0.18
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.18);
  }

  // Four arming confirmation beeps
  createSweep(now);
  createSweep(now + 0.32);
  createSweep(now + 0.64);
  createSweep(now + 0.96);
}

function startAlarmSound() {
  if (!audioContext || alarmSoundTimer) {
    return;
  }

  function playAlarmBeep() {
    const now = audioContext.currentTime;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "square";

    oscillator.frequency.setValueAtTime(
      900,
      now
    );

    oscillator.frequency.exponentialRampToValueAtTime(
      1600,
      now + 0.16
    );

    gainNode.gain.setValueAtTime(
      0.07,
      now
    );

    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      now + 0.18
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.18);
  }

  // Start immediately when ALARM is confirmed
  playAlarmBeep();

  // Continue until DISARM
  alarmSoundTimer = setInterval(() => {
    playAlarmBeep();
  }, 320);
}

function stopAlarmSound() {
  if (alarmSoundTimer) {
    clearInterval(alarmSoundTimer);
    alarmSoundTimer = null;
  }
}

// ===============================
// STATUS INDICATOR
// ===============================
const statusIndicator = document.getElementById("status-indicator");

function updateStatusIndicator(state) {
  switch (state) {
    case SYSTEM_STATES.DISARMED:
      statusIndicator.textContent = "DISARMED";
      statusIndicator.style.backgroundColor = "#808080";
      statusIndicator.style.color = "#000";
      break;

    case SYSTEM_STATES.ARMED_HOME:
      statusIndicator.textContent = "ARMED (HOME)";
      statusIndicator.style.backgroundColor = "#007BFF";
      statusIndicator.style.color = "#fff";
      break;

    case SYSTEM_STATES.ARMED_AWAY:
      statusIndicator.textContent = "ARMED (AWAY)";
      statusIndicator.style.backgroundColor = "#FF0000";
      statusIndicator.style.color = "#fff";
      break;

    case SYSTEM_STATES.EXIT_DELAY:
    case SYSTEM_STATES.ENTRY_DELAY:
      statusIndicator.textContent = "DELAY";
      statusIndicator.style.backgroundColor = "#FFD700";
      statusIndicator.style.color = "#000";
      break;

    case SYSTEM_STATES.ALARM:
      statusIndicator.textContent = "ALARM!";
      statusIndicator.style.backgroundColor = "#FF0000";
      statusIndicator.style.color = "#fff";
      break;

    default:
      statusIndicator.textContent = "UNKNOWN";
      statusIndicator.style.backgroundColor = "#808080";
      statusIndicator.style.color = "#000";
  }

  updateMonitoringPanel(state);
}

// ===============================
// MONITORING PANEL
// ===============================
const monitoringPanel = document.getElementById("monitoring-panel");
const monitorMode = document.getElementById("monitor-mode");
const monitorZones = document.getElementById("monitor-zones");
const monitorActive = document.getElementById("monitor-active");
const monitorStatus = document.getElementById("monitor-status");
const monitorNetwork = document.getElementById("monitor-network");

function updateMonitoringPanel(state) {
  // Do not allow the monitoring panel
  // to interrupt the main SSA system
  if (
    !monitoringPanel ||
    !monitorMode ||
    !monitorZones ||
    !monitorActive ||
    !monitorStatus ||
    !monitorNetwork
  ) {
    return;
  }

  monitoringPanel.classList.remove(
    "monitor-state-normal",
    "monitor-state-warning",
    "monitor-state-alarm"
  );

  monitorZones.textContent = "10";
  monitorNetwork.textContent = "SECURE";

  switch (state) {
    case SYSTEM_STATES.DISARMED:
      monitoringPanel.classList.add("monitor-state-normal");

      monitorMode.textContent = "DISARMED";
      monitorActive.textContent = "0 / 10";
      monitorStatus.textContent = "STANDBY";
      break;

    case SYSTEM_STATES.EXIT_DELAY:
      monitoringPanel.classList.add("monitor-state-normal");

      monitorMode.textContent = "ARMING";
      monitorActive.textContent = "0 / 10";
      monitorStatus.textContent = "EXIT DELAY";
      break;

    case SYSTEM_STATES.ARMED_AWAY:
      monitoringPanel.classList.add("monitor-state-normal");

      monitorMode.textContent = "ARMED AWAY";
      monitorActive.textContent = "10 / 10";
      monitorStatus.textContent = "MONITORING ACTIVE";
      break;

    case SYSTEM_STATES.ARMED_HOME:
      monitoringPanel.classList.add("monitor-state-normal");

      monitorMode.textContent = "ARMED HOME";
      monitorActive.textContent = "6 / 10";
      monitorStatus.textContent = "MONITORING ACTIVE";
      break;

    case SYSTEM_STATES.ENTRY_DELAY:
      monitoringPanel.classList.add("monitor-state-warning");

      monitorMode.textContent = "ALERT";
      monitorStatus.textContent = "ZONE ACTIVITY DETECTED";
      break;

    case SYSTEM_STATES.ALARM:
      monitoringPanel.classList.add("monitor-state-alarm");

      monitorMode.textContent = "ALARM";
      monitorStatus.textContent = "SECURITY BREACH";
      break;
  }
}

// ===============================
// LOGIC, ZONES, SYSTEM FUNCTIONS
// ===============================
const armBtn = document.getElementById("arm-btn");
const disarmBtn = document.getElementById("disarm-btn");
const zones = document.querySelectorAll(".zone");
const logContainer = document.getElementById("log-entries");

const ZONE_STATES = {
  IDLE: "idle",
  TRIGGERED: "triggered",
  RESTORED: "restored"
};

const zoneStates = {};

zones.forEach(zone => {
  zoneStates[zone.dataset.zone] = ZONE_STATES.IDLE;
});

const EXIT_DELAY_SECONDS = 10;
const ENTRY_DELAY_SECONDS = 8;

// ===============================
// LOGGING
// ===============================
let logHistory =
  JSON.parse(localStorage.getItem("ssaLogHistory")) || [];

function severityColor(severity) {
  switch (severity) {
    case "INFO":
      return "#00ff88";

    case "WARNING":
      return "#ffd54f";

    case "ALARM":
      return "#ff0000";

    default:
      return "#eaeaea";
  }
}

function logEvent(container, message, severity = "INFO") {
  const now = new Date();
  const timestamp = now.toLocaleTimeString();
  const text = `[${timestamp}] ${message}`;
  const color = severityColor(severity);

  const p = document.createElement("p");

  p.textContent = text;
  p.style.color = color;

  container.prepend(p);

  logHistory.unshift({
    text,
    color
  });

  if (logHistory.length > 50) {
    logHistory.pop();
  }

  localStorage.setItem(
    "ssaLogHistory",
    JSON.stringify(logHistory)
  );

  return p;
}

function renderLogs() {
  logContainer.innerHTML = "";

  logHistory.forEach(entry => {
    const p = document.createElement("p");

    p.textContent = entry.text;
    p.style.color = entry.color;

    logContainer.appendChild(p);
  });
}

// ===============================
// ZONE HELPERS
// ===============================
function clearZoneClasses(zone) {
  zone.classList.remove(
    "armed",
    "disarmed",
    "inactive",
    "triggered"
  );
}

function resetZones() {
  zones.forEach(zone => {
    const state = zone.classList.contains("disarmed")
      ? ZONE_STATES.IDLE
      : zoneStates[zone.dataset.zone];

    zoneStates[zone.dataset.zone] = state;

    if (zone.classList.contains("armed")) {
      zone.style.backgroundColor = "#2f6f73";
    } else if (zone.classList.contains("inactive")) {
      zone.style.backgroundColor = "#3b3b3b";
    } else if (zone.classList.contains("disarmed")) {
      zone.style.backgroundColor = "#2f2f2f";
    } else {
      zone.style.backgroundColor = "#2f2f2f";
    }
  });
}

function setZoneState(zone, newState) {
  const zoneId = zone.dataset.zone;

  if (zoneStates[zoneId] === newState) {
    return;
  }

  zoneStates[zoneId] = newState;

  if (newState === ZONE_STATES.TRIGGERED) {
    logEvent(
      logContainer,
      `ZONE TRIGGERED → ${zone.textContent}`,
      "ALARM"
    );
  }

  if (newState === ZONE_STATES.RESTORED) {
    zone.classList.remove("triggered");

    if (zone.classList.contains("armed")) {
      zone.style.backgroundColor = "#2f6f73";
    } else if (zone.classList.contains("inactive")) {
      zone.style.backgroundColor = "#3b3b3b";
    } else {
      zone.style.backgroundColor = "#2f2f2f";
    }

    logEvent(
      logContainer,
      `ZONE RESTORED → ${zone.textContent}`,
      "INFO"
    );
  }
}

// ===============================
// SYSTEM FUNCTIONS
// ===============================
function clearTimers() {
  clearInterval(exitTimer);
  clearInterval(entryTimer);

  exitTimer = null;
  entryTimer = null;
}

function setDisarmed() {
  clearTimers();

  // Stop continuous alarm sound
  stopAlarmSound();

  systemState = SYSTEM_STATES.DISARMED;

  zones.forEach(zone => {
    clearZoneClasses(zone);

    // Reset the zone-name strip back to black
    zone.style.removeProperty("--zone-strip-color");

    zone.classList.add("disarmed");
  });

  resetZones();

  logEvent(
    logContainer,
    "SYSTEM DISARMED",
    "INFO"
  );

  updateStatusIndicator(systemState);
}

function setArmedAway() {
  systemState = SYSTEM_STATES.ARMED_AWAY;

  zones.forEach(zone => {
    clearZoneClasses(zone);

    // Ensure strip starts black whenever system is armed
    zone.style.removeProperty("--zone-strip-color");

    zone.classList.add("armed");
  });

  resetZones();

  logEvent(
    logContainer,
    "SYSTEM ARMED (AWAY)",
    "INFO"
  );

  updateStatusIndicator(systemState);
}

function setArmedHome() {
  systemState = SYSTEM_STATES.ARMED_HOME;

  // Zones disabled while armed in HOME mode
  const HOME_DISABLED_ZONES = [
    "4",
    "5",
    "6",
    "9"
  ];

  zones.forEach(zone => {
    clearZoneClasses(zone);

    // Ensure strip starts black whenever system is armed
    zone.style.removeProperty("--zone-strip-color");

    if (HOME_DISABLED_ZONES.includes(zone.dataset.zone)) {
      zone.classList.add("inactive");
    } else {
      zone.classList.add("armed");
    }
  });

  resetZones();

  logEvent(
    logContainer,
    "SYSTEM ARMED (HOME)",
    "INFO"
  );

  updateStatusIndicator(systemState);
}

function startExitDelay(targetState) {
  clearTimers();

  systemState = SYSTEM_STATES.EXIT_DELAY;

  let remaining = EXIT_DELAY_SECONDS;

  const logLine = logEvent(
    logContainer,
    `EXIT DELAY: ${remaining}s`,
    "WARNING"
  );

  updateStatusIndicator(systemState);

  exitTimer = setInterval(() => {
    remaining--;

    logLine.textContent =
      `[${new Date().toLocaleTimeString()}] EXIT DELAY: ${remaining}s`;

    if (remaining <= 0) {
      clearInterval(exitTimer);
      exitTimer = null;

      targetState === SYSTEM_STATES.ARMED_HOME
        ? setArmedHome()
        : setArmedAway();

      playArmConfirmation();
    }
  }, 1000);
}

function startEntryDelay(zone) {
  if (
    systemState === SYSTEM_STATES.ENTRY_DELAY ||
    systemState === SYSTEM_STATES.ALARM
  ) {
    return;
  }

  systemState = SYSTEM_STATES.ENTRY_DELAY;

  setZoneState(
    zone,
    ZONE_STATES.TRIGGERED
  );

  let remaining = ENTRY_DELAY_SECONDS;

  const logLine = logEvent(
    logContainer,
    `ENTRY DELAY: ${remaining}s → ${zone.textContent}`,
    "WARNING"
  );

  updateStatusIndicator(systemState);

  entryTimer = setInterval(() => {
    remaining--;

    if (remaining > 0) {
      logLine.textContent =
        `[${new Date().toLocaleTimeString()}] ENTRY DELAY: ${remaining}s → ${zone.textContent}`;
    } else {
      logLine.textContent =
        `[${new Date().toLocaleTimeString()}] ENTRY DELAY: 0s → ${zone.textContent}`;

      clearInterval(entryTimer);
      entryTimer = null;

      triggerAlarm(zone);
    }
  }, 1000);
}

function triggerAlarm(zone) {
  systemState = SYSTEM_STATES.ALARM;

  // Turn the zone-name strip red
  // at the exact moment the alarm is confirmed
  zone.style.setProperty(
    "--zone-strip-color",
    "#ff0000"
  );

  logEvent(
    logContainer,
    `🚨 ALARM CONFIRMED → ${zone.textContent}`,
    "ALARM"
  );

  updateStatusIndicator(systemState);

  // Start continuous alarm sound
  startAlarmSound();
}

// ===============================
// EVENT LISTENERS
// ===============================
armBtn.addEventListener("click", () => {
  ensureAudioReady();

  if (systemState === SYSTEM_STATES.DISARMED) {
    startExitDelay(
      SYSTEM_STATES.ARMED_AWAY
    );
  } else if (
    systemState === SYSTEM_STATES.ARMED_AWAY
  ) {
    startExitDelay(
      SYSTEM_STATES.ARMED_HOME
    );
  }
});

disarmBtn.addEventListener("click", () => {
  if (systemState !== SYSTEM_STATES.DISARMED) {
    setDisarmed();
  }
});

zones.forEach(zone => {
  zone.addEventListener("click", () => {
    if (!zone.classList.contains("armed")) {
      return;
    }

    if (
      systemState === SYSTEM_STATES.ARMED_AWAY ||
      systemState === SYSTEM_STATES.ARMED_HOME
    ) {
      startEntryDelay(zone);
    }
  });
});

// ===============================
// INITIAL LOAD
// ===============================
renderLogs();
setDisarmed();