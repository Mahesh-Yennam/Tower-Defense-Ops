/**
 * Tower Defense Ops - Tactical Strategy Defense Engine
 * Pure Vanilla JavaScript & Synthesized Web Audio API
 */

(function () {
  'use strict';

  // --- Web Audio Synthesizer ---
  let audioCtx = null;
  let isMuted = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSound(type) {
    if (isMuted || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;

      if (type === 'gun') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.05);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'laser') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(350, now + 0.07);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
      } else if (type === 'missile') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'explosion') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(25, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'frost') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'build') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'upgrade') {
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);
          gain.gain.setValueAtTime(0.15, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.05 + 0.15);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.15);
        });
      } else if (type === 'alarm') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.setValueAtTime(280, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'victory') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.25, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.4);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.4);
        });
      }
    } catch (e) {
      // Audio fallback
    }
  }

  // --- Canvas Setup ---
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const COLS = 20;
  const ROWS = 12;
  const TILE = 40; // 800 x 480

  // --- Tactical Patrol Waypoints ---
  const WAYPOINTS = [
    { x: -20, y: 3 * TILE + 20 },
    { x: 4 * TILE + 20, y: 3 * TILE + 20 },
    { x: 4 * TILE + 20, y: 8 * TILE + 20 },
    { x: 10 * TILE + 20, y: 8 * TILE + 20 },
    { x: 10 * TILE + 20, y: 2 * TILE + 20 },
    { x: 15 * TILE + 20, y: 2 * TILE + 20 },
    { x: 15 * TILE + 20, y: 9 * TILE + 20 },
    { x: 20 * TILE + 30, y: 9 * TILE + 20 }
  ];

  // Precomputed road tiles set for collision checking
  const ROAD_TILES = new Set();
  function initRoadTiles() {
    ROAD_TILES.clear();
    for (let i = 0; i < WAYPOINTS.length - 1; i++) {
      const p1 = WAYPOINTS[i];
      const p2 = WAYPOINTS[i + 1];

      const startCol = Math.floor(Math.min(p1.x, p2.x) / TILE);
      const endCol = Math.floor(Math.max(p1.x, p2.x) / TILE);
      const startRow = Math.floor(Math.min(p1.y, p2.y) / TILE);
      const endRow = Math.floor(Math.max(p1.y, p2.y) / TILE);

      for (let c = Math.max(0, startCol); c <= Math.min(COLS - 1, endCol); c++) {
        for (let r = Math.max(0, startRow); r <= Math.min(ROWS - 1, endRow); r++) {
          ROAD_TILES.add(`${c},${r}`);
        }
      }
    }
  }
  initRoadTiles();

  // --- Turret Specifications ---
  const TURRET_TYPES = {
    gatling: {
      name: 'Gatling',
      icon: '🔫',
      cost: 100,
      range: 115,
      damage: 14,
      fireRate: 11, // frames between shots
      bulletSpeed: 12,
      color: '#38bdf8'
    },
    frost: {
      name: 'Frost Beam',
      icon: '❄️',
      cost: 150,
      range: 100,
      damage: 6,
      fireRate: 20,
      slowFactor: 0.5,
      slowDuration: 75,
      color: '#06b6d4'
    },
    laser: {
      name: 'Plasma Laser',
      icon: '⚡',
      cost: 225,
      range: 145,
      damage: 2.2, // Continuous beam DPS
      fireRate: 1,
      color: '#a855f7'
    },
    missile: {
      name: 'Missile Pod',
      icon: '🚀',
      cost: 300,
      range: 175,
      damage: 75,
      splashRadius: 55,
      fireRate: 65,
      bulletSpeed: 7,
      color: '#f59e0b'
    }
  };

  // --- Game State ---
  let credits = 450;
  let lives = 15;
  let wave = 0;
  let maxWaves = 20;
  let score = 0;
  let highScore = parseInt(localStorage.getItem('tower_defense_highscore') || '0', 10);
  let maxWaveCleared = parseInt(localStorage.getItem('tower_defense_max_wave') || '0', 10);
  let gameSpeed = 1; // 1 or 2
  let isRunning = false;
  let isPaused = false;
  let isGameOver = false;
  let waveInProgress = false;

  let turrets = [];
  let enemies = [];
  let projectiles = [];
  let particles = [];

  let selectedTurretType = 'gatling';
  let inspectedTurret = null;
  let hoveredTile = null;

  // Wave Spawner
  let spawnQueue = [];
  let spawnTimer = 0;

  // DOM Elements
  const creditsVal = document.getElementById('creditsVal');
  const livesVal = document.getElementById('livesVal');
  const waveVal = document.getElementById('waveVal');
  const scoreVal = document.getElementById('scoreVal');
  const modeSubtitle = document.getElementById('modeSubtitle');

  const startWaveBtn = document.getElementById('startWaveBtn');
  const speedToggleBtn = document.getElementById('speedToggleBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const muteBtn = document.getElementById('muteBtn');

  const startOverlay = document.getElementById('startOverlay');
  const startBtn = document.getElementById('startBtn');
  const gameOverOverlay = document.getElementById('gameOverOverlay');
  const finalWaveEl = document.getElementById('finalWave');
  const finalScoreEl = document.getElementById('finalScore');
  const bestScoreEl = document.getElementById('bestScoreEl');
  const restartBtn = document.getElementById('restartBtn');

  const victoryOverlay = document.getElementById('victoryOverlay');
  const victoryScoreEl = document.getElementById('victoryScore');
  const victoryLivesEl = document.getElementById('victoryLives');
  const vicBestScoreEl = document.getElementById('vicBestScoreEl');
  const playAgainBtn = document.getElementById('playAgainBtn');

  const inspectorPanel = document.getElementById('inspectorPanel');
  const inspectorTitle = document.getElementById('inspectorTitle');
  const inspectorStats = document.getElementById('inspectorStats');
  const upgradeBtn = document.getElementById('upgradeBtn');
  const upgradeCostEl = document.getElementById('upgradeCost');
  const sellBtn = document.getElementById('sellBtn');
  const sellValueEl = document.getElementById('sellValue');
  const closeInspectorBtn = document.getElementById('closeInspectorBtn');

  // Initialize Pause Button State (Disabled before game start)
  if (pauseBtn) {
    pauseBtn.disabled = true;
    pauseBtn.style.opacity = '0.4';
    pauseBtn.style.pointerEvents = 'none';
  }

  // --- Spawner Engine ---
  function generateWave(waveNum) {
    const queue = [];
    const count = 6 + waveNum * 3;

    for (let i = 0; i < count; i++) {
      let type = 'scout';
      if (waveNum >= 2 && i % 3 === 0) type = 'walker';
      if (waveNum >= 4 && i % 5 === 0) type = 'tank';
      if (waveNum % 5 === 0 && i === count - 1) type = 'boss';

      let hp = 45 + waveNum * 15;
      let spd = 1.6;
      let reward = 10;
      let size = 11;
      let color = '#38bdf8';

      if (type === 'walker') {
        hp = 95 + waveNum * 26;
        spd = 1.15;
        reward = 18;
        size = 14;
        color = '#a855f7';
      } else if (type === 'tank') {
        hp = 260 + waveNum * 65;
        spd = 0.75;
        reward = 35;
        size = 17;
        color = '#f59e0b';
      } else if (type === 'boss') {
        hp = 900 + waveNum * 220;
        spd = 0.55;
        reward = 150;
        size = 22;
        color = '#ef4444';
      }

      queue.push({
        type,
        hp,
        maxHp: hp,
        speed: spd,
        reward,
        size,
        color,
        wpIndex: 0,
        x: WAYPOINTS[0].x,
        y: WAYPOINTS[0].y,
        slowTimer: 0,
        slowRate: 1
      });
    }

    return queue;
  }

  function startNextWave() {
    if (!isRunning || waveInProgress || isGameOver) return;
    initAudio();

    wave++;
    waveInProgress = true;
    spawnQueue = generateWave(wave);
    spawnTimer = 0;

    playSound('alarm');
    if (startWaveBtn) {
      startWaveBtn.disabled = true;
      startWaveBtn.innerHTML = `<span>⚔️</span> Wave ${wave} Fighting`;
    }
    updateHUD();
  }

  // --- Core Game Flow ---
  function startGame() {
    initAudio();

    credits = 450;
    lives = 15;
    wave = 0;
    score = 0;
    gameSpeed = 1;
    turrets = [];
    enemies = [];
    projectiles = [];
    particles = [];
    spawnQueue = [];
    inspectedTurret = null;
    waveInProgress = false;
    isGameOver = false;
    isRunning = true;
    isPaused = false;

    // Enable Pause Button
    if (pauseBtn) {
      pauseBtn.disabled = false;
      pauseBtn.innerHTML = '⏸️ Pause';
      pauseBtn.style.opacity = '1';
      pauseBtn.style.pointerEvents = 'auto';
    }

    startOverlay?.classList.add('hidden');
    gameOverOverlay?.classList.add('hidden');
    victoryOverlay?.classList.add('hidden');
    inspectorPanel?.classList.add('hidden');

    if (startWaveBtn) {
      startWaveBtn.disabled = false;
      startWaveBtn.innerHTML = '<span>⚔️</span> Launch Wave 1';
    }

    updateHUD();
  }

  function gameOver() {
    isRunning = false;
    isGameOver = true;
    isPaused = false;
    playSound('explosion');

    // Disable Pause Button on Game Over
    if (pauseBtn) {
      pauseBtn.disabled = true;
      pauseBtn.innerHTML = '⏸️ Pause';
      pauseBtn.style.opacity = '0.4';
      pauseBtn.style.pointerEvents = 'none';
    }

    if (score > highScore) {
      highScore = score;
      localStorage.setItem('tower_defense_highscore', highScore.toString());
    }
    if (wave > maxWaveCleared) {
      maxWaveCleared = wave;
      localStorage.setItem('tower_defense_max_wave', maxWaveCleared.toString());
    }

    if (finalWaveEl) finalWaveEl.textContent = wave;
    if (finalScoreEl) finalScoreEl.textContent = score;
    if (bestScoreEl) bestScoreEl.textContent = highScore;
    gameOverOverlay?.classList.remove('hidden');
  }

  function victory() {
    isRunning = false;
    isGameOver = true;
    isPaused = false;
    playSound('victory');

    // Disable Pause Button on Victory
    if (pauseBtn) {
      pauseBtn.disabled = true;
      pauseBtn.innerHTML = '⏸️ Pause';
      pauseBtn.style.opacity = '0.4';
      pauseBtn.style.pointerEvents = 'none';
    }

    if (score > highScore) {
      highScore = score;
      localStorage.setItem('tower_defense_highscore', highScore.toString());
    }
    if (wave > maxWaveCleared) {
      maxWaveCleared = wave;
      localStorage.setItem('tower_defense_max_wave', maxWaveCleared.toString());
    }

    if (victoryScoreEl) victoryScoreEl.textContent = score;
    if (victoryLivesEl) victoryLivesEl.textContent = `${lives} ❤️`;
    if (vicBestScoreEl) vicBestScoreEl.textContent = highScore;
    victoryOverlay?.classList.remove('hidden');
  }

  function togglePause() {
    if (!isRunning || isGameOver) return;
    isPaused = !isPaused;
    if (pauseBtn) {
      pauseBtn.innerHTML = isPaused ? '▶️ Resume' : '⏸️ Pause';
    }
  }

  function toggleMute() {
    isMuted = !isMuted;
    if (muteBtn) {
      muteBtn.innerHTML = isMuted ? '🔇 Muted' : '🔊 Sound';
    }
  }

  function updateHUD() {
    if (creditsVal) creditsVal.textContent = `${credits} ¢`;
    if (livesVal) livesVal.textContent = `${lives} ❤️`;
    if (waveVal) waveVal.textContent = `Wave ${wave}/${maxWaves}`;
    if (scoreVal) scoreVal.textContent = score;
    if (speedToggleBtn) {
      speedToggleBtn.innerHTML = `<span>⏩</span> Speed: ${gameSpeed}x`;
    }
    if (modeSubtitle) {
      modeSubtitle.textContent = waveInProgress ? `Combat Active • Wave ${wave} Assault` : `Tactical Grid • Ready for Deployment`;
    }
  }

  // --- Particle FX ---
  function spawnSparks(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        life: 1,
        decay: Math.random() * 0.05 + 0.03
      });
    }
  }

  // --- Turret Construction & Inspection ---
  function placeTurret(col, row) {
    const key = `${col},${row}`;
    if (ROAD_TILES.has(key)) return; // Can't build on roads
    if (turrets.some(t => t.col === col && t.row === row)) return; // Occupied

    const spec = TURRET_TYPES[selectedTurretType];
    if (credits < spec.cost) return;

    initAudio();
    credits -= spec.cost;
    playSound('build');

    const newTurret = {
      col,
      row,
      x: col * TILE + TILE / 2,
      y: row * TILE + TILE / 2,
      type: selectedTurretType,
      level: 1,
      range: spec.range,
      damage: spec.damage,
      fireRate: spec.fireRate,
      fireCooldown: 0,
      angle: 0,
      totalCost: spec.cost,
      target: null
    };

    turrets.push(newTurret);
    inspectTurret(newTurret);
    updateHUD();
  }

  function inspectTurret(turret) {
    inspectedTurret = turret;
    if (!inspectorPanel) return;

    if (!turret) {
      inspectorPanel.classList.add('hidden');
      return;
    }

    inspectorPanel.classList.remove('hidden');
    const spec = TURRET_TYPES[turret.type];
    const upCost = Math.floor(turret.totalCost * 0.75);
    const sellVal = Math.floor(turret.totalCost * 0.7);

    if (inspectorTitle) inspectorTitle.textContent = `${spec.name} (Level ${turret.level})`;
    if (inspectorStats) inspectorStats.textContent = `Dmg: ${Math.round(turret.damage)} • Rng: ${Math.round(turret.range)}`;
    if (upgradeCostEl) upgradeCostEl.textContent = `${upCost} ¢`;
    if (sellValueEl) sellValueEl.textContent = `${sellVal} ¢`;

    if (upgradeBtn) {
      upgradeBtn.disabled = (turret.level >= 3 || credits < upCost);
      upgradeBtn.style.opacity = (turret.level >= 3 || credits < upCost) ? '0.4' : '1';
    }
  }

  function upgradeCurrentTurret() {
    if (!inspectedTurret || inspectedTurret.level >= 3) return;
    const upCost = Math.floor(inspectedTurret.totalCost * 0.75);
    if (credits < upCost) return;

    initAudio();
    credits -= upCost;
    inspectedTurret.totalCost += upCost;
    inspectedTurret.level++;
    inspectedTurret.damage *= 1.45;
    inspectedTurret.range *= 1.15;
    inspectedTurret.fireRate = Math.max(2, Math.floor(inspectedTurret.fireRate * 0.85));

    playSound('upgrade');
    spawnSparks(inspectedTurret.x, inspectedTurret.y, '#10b981', 16);
    inspectTurret(inspectedTurret);
    updateHUD();
  }

  function sellCurrentTurret() {
    if (!inspectedTurret) return;
    initAudio();

    const sellVal = Math.floor(inspectedTurret.totalCost * 0.7);
    credits += sellVal;
    playSound('upgrade');
    spawnSparks(inspectedTurret.x, inspectedTurret.y, '#fbbf24', 16);

    turrets = turrets.filter(t => t !== inspectedTurret);
    inspectTurret(null);
    updateHUD();
  }

  // --- Main Update Loop ---
  function update() {
    if (!isRunning || isPaused || isGameOver) return;

    // Run ticks according to game speed (1x or 2x)
    for (let s = 0; s < gameSpeed; s++) {
      // 1. Spawn Wave Units
      if (spawnQueue.length > 0) {
        spawnTimer++;
        if (spawnTimer >= 25) {
          spawnTimer = 0;
          enemies.push(spawnQueue.shift());
        }
      }

      // 2. Move Enemies along waypoints
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];

        // Apply Cryo Slowdown
        if (e.slowTimer > 0) {
          e.slowTimer--;
          e.slowRate = 0.5;
        } else {
          e.slowRate = 1;
        }

        const targetWp = WAYPOINTS[e.wpIndex + 1];
        if (!targetWp) {
          // Reached Base HQ! Breach!
          lives--;
          playSound('alarm');
          spawnSparks(e.x, e.y, '#ef4444', 16);
          enemies.splice(i, 1);
          updateHUD();

          if (lives <= 0) {
            gameOver();
            return;
          }
          continue;
        }

        const dx = targetWp.x - e.x;
        const dy = targetWp.y - e.y;
        const dist = Math.hypot(dx, dy);
        const step = e.speed * e.slowRate;

        if (dist <= step) {
          e.x = targetWp.x;
          e.y = targetWp.y;
          e.wpIndex++;
        } else {
          e.x += (dx / dist) * step;
          e.y += (dy / dist) * step;
        }
      }

      // 3. Turret AI Targeting & Firing
      turrets.forEach(t => {
        // Find closest enemy within range
        let target = null;
        let minDist = Infinity;

        for (const e of enemies) {
          const d = Math.hypot(e.x - t.x, e.y - t.y);
          if (d <= t.range && d < minDist) {
            minDist = d;
            target = e;
          }
        }

        t.target = target;
        if (target) {
          // Smooth rotation
          t.angle = Math.atan2(target.y - t.y, target.x - t.x);

          if (t.fireCooldown > 0) {
            t.fireCooldown--;
          } else {
            // Fire Weapon
            t.fireCooldown = t.fireRate;

            if (t.type === 'gatling') {
              playSound('gun');
              projectiles.push({
                x: t.x,
                y: t.y,
                vx: Math.cos(t.angle) * 12,
                vy: Math.sin(t.angle) * 12,
                damage: t.damage,
                type: 'bullet',
                life: 30
              });
            } else if (t.type === 'frost') {
              playSound('frost');
              projectiles.push({
                x: t.x,
                y: t.y,
                vx: Math.cos(t.angle) * 10,
                vy: Math.sin(t.angle) * 10,
                damage: t.damage,
                type: 'frost',
                life: 30
              });
            } else if (t.type === 'laser') {
              // Continuous thermal beam deals direct damage
              target.hp -= t.damage;
              spawnSparks(target.x, target.y, '#a855f7', 1);
            } else if (t.type === 'missile') {
              playSound('missile');
              projectiles.push({
                x: t.x,
                y: t.y,
                target: target,
                damage: t.damage,
                splash: t.splashRadius,
                type: 'missile',
                speed: 7
              });
            }
          }
        }
      });

      // 4. Update Projectiles
      for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];

        if (p.type === 'bullet' || p.type === 'frost') {
          p.x += p.vx;
          p.y += p.vy;
          p.life--;

          // Check hit with enemies
          let hit = false;
          for (const e of enemies) {
            if (Math.hypot(e.x - p.x, e.y - p.y) < e.size + 4) {
              e.hp -= p.damage;
              hit = true;
              if (p.type === 'frost') {
                e.slowTimer = 80;
                spawnSparks(e.x, e.y, '#06b6d4', 6);
              } else {
                spawnSparks(e.x, e.y, '#38bdf8', 4);
              }
              break;
            }
          }

          if (hit || p.life <= 0) {
            projectiles.splice(i, 1);
          }
        } else if (p.type === 'missile') {
          // Guided rocket homing toward target
          if (!enemies.includes(p.target)) {
            // Target dead, acquire nearest
            p.target = enemies[0] || null;
          }

          if (p.target) {
            const dx = p.target.x - p.x;
            const dy = p.target.y - p.y;
            const dist = Math.hypot(dx, dy);
            p.x += (dx / dist) * p.speed;
            p.y += (dy / dist) * p.speed;

            if (dist < p.target.size + 6) {
              // Detonation! Area of effect splash
              playSound('explosion');
              spawnSparks(p.x, p.y, '#f59e0b', 24);

              for (const e of enemies) {
                const splashDist = Math.hypot(e.x - p.x, e.y - p.y);
                if (splashDist <= p.splash) {
                  const falloff = 1 - (splashDist / p.splash) * 0.5;
                  e.hp -= p.damage * falloff;
                }
              }
              projectiles.splice(i, 1);
            }
          } else {
            projectiles.splice(i, 1);
          }
        }
      }

      // 5. Check Dead Enemies
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        if (e.hp <= 0) {
          credits += e.reward;
          score += e.reward * 10;
          spawnSparks(e.x, e.y, e.color, 14);
          enemies.splice(i, 1);
          updateHUD();
        }
      }

      // 6. Check Wave Completion
      if (waveInProgress && spawnQueue.length === 0 && enemies.length === 0) {
        waveInProgress = false;
        credits += 50 + wave * 10; // Wave bonus
        score += 250;
        updateHUD();

        if (wave >= maxWaves) {
          victory();
          return;
        }

        if (startWaveBtn) {
          startWaveBtn.disabled = false;
          startWaveBtn.innerHTML = `<span>⚔️</span> Launch Wave ${wave + 1}`;
        }
      }

      // 7. Update Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) particles.splice(i, 1);
      }
    }
  }

  // --- Rendering ---
  function draw() {
    // 1. Clear Arena
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Tactical Grid Lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
    ctx.lineWidth = 1;
    for (let c = 0; c < COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * TILE, 0);
      ctx.lineTo(c * TILE, canvas.height);
      ctx.stroke();
    }
    for (let r = 0; r < ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * TILE);
      ctx.lineTo(canvas.width, r * TILE);
      ctx.stroke();
    }

    // 3. Draw Patrol Road Waypoints
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 26;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(WAYPOINTS[0].x, WAYPOINTS[0].y);
    for (let i = 1; i < WAYPOINTS.length; i++) {
      ctx.lineTo(WAYPOINTS[i].x, WAYPOINTS[i].y);
    }
    ctx.stroke();

    // Road glowing inner line
    ctx.strokeStyle = 'rgba(2, 132, 199, 0.35)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // 4. Base HQ at endpoint
    const endWp = WAYPOINTS[WAYPOINTS.length - 1];
    ctx.save();
    ctx.fillStyle = '#0284c7';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 15;
    ctx.fillRect(canvas.width - 24, endWp.y - 20, 24, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HQ', canvas.width - 12, endWp.y + 4);
    ctx.restore();

    // 5. Draw Placed Turrets
    turrets.forEach(t => {
      const spec = TURRET_TYPES[t.type];

      ctx.save();
      ctx.translate(t.x, t.y);

      // Base Mount
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = spec.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-15, -15, 30, 30, 6);
      ctx.fill();
      ctx.stroke();

      // Rotating Gun Barrel
      ctx.rotate(t.angle);
      ctx.fillStyle = spec.color;
      ctx.fillRect(0, -3, 16, 6);

      // Core Dome
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();

      // Level Indicator Stars
      if (t.level > 1) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = '8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('★'.repeat(t.level), 0, -18);
      }

      ctx.restore();

      // Laser Beam Drawing
      if (t.type === 'laser' && t.target) {
        ctx.save();
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(t.target.x, t.target.y);
        ctx.stroke();
        ctx.restore();
      }
    });

    // 6. Draw Range Ring for Inspected / Hovered Turret
    if (inspectedTurret) {
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(inspectedTurret.x, inspectedTurret.y, inspectedTurret.range, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    } else if (hoveredTile && !ROAD_TILES.has(`${hoveredTile.c},${hoveredTile.r}`)) {
      // Preview range ring on hovered tile
      const spec = TURRET_TYPES[selectedTurretType];
      ctx.save();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
      ctx.fillStyle = 'rgba(16, 185, 129, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(hoveredTile.c * TILE + TILE / 2, hoveredTile.r * TILE + TILE / 2, spec.range, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // 7. Draw Enemies
    enemies.forEach(e => {
      ctx.save();
      ctx.fillStyle = (e.slowTimer > 0) ? '#06b6d4' : e.color;
      ctx.shadowColor = e.color;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
      ctx.fill();

      // Health Bar
      const hpPct = Math.max(0, e.hp / e.maxHp);
      const barW = e.size * 2;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(e.x - e.size, e.y - e.size - 8, barW, 4);

      ctx.fillStyle = (hpPct > 0.5) ? '#10b981' : (hpPct > 0.25) ? '#fbbf24' : '#ef4444';
      ctx.fillRect(e.x - e.size, e.y - e.size - 8, barW * hpPct, 4);

      ctx.restore();
    });

    // 8. Draw Projectiles
    projectiles.forEach(p => {
      ctx.save();
      if (p.type === 'bullet') {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'frost') {
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'missile') {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    // 9. Draw Particles
    particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.fillRect(p.x, p.y, 3, 3);
    });
    ctx.globalAlpha = 1;

    // 10. Visual Paused State Overlay
    if (isPaused) {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.75)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '900 32px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#38bdf8';
      ctx.fillText('⏸️ TACTICAL PAUSE', canvas.width / 2, canvas.height / 2 - 8);

      ctx.font = '600 15px Outfit, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.shadowBlur = 0;
      ctx.fillText('Press P or click Resume to continue battle operations', canvas.width / 2, canvas.height / 2 + 28);
    }
  }

  // --- Animation Loop ---
  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  // --- Pointer & Click Interactions ---
  canvas.addEventListener('click', (e) => {
    if (!isRunning || isPaused || isGameOver) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const col = Math.floor(clickX / TILE);
    const row = Math.floor(clickY / TILE);

    // Check if clicked an existing turret
    const clickedTurret = turrets.find(t => t.col === col && t.row === row);
    if (clickedTurret) {
      inspectTurret(clickedTurret);
    } else {
      // Place turret
      placeTurret(col, row);
    }
  });

  canvas.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const moveX = (e.clientX - rect.left) * scaleX;
    const moveY = (e.clientY - rect.top) * scaleY;

    hoveredTile = {
      c: Math.floor(moveX / TILE),
      r: Math.floor(moveY / TILE)
    };
  });

  canvas.addEventListener('pointerleave', () => {
    hoveredTile = null;
  });

  // --- Arsenal Tray Card Bindings ---
  document.querySelectorAll('.turret-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.turret-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedTurretType = card.dataset.turretType;
      inspectTurret(null);
    });
  });

  // --- Event Bindings ---
  startBtn?.addEventListener('click', startGame);
  restartBtn?.addEventListener('click', startGame);
  playAgainBtn?.addEventListener('click', startGame);
  startWaveBtn?.addEventListener('click', startNextWave);
  pauseBtn?.addEventListener('click', togglePause);
  muteBtn?.addEventListener('click', toggleMute);

  speedToggleBtn?.addEventListener('click', () => {
    gameSpeed = (gameSpeed === 1) ? 2 : 1;
    updateHUD();
  });

  upgradeBtn?.addEventListener('click', upgradeCurrentTurret);
  sellBtn?.addEventListener('click', sellCurrentTurret);
  closeInspectorBtn?.addEventListener('click', () => inspectTurret(null));

  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyP') {
      e.preventDefault();
      togglePause();
    } else if (e.code === 'Space') {
      e.preventDefault();
      if (!waveInProgress) startNextWave();
    }
  });

  // Run render loop
  requestAnimationFrame(loop);
})();
