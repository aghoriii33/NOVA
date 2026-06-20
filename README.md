# NOVA | Premium Developer Portfolio

A modern, high-performance developer portfolio website inspired by Freelancer and Upwork platforms, custom-tailored for lead developers **MR HRICK** and **MR RTIYANA**.

This portfolio features a cinematic, zero-dependency visual system utilizing math-based interactive projections on HTML5 Canvas.

---

## 🌌 Core Features

### 1. Cinematic 3D Cyber Portal Background
* **3D Perspective Camera Model**: Translates world space coordinate matrices `(X, Y, Z)` to pixel screen vectors using standard perspective projection.
* **Spinning Concentric Rings**: Three independent circular rings rotating on Yaw, Pitch, and Roll axes to form a digital portal.
* **Interactive Perspective Tilting**: Mouse coordinates interpolate to tilt the global camera angle, shifting the portal, stars, and code streams dynamically.
* **Warp Speed Particle Starfield**: Projects radial velocity lines traveling from deep space depth coordinates.
* **3D Matrix Code Streams**: Vertical character columns drifting down in perspective space behind the portal core.

### 2. Morphing Geometric Shapes Intro Loader
* **Shape Interpolation**: Cycles mathematically between regular polygons (Triangle -> Square -> Pentagon -> Circle) using parameterized polar radii coordinates.
* **Climax Explosion**: The circle rotates rapidly, builds neon shadow glow, and bursts into particle rings to reveal the header and main landing screen.
* **Smooth Typography Fade**: Logo and creators' names fade and scale into place in sync with the morph sequence.

### 3. Responsive Showcase Grid & Modal Slides
* **Capability Progress Bars**: Scroll-triggered capability filling animation.
* **Filtered Portfolio Grid**: Dynamic tab filtration (Web Apps, UI/UX, Frontend) with visual card overlays.
* **Detailed Info Modals**: Injects project statistics (Core Stack, Client, Duration) on card clicks.

### 4. Verified Contact Form
* Floating cyber labels, glowing focus bars, email triggers, and client-side validators.
* Social icons and direct email links.

---

## 🛠️ Tech Stack
* **Markup**: HTML5 Semantic Tags
* **Styling**: Vanilla CSS (CSS Grid, Flexbox, Variable Tokens, Glassmorphism, Keyframes)
* **Interactions**: Pure JavaScript (HTML5 Canvas 2D Context, requestAnimationFrame loops, Scroll Reveal hooks)

---

## 🚀 Local Setup & Development

To run the site locally, spin up any static file server inside the project root:

```bash
# Option 1: Python HTTP Server
python -m http.server 8080

# Option 2: Node.js http-server
npx http-server -p 8080
```

Open `http://localhost:8080` in your web browser.

---

## 📦 Automatic Hosting Deployment (GitHub Pages)

This project contains a GitHub Actions workflow in `.github/workflows/deploy.yml` that automates hosting:

1. Push this project to your GitHub repository: `https://github.com/aghoriii33/NOVA`
2. Go to **Settings > Pages** on your GitHub repository.
3. Set **Source** to **GitHub Actions**.
4. The site will automatically build and publish to your GitHub Pages subdomain (`https://aghoriii33.github.io/NOVA/`) on every push to the `main` or `master` branch.

---

## 👥 Authors & Contact

* **MR HRICK** - [kundurick781@gmail.com](mailto:kundurick781@gmail.com)
* **MR RTIYANA** - [kaitristan312@gmail.com](mailto:kaitristan312@gmail.com)
* **GitHub Repository** - [aghoriii33/NOVA](https://github.com/aghoriii33/NOVA)
