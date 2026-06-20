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

  function updateLoaderLogs(progress) {
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
  }

  // Parametric geometry point generator
  function getShapePoints(sides, radius, cx, cy, totalPoints = 120) {
    const points = [];
    for (let i = 0; i < totalPoints; i++) {
      const angle = (i / totalPoints) * Math.PI * 2 - Math.PI / 2;
      let r = radius;
      if (sides >= 3 && sides <= 10) {
        const segment = Math.PI * 2 / sides;
        const term = (angle + Math.PI/2) % segment - segment / 2;
        r = radius * Math.cos(segment / 2) / Math.cos(term);
      }
      points.push({
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r
      });
    }
    return points;
  }

  // Particle burst class for intro climax
  class ExplodingParticle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 8;
      this.vy = (Math.random() - 0.5) * 8;
      this.alpha = 1;
      this.size = Math.random() * 3 + 1;
      this.color = color;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.02;
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
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
    
    // Update progress bar & logs
    progressFill.style.width = `${progress * 100}%`;
    updateLoaderLogs(progress);

    introCtx.clearRect(0, 0, 300, 300);
    const cx = 150, cy = 150, baseRadius = 60;
    
    let sidesA = 3, sidesB = 3;
    let morphFactor = 0;
    let rotation = elapsed * 0.001;

    if (progress < 0.25) {
      sidesA = 3; sidesB = 4;
      morphFactor = progress / 0.25;
    } else if (progress < 0.50) {
      sidesA = 4; sidesB = 5;
      morphFactor = (progress - 0.25) / 0.25;
    } else if (progress < 0.75) {
      sidesA = 5; sidesB = 100;
      morphFactor = (progress - 0.50) / 0.25;
    } else if (progress < 0.90) {
      sidesA = 100; sidesB = 100;
      morphFactor = 0;
      rotation = elapsed * 0.005;
    }

    const pointsA = getShapePoints(sidesA, baseRadius, cx, cy);
    const pointsB = getShapePoints(sidesB, baseRadius, cx, cy);

    // Interpolate points
    const currentPoints = [];
    for (let i = 0; i < pointsA.length; i++) {
      const x = pointsA[i].x + (pointsB[i].x - pointsA[i].x) * morphFactor;
      const y = pointsA[i].y + (pointsB[i].y - pointsA[i].y) * morphFactor;
      currentPoints.push({ x, y });
    }

    // Apply rotation
    introCtx.save();
    introCtx.translate(cx, cy);
    introCtx.rotate(rotation);
    introCtx.translate(-cx, -cy);

    introCtx.lineWidth = 3;
    let glowSize = 5;
    let strokeColor = '#00f2fe';

    if (progress >= 0.75 && progress < 0.90) {
      const intensity = (progress - 0.75) / 0.15;
      glowSize = 5 + intensity * 20;
      strokeColor = `rgb(${Math.floor(intensity * 127)}, ${Math.floor(242 - intensity * 100)}, 254)`;
    }

    introCtx.shadowBlur = glowSize;
    introCtx.shadowColor = strokeColor;
    introCtx.strokeStyle = strokeColor;

    // Draw Shape
    if (progress < 0.90) {
      introCtx.beginPath();
      introCtx.moveTo(currentPoints[0].x, currentPoints[0].y);
      for (let i = 1; i < currentPoints.length; i++) {
        introCtx.lineTo(currentPoints[i].x, currentPoints[i].y);
      }
      introCtx.closePath();
      introCtx.stroke();
    } else {
      // Climax burst
      if (explodingParticles.length === 0) {
        const circlePoints = getShapePoints(100, baseRadius, cx, cy);
        circlePoints.forEach(p => {
          explodingParticles.push(new ExplodingParticle(p.x, p.y, '#00f2fe'));
          explodingParticles.push(new ExplodingParticle(p.x, p.y, '#7f00ff'));
        });
        introText.classList.add('reveal');
      }
    }
    introCtx.restore();

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
      }, 1000);
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
      const segments = 80;
      ctx.save();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2.2;
      ctx.shadowBlur = 12;
      ctx.shadowColor = this.color;
      if (this.isDashed) {
        ctx.setLineDash([6, 14]);
      }
      
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

  // 3. Floating 3D Cubes
  class Cube3D {
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
      this.vertices = [
        {x: -s, y: -s, z: -s},
        {x:  s, y: -s, z: -s},
        {x:  s, y:  s, z: -s},
        {x: -s, y:  s, z: -s},
        {x: -s, y: -s, z:  s},
        {x:  s, y: -s, z:  s},
        {x:  s, y:  s, z:  s},
        {x: -s, y:  s, z:  s}
      ];

      this.edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ];

      this.faces = [
        [0, 1, 2, 3], [1, 5, 6, 2],
        [5, 4, 7, 6], [4, 0, 3, 7],
        [3, 2, 6, 7], [4, 5, 1, 0]
      ];
    }

    update() {
      this.rx += this.rotSpeedX;
      this.ry += this.rotSpeedY;
      this.rz += this.rotSpeedZ;
      this.cz -= 1.0;
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
      // Glass face fill
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

      // Neon lines
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

      // Neon corner nodes
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#ffffff';
      screenPoints.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(1, pt.scale * 0.015), 0, Math.PI * 2);
        ctx.fill();
      });

      // Coding hex label overlay
      const avgX = screenPoints.reduce((sum, p) => sum + p.x, 0) / 8;
      const avgY = screenPoints.reduce((sum, p) => sum + p.y, 0) / 8;
      const scale = screenPoints.reduce((sum, p) => sum + p.scale, 0) / 8;

      ctx.fillStyle = this.color;
      ctx.font = `600 ${Math.max(7, scale * 0.045)}px monospace`;
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 0.45;
      ctx.fillText("0x" + Math.floor(this.cz).toString(16).toUpperCase(), avgX - 22, avgY - 6);
      ctx.fillText("SYS: " + Math.floor(this.cx), avgX - 26, avgY + 12);
      ctx.restore();
    }
  }

  const cuboids = [
    new Cube3D(-300, -200, 900, 60, 'hsl(182, 100%, 50%)', 0.008, 0.004, 0.002),
    new Cube3D(350, -150, 1100, 70, 'hsl(272, 100%, 60%)', 0.003, 0.009, 0.005),
    new Cube3D(-250, 220, 750, 50, 'hsl(332, 100%, 55%)', 0.006, 0.003, 0.008),
    new Cube3D(280, 200, 1000, 65, 'hsl(182, 100%, 50%)', -0.004, 0.006, 0.003)
  ];

  // 4. Matrix Code Streams in 3D Space
  class CodeStream3D {
    constructor() {
      this.reset();
      this.z = Math.random() * 1000;
    }
    reset() {
      this.x = (Math.random() - 0.5) * 1400;
      this.y = -600;
      this.z = Math.random() * 600 + 400;
      this.speed = Math.random() * 3 + 1.5;
      this.chars = [];
      const len = Math.floor(Math.random() * 10 + 6);
      for (let i = 0; i < len; i++) {
        this.chars.push(Math.random() > 0.5 ? '1' : '0');
      }
      this.color = Math.random() > 0.6 ? 'hsla(182, 100%, 50%, 0.12)' : 'hsla(272, 100%, 60%, 0.12)';
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
          const fontSize = Math.max(5, pt.scale * 0.045);
          ctx.save();
          let alpha = (1 - this.z / 1000) * 0.45 * (1 - i / this.chars.length);
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
  const totalStreams = 20;
  for (let i = 0; i < totalStreams; i++) {
    codeStreams.push(new CodeStream3D());
  }

  // Gradient Nebula backdrop base
  function drawNebulaBackdrop(ctx, width, height) {
    ctx.fillStyle = '#05050a';
    ctx.fillRect(0, 0, width, height);

    // Cyan portal aura
    const grad1 = ctx.createRadialGradient(
      width / 2, height / 2, 20,
      width / 2, height / 2, Math.max(width, height) * 0.55
    );
    grad1.addColorStop(0, 'rgba(0, 242, 254, 0.06)');
    grad1.addColorStop(0.4, 'rgba(0, 242, 254, 0.015)');
    grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, width, height);

    // Purple nebula clouds
    const grad2 = ctx.createRadialGradient(
      width * 0.75, height * 0.3, 10,
      width * 0.75, height * 0.3, Math.max(width, height) * 0.65
    );
    grad2.addColorStop(0, 'rgba(127, 0, 255, 0.05)');
    grad2.addColorStop(0.5, 'rgba(127, 0, 255, 0.01)');
    grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, width, height);
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

  // Unified VFX Render loop
  function loopVfx() {
    const w = vfxCanvas.width;
    const h = vfxCanvas.height;

    // 1. Draw Static Backdrop Nebulas
    drawNebulaBackdrop(vfxCtx, w, h);

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

    // 6. Update & Draw Floating Cubes
    cuboids.forEach(cube => {
      cube.update();
      cube.draw(vfxCtx, w, h, camPitch, camYaw);
    });

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
