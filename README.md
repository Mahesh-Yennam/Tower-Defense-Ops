# 🛡️ Tower Defense Ops

A high-octane tactical grid tower defense web game built with pure vanilla JavaScript, HTML5 Canvas, and the Web Audio API. Construct heavy defense networks, upgrade laser and missile emplacements, analyze enemy armor classifications, and hold the perimeter against waves of mechanized invaders.

Part of the [Gamility](https://mahesh-yennam.github.io/Gamility/) web games collection. Fully configured to run as an **independent standalone repository** or embedded directly within the Gamility portal.

---

## 📁 Repository Structure

```text
tower-defense-ops/
├── index.html        # Game layout, tactical battlefield canvas, arsenal tray & Schema.org JSON-LD
├── style.css         # Sci-fi tactical command HUD, neon holographic ranges, turret buttons
├── game.js           # 60FPS pathfinding, projectile ballistics, waves engine & Web Audio SFX
├── favicon.svg       # Tactical turret vector SVG favicon
├── site.webmanifest  # Progressive Web App (PWA) manifest for mobile install
├── robots.txt        # Search engine crawler configuration
├── sitemap.xml       # Standalone XML sitemap
├── .gitignore        # Standard web gitignore
└── README.md         # Documentation & deployment guide
```

---

## 🎮 How to Play

- **Objective:** Prevent enemy mechanized forces from breaching your perimeter Headquarters (10 Lives). Earn credits for destroyed units to construct and upgrade your defense grid.
- **Controls:**
  - **Select Turret:** Tap or click a turret type from the bottom arsenal tray.
  - **Deploy:** Click on any empty sector on the grid outside the winding patrol road.
  - **Inspect & Upgrade:** Click on any placed turret to view its range ring, upgrade damage/rate, or sell it for a credit refund.
  - **Launch Wave:** Click **Deploy Next Wave** or press `Spacebar` to trigger the incoming assault.
  - **Fast Forward:** Toggle **1x / 2x Speed** to accelerate the battle.
  - **P:** Pause / Resume the game clock.

---

## 🔫 Turret Arsenal

| Turret | Type | Cost | Range | Description |
| :--- | :---: | :---: | :---: | :--- |
| **Gatling Gun** | Ballistic | 100 ¢ | Medium | High fire-rate rapid bullets. Best for light scouts. |
| **Frost Beam** | Cryo | 150 ¢ | Medium | Chills enemies, slowing down march speed by 50%. |
| **Plasma Laser** | Energy | 225 ¢ | Long | Sustained piercing thermal beam. Melts heavy armor. |
| **Missile Pod** | Explosive | 300 ¢ | Very Long | High-explosive rockets with area-of-effect splash damage. |

---

## 👾 Invading Forces

- **Scout Drone:** Fast, lightly armored reconnaissance units.
- **Assault Walker:** Balanced infantry mechs marching in tight formations.
- **Heavy Siege Tank:** Slow, heavily armored juggernauts with thick plating.
- **Titan Boss Mech:** Colossal high-durability boss arriving on landmark waves.

---

## ✨ Features

- **Pure Vanilla Web Tech:** Zero dependencies, zero external frameworks, zero build steps.
- **Synthesized Web Audio SFX:** Dynamic procedural gunfire, laser hums, rocket launches, explosive rumbles, wave sirens, and upgrade chimes synthesized natively with `AudioContext`.
- **Intelligent Target Tracking:** Turrets calculate projectile lead and rotate smoothly to track targets in their radius.
- **Persistent High Scores:** Tracks highest wave cleared and maximum score in `localStorage`.
- **Responsive Mobile Touch:** Tap-to-select, range preview indicators, and zoom-friendly layout on mobile devices.

---

## 📄 Copyright & Terms

Copyright © 2026 Gamility. All rights reserved.  
This repository and its source code are proprietary. Unauthorized copying, distribution, or commercial reuse without explicit permission is strictly prohibited.
