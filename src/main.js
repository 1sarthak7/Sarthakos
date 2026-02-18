import * as THREE from 'three';
import gsap from 'gsap';
import { Engine, SYSTEM_STATE } from './core/Engine.js';
import { GithubService } from './systems/githubService.js';
import { CoreSun } from './objects/CoreSun.js';
import { Starfield } from './objects/Starfield.js';
import { Planet } from './objects/Planet.js';
import { Interface } from './ui/Interface.js';

// --- Initialization ---
const engine = new Engine('canvas-container');
const service = new GithubService('1sarthak7'); // Replace with your username
const ui = new Interface(() => handleUndock(), service);

let sun, starfield;
let planets = [];
let activePlanet = null;
let systemStarted = false; // Flag to check if start button pressed

// --- Load Universe ---
async function init() {
    // 1. Initial "Far Away" Camera Position for Welcome Screen
    // We place the camera very high and far so the user sees a distant "galaxy" view behind the blur
    engine.camera.position.set(0, 400, 600);
    engine.camera.lookAt(0, 0, 0);
    engine.controls.enabled = false; // Disable mouse control on welcome screen

    // Fetch Data
    const data = await service.fetchData();
    ui.updateMetrics(data.metrics);
    
    // Create Objects
    sun = new CoreSun(engine.scene);
    engine.clickableObjects.push(sun.collider);

    starfield = new Starfield(engine.scene);

    data.repos.forEach(repoData => {
        const planet = new Planet(engine.scene, repoData);
        planets.push(planet);
        engine.clickableObjects.push(planet.collider);
    });

    const ambient = new THREE.AmbientLight(0x404040, 1.5);
    engine.scene.add(ambient);

    // Setup Start Button Listener with STOP PROPAGATION
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', (e) => {
            // CRITICAL FIX: Stop the click from passing through to the 3D scene
            e.stopPropagation(); 
            e.preventDefault();
            enterSystem();
        });
    }

    animate();
}

function enterSystem() {
    if (systemStarted) return;
    systemStarted = true;

    // 1. Fade Out Welcome Screen
    const welcome = document.getElementById('welcome-screen');
    welcome.classList.add('fade-out');

    // 2. Remove Welcome Screen from DOM after fade (optimization)
    setTimeout(() => {
        welcome.style.display = 'none';
    }, 1000);

    // 3. Show Main UI
    setTimeout(() => {
        document.getElementById('ui-layer').classList.remove('hidden');
    }, 1000);

    // 4. Cinematic Camera Entrance
    // Fly from (0, 400, 600) down to standard view (0, 60, 120)
    gsap.to(engine.camera.position, {
        x: 0, 
        y: 60, 
        z: 120,
        duration: 2.5,
        ease: "power4.inOut",
        onComplete: () => {
            engine.controls.enabled = true; // Enable orbit controls
        }
    });
}

init();

// --- Input Handling ---
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (e) => {
    if (!systemStarted) return; // Ignore mouse before start
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    engine.checkIntersections(mouse);
});

window.addEventListener('click', (e) => {
    // STRICT CHECK: Do not fire if system hasn't started
    if (!systemStarted) return; 
    
    const target = engine.checkIntersections(mouse);
    if (target && engine.currentState === SYSTEM_STATE.UNIVERSE) {
        if (target.data && target.data.type === 'sun') {
            window.open(target.data.url, '_blank');
        } else {
            handleDock(target);
        }
    }
});

window.addEventListener('keydown', (e) => {
    if (!systemStarted) return;
    if (e.key === 'Escape') handleUndock();
});

window.addEventListener('resize', () => engine.onResize());

// --- State Management ---
function handleDock(planet) {
    activePlanet = planet;
    engine.currentState = SYSTEM_STATE.DOCKED;
    engine.controls.enabled = false;

    const targetPos = new THREE.Vector3();
    planet.meshGroup.getWorldPosition(targetPos);
    
    const camOffset = new THREE.Vector3(10, 5, 10);
    const endPos = targetPos.clone().add(camOffset);

    gsap.to(engine.camera.position, {
        x: endPos.x, y: endPos.y, z: endPos.z,
        duration: 1.5, ease: "power3.inOut",
        onUpdate: () => engine.camera.lookAt(targetPos),
        onComplete: () => ui.showProject(planet.data)
    });

    gsap.to(engine.bloomPass, { strength: 2.2, radius: 0.8, duration: 1.5 });
}

function handleUndock() {
    if (engine.currentState !== SYSTEM_STATE.DOCKED) return;

    ui.hide();
    engine.currentState = SYSTEM_STATE.UNIVERSE;
    activePlanet = null;

    gsap.to(engine.camera.position, {
        x: 0, y: 60, z: 120,
        duration: 2.0, ease: "power3.inOut",
        onComplete: () => {
            engine.controls.enabled = true;
            engine.controls.target.set(0, 0, 0);
        }
    });

    gsap.to(engine.bloomPass, { strength: 1.4, radius: 0.4, duration: 1.5 });
}

// --- Render Loop ---
const clock = new THREE.Clock();

function animate() {
    const time = clock.getElapsedTime();

    if(sun) sun.update(time);
    if(starfield) starfield.update(time);

    // While waiting on welcome screen, rotate the whole universe slowly for effect
    if (!systemStarted) {
        engine.camera.position.x = Math.sin(time * 0.1) * 600;
        engine.camera.position.z = Math.cos(time * 0.1) * 600;
        engine.camera.lookAt(0, 0, 0);
    }

    planets.forEach(p => {
        if (engine.currentState === SYSTEM_STATE.UNIVERSE) {
            p.update(time); 
        } else if (p === activePlanet) {
            p.mesh.rotation.y += 0.005; 
            const targetPos = new THREE.Vector3();
            p.meshGroup.getWorldPosition(targetPos);
            engine.camera.lookAt(targetPos);
        }
    });

    engine.render();
    requestAnimationFrame(animate);
}