const MAX_LOGS = 50;
let logHistory = JSON.parse(localStorage.getItem("ssaLogHistory")) || [];

const COLORS = {
  INFO: "#00ff88",
  WARNING: "#ffd54f",
  ALARM: "#ff0000"
};

export function logEvent(container, message, severity = "INFO") {
  const time = new Date().toLocaleTimeString();
  const text = `[${time}] ${message}`;

  const p = document.createElement("p");
  p.textContent = text;
  p.style.color = COLORS[severity] || "#eaeaea";

  container.prepend(p);

  logHistory.unshift({ text, color: p.style.color });
  if (logHistory.length > MAX_LOGS) logHistory.pop();

  localStorage.setItem("ssaLogHistory", JSON.stringify(logHistory));
}

export function renderLogs(container) {
  container.innerHTML = "";
  logHistory.forEach(e => {
    const p = document.createElement("p");
    p.textContent = e.text;
    p.style.color = e.color;
    container.appendChild(p);
  });
}









