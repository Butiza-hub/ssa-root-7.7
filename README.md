# Project 25 – Security System Administrator (SSA)

## Overview
The **Security System Administrator (SSA)** is a front-end simulation of a residential security system.  
It models real-world alarm system behavior, including arming states, exit delays, zone monitoring, system indicators, and event logging.

This project was built as part of **Project 25**, a long-term portfolio initiative focused on developing practical, production-minded engineering skills.

---

## Features
- Arm / Disarm system controls
- Exit delay countdown with live updates
- Multiple security zones with trigger states
- Visual system status indicator
- Event log (newest events shown first)
- Fully modular JavaScript architecture
- Clean UI optimized for monitoring clarity

---

## Platform Scope – Desktop-Optimized Dashboard

SSA is intentionally designed as a **desktop-first monitoring dashboard**.

The interface layout (10-zone grid, persistent event log, and real-time system indicators) is optimized for:

- Laptops
- Desktop monitors
- Large displays
- Control-room style environments

While basic responsiveness is present, full mobile optimization was **not prioritized in this version** in order to preserve:

- Dashboard clarity
- Zone visibility at a glance
- Log readability
- Consistent system-state presentation

This reflects a deliberate architectural decision rather than a limitation.

A future version could include a mobile-adapted layout if required by product scope.

---

## System Behavior
SSA is designed to behave like a real alarm system:
- Zones only trigger when the system is armed
- Exit delays allow safe departure before full arming
- All state changes are logged
- UI feedback is always synchronized with system logic

---

## Alarm Sound (Known Limitation)
An alarm sound feature was designed and partially implemented.  
However, modern browsers restrict audio playback unless it is triggered directly by a user interaction (e.g., a click or keypress).

After multiple correct implementation attempts, the decision was made to **ship the system without forced audio playback**.

This reflects a real-world engineering decision:
- System logic is correct
- Browser behavior is documented
- The project is shipped in a stable, predictable state

Future versions could include optional, user-initiated sound activation.

---

## Technologies Used
- HTML5
- CSS3
- Vanilla JavaScript (ES6)
- Modular file structure
- Browser DevTools for debugging and testing

---

## How to Run Locally
1. Clone the repository:
   ```bash
   git clone <repository-url>

