document.addEventListener("DOMContentLoaded", () => {
  const controls = document.getElementById("controls");

  // Create Help button
  const helpBtn = document.createElement("button");
  helpBtn.id = "help-btn";
  helpBtn.textContent = "HELP";
  controls.appendChild(helpBtn);

  // Create overlay
  const overlay = document.createElement("div");
  overlay.id = "help-overlay";

  overlay.innerHTML = `
    <div id="help-box">
      <h2>System Help</h2>
      <ul>
        <li><strong>ARM</strong>: Activates all zones.</li>
        <li><strong>DISARM</strong>: Deactivates the system.</li>
        <li><strong>Zones</strong>: Click an armed zone to trigger an event.</li>
        <li><strong>Colors</strong>:
          <ul>
            <li>Green = Armed</li>
            <li>Grey = Disarmed</li>
            <li>Red = Triggered</li>
          </ul>
        </li>
        <li><strong>System Log</strong>: Shows latest events at the top.</li>
      </ul>
      <button id="help-close">CLOSE</button>
    </div>
  `;

  document.body.appendChild(overlay);

  // Open / close logic
  helpBtn.addEventListener("click", () => {
    overlay.style.display = "flex";
  });

  overlay.addEventListener("click", (e) => {
    if (e.target.id === "help-overlay" || e.target.id === "help-close") {
      overlay.style.display = "none";
    }
  });
});
