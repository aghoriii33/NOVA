/**
 * NOVA Studio Portfolio JS
 * Creators: MR HRICK & MR RTIYANA
 * Mails: kundurick781@gmail.com | kaitristan312@gmail.com
 */

document.addEventListener('DOMContentLoaded', () => {
  // Disable scroll while loading
  document.body.classList.add('loading');

  // Core App State
  const state = {
    mouse: { x: -1000, y: -1000, targetX: -1000, targetY: -1000 },
    scrollPercent: 0,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    isMenuOpen: false
  };

  // Track Mouse Position
  window.addEventListener('mousemove', (e) => {
    state.mouse.targetX = e.clientX;
    state.mouse.targetY = e.clientY;
  });

  // Smooth mouse interpolation
  function updateMousePhysics() {
    if (state.mouse.x === -1000) {
      state.mouse.x = state.mouse.targetX;
      state.mouse.y = state.mouse.targetY;
    } else {
      state.mouse.x += (state.mouse.targetX - state.mouse.x) * 0.1;
      state.mouse.y += (state.mouse.targetY - state.mouse.y) * 0.1;
    }
  }

  // Handle Resize
  window.addEventListener('resize', () => {
    state.windowWidth = window.innerWidth;
    state.windowHeight = window.innerHeight;
  });

  /* ==========================================================================
     1. INTRO LOADER & MORPHING SHAPES
     ========================================================================== */
  const introOverlay = document.getElementById('intro-overlay');
  const introCanvas = document.getElementById('intro-canvas');
  const introCtx = introCanvas.getContext('2d');
  const progressFill = document.querySelector('.intro-progress-fill');
  const introText = document.querySelector('.intro-text');
  const loaderLog = document.getElementById('loader-log');
  
  // Telemetry indicators
  const teleSync = document.getElementById('tele-sync');
  const teleLatency = document.getElementById('tele-latency');
  const teleSpeed = document.getElementById('tele-speed');
  const teleLoad = document.getElementById('tele-load');

  // Set canvas resolution
  function resizeIntroCanvas() {
    introCanvas.width = 360;
    introCanvas.height = 360;
  }
  resizeIntroCanvas();

  let introStartTime = null;
  let introAnimationId = null;
  const introDuration = 6000; // 6 seconds total

  // === ASSASSIN'S CREED ANIMUS LOADER ===
  // Log sequence — AC themed
  const logLines = [
    { threshold: 0.05, text: "[ANIMUS] INITIALIZING GENETIC MEMORY CORE v4.3.5...", color: "" },
    { threshold: 0.22, text: "[SYNC]   ACCESSING BROTHERHOOD MEMORY ARCHIVE...", color: "cyan" },
    { threshold: 0.45, text: "[EAGLE]  ACTIVATING EAGLE VISION PROTOCOL...", color: "" },
    { threshold: 0.65, text: "[CREED]  LOADING SUBJECT MEMORY SEQUENCE...", color: "purple" },
    { threshold: 0.80, text: "[ANIMUS] SUBJECT IDENTITY CONFIRMED: ASSASSIN...", color: "cyan" },
    { threshold: 0.92, text: "[SYSTEM] DESYNCHRONIZATION PREVENTED. LAUNCHING...", color: "" }
  ];
  const writtenLogs = new Set();
  let lastMicroLogTime = 0;
  const microLogs = [
    "[ANIMUS] Calibrating DNA strand resonance...",
    "[SYNC]   Verifying ancestral memory timestamps...",
    "[EAGLE]  Scanning environmental parameters...",
    "[CREED]  Decrypting Templar encoded data...",
    "[ANIMUS] Cross-referencing Isu artifact indices...",
    "[SYNC]   Memory bleeding compensation active...",
    "[CREED]  Brotherhood network handshake sent...",
    "[ANIMUS] Bleeding effect suppressor engaged...",
    "[EAGLE]  Neural pathway synchronization 98.4%...",
    "[SYNC]   Genetic memory lock-in confirmed..."
  ];

  function updateLoaderLogs(progress, timestamp) {
    logLines.forEach(log => {
      if (progress >= log.threshold && !writtenLogs.has(log.text)) {
        writtenLogs.add(log.text);
        const line = document.createElement('div');
        line.className = 'log-line';
        if (log.color) line.classList.add(log.color);
        line.textContent = log.text;
        loaderLog.appendChild(line);
        loaderLog.scrollTop = loaderLog.scrollHeight;
      }
    });
    if (timestamp - lastMicroLogTime > 350 && Math.random() < 0.75 && progress < 0.92) {
      lastMicroLogTime = timestamp;
      const text = microLogs[Math.floor(Math.random() * microLogs.length)];
      const line = document.createElement('div');
      line.className = 'log-line';
      line.style.opacity = 0.5;
      line.style.fontSize = '0.72rem';
      line.textContent = text;
      loaderLog.appendChild(line);
      loaderLog.scrollTop = loaderLog.scrollHeight;
    }
  }

  function updateTelemetry(progress) {
    if (teleSync) teleSync.textContent = `${Math.floor(progress * 100)}%`;
    if (teleLatency) {
      const lat = Math.floor(99 - progress * 95) + Math.floor(Math.sin(Date.now() * 0.01) * 3 + 4);
      teleLatency.textContent = `${Math.max(4, lat)}ms`;
    }
    if (teleSpeed) teleSpeed.textContent = `${(progress * 0.99).toFixed(2)}c`;
    if (teleLoad) teleLoad.textContent = `${(progress * 100).toFixed(2)}%`;
  }

  // ─── Canvas & Color Constants ──────────────────────────────────────────────
  const CX = 180, CY = 180;
  const AC_GOLD   = '#d4af37';
  const AC_LIGHT  = '#f0e6c0';
  const AC_DIM    = '#8b6914';
  const AC_WHITE  = '#ffffff';

  // ─── Emblem stroke paths ───────────────────────────────────────────────────
  // Points are [x, y] relative to canvas (CX, CY already baked in via ep())
  const SC = 1.15; // scale factor
  function ep(x, y) { return [CX + x * SC, CY + y * SC]; }

  const acEmblemStrokes = [
    // 0 — Left A-leg top to bottom-left
    { pts: [ep(0,-78), ep(-38,18), ep(-22,52), ep(0,75)],    col: AC_GOLD,  w: 2.2 },
    // 1 — Right A-leg top to bottom-right (mirrors left)
    { pts: [ep(0,-78), ep(38,18),  ep(22,52),  ep(0,75)],    col: AC_GOLD,  w: 2.2 },
    // 2 — Crossbar
    { pts: [ep(-30,35), ep(30,35)],                           col: AC_GOLD,  w: 2.0 },
    // 3 — Left inner notch (shoulder detail)
    { pts: [ep(-38,18), ep(-18,18)],                          col: AC_DIM,   w: 1.2 },
    // 4 — Right inner notch
    { pts: [ep(38,18),  ep(18,18)],                           col: AC_DIM,   w: 1.2 },
    // 5 — Left outer wing — sweeping up-left
    { pts: [ep(-38,18), ep(-62,2), ep(-88,-22), ep(-82,-48)], col: AC_GOLD,  w: 1.8 },
    // 6 — Right outer wing — sweeping up-right
    { pts: [ep(38,18),  ep(62,2),  ep(88,-22),  ep(82,-48)],  col: AC_GOLD,  w: 1.8 },
    // 7 — Left wing lower curve back to body
    { pts: [ep(-82,-48), ep(-68,-58), ep(-48,-38), ep(-38,18)], col: AC_GOLD, w: 1.2 },
    // 8 — Right wing lower curve
    { pts: [ep(82,-48),  ep(68,-58),  ep(48,-38),  ep(38,18)],  col: AC_GOLD, w: 1.2 },
    // 9 — Left wing tip feather
    { pts: [ep(-82,-48), ep(-98,-52), ep(-88,-64)],           col: AC_DIM,   w: 1.0 },
    // 10 — Right wing tip feather
    { pts: [ep(82,-48),  ep(98,-52),  ep(88,-64)],            col: AC_DIM,   w: 1.0 },
    // 11 — Left inner wing brace
    { pts: [ep(-60,0),   ep(-50,-28), ep(-38,18)],            col: AC_DIM,   w: 0.8 },
    // 12 — Right inner wing brace
    { pts: [ep(60,0),    ep(50,-28),  ep(38,18)],             col: AC_DIM,   w: 0.8 },
    // 13 — Eagle head / beak (top ornament)
    { pts: [ep(0,-78), ep(-10,-92), ep(0,-104), ep(10,-92), ep(0,-78)], col: AC_WHITE, w: 1.6 },
    // 14 — Central Animus circle (hidden blade mechanism)
    { isCircle: true, cx: CX, cy: CY - 2*SC, r: 13*SC,       col: AC_GOLD,  w: 1.5 },
    // 15 — Inner cross on circle
    { pts: [ep(-10,-2), ep(10,-2)],                           col: AC_DIM,   w: 0.8 },
    { pts: [ep(0,-12),  ep(0,8)],                             col: AC_DIM,   w: 0.8 },
  ];

  // ─── Polyline length helper ────────────────────────────────────────────────
  function polylineLength(pts) {
    let len = 0;
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i][0] - pts[i-1][0], dy = pts[i][1] - pts[i-1][1];
      len += Math.sqrt(dx*dx + dy*dy);
    }
    return len;
  }

  function drawStrokeFraction(ctx, pts, frac) {
    if (pts.length < 2 || frac <= 0) return;
    const total = polylineLength(pts);
    const target = total * Math.min(1, frac);
    let drawn = 0;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i][0] - pts[i-1][0], dy = pts[i][1] - pts[i-1][1];
      const seg = Math.sqrt(dx*dx + dy*dy);
      if (drawn + seg >= target) {
        const t = (target - drawn) / seg;
        ctx.lineTo(pts[i-1][0] + dx*t, pts[i-1][1] + dy*t);
        break;
      }
      ctx.lineTo(pts[i][0], pts[i][1]);
      drawn += seg;
    }
    ctx.stroke();
  }

  // ─── Animus rotating rings ─────────────────────────────────────────────────
  const animusRings = [
    { r: 112, rotDir:  1, speed: 0.004, col: 'rgba(212,175,55,0.50)', dash: [10,6],  lw: 1.2, ticks: 36 },
    { r: 122, rotDir: -1, speed: 0.003, col: 'rgba(212,175,55,0.25)', dash: [4,10],  lw: 0.8, ticks: 0  },
    { r: 104, rotDir:  1, speed: 0.006, col: 'rgba(255,255,255,0.12)', dash: [2,7],  lw: 0.6, ticks: 12 },
  ];
  let acAngle = 0;

  function drawAnimusRings(ctx, timestamp, progress) {
    const alpha = Math.min(1, (progress - 0.08) * 6);
    if (alpha <= 0) return;
    acAngle += 0.006;

    animusRings.forEach((ring, ri) => {
      const pulse = 1 + Math.sin(timestamp * 0.0018 + ri) * 0.12;
      const a = Math.min(1, alpha * pulse);

      ctx.save();
      ctx.strokeStyle = ring.col.replace(/[\d.]+\)$/, `${parseFloat(ring.col.match(/[\d.]+\)$/)?.[0] || 0.4) * a})`);
      ctx.lineWidth = ring.lw;
      ctx.setLineDash(ring.dash);
      ctx.lineDashOffset = -acAngle * ring.rotDir * 200;
      ctx.shadowBlur = 8;
      ctx.shadowColor = AC_GOLD;
      ctx.beginPath();
      ctx.arc(CX, CY, ring.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Tick marks
      if (ring.ticks > 0) {
        ctx.lineWidth = 0.7;
        ctx.shadowBlur = 4;
        for (let i = 0; i < ring.ticks; i++) {
          const ang = (i / ring.ticks) * Math.PI * 2 + acAngle * ring.rotDir * 0.5;
          const tickLen = (i % 3 === 0) ? 8 : 4;
          const inner = ring.r - tickLen;
          ctx.beginPath();
          ctx.moveTo(CX + Math.cos(ang) * inner, CY + Math.sin(ang) * inner);
          ctx.lineTo(CX + Math.cos(ang) * ring.r,  CY + Math.sin(ang) * ring.r);
          ctx.stroke();
        }
      }
      ctx.restore();
    });

    // Cardinal tick labels
    const labelAlpha = Math.min(1, (progress - 0.2) * 5) * 0.7;
    if (labelAlpha > 0) {
      const labels = ['N', 'E', 'S', 'W'];
      ctx.save();
      ctx.font = 'bold 8px monospace';
      ctx.fillStyle = `rgba(212,175,55,${labelAlpha})`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      labels.forEach((lbl, i) => {
        const ang = (i / 4) * Math.PI * 2 - Math.PI / 2;
        ctx.fillText(lbl, CX + Math.cos(ang) * 132, CY + Math.sin(ang) * 132);
      });
      ctx.restore();
    }
  }

  // ─── Triangular Eagle Vision grid ─────────────────────────────────────────
  const gridPts = Array.from({length: 14}, (_, i) => {
    const ang = (i / 14) * Math.PI * 2;
    const r = 118 + (i % 3) * 10;
    return { x: CX + Math.cos(ang) * r, y: CY + Math.sin(ang) * r };
  });

  function drawEagleVisionGrid(ctx, progress) {
    const alpha = Math.min(1, progress * 5) * 0.10;
    if (alpha <= 0) return;
    ctx.save();
    ctx.strokeStyle = `rgba(212,175,55,${alpha})`;
    ctx.lineWidth = 0.4;
    for (let i = 0; i < gridPts.length; i++) {
      const a = gridPts[i], b = gridPts[(i+1) % gridPts.length];
      ctx.beginPath(); ctx.moveTo(CX, CY); ctx.lineTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();
  }

  // ─── Falling ancient rune streams ─────────────────────────────────────────
  const runeChars = ['✦','⌘','⊕','△','▽','◈','⊗','⌬','Δ','Σ','Λ','ψ','Ω','ℭ','☩','⌁','⍟'];
  const runeStreams = Array.from({length: 14}, () => ({
    x: 15 + Math.random() * 330,
    y: -(Math.random() * 360),
    speed: 0.55 + Math.random() * 0.8,
    chars: Array.from({length: 5 + Math.floor(Math.random()*5)}, () => runeChars[Math.floor(Math.random()*runeChars.length)]),
    op: 0.25 + Math.random() * 0.35,
    tick: 0
  }));

  function drawRuneStreams(ctx, timestamp, progress) {
    const alpha = Math.min(1, progress * 4) * 0.9;
    if (alpha <= 0) return;
    ctx.save();
    ctx.font = '10px serif';
    runeStreams.forEach(s => {
      s.y += s.speed;
      s.tick++;
      if (s.tick > 18) { s.tick = 0; s.chars[Math.floor(Math.random()*s.chars.length)] = runeChars[Math.floor(Math.random()*runeChars.length)]; }
      if (s.y > 380) { s.y = -60; s.x = 15 + Math.random()*330; }
      s.chars.forEach((ch, idx) => {
        const cy2 = s.y - idx * 13;
        if (cy2 < -15 || cy2 > 375) return;
        const fade = Math.max(0, 1 - idx / s.chars.length);
        const op = alpha * s.op * fade;
        if (idx === 0) {
          ctx.fillStyle = `rgba(240,230,192,${op * 1.6})`;
          ctx.shadowColor = AC_GOLD; ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = `rgba(212,175,55,${op})`;
          ctx.shadowBlur = 3; ctx.shadowColor = AC_GOLD;
        }
        ctx.fillText(ch, s.x, cy2);
      });
    });
    ctx.restore();
  }

  // ─── AC Emblem assembling ──────────────────────────────────────────────────
  function drawACEmblem(ctx, timestamp, progress) {
    // Emblem draws from 22% → 85%
    const ep2 = Math.max(0, Math.min(1, (progress - 0.22) / 0.63));
    if (ep2 <= 0) return;

    const totalStrokes = acEmblemStrokes.length;
    const glow = 6 + ep2 * 18;

    acEmblemStrokes.forEach((stroke, idx) => {
      const sStart = (idx / totalStrokes) * 0.88;
      const sEnd   = ((idx + 2.0) / totalStrokes) * 0.88;
      const frac   = Math.max(0, Math.min(1, (ep2 - sStart) / (sEnd - sStart)));
      if (frac <= 0) return;

      ctx.save();
      ctx.strokeStyle = stroke.col;
      ctx.lineWidth   = stroke.w || 1.5;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.shadowBlur  = glow;
      ctx.shadowColor = stroke.col === AC_WHITE ? AC_WHITE : AC_GOLD;

      if (stroke.isCircle) {
        ctx.beginPath();
        ctx.arc(stroke.cx, stroke.cy, stroke.r, -Math.PI/2, -Math.PI/2 + frac * Math.PI * 2);
        ctx.stroke();
      } else {
        drawStrokeFraction(ctx, stroke.pts, frac);
      }
      ctx.restore();
    });

    // Aura glow at near-complete
    if (ep2 > 0.88) {
      const ga = (ep2 - 0.88) / 0.12;
      ctx.save();
      const grad = ctx.createRadialGradient(CX, CY, 0, CX, CY, 95);
      grad.addColorStop(0,   `rgba(212,175,55,${ga * 0.20})`);
      grad.addColorStop(0.5, `rgba(212,175,55,${ga * 0.08})`);
      grad.addColorStop(1,   'rgba(212,175,55,0)');
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(CX, CY, 95, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // ─── Eagle Vision horizontal sweep ────────────────────────────────────────
  function drawEagleSweep(ctx, timestamp, progress) {
    if (progress < 0.68) return;
    const sp = Math.min(1, (progress - 0.68) / 0.22);
    const sweepX = sp * 300;
    const grad = ctx.createLinearGradient(sweepX - 50, 0, sweepX + 50, 0);
    grad.addColorStop(0,   'rgba(212,175,55,0)');
    grad.addColorStop(0.5, `rgba(212,175,55,${0.15 * (1 - Math.abs(sp - 0.5) * 2)})`);
    grad.addColorStop(1,   'rgba(212,175,55,0)');
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 360, 360);
    ctx.restore();
  }

  // ─── Scanning horizontal laser ─────────────────────────────────────────────
  function drawACScanner(ctx, timestamp, progress) {
    if (progress > 0.92) return;
    const scanY = CY + Math.sin(timestamp * 0.002) * 110;
    const scanAlpha = Math.min(0.35, progress * 0.5);
    const grad = ctx.createLinearGradient(0, scanY - 10, 0, scanY + 2);
    grad.addColorStop(0, 'rgba(212,175,55,0)');
    grad.addColorStop(0.7, `rgba(212,175,55,${scanAlpha * 0.4})`);
    grad.addColorStop(1,   `rgba(212,175,55,${scanAlpha})`);
    ctx.save();
    ctx.fillStyle = grad;
    ctx.fillRect(20, scanY - 10, 320, 12);
    ctx.strokeStyle = `rgba(212,175,55,${scanAlpha})`;
    ctx.lineWidth = 1;
    ctx.shadowBlur = 6;
    ctx.shadowColor = AC_GOLD;
    ctx.beginPath(); ctx.moveTo(20, scanY); ctx.lineTo(340, scanY); ctx.stroke();
    ctx.restore();
  }

  // ─── Gold particle finale ──────────────────────────────────────────────────
  class ACParticle {
    constructor(x, y) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 1.5 + Math.random() * 5;
      this.x = x; this.y = y;
      this.vx = Math.cos(ang) * spd;
      this.vy = Math.sin(ang) * spd;
      this.alpha = 1;
      this.size  = Math.random() * 3 + 0.8;
      this.col   = Math.random() > 0.4 ? AC_GOLD : AC_WHITE;
    }
    update() { this.x += this.vx; this.y += this.vy; this.vy += 0.08; this.alpha -= 0.018; }
    draw(ctx) {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.col;
      ctx.shadowBlur = 10; ctx.shadowColor = this.col;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    }
  }
  let acParticles = [];

  // ─── Main drawIntro loop ───────────────────────────────────────────────────
  function drawIntro(timestamp) {
    if (!introStartTime) introStartTime = timestamp;
    const elapsed  = timestamp - introStartTime;
    const progress = Math.min(elapsed / introDuration, 1);

    progressFill.style.width = `${progress * 100}%`;
    updateLoaderLogs(progress, timestamp);
    updateTelemetry(progress);

    introCtx.clearRect(0, 0, 360, 360);

    if (progress < 0.94) {
      // Layer 1 — rune streams (background)
      drawRuneStreams(introCtx, timestamp, progress);
      // Layer 2 — Eagle Vision triangular grid
      drawEagleVisionGrid(introCtx, progress);
      // Layer 3 — rotating Animus rings
      drawAnimusRings(introCtx, timestamp, progress);
      // Layer 4 — Eagle Vision golden sweep
      drawEagleSweep(introCtx, timestamp, progress);
      // Layer 5 — AC Emblem assembling itself
      drawACEmblem(introCtx, timestamp, progress);
      // Layer 6 — scanning laser line
      drawACScanner(introCtx, timestamp, progress);
    } else {
      // Finale — gold particle burst
      if (acParticles.length === 0) {
        for (let i = 0; i < 90; i++) {
          const ang = (i / 90) * Math.PI * 2;
          const r   = 15 + Math.random() * 85;
          acParticles.push(new ACParticle(CX + Math.cos(ang)*r, CY + Math.sin(ang)*r));
        }
        introText.classList.add('reveal');
      }
    }

    // Render particles
    if (acParticles.length > 0) {
      acParticles.forEach(p => { p.update(); p.draw(introCtx); });
      acParticles = acParticles.filter(p => p.alpha > 0);
    }

    if (progress < 1) {
      introAnimationId = requestAnimationFrame(drawIntro);
    } else {
      setTimeout(() => {
        introOverlay.classList.add('fade-out');
        document.body.classList.remove('loading');
        revealSkills();
      }, 800);
    }
  }

  requestAnimationFrame(drawIntro);




  /* ==========================================================================
     2. DYNAMIC INTERACTIVE VFX BACKGROUND (3D CYBER PORTAL SPACE)
     ========================================================================== */
  const vfxCanvas = document.getElementById('vfx-canvas');
  const vfxCtx = vfxCanvas.getContext('2d');

  // Detect mobile — disable heavy VFX to hit 120Hz
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;

  function resizeVfxCanvas() {
    // On mobile use 0.5x pixel ratio to cut GPU work in half
    const dpr = isMobile ? Math.min(window.devicePixelRatio || 1, 1) : Math.min(window.devicePixelRatio || 1, 2);
    vfxCanvas.width  = Math.floor(window.innerWidth  * dpr);
    vfxCanvas.height = Math.floor(window.innerHeight * dpr);
    vfxCanvas.style.width  = window.innerWidth  + 'px';
    vfxCanvas.style.height = window.innerHeight + 'px';
    vfxCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resizeVfxCanvas();
  window.addEventListener('resize', resizeVfxCanvas, { passive: true });

  // Projection math
  const fov = 450;
  let camPitch = 0;
  let camYaw = 0;
  let targetCamPitch = 0;
  let targetCamYaw = 0;

  function project3D(x, y, z, width, height, cp, cy) {
    // 1. Rotate around Y (Yaw)
    const cosY = Math.cos(cy);
    const sinY = Math.sin(cy);
    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;

    // 2. Rotate around X (Pitch)
    const cosX = Math.cos(cp);
    const sinX = Math.sin(cp);
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;

    if (z2 <= 15) return null;

    const scale = fov / z2;
    const sx = width / 2 + x1 * scale;
    const sy = height / 2 + y2 * scale;

    return { x: sx, y: sy, depth: z2, scale: scale };
  }

  // 1. Concentric Cyber Rings
  class CyberRing3D {
    constructor(radius, color, rotSpeedX, rotSpeedY, rotSpeedZ, isDashed = false) {
      this.radius = radius;
      this.color = color;
      this.rx = Math.random() * Math.PI;
      this.ry = Math.random() * Math.PI;
      this.rz = Math.random() * Math.PI;
      this.rotSpeedX = rotSpeedX;
      this.rotSpeedY = rotSpeedY;
      this.rotSpeedZ = rotSpeedZ;
      this.isDashed = isDashed;
      this.centerZ = 500; // portal depth plane
    }

    update() {
      this.rx += this.rotSpeedX;
      this.ry += this.rotSpeedY;
      this.rz += this.rotSpeedZ;
    }

    draw(ctx, width, height, cp, cy) {
      const segments = 120;
      ctx.save();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1.8;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      
      // Draw outer circle
      ctx.beginPath();
      let first = true;
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const lx = this.radius * Math.cos(angle);
        const ly = this.radius * Math.sin(angle);
        const lz = 0;

        // Rotate local points around X, Y, Z
        let y1 = ly * Math.cos(this.rx) - lz * Math.sin(this.rx);
        let z1 = ly * Math.sin(this.rx) + lz * Math.cos(this.rx);
        let x2 = lx * Math.cos(this.ry) - z1 * Math.sin(this.ry);
        let z2 = lx * Math.sin(this.ry) + z1 * Math.cos(this.ry);
        let x3 = x2 * Math.cos(this.rz) - y1 * Math.sin(this.rz);
        let y3 = x2 * Math.sin(this.rz) + y1 * Math.cos(this.rz);

        const screenPt = project3D(x3, y3, z2 + this.centerZ, width, height, cp, cy);
        if (screenPt) {
          if (first) {
            ctx.moveTo(screenPt.x, screenPt.y);
            first = false;
          } else {
            ctx.lineTo(screenPt.x, screenPt.y);
          }
        }
      }
      ctx.stroke();

      // If dashed (like the middle ring in the image), also draw radial tick indicators
      if (this.isDashed) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.shadowBlur = 4;
        
        for (let i = 0; i < 36; i++) {
          const angle = (i / 36) * Math.PI * 2;
          const r1 = this.radius - 8;
          const r2 = this.radius + 8;
          
          const x_start = r1 * Math.cos(angle);
          const y_start = r1 * Math.sin(angle);
          const x_end = r2 * Math.cos(angle);
          const y_end = r2 * Math.sin(angle);

          // Rotate local points function
          const rotPt = (lx, ly) => {
            let y1 = ly * Math.cos(this.rx);
            let z1 = ly * Math.sin(this.rx);
            let x2 = lx * Math.cos(this.ry) - z1 * Math.sin(this.ry);
            let z2 = lx * Math.sin(this.ry) + z1 * Math.cos(this.ry);
            let x3 = x2 * Math.cos(this.rz) - y1 * Math.sin(this.rz);
            let y3 = x2 * Math.sin(this.rz) + y1 * Math.cos(this.rz);
            return { x: x3, y: y3, z: z2 };
          };

          const p1 = rotPt(x_start, y_start);
          const p2 = rotPt(x_end, y_end);

          const s1 = project3D(p1.x, p1.y, p1.z + this.centerZ, width, height, cp, cy);
          const s2 = project3D(p2.x, p2.y, p2.z + this.centerZ, width, height, cp, cy);

          if (s1 && s2) {
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();
    }
  }

  const portalRings = [
    new CyberRing3D(100, 'hsl(182, 100%, 50%)', 0.003, 0.007, 0.012, false),
    new CyberRing3D(160, 'hsl(272, 100%, 60%)', 0.005, -0.004, 0.008, true),
    new CyberRing3D(230, 'hsl(332, 100%, 55%)', -0.002, 0.009, -0.005, false)
  ];

  // 2. Warp-Speed Starfield Particles
  class WarpParticle {
    constructor() {
      this.reset();
      this.z = Math.random() * 1000;
    }
    reset() {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 320 + 30; // offset cylindrical tunnel
      this.x = Math.cos(angle) * radius;
      this.y = Math.sin(angle) * radius;
      this.z = 1000;
      this.speed = Math.random() * 8 + 6;
      this.color = Math.random() > 0.6 ? 'hsl(182, 100%, 50%)' : (Math.random() > 0.5 ? 'hsl(272, 100%, 60%)' : 'hsl(332, 100%, 55%)');
    }
    update() {
      this.z -= this.speed;
      if (this.z <= 15) {
        this.reset();
      }
    }
    draw(ctx, width, height, cp, cy) {
      const curr = project3D(this.x, this.y, this.z, width, height, cp, cy);
      if (!curr) return;

      const prev = project3D(this.x, this.y, this.z + this.speed * 1.5, width, height, cp, cy);
      if (!prev) return;

      let alpha = (1 - this.z / 1000) * 0.75;
      if (this.z < 80) alpha *= (this.z / 80);

      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.strokeStyle = this.color;
      ctx.shadowBlur = 5;
      ctx.shadowColor = this.color;
      ctx.lineWidth = Math.max(0.6, (1 - this.z / 1000) * 2.2);
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(curr.x, curr.y);
      ctx.stroke();
      ctx.restore();
    }
  }

  const warpParticles = [];
  const totalWarpParticles = isMobile ? 18 : 60; // half particles on mobile
  for (let i = 0; i < totalWarpParticles; i++) {
    warpParticles.push(new WarpParticle());
  }

  // 3. Floating 3D Interconnected Crystals (Reference 2 style)
  class Crystal3D {
    constructor(cx, cy, cz, size, color, rotSpeedX, rotSpeedY, rotSpeedZ) {
      this.cx = cx;
      this.cy = cy;
      this.cz = cz;
      this.size = size;
      this.color = color;
      this.rx = Math.random() * Math.PI;
      this.ry = Math.random() * Math.PI;
      this.rz = Math.random() * Math.PI;
      this.rotSpeedX = rotSpeedX;
      this.rotSpeedY = rotSpeedY;
      this.rotSpeedZ = rotSpeedZ;

      const s = size / 2;
      // Octahedron crystal shape: elongated vertical diamond
      this.vertices = [
        {x: 0, y: -s * 1.5, z: 0},  // 0: Top tip
        {x: 0, y: s * 1.5, z: 0},   // 1: Bottom tip
        {x: -s, y: 0, z: -s},       // 2: Equatorial L-Back
        {x: s, y: 0, z: -s},        // 3: Equatorial R-Back
        {x: s, y: 0, z: s},         // 4: Equatorial R-Front
        {x: -s, y: 0, z: s}         // 5: Equatorial L-Front
      ];

      this.edges = [
        [0, 2], [0, 3], [0, 4], [0, 5], // Top pyramid caps
        [1, 2], [1, 3], [1, 4], [1, 5], // Bottom pyramid caps
        [2, 3], [3, 4], [4, 5], [5, 2]  // Belt
      ];

      this.faces = [
        [0, 2, 3], [0, 3, 4], [0, 4, 5], [0, 5, 2], // Top pyramid faces
        [1, 3, 2], [1, 4, 3], [1, 5, 4], [1, 2, 5]  // Bottom pyramid faces
      ];
    }

    update() {
      this.rx += this.rotSpeedX;
      this.ry += this.rotSpeedY;
      this.rz += this.rotSpeedZ;
      this.cz -= 1.2;
      if (this.cz < 120) {
        this.cz = 1200;
        this.cx = (Math.random() - 0.5) * 900;
        this.cy = (Math.random() - 0.5) * 600;
      }
    }

    draw(ctx, width, height, cp, cy) {
      const screenPoints = [];
      for (let i = 0; i < this.vertices.length; i++) {
        const v = this.vertices[i];
        let y1 = v.y * Math.cos(this.rx) - v.z * Math.sin(this.rx);
        let z1 = v.y * Math.sin(this.rx) + v.z * Math.cos(this.rx);
        let x2 = v.x * Math.cos(this.ry) - z1 * Math.sin(this.ry);
        let z2 = v.x * Math.sin(this.ry) + z1 * Math.cos(this.ry);
        let x3 = x2 * Math.cos(this.rz) - y1 * Math.sin(this.rz);
        let y3 = x2 * Math.sin(this.rz) + y1 * Math.cos(this.rz);

        const pt = project3D(x3 + this.cx, y3 + this.cy, z2 + this.cz, width, height, cp, cy);
        if (!pt) return;
        screenPoints.push(pt);
      }

      ctx.save();
      // Glass face transparent fill
      ctx.fillStyle = this.color.replace('rgb', 'rgba').replace('hsl', 'hsla').replace(')', ', 0.045)');
      this.faces.forEach(face => {
        ctx.beginPath();
        ctx.moveTo(screenPoints[face[0]].x, screenPoints[face[0]].y);
        for (let i = 1; i < face.length; i++) {
          ctx.lineTo(screenPoints[face[i]].x, screenPoints[face[i]].y);
        }
        ctx.closePath();
        ctx.fill();
      });

      // Neon wireframe borders
      ctx.strokeStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.lineWidth = 1.2;
      this.edges.forEach(edge => {
        ctx.beginPath();
        ctx.moveTo(screenPoints[edge[0]].x, screenPoints[edge[0]].y);
        ctx.lineTo(screenPoints[edge[1]].x, screenPoints[edge[1]].y);
        ctx.stroke();
      });

      // Pulsing glowing center core sphere
      const centerPt = project3D(this.cx, this.cy, this.cz, width, height, cp, cy);
      if (centerPt) {
        const pulse = 0.8 + Math.sin(performance.now() * 0.005 + this.cx) * 0.25;
        const radius = Math.max(2, centerPt.scale * 0.02 * pulse);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(centerPt.x, centerPt.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Neon vertices nodes
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#ffffff';
      screenPoints.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(1, pt.scale * 0.015), 0, Math.PI * 2);
        ctx.fill();
      });

      // Coding coordinate text overlay
      const scale = screenPoints.reduce((sum, p) => sum + p.scale, 0) / 6;
      ctx.fillStyle = this.color;
      ctx.font = `600 ${Math.max(7, scale * 0.045)}px monospace`;
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 0.45;
      ctx.fillText("0x" + Math.floor(this.cz).toString(16).toUpperCase(), centerPt.x - 22, centerPt.y - 12);
      ctx.restore();
    }
  }

  const cuboids = [
    new Crystal3D(-300, -200, 900, 60, 'hsl(182, 100%, 50%)', 0.008, 0.004, 0.002),
    new Crystal3D(350, -150, 1100, 70, 'hsl(272, 100%, 60%)', 0.003, 0.009, 0.005),
    new Crystal3D(-250, 220, 750, 50, 'hsl(332, 100%, 55%)', 0.006, 0.003, 0.008),
    new Crystal3D(280, 200, 1000, 65, 'hsl(182, 100%, 50%)', -0.004, 0.006, 0.003)
  ];

  // 4. Matrix Code Streams in 3D Space
  class CodeStream3D {
    constructor() {
      this.reset();
      this.z = Math.random() * 1000;
    }
    reset() {
      // Cluster stream coordinates left and right to framing channels
      this.x = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 250 + 280);
      this.y = -600;
      this.z = Math.random() * 600 + 400;
      this.speed = Math.random() * 4 + 2;
      this.chars = [];
      const len = Math.floor(Math.random() * 12 + 8);
      for (let i = 0; i < len; i++) {
        this.chars.push(Math.random() > 0.5 ? '1' : '0');
      }
      this.color = Math.random() > 0.65 ? 'hsla(182, 100%, 50%, 0.16)' : 'hsla(272, 100%, 65%, 0.16)';
    }
    update() {
      this.y += this.speed;
      if (this.y > 600) {
        this.reset();
      }
    }
    draw(ctx, width, height, cp, cy) {
      let currentY = this.y;
      for (let i = 0; i < this.chars.length; i++) {
        const charY = currentY - (i * 20);
        const pt = project3D(this.x, charY, this.z, width, height, cp, cy);
        if (pt) {
          const fontSize = Math.max(6, pt.scale * 0.05);
          ctx.save();
          let alpha = (1 - this.z / 1000) * 0.5 * (1 - i / this.chars.length);
          ctx.globalAlpha = Math.max(0, alpha);
          ctx.fillStyle = this.color;
          ctx.font = `bold ${fontSize}px monospace`;
          ctx.fillText(this.chars[i], pt.x, pt.y);
          ctx.restore();
        }
      }
    }
  }

  const codeStreams = [];
  const totalStreams = isMobile ? 8 : 35; // cut streams on mobile for smooth 120Hz
  for (let i = 0; i < totalStreams; i++) {
    codeStreams.push(new CodeStream3D());
  }

  // Dynamic Backdrop Nebulas shifting over time
  function drawNebulaBackdrop(ctx, width, height, timestamp) {
    ctx.fillStyle = '#020205';
    ctx.fillRect(0, 0, width, height);

    const time = timestamp ? timestamp * 0.00008 : 0;
    const dx1 = Math.sin(time) * 45;
    const dy1 = Math.cos(time * 0.85) * 35;
    const dx2 = Math.cos(time * 1.15) * 55;
    const dy2 = Math.sin(time * 0.72) * 45;

    // Cyan core portal aura
    const grad1 = ctx.createRadialGradient(
      width / 2 + dx1, height / 2 + dy1, 10,
      width / 2 + dx1, height / 2 + dy1, Math.max(width, height) * 0.52
    );
    grad1.addColorStop(0, 'rgba(0, 242, 254, 0.08)');
    grad1.addColorStop(0.5, 'rgba(0, 242, 254, 0.02)');
    grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, width, height);

    // Purple nebula clouds
    const grad2 = ctx.createRadialGradient(
      width * 0.72 + dx2, height * 0.35 + dy2, 10,
      width * 0.72 + dx2, height * 0.35 + dy2, Math.max(width, height) * 0.62
    );
    grad2.addColorStop(0, 'rgba(127, 0, 255, 0.07)');
    grad2.addColorStop(0.5, 'rgba(127, 0, 255, 0.015)');
    grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, width, height);

    // Magenta outer nebulas
    const grad3 = ctx.createRadialGradient(
      width * 0.28 - dx2, height * 0.62 - dy2, 10,
      width * 0.28 - dx2, height * 0.62 - dy2, Math.max(width, height) * 0.58
    );
    grad3.addColorStop(0, 'rgba(255, 0, 127, 0.06)');
    grad3.addColorStop(0.5, 'rgba(255, 0, 127, 0.012)');
    grad3.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad3;
    ctx.fillRect(0, 0, width, height);

    // Volumetric vertical god rays in background (Reference 2 style)
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const rayCount = 5;
    const scrollTime = timestamp ? timestamp * 0.00005 : 0;
    for (let i = 0; i < rayCount; i++) {
      const angle = Math.sin(scrollTime + i * 1.5) * 0.06;
      const xStart = (width / rayCount) * i + (width / rayCount) / 2 + Math.sin(scrollTime * 0.8 + i) * 80;
      const rWidth = 70 + Math.sin(scrollTime * 1.2 + i * 2) * 30;
      
      const gradR = ctx.createLinearGradient(xStart, 0, xStart + Math.tan(angle) * height, height);
      gradR.addColorStop(0, `rgba(127, 0, 255, ${0.02 + Math.sin(scrollTime * 1.5 + i) * 0.012})`);
      gradR.addColorStop(0.6, `rgba(0, 242, 254, ${0.015 + Math.cos(scrollTime * 1.1 + i) * 0.008})`);
      gradR.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradR;
      ctx.beginPath();
      ctx.moveTo(xStart - rWidth / 2, 0);
      ctx.lineTo(xStart + rWidth / 2, 0);
      ctx.lineTo(xStart + Math.tan(angle) * height + rWidth * 1.5, height);
      ctx.lineTo(xStart + Math.tan(angle) * height - rWidth * 1.5, height);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // Re-map mouse interpolation coordinates to camera pitch and yaw targets
  let breathTime = 0;
  function updateCamRotationPhysics() {
    updateMousePhysics();
    breathTime += 0.012;
    
    // Smooth camera drift offset
    const mxOffset = Math.sin(breathTime * 0.8) * 0.018;
    const myOffset = Math.cos(breathTime * 0.6) * 0.012;

    if (state.mouse.x !== -1000) {
      const mx = (state.mouse.x / state.windowWidth) * 2 - 1;
      const my = (state.mouse.y / state.windowHeight) * 2 - 1;

      targetCamYaw = mx * 0.16 + mxOffset;
      targetCamPitch = my * -0.10 + myOffset;
    } else {
      // Natural camera breathing movement when mouse is off-screen
      targetCamYaw = mxOffset;
      targetCamPitch = myOffset;
    }
    camYaw += (targetCamYaw - camYaw) * 0.05;
    camPitch += (targetCamPitch - camPitch) * 0.05;
  }

  // Draw 3D Neural links between close floating crystals (Reference 2 style)
  function drawNeuralWebLinks(ctx, width, height, cp, cy) {
    ctx.save();
    
    for (let i = 0; i < cuboids.length; i++) {
      const c1 = cuboids[i];
      const p1 = project3D(c1.cx, c1.cy, c1.cz, width, height, cp, cy);
      if (!p1) continue;

      for (let j = i + 1; j < cuboids.length; j++) {
        const c2 = cuboids[j];
        
        // Calculate 3D distance between crystals
        const dx = c1.cx - c2.cx;
        const dy = c1.cy - c2.cy;
        const dz = c1.cz - c2.cz;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        
        const threshold = 480;
        if (dist < threshold) {
          const p2 = project3D(c2.cx, c2.cy, c2.cz, width, height, cp, cy);
          if (!p2) continue;
          
          // Draw alpha-faded laser link line
          const opacity = (1 - dist / threshold) * 0.35 * (1 - Math.max(c1.cz, c2.cz) / 1200);
          ctx.strokeStyle = `rgba(127, 0, 255, ${opacity})`;
          ctx.lineWidth = 1.0;
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(127, 0, 255, 0.5)';
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          
          // Draw a small signal node traveling along this link
          const time = performance.now() * 0.001;
          const travel = (time + i * 0.5) % 1;
          const sigX = p1.x + (p2.x - p1.x) * travel;
          const sigY = p1.y + (p2.y - p1.y) * travel;
          
          ctx.fillStyle = 'rgba(0, 242, 254, 0.7)';
          ctx.beginPath();
          ctx.arc(sigX, sigY, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    
    ctx.restore();
  }

  // Unified VFX Render loop — optimized for 120Hz on mobile
  // On mobile skip heavy 3D crystals/rings/codestreams; keep starfield only
  let vfxLastFrame = 0;
  function loopVfx(ts) {
    requestAnimationFrame(loopVfx);

    // On low-end mobile cap at 60fps to prevent thermal throttle
    if (isMobile && ts - vfxLastFrame < 14) return; // ~72fps gate
    vfxLastFrame = ts;

    const w = window.innerWidth;
    const h = window.innerHeight;

    // 1. Draw Backdrop Nebulas (simplified on mobile)
    if (isMobile) {
      vfxCtx.fillStyle = '#020205';
      vfxCtx.fillRect(0, 0, w, h);
    } else {
      drawNebulaBackdrop(vfxCtx, w, h, ts);
    }

    // 2. Camera physics (skip on mobile — no mouse tracking on touch)
    if (!isMobile) updateCamRotationPhysics();

    // 3. Code Streams
    codeStreams.forEach(stream => {
      stream.update();
      stream.draw(vfxCtx, w, h, camPitch, camYaw);
    });

    // 4. Warp Particles — always drawn
    warpParticles.forEach(p => {
      p.update();
      p.draw(vfxCtx, w, h, camPitch, camYaw);
    });

    // 5–7. Heavy 3D: desktop only
    if (!isMobile) {
      portalRings.forEach(ring => { ring.update(); ring.draw(vfxCtx, w, h, camPitch, camYaw); });
      cuboids.forEach(cube => { cube.update(); cube.draw(vfxCtx, w, h, camPitch, camYaw); });
      drawNeuralWebLinks(vfxCtx, w, h, camPitch, camYaw);
    }
  }

  // Launch VFX Loop
  requestAnimationFrame(loopVfx);


  /* ==========================================================================
     3. USER INTERFACE NAVIGATION & HEADER EVENTS
     ========================================================================== */
  const header = document.getElementById('main-header');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  // Shrink Header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Update active navigation link on scroll
    let currentActive = '';
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (window.scrollY >= top - 150 && window.scrollY < top + height - 150) {
        currentActive = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentActive}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Hamburger Toggle
  menuToggle.addEventListener('click', () => {
    state.isMenuOpen = !state.isMenuOpen;
    menuToggle.classList.toggle('open', state.isMenuOpen);
    navMenu.classList.toggle('open', state.isMenuOpen);
  });

  // Close Mobile Menu on Nav Item Click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      state.isMenuOpen = false;
      menuToggle.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });


  /* ==========================================================================
     4. SERVICE CARDS MOUSE TILTING & GLOW PATTERN
     ========================================================================== */
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Gentle interactive physical tilt effect
      const tiltX = ((y / rect.height) - 0.5) * -12; // tilt angle limit
      const tiltY = ((x / rect.width) - 0.5) * 12;

      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ==========================================================================
     5. PORTFOLIO TABS FILTER LOGIC
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button states
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });


  /* ==========================================================================
     6. INTERACTIVE 3D SKILL NODE GRAPH
     ========================================================================== */
  const skillsCanvas = document.getElementById('skills-canvas');
  let skillsCtx = null;
  let skillsWidth = 0;
  let skillsHeight = 0;

  const skillNodes = [
    { id: 0, name: "Frontend Architecture", category: "Core Development", percent: "95%", desc: "Advanced HTML5/CSS3 layouts, modern JavaScript structures, single-page application patterns, and semantic DOM structures optimized for user accessibility and page performance.", color: "hsl(182, 100%, 50%)" },
    { id: 1, name: "Creative UI/UX", category: "Visual Design", percent: "90%", desc: "Vibrant and interactive dashboard designs, vector UI components, typography pairing, color psychology mapping, and Figma wireframes.", color: "hsl(272, 100%, 60%)" },
    { id: 2, name: "Node Systems", category: "Backend Engineering", percent: "88%", desc: "Scalable event-driven server architectures, WebSockets integration for real-time synchronization, API routers, and performance tuning.", color: "hsl(332, 100%, 55%)" },
    { id: 3, name: "Canvas & WebGL", category: "Graphics Engine", percent: "85%", desc: "Interactive math-driven visual systems, 3D projections on 2D context canvas, shaders, particle starfields, and physics loops.", color: "hsl(125, 90%, 55%)" },
    { id: 4, name: "CI/CD & Git workflows", category: "DevOps Operations", percent: "82%", desc: "GitHub Actions automated deployment integration, Pages hosting pipelines, branch version management, and workspace optimization.", color: "hsl(45, 100%, 50%)" },
    { id: 5, name: "Solidity & Web3", category: "Blockchain Core", percent: "80%", desc: "Decentralized applications (DApps) connectivity, Solidity smart contracts parsing, provider interfaces, and browser wallet sync protocols.", color: "hsl(200, 100%, 50%)" }
  ];

  const skillEdges = [
    { source: 0, target: 1 }, // Frontend <-> UI/UX
    { source: 0, target: 3 }, // Frontend <-> Canvas/WebGL
    { source: 0, target: 2 }, // Frontend <-> Node Systems
    { source: 2, target: 4 }, // Node Systems <-> CI/CD Git
    { source: 2, target: 5 }, // Node Systems <-> Solidity/Web3
    { source: 4, target: 0 }  // CI/CD Git <-> Frontend
  ];

  // Initialize node physics coordinates randomly in 3D
  skillNodes.forEach(node => {
    const angle = Math.random() * Math.PI * 2;
    const radius = 60 + Math.random() * 40;
    node.x = Math.cos(angle) * radius;
    node.y = Math.sin(angle) * radius;
    node.z = (Math.random() - 0.5) * 80;
    node.vx = 0;
    node.vy = 0;
    node.vz = 0;
    node.size = 14;
    node.pulseOffset = Math.random() * 100;
  });

  let skillsYaw = 0;
  let skillsPitch = 0;
  let autoYawSpeed = 0.003;
  let autoPitchSpeed = 0.0015;
  let isDraggingSkills = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let hoveredNode = null;
  let projectedNodes = [];
  let graphFov = 350;

  // Telemetry HUD panel elements
  const hudPanel = document.getElementById('skill-hud-panel');
  const hudName = document.getElementById('hud-skill-name');
  const hudCategory = document.getElementById('hud-skill-category');
  const hudPercent = document.getElementById('hud-skill-percent');
  const hudDesc = document.getElementById('hud-skill-desc');
  const hudStatusLight = hudPanel ? hudPanel.querySelector('.hud-status-light') : null;

  function decryptText(element, finalString, speed = 25) {
    if (!element) return;
    clearInterval(element.decryptInterval);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$&%[]//";
    let iterations = 0;
    
    element.decryptInterval = setInterval(() => {
      element.innerHTML = finalString
        .split("")
        .map((char, index) => {
          if (index < iterations) {
            return finalString[index];
          }
          if (char === " ") return " ";
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");
      
      if (iterations >= finalString.length) {
        clearInterval(element.decryptInterval);
      }
      iterations += 1/3;
    }, speed);
  }

  function selectSkillNode(node) {
    if (!node || !hudPanel) return;
    hudPanel.classList.add('active');
    if (hudStatusLight) {
      hudStatusLight.classList.add('syncing');
    }
    
    decryptText(hudName, node.name);
    decryptText(hudCategory, node.category);
    decryptText(hudPercent, node.percent);
    decryptText(hudDesc, node.desc, 10);
  }

  function initSkillsCanvas() {
    if (!skillsCanvas) return;
    skillsCtx = skillsCanvas.getContext('2d');
    resizeSkillsCanvas();
    
    // Bind interaction events
    skillsCanvas.addEventListener('mousedown', (e) => {
      isDraggingSkills = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      skillsCanvas.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!skillsCtx || !skillsCanvas) return;
      const rect = skillsCanvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (isDraggingSkills) {
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        skillsYaw += dx * 0.008;
        skillsPitch += dy * 0.008;
        skillsPitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, skillsPitch));
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      } else {
        let foundNode = null;
        let minHoverDist = 22;

        if (Math.random() < 0.05) {
          console.log(`DEBUG MOUSE: viewport=(${e.clientX},${e.clientY}), rect=(${rect.left},${rect.top}), relative=(${mouseX},${mouseY})`);
          if (projectedNodes.length > 0) {
            console.log(`DEBUG NODE 0: projected=(${projectedNodes[0].sx},${projectedNodes[0].sy}), world=(${projectedNodes[0].node.x.toFixed(1)},${projectedNodes[0].node.y.toFixed(1)},${projectedNodes[0].node.z.toFixed(1)})`);
          }
        }

        projectedNodes.forEach(pn => {
          const dx = mouseX - pn.sx;
          const dy = mouseY - pn.sy;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < minHoverDist) {
            foundNode = pn.node;
          }
        });

        if (foundNode !== hoveredNode) {
          hoveredNode = foundNode;
          if (hoveredNode) {
            skillsCanvas.style.cursor = 'pointer';
            selectSkillNode(hoveredNode);
          } else {
            skillsCanvas.style.cursor = 'grab';
          }
        }
      }
    });

    window.addEventListener('mouseup', () => {
      isDraggingSkills = false;
      if (skillsCanvas) {
        skillsCanvas.style.cursor = hoveredNode ? 'pointer' : 'grab';
      }
    });

    // Touch support for mobile devices
    skillsCanvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDraggingSkills = true;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
      }
    });

    skillsCanvas.addEventListener('touchmove', (e) => {
      if (isDraggingSkills && e.touches.length === 1) {
        const dx = e.touches[0].clientX - lastMouseX;
        const dy = e.touches[0].clientY - lastMouseY;
        skillsYaw += dx * 0.008;
        skillsPitch += dy * 0.008;
        skillsPitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, skillsPitch));
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
        
        // Mobile hover/touch select
        const rect = skillsCanvas.getBoundingClientRect();
        const mouseX = e.touches[0].clientX - rect.left;
        const mouseY = e.touches[0].clientY - rect.top;
        
        let foundNode = null;
        let minHoverDist = 30;
        projectedNodes.forEach(pn => {
          const dx = mouseX - pn.sx;
          const dy = mouseY - pn.sy;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < minHoverDist) {
            foundNode = pn.node;
          }
        });
        if (foundNode && foundNode !== hoveredNode) {
          hoveredNode = foundNode;
          selectSkillNode(hoveredNode);
        }
      }
    });

    window.addEventListener('touchend', () => {
      isDraggingSkills = false;
    });

    // Start skills loop
    requestAnimationFrame(loopSkillsGraph);
  }

  function resizeSkillsCanvas() {
    if (!skillsCanvas) return;
    const parent = skillsCanvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    skillsWidth = rect.width || parent.clientWidth || parent.offsetWidth || 0;
    skillsHeight = rect.height || parent.clientHeight || parent.offsetHeight || 380;
    
    if (skillsWidth > 0 && skillsHeight > 0) {
      skillsCanvas.width = skillsWidth;
      skillsCanvas.height = skillsHeight;
    }
  }
  window.addEventListener('resize', resizeSkillsCanvas);

  function projectSkillsNode3D(x, y, z, width, height, cp, cy) {
    // 1. Rotate around Y (Yaw)
    const cosY = Math.cos(cy);
    const sinY = Math.sin(cy);
    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;

    // 2. Rotate around X (Pitch)
    const cosX = Math.cos(cp);
    const sinX = Math.sin(cp);
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;

    const zOffset = z2 + 260; // Camera distance offset
    if (zOffset <= 10) return null;

    const scale = graphFov / zOffset;
    const sx = width / 2 + x1 * scale;
    const sy = height / 2 + y2 * scale;

    return { sx: sx, sy: sy, scale: scale, depth: zOffset };
  }

  function updateSkillsPhysics() {
    // 1. Elastic spring connections (Hooke's Law)
    skillEdges.forEach(edge => {
      const s = skillNodes[edge.source];
      const t = skillNodes[edge.target];
      const dx = t.x - s.x;
      const dy = t.y - s.y;
      const dz = t.z - s.z;
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz) || 1;
      
      const restLength = 120;
      const springK = 0.008;
      const force = (dist - restLength) * springK;
      
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      const fz = (dz / dist) * force;
      
      s.vx += fx; s.vy += fy; s.vz += fz;
      t.vx -= fx; t.vy -= fy; t.vz -= fz;
    });

    // 2. Repulsion forces between nodes (prevent overlaps)
    for (let i = 0; i < skillNodes.length; i++) {
      const n1 = skillNodes[i];
      for (let j = i + 1; j < skillNodes.length; j++) {
        const n2 = skillNodes[j];
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dz = n2.z - n1.z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz) || 1;
        
        const minDistance = 110;
        if (dist < minDistance) {
          const repelK = 0.05;
          const force = (minDistance - dist) * repelK;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          const fz = (dz / dist) * force;
          
          n1.vx -= fx; n1.vy -= fy; n1.vz -= fz;
          n2.vx += fx; n2.vy += fy; n2.vz += fz;
        }
      }
    }

    // 3. Central gravity pulling nodes towards coordinate origin
    const gravityK = 0.004;
    skillNodes.forEach(node => {
      node.vx -= node.x * gravityK;
      node.vy -= node.y * gravityK;
      node.vz -= node.z * gravityK;
      
      // Applying mouse node interaction force
      if (hoveredNode && hoveredNode === node) {
        // Expand/hover nodes slightly pull outwards
        node.vx += node.vx * 0.1;
      }
      
      // Damping and integration
      node.vx *= 0.85;
      node.vy *= 0.85;
      node.vz *= 0.85;
      
      node.x += node.vx;
      node.y += node.vy;
      node.z += node.vz;
    });
  }

  let debugCount = 0;
  function loopSkillsGraph(timestamp) {
    if (!skillsCtx) return;
    
    // Dynamic resize check
    if (skillsCanvas.width !== skillsCanvas.clientWidth || skillsCanvas.height !== skillsCanvas.clientHeight) {
      resizeSkillsCanvas();
    }
    
    if (skillsWidth <= 0 || skillsHeight <= 0) {
      resizeSkillsCanvas();
      if (skillsWidth <= 0) {
        requestAnimationFrame(loopSkillsGraph);
        return;
      }
    }
    
    if (debugCount < 10) {
      console.log("3D Skills Graph rendering active. Dimensions:", skillsWidth, "x", skillsHeight);
      debugCount++;
    }

    // Clear canvas with deep transparent backdrop matching body background
    skillsCtx.clearRect(0, 0, skillsWidth, skillsHeight);

    // Apply auto-orbiting rotation when not dragging
    if (!isDraggingSkills) {
      skillsYaw += autoYawSpeed;
      skillsPitch += Math.sin(timestamp * 0.0005) * autoPitchSpeed * 0.5;
    }

    // Update node coordinate physics
    updateSkillsPhysics();

    // 1. Project all nodes to projected coordinate list
    projectedNodes = [];
    skillNodes.forEach(node => {
      const pt = projectSkillsNode3D(node.x, node.y, node.z, skillsWidth, skillsHeight, skillsPitch, skillsYaw);
      if (pt) {
        projectedNodes.push({
          sx: pt.sx,
          sy: pt.sy,
          scale: pt.scale,
          depth: pt.depth,
          node: node
        });
      }
    });

    // 2. Draw connections/edges
    skillsCtx.save();
    skillEdges.forEach(edge => {
      const p1 = projectedNodes.find(pn => pn.node.id === edge.source);
      const p2 = projectedNodes.find(pn => pn.node.id === edge.target);
      
      if (p1 && p2) {
        // Fade lines based on depth
        const avgDepth = (p1.depth + p2.depth) / 2;
        const opacity = Math.max(0.08, 0.52 - (avgDepth / 600));
        
        // Highlight active link if source or target node is hovered
        const isActive = (hoveredNode && (hoveredNode.id === edge.source || hoveredNode.id === edge.target));
        
        skillsCtx.strokeStyle = isActive ? `rgba(0, 242, 254, ${opacity * 1.8})` : `rgba(127, 0, 255, ${opacity})`;
        skillsCtx.lineWidth = isActive ? 2.0 : 1.2;
        
        if (isActive) {
          skillsCtx.shadowBlur = 8;
          skillsCtx.shadowColor = '#00f2fe';
        } else {
          skillsCtx.shadowBlur = 0;
        }

        skillsCtx.beginPath();
        skillsCtx.moveTo(p1.sx, p1.sy);
        skillsCtx.lineTo(p2.sx, p2.sy);
        skillsCtx.stroke();
        
        // Draw moving neural signal pulses
        const speed = 0.0015;
        const pulseProgress = (timestamp * speed + edge.source * 0.3) % 1.0;
        const pulseX = p1.sx + (p2.sx - p1.sx) * pulseProgress;
        const pulseY = p1.sy + (p2.sy - p1.sy) * pulseProgress;
        
        skillsCtx.fillStyle = isActive ? '#ff007f' : '#00f2fe';
        skillsCtx.shadowBlur = 4;
        skillsCtx.shadowColor = skillsCtx.fillStyle;
        skillsCtx.beginPath();
        skillsCtx.arc(pulseX, pulseY, 2.0, 0, Math.PI * 2);
        skillsCtx.fill();
      }
    });
    skillsCtx.restore();

    // 3. Sort nodes by depth (draw back nodes first, painter's algorithm)
    projectedNodes.sort((a, b) => b.depth - a.depth);

    // 4. Draw node circles and names
    projectedNodes.forEach(pn => {
      const node = pn.node;
      const size = Math.max(6, node.size * pn.scale * 0.005);
      const isHovered = hoveredNode && hoveredNode.id === node.id;
      
      skillsCtx.save();
      
      // Node glow aura
      skillsCtx.shadowBlur = isHovered ? 20 : 12;
      skillsCtx.shadowColor = node.color;
      
      // Outer colored border ring
      skillsCtx.strokeStyle = isHovered ? '#ffffff' : node.color;
      skillsCtx.lineWidth = isHovered ? 2.5 : 1.8;
      
      // Fill node core
      const pulseVal = Math.sin(timestamp * 0.003 + node.pulseOffset) * 0.2 + 0.8;
      const grad = skillsCtx.createRadialGradient(pn.sx, pn.sy, 0, pn.sx, pn.sy, size * 1.5);
      grad.addColorStop(0, 'rgba(6, 6, 12, 0.9)');
      grad.addColorStop(1, node.color.replace(')', `, ${0.15 + pulseVal * 0.15})`));
      
      skillsCtx.fillStyle = grad;
      skillsCtx.beginPath();
      skillsCtx.arc(pn.sx, pn.sy, size, 0, Math.PI * 2);
      skillsCtx.fill();
      skillsCtx.stroke();
      
      // Draw target lock sights on hover
      if (isHovered) {
        skillsCtx.strokeStyle = 'rgba(57, 255, 20, 0.6)';
        skillsCtx.lineWidth = 1;
        skillsCtx.shadowBlur = 4;
        skillsCtx.shadowColor = '#39ff14';
        
        // Target bracket ticks
        const bracketRad = size + 6;
        skillsCtx.beginPath();
        // Top Left
        skillsCtx.moveTo(pn.sx - bracketRad, pn.sy - bracketRad + 4);
        skillsCtx.lineTo(pn.sx - bracketRad, pn.sy - bracketRad);
        skillsCtx.lineTo(pn.sx - bracketRad + 4, pn.sy - bracketRad);
        // Top Right
        skillsCtx.moveTo(pn.sx + bracketRad, pn.sy - bracketRad + 4);
        skillsCtx.lineTo(pn.sx + bracketRad, pn.sy - bracketRad);
        skillsCtx.lineTo(pn.sx + bracketRad - 4, pn.sy - bracketRad);
        // Bottom Left
        skillsCtx.moveTo(pn.sx - bracketRad, pn.sy + bracketRad - 4);
        skillsCtx.lineTo(pn.sx - bracketRad, pn.sy + bracketRad);
        skillsCtx.lineTo(pn.sx - bracketRad + 4, pn.sy + bracketRad);
        // Bottom Right
        skillsCtx.moveTo(pn.sx + bracketRad, pn.sy + bracketRad - 4);
        skillsCtx.lineTo(pn.sx + bracketRad, pn.sy + bracketRad);
        skillsCtx.lineTo(pn.sx + bracketRad - 4, pn.sy + bracketRad);
        
        skillsCtx.stroke();
      }

      // Draw node text label
      const fontSize = Math.max(9, 13 * pn.scale * 0.0045);
      skillsCtx.font = `600 ${fontSize}px var(--font-heading)`;
      skillsCtx.fillStyle = isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.72)';
      skillsCtx.shadowBlur = isHovered ? 4 : 0;
      skillsCtx.shadowColor = '#ffffff';
      
      // Offset text slightly to prevent overlapping
      skillsCtx.fillText(node.name, pn.sx + size + 8, pn.sy + fontSize / 3.5);
      
      // Node percentage label (smaller)
      skillsCtx.font = `600 ${fontSize * 0.8}px monospace`;
      skillsCtx.fillStyle = node.color;
      skillsCtx.shadowBlur = 0;
      skillsCtx.fillText(node.percent, pn.sx + size + 8, pn.sy + fontSize * 1.1);

      skillsCtx.restore();
    });

    requestAnimationFrame(loopSkillsGraph);
  }

  // Hook init into script startup
  initSkillsCanvas();

  // Scroll Reveal elements hook
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  function revealOnScrollHandler() {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
      if (!(rect.bottom < 0 || rect.top - viewHeight + 100 >= 0)) {
        el.classList.add('revealed');
      }
    });
  }

  function revealSkills() {
    // Legacy support trigger, select first node initially for a premium introduction
    if (skillNodes.length > 0 && !hoveredNode) {
      setTimeout(() => {
        selectSkillNode(skillNodes[0]);
      }, 1000);
    }
  }

  window.addEventListener('scroll', revealOnScrollHandler);
  // Trigger once to capture page load state
  revealOnScrollHandler();


  /* ==========================================================================
     7. DETAILED PORTFOLIO MODAL LOGIC
     ========================================================================== */
  const projectModal = document.getElementById('project-modal');
  const modalBody = projectModal.querySelector('.modal-body');
  const modalCloseBtn = projectModal.querySelector('.modal-close');

  const projectDetailsDatabase = {
    '1': {
      title: 'Aether Analytics Dashboard',
      category: 'Web Application',
      desc: 'A comprehensive cloud data gateway presenting live telemetry streams and analytics panels. Features a robust data ingestion network, reactive layouts, and canvas drawing pipelines for extreme performance.',
      specType: 'Custom BI Engine',
      client: 'Synthetix Global LLC',
      duration: '3 Months',
      technologies: 'Node.js, CanvasAPI, WebSockets, Redis Cache, CSS Grid'
    },
    '2': {
      title: 'Vespera Portal UX',
      category: 'UI/UX Design',
      desc: 'A complete branding overhaul, client wireframing system, and visual design guidelines. Merges smooth aesthetics with functional spacing variables to keep user bounce rate under 20%.',
      specType: 'DeFi Web Portal',
      client: 'Vespera DAO',
      duration: '4 Weeks',
      technologies: 'Figma, Creative Assets, HSL Palettes, Typography System'
    },
    '3': {
      title: 'Synapse Interactive Client',
      category: 'Frontend Design',
      desc: 'A lightweight frontend app built using advanced CSS layouts and DOM animations. Includes an embedded terminal emulator, customizable cyberpunk layouts, and sub-50ms paint load speeds.',
      specType: 'SPA Interface',
      client: 'Synapse Technologies',
      duration: '6 Weeks',
      technologies: 'CSS Grid, GSAP Engine, HTML5 Semantic Tags, ESNext'
    },
    '4': {
      title: 'Helios Blockchain Ledger',
      category: 'Web Application',
      desc: 'An isometric network portal showcasing block creation metrics, node transactions, and ledger status values. Includes security validation checkers and Web3 wallet connectors.',
      specType: 'Blockchain Visualizer',
      client: 'Helios Protocol',
      duration: '2 Months',
      technologies: 'React Native Web, Solidity, Web3.js, HTML5 Canvas'
    },
    '5': {
      title: 'Nebula Design System',
      category: 'UI/UX Architecture',
      desc: 'A reusable modular framework presenting customizable cards, buttons, layouts, and variables. Empowers developers to spawn beautiful dashboard portals in seconds with zero visual discrepancies.',
      specType: 'Design Pattern Library',
      client: 'Nebula Systems Inc',
      duration: '5 Weeks',
      technologies: 'Design Systems, CSS Variables, Typography mapping'
    },
    '6': {
      title: 'Orion Landing System',
      category: 'Frontend Engineering',
      desc: 'A premium corporate product showcase utilizing smooth page scrolls, kinetic SVG animations, and dynamic loaders. Achieved a perfect 100 Performance Score on Google Lighthouse.',
      specType: 'High-conversion Landing Page',
      client: 'Orion Space Corp',
      duration: '3 Weeks',
      technologies: 'Tailored CSS, SVG Drawings, JS DOM, SEO Structure'
    }
  };

  document.querySelectorAll('.view-project-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pId = link.getAttribute('data-project-id');
      const data = projectDetailsDatabase[pId];

      if (data) {
        // Build modal content dynamically
        modalBody.innerHTML = `
          <div class="modal-grid">
            <div class="modal-visual-wrap">
              <svg viewBox="0 0 200 200" width="100%" style="max-width: 150px; height: auto; filter: drop-shadow(0 0 10px var(--color-primary));">
                <circle cx="100" cy="100" r="80" fill="none" stroke="url(#modal-grad)" stroke-width="4" />
                <path d="M 60 100 L 90 130 L 140 70" fill="none" stroke="url(#modal-grad)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
                <defs>
                  <linearGradient id="modal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#00f2fe"/>
                    <stop offset="100%" stop-color="#7f00ff"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div class="modal-details">
              <span class="modal-meta-tag">${data.category}</span>
              <h3>${data.title}</h3>
              <p>${data.desc}</p>
              
              <div class="modal-spec-list">
                <div class="modal-spec-item">
                  <span class="modal-spec-name">Client Focus</span>
                  <span class="modal-spec-value">${data.client}</span>
                </div>
                <div class="modal-spec-item">
                  <span class="modal-spec-name">Development Type</span>
                  <span class="modal-spec-value">${data.specType}</span>
                </div>
                <div class="modal-spec-item">
                  <span class="modal-spec-name">Project Duration</span>
                  <span class="modal-spec-value">${data.duration}</span>
                </div>
                <div class="modal-spec-item">
                  <span class="modal-spec-name">Core Stack</span>
                  <span class="modal-spec-value" style="color: var(--color-primary);">${data.technologies}</span>
                </div>
              </div>
              
              <div style="display: flex; gap: 1rem;">
                <a href="https://github.com/aghoriii33/NOVA" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">View Code (GitHub)</a>
                <button class="btn btn-outline btn-sm modal-close-btn-inner">Close Screen</button>
              </div>
            </div>
          </div>
        `;

        // Open modal
        projectModal.classList.add('open');
        document.body.style.overflow = 'hidden';

        // Bind inner close button
        modalBody.querySelector('.modal-close-btn-inner').addEventListener('click', closeModal);
      }
    });
  });

  function closeModal() {
    projectModal.classList.remove('open');
    if (!document.body.classList.contains('loading')) {
      document.body.style.overflow = '';
    }
  }

  modalCloseBtn.addEventListener('click', closeModal);
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) {
      closeModal();
    }
  });

  // ESC key to close modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });


  /* ==========================================================================
     8. CONTACT FORM CLIENT-SIDE VALIDATION & FEEDBACK
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formStatus = document.getElementById('form-status');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset status message
    formStatus.className = 'form-status';
    formStatus.textContent = '';

    // Collect inputs
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();

    // Verify fields
    if (!name || !email || !subject || !message) {
      formStatus.classList.add('error');
      formStatus.textContent = 'All fields are mandatory. Please fill in all fields.';
      return;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      formStatus.classList.add('error');
      formStatus.textContent = 'Please enter a valid email address.';
      return;
    }

    // Enter submitting visual state
    submitBtn.classList.add('submitting');
    submitBtn.disabled = true;

    // Send via Formspree (real email delivery — free, no backend needed)
    fetch('https://formspree.io/f/mjkwgkwb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name, email, subject, message })
    })
    .then(res => {
      submitBtn.classList.remove('submitting');
      submitBtn.disabled = false;
      if (res.ok) {
        formStatus.classList.add('success');
        formStatus.innerHTML = `Message sent! Thank you, <strong>${name}</strong>. We'll reply to <strong>${email}</strong> shortly.`;
        contactForm.reset();
      } else {
        // Fallback: open mailto if Formspree fails
        throw new Error('formspree_fail');
      }
    })
    .catch(() => {
      submitBtn.classList.remove('submitting');
      submitBtn.disabled = false;
      // Mailto fallback — opens user's email client pre-filled
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      const mailtoLink = `mailto:kundurick781@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
      window.location.href = mailtoLink;
      formStatus.classList.add('success');
      formStatus.textContent = 'Opening your email client to send the message...';
    });
  });

  // Auto-update copyright year in footer
  const copyrightYear = document.getElementById('copyright-year');
  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     3. ASSASSIN'S CREED THEMED AUTH SYSTEM
     Works immediately with localStorage. Upgrade to Firebase by pasting your
     firebaseConfig below — the switch is automatic.
     ========================================================================== */

  // ── Optional Firebase config ────────────────────────────────────────────────
  // Paste your real values here from https://console.firebase.google.com/
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID_HERE.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID_HERE",
    storageBucket: "YOUR_PROJECT_ID_HERE.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID_HERE",
    appId: "YOUR_APP_ID_HERE"
  };

  let auth = null;
  const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";

  if (typeof firebase !== 'undefined' && isFirebaseConfigured) {
    try {
      firebase.initializeApp(firebaseConfig);
      auth = firebase.auth();
    } catch (err) { /* already initialized */ }
  }

  // ── localStorage fallback (works without Firebase) ──────────────────────────
  const LOCAL_USERS_KEY = 'nova_users_db';
  const LOCAL_SESSION_KEY = 'nova_current_user';

  function getLocalUsers() {
    try { return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '{}'); } catch { return {}; }
  }
  function saveLocalUsers(users) {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  }
  function getLocalSession() {
    try { return JSON.parse(localStorage.getItem(LOCAL_SESSION_KEY) || 'null'); } catch { return null; }
  }
  function saveLocalSession(user) {
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
  }
  function clearLocalSession() {
    localStorage.removeItem(LOCAL_SESSION_KEY);
  }
  function hashPassword(str) {
    // Simple deterministic hash (not cryptographic — for demo only)
    let hash = 0;
    for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash |= 0; }
    return hash.toString(36);
  }

  // ── Auth UI Elements ─────────────────────────────────────────────────────────
  const authModal       = document.getElementById('auth-modal');
  const authLoginBtn    = document.getElementById('auth-login-btn');
  const authProfile     = document.getElementById('auth-profile');
  const userAvatar      = document.getElementById('user-avatar');
  const userName        = document.getElementById('user-name');
  const authLogoutBtn   = document.getElementById('auth-logout-btn');
  const authModalClose  = document.getElementById('auth-modal-close');
  const authTabs        = document.querySelectorAll('.auth-tab-btn');
  const signinForm      = document.getElementById('signin-form');
  const signupForm      = document.getElementById('signup-form');
  const googleSigninBtn = document.getElementById('google-signin-btn');
  const authMessage     = document.getElementById('auth-message');

  function showAuthMessage(msg, type = 'error') {
    if (!authMessage) return;
    authMessage.textContent = msg;
    authMessage.className = 'auth-message ' + type;
    authMessage.style.display = 'block';
  }
  function clearAuthMessage() {
    if (!authMessage) return;
    authMessage.textContent = '';
    authMessage.style.display = 'none';
  }

  // ── updateAuthUI: show/hide profile and login button ────────────────────────
  function updateAuthUI(user) {
    if (user) {
      if (authLoginBtn) authLoginBtn.style.display = 'none';
      if (authProfile) authProfile.style.display = 'flex';
      if (userName) userName.textContent = user.displayName || (user.email ? user.email.split('@')[0] : 'Assassin');
      if (userAvatar) {
        userAvatar.src = user.photoURL ||
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%2307070a" stroke="%23d4af37" stroke-width="2"/><circle cx="50" cy="38" r="18" fill="%23d4af37"/><path d="M22 78 C25 60,38 52,50 52 C62 52,75 60,78 78 Z" fill="%23d4af37"/></svg>';
      }
    } else {
      if (authLoginBtn) authLoginBtn.style.display = 'inline-block';
      if (authProfile) authProfile.style.display = 'none';
      if (userName) userName.textContent = '';
      if (userAvatar) userAvatar.src = '';
    }
  }

  // ── On page load: restore session ───────────────────────────────────────────
  if (isFirebaseConfigured && auth) {
    auth.onAuthStateChanged(user => updateAuthUI(user));
  } else {
    // Restore localStorage session
    const savedUser = getLocalSession();
    updateAuthUI(savedUser);
  }

  // ── Open Modal ───────────────────────────────────────────────────────────────
  if (authLoginBtn) {
    authLoginBtn.addEventListener('click', () => {
      clearAuthMessage();
      if (authModal) authModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  // ── Close Modal ──────────────────────────────────────────────────────────────
  function closeAuthModal() {
    if (authModal) authModal.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (authModalClose) authModalClose.addEventListener('click', closeAuthModal);
  if (authModal) {
    authModal.addEventListener('click', e => { if (e.target === authModal) closeAuthModal(); });
  }

  // ── Tab Switching ────────────────────────────────────────────────────────────
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      authTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      clearAuthMessage();
      const active = tab.getAttribute('data-tab');
      if (signinForm) signinForm.style.display = active === 'signin' ? 'flex' : 'none';
      if (signupForm) signupForm.style.display = active === 'signup' ? 'flex' : 'none';
    });
  });

  // ── SIGN IN ──────────────────────────────────────────────────────────────────
  if (signinForm) {
    signinForm.addEventListener('submit', e => {
      e.preventDefault();
      clearAuthMessage();
      const email    = document.getElementById('signin-email').value.trim();
      const password = document.getElementById('signin-password').value;
      const btn      = signinForm.querySelector('button[type="submit"]');
      const orig     = btn ? btn.textContent : 'Sign In';
      if (btn) { btn.textContent = 'Signing In…'; btn.disabled = true; }

      if (isFirebaseConfigured && auth) {
        // Firebase path
        auth.signInWithEmailAndPassword(email, password)
          .then(() => { showAuthMessage('Signed in!', 'success'); setTimeout(closeAuthModal, 900); signinForm.reset(); })
          .catch(err => showAuthMessage(err.message))
          .finally(() => { if (btn) { btn.textContent = orig; btn.disabled = false; } });
      } else {
        // localStorage path
        setTimeout(() => {
          const users = getLocalUsers();
          const key   = email.toLowerCase();
          if (!users[key]) { showAuthMessage('No account found. Please register first.'); if (btn) { btn.textContent = orig; btn.disabled = false; } return; }
          if (users[key].passwordHash !== hashPassword(password)) { showAuthMessage('Incorrect password.'); if (btn) { btn.textContent = orig; btn.disabled = false; } return; }
          const user = users[key];
          saveLocalSession(user);
          updateAuthUI(user);
          showAuthMessage('Welcome back, ' + (user.displayName || email.split('@')[0]) + '!', 'success');
          setTimeout(() => { closeAuthModal(); signinForm.reset(); }, 1000);
          if (btn) { btn.textContent = orig; btn.disabled = false; }
        }, 500);
      }
    });
  }

  // ── REGISTER ─────────────────────────────────────────────────────────────────
  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      clearAuthMessage();
      const nameVal  = document.getElementById('signup-name').value.trim();
      const email    = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
      const btn      = signupForm.querySelector('button[type="submit"]');
      const orig     = btn ? btn.textContent : 'Create Account';
      if (btn) { btn.textContent = 'Creating…'; btn.disabled = true; }

      if (password.length < 6) { showAuthMessage('Password must be at least 6 characters.'); if (btn) { btn.textContent = orig; btn.disabled = false; } return; }

      if (isFirebaseConfigured && auth) {
        // Firebase path
        auth.createUserWithEmailAndPassword(email, password)
          .then(cred => cred.user.updateProfile({ displayName: nameVal }).then(() => {
            const u = { displayName: nameVal, email, photoURL: null };
            updateAuthUI(u);
            showAuthMessage('Account created!', 'success');
            setTimeout(() => { closeAuthModal(); signupForm.reset(); }, 1000);
          }))
          .catch(err => showAuthMessage(err.message))
          .finally(() => { if (btn) { btn.textContent = orig; btn.disabled = false; } });
      } else {
        // localStorage path
        setTimeout(() => {
          const users = getLocalUsers();
          const key   = email.toLowerCase();
          if (users[key]) { showAuthMessage('An account with this email already exists.'); if (btn) { btn.textContent = orig; btn.disabled = false; } return; }
          const user = { displayName: nameVal || email.split('@')[0], email, photoURL: null, passwordHash: hashPassword(password) };
          users[key] = user;
          saveLocalUsers(users);
          const sessionUser = { displayName: user.displayName, email: user.email, photoURL: null };
          saveLocalSession(sessionUser);
          updateAuthUI(sessionUser);
          showAuthMessage('Account created! Welcome, ' + user.displayName + '!', 'success');
          setTimeout(() => { closeAuthModal(); signupForm.reset(); }, 1000);
          if (btn) { btn.textContent = orig; btn.disabled = false; }
        }, 500);
      }
    });
  }

  // ── GOOGLE SIGN IN ──────────────────────────────────────────────────────────
  if (googleSigninBtn) {
    googleSigninBtn.addEventListener('click', () => {
      clearAuthMessage();
      if (isFirebaseConfigured && auth) {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
          .then(() => { showAuthMessage('Google login successful!', 'success'); setTimeout(closeAuthModal, 900); })
          .catch(err => showAuthMessage(err.message));
      } else {
        showAuthMessage('Google Sign-In requires Firebase setup. Use email/password for now — it works offline!', 'error');
      }
    });
  }

  // ── LOGOUT ──────────────────────────────────────────────────────────────────
  if (authLogoutBtn) {
    authLogoutBtn.addEventListener('click', () => {
      if (isFirebaseConfigured && auth) {
        auth.signOut().catch(console.error);
      } else {
        clearLocalSession();
        updateAuthUI(null);
      }
    });
  }
});