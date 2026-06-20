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
    introCanvas.width = 300;
    introCanvas.height = 300;
  }
  resizeIntroCanvas();

  let introStartTime = null;
  let introAnimationId = null;
  const introDuration = 6000; // 6 seconds total

  // Logging sequence triggers
  const logLines = [
    { threshold: 0.05, text: "[SYS] BOOTING SYSTEM DECRYPTOR CORE v1.0.4...", color: "" },
    { threshold: 0.22, text: "[NET] SYNCING REMOTE AGHORIII33/NOVA...", color: "cyan" },
    { threshold: 0.45, text: "[DB] 6 PROJECT OBJECT SCHEMA RECORDS MAPPED...", color: "" },
    { threshold: 0.65, text: "[VFX] COMPILING 3D RENDER GRAPHICS ENGINE...", color: "purple" },
    { threshold: 0.80, text: "[AUTH] ADMIN AUTHORIZED: MR HRICK & MR RTIYANA...", color: "cyan" },
    { threshold: 0.92, text: "[READY] SHUTTER TRIGGERED. LAUNCHING WORKSPACE...", color: "" }
  ];
  const writtenLogs = new Set();
  let lastMicroLogTime = 0;
  const microLogs = [
    "[CORE] Fetching instruction cache...",
    "[CORE] Validating security tokens...",
    "[NET] Checking websocket latency...",
    "[NET] Handshake request transmitted...",
    "[VFX] Creating perspective matrices...",
    "[VFX] Allocation: 2000 particle vertices...",
    "[DB] Restructuring collection layout...",
    "[SYS] Thread pool scaling initialized...",
    "[SYS] Setting graphics projection FOV...",
    "[NET] Connection established to remote index..."
  ];

  function updateLoaderLogs(progress, timestamp) {
    // Principal logs
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

    // Random minor log scrolling
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

  // Crystalline Geode Nodes representing the core organic network
  const geodeNodes = [];
  const totalGeodes = 11;
  const geodeColors = ['hsl(182, 100%, 50%)', 'hsl(272, 100%, 65%)', 'hsl(332, 100%, 55%)'];
  
  for (let i = 0; i < totalGeodes; i++) {
    const angle = (i / totalGeodes) * Math.PI * 2 + Math.random() * 0.3;
    const radius = 45 + Math.random() * 35;
    geodeNodes.push({
      id: i,
      x: Math.cos(angle) * radius,
      y: (Math.random() - 0.5) * 80,
      z: Math.sin(angle) * radius,
      vx: 0, vy: 0, vz: 0,
      size: Math.random() * 12 + 10,
      rx: Math.random() * Math.PI * 2,
      ry: Math.random() * Math.PI * 2,
      rz: Math.random() * Math.PI * 2,
      rotSpeedX: (Math.random() - 0.5) * 0.015,
      rotSpeedY: (Math.random() - 0.5) * 0.015,
      rotSpeedZ: (Math.random() - 0.5) * 0.015,
      color: geodeColors[i % geodeColors.length],
      linkThreshold: 0.05 + (i / totalGeodes) * 0.8
    });
  }

  // Define geode connection links (forming a neural tree)
  const geodeLinks = [
    { source: 0, target: 1 }, { source: 1, target: 2 }, { source: 2, target: 3 },
    { source: 3, target: 4 }, { source: 4, target: 5 }, { source: 5, target: 6 },
    { source: 6, target: 7 }, { source: 7, target: 8 }, { source: 8, target: 9 },
    { source: 9, target: 10 }, { source: 10, target: 0 },
    // Cross connections
    { source: 1, target: 5 }, { source: 3, target: 8 }, { source: 0, target: 6 }
  ];

  // Drifting cosmic dust specks
  const dustParticles = [];
  for (let i = 0; i < 40; i++) {
    dustParticles.push({
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      z: Math.random() * 200 - 100,
      speedY: -0.4 - Math.random() * 0.5,
      size: Math.random() * 1.5 + 0.5
    });
  }

  // Humanoid Cyborg 3D Structure definitions
  const humanoidPoints = [
    // Head / Brain core
    { name: 'head_top', x: 0, y: -45, z: 0 },
    { name: 'head_bottom', x: 0, y: -30, z: 0 },
    { name: 'head_left', x: -8, y: -37.5, z: 0 },
    { name: 'head_right', x: 8, y: -37.5, z: 0 },
    { name: 'head_front', x: 0, y: -37.5, z: 8 },
    { name: 'head_back', x: 0, y: -37.5, z: -8 },

    // Spine
    { name: 'neck', x: 0, y: -25, z: 0 },
    { name: 'chest', x: 0, y: -10, z: 0 },
    { name: 'spine_mid', x: 0, y: 5, z: 0 },
    { name: 'hips', x: 0, y: 25, z: 0 },

    // Shoulders & Chest (trapezoidal ribcage)
    { name: 'shoulder_l', x: -22, y: -20, z: -2 },
    { name: 'shoulder_r', x: 22, y: -20, z: -2 },
    { name: 'rib_l_1', x: -16, y: -5, z: 1 },
    { name: 'rib_r_1', x: 16, y: -5, z: 1 },
    { name: 'rib_l_2', x: -12, y: 10, z: 2 },
    { name: 'rib_r_2', x: 12, y: 10, z: 2 },

    // Arms
    { name: 'elbow_l', x: -28, y: -2, z: -6 },
    { name: 'elbow_r', x: 28, y: -2, z: -6 },
    { name: 'wrist_l', x: -24, y: 16, z: -10 },
    { name: 'wrist_r', x: 24, y: 16, z: -10 },

    // Hips
    { name: 'hip_l', x: -10, y: 25, z: 0 },
    { name: 'hip_r', x: 10, y: 25, z: 0 }
  ];

  const humanoidLinks = [
    // Head wireframe
    { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 }, { a: 0, b: 5 },
    { a: 1, b: 2 }, { a: 1, b: 3 }, { a: 1, b: 4 }, { a: 1, b: 5 },
    { a: 2, b: 4 }, { a: 4, b: 3 }, { a: 3, b: 5 }, { a: 5, b: 2 },

    // Neck & Spine
    { a: 1, b: 6 },
    { a: 6, b: 7 }, { a: 7, b: 8 }, { a: 8, b: 9 },

    // Shoulders & Chest
    { a: 6, b: 10 }, { a: 6, b: 11 },
    { a: 10, b: 12 }, { a: 11, b: 13 },
    { a: 12, b: 14 }, { a: 13, b: 15 },
    { a: 14, b: 9 }, { a: 15, b: 9 },
    { a: 7, b: 12 }, { a: 7, b: 13 },
    { a: 8, b: 14 }, { a: 8, b: 15 },

    // Arms
    { a: 10, b: 16 }, { a: 11, b: 17 },
    { a: 16, b: 18 }, { a: 17, b: 19 },

    // Hips/Waist
    { a: 9, b: 20 }, { a: 9, b: 21 },
    { a: 20, b: 21 }
  ];

  // 3D vertical falling binary code streams
  const loaderCodeStreams = [];
  for (let i = 0; i < 15; i++) {
    loaderCodeStreams.push({
      x: (Math.random() - 0.5) * 220,
      y: (Math.random() - 0.5) * 200,
      z: Math.random() * 150 - 50,
      speed: 1.2 + Math.random() * 1.8,
      chars: Array.from({ length: 6 + Math.floor(Math.random() * 6) }, () => Math.random() > 0.5 ? "1" : "0"),
      activeCharIdx: 0,
      tick: 0
    });
  }

  const loaderFov = 200;
  function projectLoader3D(x, y, z, width, height, yaw, pitch) {
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;

    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);
    const y2 = y * cosP - z1 * sinP;
    const z2 = y * sinP + z1 * cosP;

    const zOffset = z2 + 200;
    if (zOffset <= 10) return null;

    const scale = loaderFov / zOffset;
    const sx = width / 2 + x1 * scale;
    const sy = height / 2 + y2 * scale;

    return { x: sx, y: sy, depth: zOffset, scale: scale };
  }

  function drawGeode(ctx, node, px, py, pz, scale, cp, cy) {
    const s = node.size / 2;
    const vertices = [
      { x: 0, y: -s * 1.6, z: 0 }, 
      { x: 0, y: s * 1.6, z: 0 },  
      { x: -s, y: 0, z: -s },      
      { x: s, y: 0, z: -s },       
      { x: s, y: 0, z: s },        
      { x: -s, y: 0, z: s }        
    ];

    const faces = [
      [0, 2, 3], [0, 3, 4], [0, 4, 5], [0, 5, 2], 
      [1, 3, 2], [1, 4, 3], [1, 5, 4], [1, 2, 5]  
    ];

    const projectedVerts = [];
    for (let i = 0; i < vertices.length; i++) {
      const v = vertices[i];
      const cosX = Math.cos(node.rx); const sinX = Math.sin(node.rx);
      const cosY = Math.cos(node.ry); const sinY = Math.sin(node.ry);
      const cosZ = Math.cos(node.rz); const sinZ = Math.sin(node.rz);

      let y1 = v.y * cosX - v.z * sinX;
      let z1 = v.y * sinX + v.z * cosX;
      let x2 = v.x * cosY - z1 * sinY;
      let z2 = v.x * sinY + z1 * cosY;
      let x3 = x2 * cosZ - y1 * sinZ;
      let y3 = x2 * sinZ + y1 * cosZ;

      const pt = projectLoader3D(x3 + px, y3 + py, z2 + pz, 300, 300, cp, cy);
      if (!pt) return;
      projectedVerts.push(pt);
    }

    ctx.save();
    ctx.fillStyle = 'rgba(6, 6, 15, 0.85)';
    ctx.strokeStyle = node.color;
    ctx.lineWidth = 0.8;
    ctx.shadowBlur = 4;
    ctx.shadowColor = node.color;

    faces.forEach(face => {
      ctx.beginPath();
      ctx.moveTo(projectedVerts[face[0]].x, projectedVerts[face[0]].y);
      ctx.lineTo(projectedVerts[face[1]].x, projectedVerts[face[1]].y);
      ctx.lineTo(projectedVerts[face[2]].x, projectedVerts[face[2]].y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

    const centerPt = projectLoader3D(px, py, pz, 300, 300, cp, cy);
    if (centerPt) {
      const coreSize = Math.max(1.5, scale * 0.025);
      ctx.fillStyle = node.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = node.color;
      ctx.beginPath();
      ctx.arc(centerPt.x, centerPt.y, coreSize, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawOrganicTendril(ctx, p1, p2, color, opacity, timestamp) {
    ctx.save();
    ctx.strokeStyle = color.replace(')', `, ${opacity})`).replace('rgb', 'rgba').replace('hsl', 'hsla');
    ctx.lineWidth = 0.8;
    
    for (let j = 0; j < 2; j++) {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      
      const offsetX = -dy * 0.15 * (j === 0 ? 1 : -0.8) + Math.sin(timestamp * 0.003 + j) * 4;
      const offsetY = dx * 0.15 * (j === 0 ? 1 : -0.8) + Math.cos(timestamp * 0.003 + j) * 4;
      
      const cx = (p1.x + p2.x) / 2 + offsetX;
      const cy = (p1.y + p2.y) / 2 + offsetY;
      
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.quadraticCurveTo(cx, cy, p2.x, p2.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawTendrilSignal(ctx, p1, p2, color, timestamp, seed) {
    const pulseProgress = (timestamp * 0.0012 + seed * 0.4) % 1.0;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const offsetX = -dy * 0.15 + Math.sin(timestamp * 0.003) * 4;
    const offsetY = dx * 0.15 + Math.cos(timestamp * 0.003) * 4;
    const cx = (p1.x + p2.x) / 2 + offsetX;
    const cy = (p1.y + p2.y) / 2 + offsetY;
    
    const t = pulseProgress;
    const px = Math.pow(1-t, 2) * p1.x + 2 * (1-t) * t * cx + Math.pow(t, 2) * p2.x;
    const py = Math.pow(1-t, 2) * p1.y + 2 * (1-t) * t * cy + Math.pow(t, 2) * p2.y;
    
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.shadowColor = color;
    ctx.beginPath();
    ctx.arc(px, py, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawLoaderGodRays(ctx, w, h, timestamp) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    
    const rayCount = 5;
    const xCenter = w / 2;
    const yCenter = -40;
    
    for (let i = 0; i < rayCount; i++) {
      const angle = -0.15 + (i / (rayCount - 1)) * 0.3 + Math.sin(timestamp * 0.0004 + i * 2) * 0.02;
      const rayWidth = 35 + Math.sin(timestamp * 0.0008 + i) * 15;
      
      const grad = ctx.createLinearGradient(xCenter, 0, xCenter + Math.tan(angle) * h, h);
      grad.addColorStop(0, `rgba(0, 242, 254, ${0.012 + Math.sin(timestamp * 0.001 + i) * 0.006})`);
      grad.addColorStop(0.4, `rgba(127, 0, 255, ${0.016 + Math.cos(timestamp * 0.0007 + i) * 0.008})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(xCenter - rayWidth / 2, yCenter);
      ctx.lineTo(xCenter + rayWidth / 2, yCenter);
      ctx.lineTo(xCenter + Math.tan(angle) * h + rayWidth * 2, h);
      ctx.lineTo(xCenter + Math.tan(angle) * h - rayWidth * 2, h);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function drawLoaderDust(ctx, timestamp, cp, cy) {
    ctx.save();
    dustParticles.forEach(p => {
      p.y += p.speedY;
      if (p.y < -120) {
        p.y = 120;
        p.x = (Math.random() - 0.5) * 200;
      }
      
      const pt = projectLoader3D(p.x, p.y, p.z, 300, 300, cp, cy);
      if (pt) {
        const size = p.size * pt.scale * 0.005;
        const opacity = Math.max(0.1, 0.6 * (1 - pt.depth / 350));
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.restore();
  }

  function drawScanningBeam(ctx, w, h, timestamp) {
    ctx.save();
    const beamY = 70 + (Math.sin(timestamp * 0.0018) * 0.5 + 0.5) * 200; 
    const grad = ctx.createLinearGradient(0, beamY - 12, 0, beamY + 3);
    grad.addColorStop(0, 'rgba(0, 242, 254, 0)');
    grad.addColorStop(0.5, 'rgba(127, 0, 255, 0.08)');
    grad.addColorStop(1, 'rgba(0, 242, 254, 0.22)');
    
    ctx.fillStyle = grad;
    ctx.fillRect(35, beamY - 12, w - 70, 12);
    
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#00f2fe';
    ctx.beginPath();
    ctx.moveTo(35, beamY);
    ctx.lineTo(w - 70, beamY);
    ctx.stroke();
    
    ctx.restore();
  }

  // Draw 3D Floating Cyborg Humanoid
  function drawHumanoid(ctx, timestamp, cp, cy) {
    const breatheY = Math.sin(timestamp * 0.0015) * 5;
    
    const projectedPts = humanoidPoints.map(p => {
      return projectLoader3D(p.x, p.y + breatheY, p.z, 300, 300, cp, cy);
    });

    ctx.save();
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.45)';
    ctx.lineWidth = 1.0;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00f2fe';

    // Draw lines
    humanoidLinks.forEach(link => {
      const p1 = projectedPts[link.a];
      const p2 = projectedPts[link.b];
      if (p1 && p2) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    });

    // Glowing core
    const corePt = projectedPts[1];
    if (corePt) {
      ctx.fillStyle = '#ff007f';
      ctx.shadowColor = '#ff007f';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(corePt.x, corePt.y - 4, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Joint dots
    ctx.fillStyle = '#00f2fe';
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 6;
    [10, 11, 16, 17, 18, 19, 20, 21].forEach(idx => {
      const pt = projectedPts[idx];
      if (pt) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.restore();
  }

  // Draw Concentric Telemetry Rings rotating around the core
  function drawHumanoidRings(ctx, timestamp, cp, cy) {
    const breatheY = Math.sin(timestamp * 0.0015) * 5;
    const centerY = -10 + breatheY;
    
    // Ring 1: Cyan, tilted horizontal ring spinning clockwise
    const radius1 = 28;
    const rotSpeed1 = timestamp * 0.002;
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.6)';
    ctx.lineWidth = 1.0;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f2fe';
    
    ctx.beginPath();
    let first = true;
    const segments = 36;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const tiltX = 0.4; 
      const lx = radius1 * Math.cos(angle);
      const lz = radius1 * Math.sin(angle);
      const ly = 0;
      
      const cosT = Math.cos(tiltX);
      const sinT = Math.sin(tiltX);
      const ry1 = ly * cosT - lz * sinT;
      const rz1 = ly * sinT + lz * cosT;
      
      const cosS = Math.cos(rotSpeed1);
      const sinS = Math.sin(rotSpeed1);
      const rx2 = lx * cosS - rz1 * sinS;
      const rz2 = lx * sinS + rz1 * cosS;
      
      const pt = projectLoader3D(rx2, ry1 + centerY, rz2, 300, 300, cp, cy);
      if (pt) {
        if (first) {
          ctx.moveTo(pt.x, pt.y);
          first = false;
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      }
    }
    ctx.stroke();
    ctx.restore();

    // Ring 2: Purple, vertical-tilted ring spinning counter-clockwise
    const radius2 = 38;
    const rotSpeed2 = -timestamp * 0.0015;
    ctx.save();
    ctx.strokeStyle = 'rgba(127, 0, 255, 0.5)';
    ctx.lineWidth = 0.8;
    ctx.setLineDash([4, 4]);
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#7f00ff';
    
    ctx.beginPath();
    first = true;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const tiltZ = -0.5;
      const lx = radius2 * Math.cos(angle);
      const ly = radius2 * Math.sin(angle);
      const lz = 0;
      
      const cosT = Math.cos(tiltZ);
      const sinT = Math.sin(tiltZ);
      const rx1 = lx * cosT - ly * sinT;
      const ry1 = lx * sinT + ly * cosT;
      
      const cosS = Math.cos(rotSpeed2);
      const sinS = Math.sin(rotSpeed2);
      const rx2 = rx1 * cosS - lz * sinS;
      const rz2 = rx1 * sinS + lz * cosS;
      
      const pt = projectLoader3D(rx2, ry1 + centerY, rz2, 300, 300, cp, cy);
      if (pt) {
        if (first) {
          ctx.moveTo(pt.x, pt.y);
          first = false;
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      }
    }
    ctx.stroke();
    ctx.restore();
  }

  // Draw 3D vertical matrix-like falling streams
  function drawLoaderCodeStreams(ctx, timestamp, cp, cy) {
    ctx.save();
    ctx.font = '8px monospace';
    ctx.shadowBlur = 4;
    
    loaderCodeStreams.forEach(stream => {
      stream.y += stream.speed;
      if (stream.y > 150) {
        stream.y = -150;
        stream.x = (Math.random() - 0.5) * 220;
      }
      
      stream.tick++;
      if (stream.tick > 10) {
        stream.tick = 0;
        stream.activeCharIdx = (stream.activeCharIdx + 1) % stream.chars.length;
        stream.chars[stream.activeCharIdx] = Math.random() > 0.5 ? "1" : "0";
      }

      stream.chars.forEach((char, idx) => {
        const charY = stream.y - idx * 10;
        const pt = projectLoader3D(stream.x, charY, stream.z, 300, 300, cp, cy);
        
        if (pt) {
          const depthFade = Math.max(0.1, 1 - pt.depth / 350);
          const trailFade = 1 - (idx / stream.chars.length);
          const opacity = depthFade * trailFade * 0.45;
          
          if (idx === 0) {
            ctx.fillStyle = `rgba(57, 255, 20, ${opacity * 1.5})`;
            ctx.shadowColor = '#39ff14';
          } else {
            ctx.fillStyle = `rgba(0, 242, 254, ${opacity})`;
            ctx.shadowColor = '#00f2fe';
          }
          
          ctx.fillText(char, pt.x, pt.y);
        }
      });
    });
    
    ctx.restore();
  }

  class ExplodingParticle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 10;
      this.vy = (Math.random() - 0.5) * 10;
      this.alpha = 1;
      this.size = Math.random() * 4 + 1.5;
      this.color = color;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.025;
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  let explodingParticles = [];

  let loaderPitch = 0;
  let loaderYaw = 0;

  function drawIntro(timestamp) {
    if (!introStartTime) introStartTime = timestamp;
    const elapsed = timestamp - introStartTime;
    const progress = Math.min(elapsed / introDuration, 1);
    
    progressFill.style.width = `${progress * 100}%`;
    updateLoaderLogs(progress, timestamp);
    updateTelemetry(progress);

    introCtx.clearRect(0, 0, 300, 300);
    
    loaderYaw = timestamp * 0.0003;
    loaderPitch = Math.sin(timestamp * 0.0002) * 0.12;

    if (progress < 0.94) {
      // 1. Background matrix falling streams
      drawLoaderCodeStreams(introCtx, timestamp, loaderPitch, loaderYaw);

      // 2. God rays
      drawLoaderGodRays(introCtx, 300, 300, timestamp);

      // 3. Cosmic dust
      drawLoaderDust(introCtx, timestamp, loaderPitch, loaderYaw);
      
      // 4. Background geode nodes & connection web
      geodeNodes.forEach(node => {
        node.rx += node.rotSpeedX;
        node.ry += node.rotSpeedY;
        node.rz += node.rotSpeedZ;
      });
      
      geodeLinks.forEach((link, idx) => {
        const sNode = geodeNodes[link.source];
        const tNode = geodeNodes[link.target];
        
        const active = progress >= sNode.linkThreshold && progress >= tNode.linkThreshold;
        if (active) {
          const pt1 = projectLoader3D(sNode.x, sNode.y, sNode.z, 300, 300, loaderPitch, loaderYaw);
          const pt2 = projectLoader3D(tNode.x, tNode.y, tNode.z, 300, 300, loaderPitch, loaderYaw);
          if (pt1 && pt2) {
            const opacity = 0.15 + (progress - Math.max(sNode.linkThreshold, tNode.linkThreshold)) * 0.8;
            drawOrganicTendril(introCtx, pt1, pt2, sNode.color, opacity, timestamp);
            drawTendrilSignal(introCtx, pt1, pt2, sNode.color, timestamp, idx);
          }
        }
      });

      const projectedNodes = [];
      geodeNodes.forEach(node => {
        const pt = projectLoader3D(node.x, node.y, node.z, 300, 300, loaderPitch, loaderYaw);
        if (pt) {
          projectedNodes.push({
            pt: pt,
            node: node
          });
        }
      });
      
      projectedNodes.sort((a, b) => b.pt.depth - a.pt.depth);
      
      projectedNodes.forEach(pn => {
        const active = progress >= pn.node.linkThreshold;
        if (active) {
          drawGeode(introCtx, pn.node, pn.node.x, pn.node.y, pn.node.z, pn.pt.scale, loaderPitch, loaderYaw);
        } else {
          const size = Math.max(2, pn.node.size * pn.pt.scale * 0.002);
          introCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
          introCtx.beginPath();
          introCtx.arc(pn.pt.x, pn.pt.y, size, 0, Math.PI*2);
          introCtx.stroke();
        }
      });

      // 5. Central 3D cyborg humanoid
      drawHumanoid(introCtx, timestamp, loaderPitch, loaderYaw);

      // 6. Concentric portal telemetry rings
      drawHumanoidRings(introCtx, timestamp, loaderPitch, loaderYaw);

      // 7. Scanning beam
      drawScanningBeam(introCtx, 300, 300, timestamp);
    } else {
      if (explodingParticles.length === 0) {
        for (let a = 0; a < Math.PI * 2; a += 0.08) {
          const r = 100;
          const px = 150 + Math.cos(a) * r;
          const py = 150 + Math.sin(a) * r;
          explodingParticles.push(new ExplodingParticle(px, py, '#00f2fe'));
          explodingParticles.push(new ExplodingParticle(px, py, '#ff007f'));
          explodingParticles.push(new ExplodingParticle(px, py, '#39ff14'));
        }
        introText.classList.add('reveal');
      }
    }

    if (explodingParticles.length > 0) {
      explodingParticles.forEach(p => {
        p.update();
        p.draw(introCtx);
      });
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

  function resizeVfxCanvas() {
    vfxCanvas.width = window.innerWidth;
    vfxCanvas.height = window.innerHeight;
  }
  resizeVfxCanvas();
  window.addEventListener('resize', resizeVfxCanvas);

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
  const totalWarpParticles = 60;
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
  const totalStreams = 35; // Increased code stream density
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

  // Unified VFX Render loop
  function loopVfx() {
    const w = vfxCanvas.width;
    const h = vfxCanvas.height;

    // 1. Draw Backdrop Nebulas & Volumetric Rays
    drawNebulaBackdrop(vfxCtx, w, h, performance.now());

    // 2. Interpolate Camera Rotation based on Mouse
    updateCamRotationPhysics();

    // 3. Update & Draw 3D Code Streams
    codeStreams.forEach(stream => {
      stream.update();
      stream.draw(vfxCtx, w, h, camPitch, camYaw);
    });

    // 4. Update & Draw Warp Particles
    warpParticles.forEach(p => {
      p.update();
      p.draw(vfxCtx, w, h, camPitch, camYaw);
    });

    // 5. Update & Draw Concentric Rings
    portalRings.forEach(ring => {
      ring.update();
      ring.draw(vfxCtx, w, h, camPitch, camYaw);
    });

    // 6. Update & Draw Floating Crystals
    cuboids.forEach(cube => {
      cube.update();
      cube.draw(vfxCtx, w, h, camPitch, camYaw);
    });

    // 7. Draw 3D Neural Web connections (Reference 2 style)
    drawNeuralWebLinks(vfxCtx, w, h, camPitch, camYaw);

    requestAnimationFrame(loopVfx);
  }

  // Launch VFX Loop
  loopVfx();


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

    // Email validation regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      formStatus.classList.add('error');
      formStatus.textContent = 'Please enter a valid email address.';
      return;
    }

    // Enter submitting visual state
    submitBtn.classList.add('submitting');
    submitBtn.disabled = true;

    // Simulate server ingestion (1.5 seconds)
    setTimeout(() => {
      submitBtn.classList.remove('submitting');
      submitBtn.disabled = false;

      // Display success message
      formStatus.classList.add('success');
      formStatus.innerHTML = `Thank you, <strong>${name}</strong>! Your message was submitted successfully. We will email you back shortly.`;

      // Reset form
      contactForm.reset();
    }, 1500);
  });

  // Auto-update copyright year in footer
  const copyrightYear = document.getElementById('copyright-year');
  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }
});
