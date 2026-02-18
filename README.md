<div align="center">

  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:00f3ff,100:bc13fe&height=200&section=header&text=SARTHAK-OS&fontSize=70&fontAlignY=35&animation=fadeIn&fontColor=ffffff&desc=INTERACTIVE%203D%20DATA%20COSMOS&descAlignY=55&descSize=20" alt="SarthakOS Header" width="100%">

  <br>

  <a href="https://github.com/1sarthak7/sarthakos">
    <img src="https://img.shields.io/badge/STATUS-OPERATIONAL-00f3ff?style=for-the-badge&logo=github&logoColor=000" alt="Status Operational">
  </a>
  <a href="https://threejs.org/">
    <img src="https://img.shields.io/badge/ENGINE-THREE.JS-bc13fe?style=for-the-badge&logo=three.js&logoColor=white" alt="Engine Three.js">
  </a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">
    <img src="https://img.shields.io/badge/CORE-JAVASCRIPT-f7df1e?style=for-the-badge&logo=javascript&logoColor=black" alt="Core JS">
  </a>
  <a href="https://www.khronos.org/opengl/wiki/Core_Language_(GLSL)">
    <img src="https://img.shields.io/badge/SHADER-GLSL-ff0055?style=for-the-badge&logo=opengl&logoColor=white" alt="Shader GLSL">
  </a>

<br><br>

  <p align="center">
    <b>A cinematic, data-driven portfolio engine that visualizes your developer identity as a living solar system.</b><br>
    Repositories orbit as planets. Commits burn as stars. You are the gravitational core.
  </p>

  <br>

  <a href="https://1sarthak7.github.io/sarthakos/">
    <img src="https://img.shields.io/badge/LAUNCH_SYSTEM-INITIALIZE_NOW-00f3ff?style=for-the-badge" height="40">
  </a>

</div>

<br>


<div align="center">

## SYSTEM ARCHITECTURE

| MODULE        | DESCRIPTION                                                                                       | TECH STACK                |
| :------------ | :------------------------------------------------------------------------------------------------ | :------------------------ |
| CORE ENGINE   | Real-time WebGL rendering pipeline with ACES Filmic Tone Mapping and physically correct lighting. | Three.js WebGL            |
| PLANET SYSTEM | Procedural PBR planets with atmosphere shaders, Fresnel rim lighting and orbital mechanics.       | GLSL ShaderMaterial       |
| DATA LINK     | Live fetching of GitHub repositories, stars, forks, commits and README content.                   | Fetch API GitHub REST API |
| UI LAYER      | Holographic glass interface with cinematic docking and undocking transitions.                     | CSS3 GSAP                 |
| STARFIELD     | Data-reactive instanced particle system representing activity and growth.                         | BufferGeometry Instancing |

</div>


<div align="center">

## INSTALLATION AND DEPLOYMENT

This project is a static web application. No backend server is required.
It runs directly in the browser using ES6 Modules.

### 1 CLONE THE REPOSITORY

```bash
git clone https://github.com/1sarthak7/sarthakos.git
cd sarthakos
```

### 2 LOCAL INITIALIZATION

Because ES6 modules are used, a local development server is required.

Using Python

```bash
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

Using VS Code

Install the Live Server extension.
Right-click index.html.
Select Open with Live Server.

</div>


<div align="center">

## VISUAL FEATURES

<table>
<tr>
<td align="center" width="33%">
<h3>ORBITAL PHYSICS</h3>
<p>Elliptical motion driven by angular velocity. Planets pause during docking and resume on return.</p>
</td>
<td align="center" width="33%">
<h3>REACTIVE SHADERS</h3>
<p>Procedural GLSL noise drives solar pulse intensity and atmospheric glow based on GitHub activity.</p>
</td>
<td align="center" width="33%">
<h3>CINEMATIC CAMERA</h3>
<p>Smooth GSAP-powered camera transitions with depth control and immersive focus states.</p>
</td>
</tr>
</table>

</div>



<div align="center">

## DATA INTELLIGENCE

The system dynamically retrieves

Total Public Repositories
Total Stars
Total Forks
Total Commit Counts
Individual Repository README Preview

Each metric directly influences visual behavior

More commits increase solar pulse intensity
Higher stars increase planetary glow
Recent activity generates star bursts

</div>



<div align="center">

## NAVIGATION SYSTEM

Universe Mode
Planets rotate in real time. Global GitHub metrics are visible.

Dock Mode
Click a planet to focus. Orbit freezes. Repository details and README preview appear.

Return To Orbit
Use the Return button or press ESC to re-enter the universe view.

Warp Mode
Press SPACE to temporarily increase star velocity and bloom intensity.

</div>



<div align="center">

## CUSTOMIZATION

To use this engine for another profile, modify:

src/systems/githubService.js

Replace the username with your own.

To adjust shaders and atmosphere composition, edit:

src/Shaders.js

To tweak orbital mechanics or lighting behavior, modify:

src/Engine.js

</div>


--- 

<div align="center">

## PERFORMANCE NOTES

Instanced particle rendering for starfield
Selective raycasting for accurate click detection
Lazy README fetching to avoid blocking render loop
Optimized post-processing pipeline with tuned bloom and tone mapping

Designed to maintain high frame rates on modern browsers.

</div>

---


<div align="center">

ENGINEERED BY

<a href="https://github.com/1sarthak7">SARTHAK BHOPALE</a>


</div>
