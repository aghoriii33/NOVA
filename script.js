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

  // Central Cyborg Nodes for structural reference
  const cyborgNodes = [
    {x: 150, y: 140, r: 5}, // Heart core
    {x: 150, y: 85, r: 3},  // Brain center
    {x: 120, y: 120, r: 2}, // L Shoulder
    {x: 180, y: 120, r: 2}, // R Shoulder
    {x: 95, y: 145, r: 2},  // L Elbow
    {x: 205, y: 145, r: 2}, // R Elbow
    {x: 140, y: 192, r: 2}, // L Hip
    {x: 160, y: 192, r: 2}, // R Hip
    {x: 132, y: 235, r: 2}, // L Knee
    {x: 168, y: 235, r: 2}  // R Knee
  ];

  // Loader Crystalline neural shards (incorporating Reference 2 style)
  const loaderShards = [];
  const totalLoaderShards = 12;
  for (let i = 0; i < totalLoaderShards; i++) {
    const angle = (i / totalLoaderShards) * Math.PI * 2 + Math.random() * 0.25;
    const distance = 55 + Math.random() * 45;
    loaderShards.push({
      x: 150 + Math.cos(angle) * distance,
      y: 150 + Math.sin(angle) * distance,
      size: Math.random() * 5 + 3.5,
      angle: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.035,
      connectedNodeIndex: Math.floor(Math.random() * cyborgNodes.length),
      linkThreshold: 0.12 + (i / totalLoaderShards) * 0.7
    });
  }

  // Draw Cyborg wireframe
  function drawCyborgWireframe(ctx, cx, cy, progress, timestamp) {
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.45)';
    ctx.lineWidth = 1.5;
    
    // Head
    ctx.beginPath();
    ctx.arc(150, 85, 16, 0, Math.PI * 2);
    ctx.stroke();
    
    // Brain grid
    ctx.beginPath();
    ctx.moveTo(150, 69); ctx.lineTo(150, 101);
    ctx.moveTo(134, 85); ctx.lineTo(166, 85);
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.15)';
    ctx.stroke();
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.45)';
    
    // Neck
    ctx.beginPath();
    ctx.moveTo(147, 101); ctx.lineTo(147, 115);
    ctx.moveTo(153, 101); ctx.lineTo(153, 115);
    ctx.stroke();
    
    // Shoulders
    ctx.beginPath();
    ctx.moveTo(115, 120); ctx.lineTo(185, 120);
    ctx.stroke();
    
    // Torso/Chest
    ctx.beginPath();
    ctx.moveTo(120, 120);
    ctx.lineTo(180, 120);
    ctx.lineTo(168, 170);
    ctx.lineTo(132, 170);
    ctx.closePath();
    ctx.stroke();
    
    // Spine
    ctx.beginPath();
    ctx.moveTo(150, 120);
    ctx.lineTo(150, 190);
    ctx.strokeStyle = 'rgba(57, 255, 20, 0.5)';
    ctx.stroke();
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.45)';
    
    // Arms
    ctx.beginPath();
    ctx.moveTo(120, 120);
    ctx.lineTo(95, 145);
    ctx.lineTo(80, 175);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(180, 120);
    ctx.lineTo(205, 145);
    ctx.lineTo(220, 175);
    ctx.stroke();
    
    // Pelvis
    ctx.beginPath();
    ctx.moveTo(132, 170);
    ctx.lineTo(168, 170);
    ctx.lineTo(160, 192);
    ctx.lineTo(140, 192);
    ctx.closePath();
    ctx.stroke();
    
    // Legs
    ctx.beginPath();
    ctx.moveTo(140, 192);
    ctx.lineTo(132, 235);
    ctx.lineTo(125, 275);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(160, 192);
    ctx.lineTo(168, 235);
    ctx.lineTo(175, 275);
    ctx.stroke();
    
    // Pulsing core nodes
    const pulseFactor = 0.5 + Math.sin(timestamp * 0.008) * 0.5;
    ctx.fillStyle = `rgba(57, 255, 20, ${0.4 + pulseFactor * 0.6})`;
    
    cyborgNodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.restore();
  }

  // Draw floating crystalline shards and their neural lines
  function drawLoaderShards(ctx, progress, timestamp) {
    ctx.save();
    
    loaderShards.forEach(shard => {
      // 1. Update rotation
      shard.angle += shard.rotSpeed;
      
      // 2. Float drift offset
      const dx = Math.sin(timestamp * 0.0012 + shard.x) * 2.5;
      const dy = Math.cos(timestamp * 0.0014 + shard.y) * 2.5;
      const sx = shard.x + dx;
      const sy = shard.y + dy;
      
      // 3. Draw crystalline diamond/shard
      const active = progress >= shard.linkThreshold;
      ctx.strokeStyle = active ? 'rgba(0, 242, 254, 0.7)' : 'rgba(0, 242, 254, 0.2)';
      ctx.fillStyle = active ? 'rgba(0, 242, 254, 0.15)' : 'rgba(0, 242, 254, 0.03)';
      ctx.lineWidth = 1;
      
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(shard.angle);
      
      ctx.beginPath();
      ctx.moveTo(0, -shard.size);
      ctx.lineTo(shard.size / 1.6, 0);
      ctx.lineTo(0, shard.size);
      ctx.lineTo(-shard.size / 1.6, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      
      // 4. Draw neural connection line to the cyborg nodes
      if (active) {
        const targetNode = cyborgNodes[shard.connectedNodeIndex];
        
        ctx.strokeStyle = `rgba(127, 0, 255, ${0.15 + (progress - shard.linkThreshold) * 0.75})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.stroke();
        
        // Draw tiny moving neural node signal along the link line
        const linkPercent = (timestamp * 0.0015) % 1;
        const sigX = sx + (targetNode.x - sx) * linkPercent;
        const sigY = sy + (targetNode.y - sy) * linkPercent;
        ctx.fillStyle = '#00f2fe';
        ctx.beginPath();
        ctx.arc(sigX, sigY, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    ctx.restore();
  }

  // Draw ambient volumetric god rays (atmosphere from Reference 2)
  function drawLoaderLightRays(ctx, w, h, timestamp) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    
    const rayCount = 4;
    for (let i = 0; i < rayCount; i++) {
      const angleOffset = Math.sin(timestamp * 0.0003 + i) * 0.04;
      const xStart = (w / rayCount) * i + (w / rayCount) / 2 + Math.sin(timestamp * 0.00025 + i) * 15;
      const rayWidth = 25 + Math.sin(timestamp * 0.0004 + i * 2) * 10;
      
      const grad = ctx.createLinearGradient(xStart, 0, xStart + Math.tan(angleOffset) * h, h);
      grad.addColorStop(0, `rgba(127, 0, 255, ${0.012 + Math.sin(timestamp * 0.0008 + i) * 0.006})`);
      grad.addColorStop(0.5, `rgba(0, 242, 254, ${0.016 + Math.cos(timestamp * 0.0006 + i) * 0.008})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(xStart - rayWidth / 2, 0);
      ctx.lineTo(xStart + rayWidth / 2, 0);
      ctx.lineTo(xStart + Math.tan(angleOffset) * h + rayWidth, h);
      ctx.lineTo(xStart + Math.tan(angleOffset) * h - rayWidth, h);
      ctx.closePath();
      ctx.fill();
    }
    
    ctx.restore();
  }

  // Draw HUD circle animations
  function drawHUDGauges(ctx, cx, cy, progress, timestamp) {
    ctx.save();
    
    // Outer dashed ring
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 120, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(timestamp * 0.0003);
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([12, 24, 4, 8]);
    ctx.beginPath();
    ctx.arc(0, 0, 114, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Inner magenta dash ring
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-timestamp * 0.0005);
    ctx.strokeStyle = 'rgba(255, 0, 127, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, 100, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Cyan progress arc
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00f2fe';
    ctx.beginPath();
    ctx.arc(cx, cy, 100, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
    ctx.stroke();

    // Micro grid lines
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.08)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(cx - 130, cy); ctx.lineTo(cx + 130, cy);
    ctx.moveTo(cx, cy - 130); ctx.lineTo(cx, cy + 130);
    ctx.stroke();
    
    // Angle markers
    ctx.fillStyle = 'rgba(0, 242, 254, 0.3)';
    ctx.font = '8px monospace';
    ctx.fillText("00", cx - 4, cy - 124);
    ctx.fillText("50", cx + 124, cy + 3);
    ctx.fillText("00", cx - 4, cy + 128);
    ctx.fillText("25", cx - 134, cy + 3);
    
    ctx.restore();
  }

  // Draw scanning laser beam
  function drawScanningBeam(ctx, w, h, timestamp) {
    ctx.save();
    const beamY = 70 + (Math.sin(timestamp * 0.0018) * 0.5 + 0.5) * 200; // sweeps between 70 and 270
    
    // Laser sweep glow
    const grad = ctx.createLinearGradient(0, beamY - 12, 0, beamY + 3);
    grad.addColorStop(0, 'rgba(57, 255, 20, 0)');
    grad.addColorStop(0.5, 'rgba(57, 255, 20, 0.12)');
    grad.addColorStop(1, 'rgba(57, 255, 20, 0.35)');
    
    ctx.fillStyle = grad;
    ctx.fillRect(35, beamY - 12, w - 70, 12);
    
    // Core beam line
    ctx.strokeStyle = '#39ff14';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#39ff14';
    ctx.beginPath();
    ctx.moveTo(35, beamY);
    ctx.lineTo(w - 70, beamY);
    ctx.stroke();
    
    ctx.restore();
  }

  // Climax burst particles
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

  function drawIntro(timestamp) {
    if (!introStartTime) introStartTime = timestamp;
    const elapsed = timestamp - introStartTime;
    const progress = Math.min(elapsed / introDuration, 1);
    
    // Update progress elements
    progressFill.style.width = `${progress * 100}%`;
    updateLoaderLogs(progress, timestamp);
    updateTelemetry(progress);

    introCtx.clearRect(0, 0, 300, 300);
    const cx = 150, cy = 150;
    
    if (progress < 0.94) {
      // 1. Draw ambient atmospheric god rays (Reference 2)
      drawLoaderLightRays(introCtx, 300, 300, timestamp);

      // 2. Draw concentric HUD rings (Reference 1)
      drawHUDGauges(introCtx, cx, cy, progress, timestamp);
      
      // 3. Draw crystalline shards and neural connection lines (Reference 2)
      drawLoaderShards(introCtx, progress, timestamp);
      
      // 4. Draw internal cyborg wireframe (Reference 1)
      drawCyborgWireframe(introCtx, cx, cy, progress, timestamp);
      
      // 5. Draw green scanning sweep laser
      drawScanningBeam(introCtx, 300, 300, timestamp);
    } else {
      // Climax burst when loader hits ~94%
      if (explodingParticles.length === 0) {
        for (let a = 0; a < Math.PI * 2; a += 0.08) {
          const r = 100;
          const px = cx + Math.cos(a) * r;
          const py = cy + Math.sin(a) * r;
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
     6. ABOUT ME SECTION TIMELINE & PROGRESS BARS ANIMATION
     ========================================================================== */
  const skillBars = document.querySelectorAll('.skill-fill');

  function revealSkills() {
    skillBars.forEach(bar => {
      const rect = bar.getBoundingClientRect();
      const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
      
      // If progress bar becomes visible in the viewport, fill it up!
      if (!(rect.bottom < 0 || rect.top - viewHeight >= 0)) {
        const targetPercent = bar.getAttribute('data-progress');
        bar.style.width = targetPercent;
      }
    });
  }

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
    revealSkills();
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
