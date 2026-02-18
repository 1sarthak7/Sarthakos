import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import gsap from 'gsap';

export const SYSTEM_STATE = { UNIVERSE: 'universe', DOCKED: 'docked' };

export class Engine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentState = SYSTEM_STATE.UNIVERSE;
        
        // Raycaster Setup
        this.raycaster = new THREE.Raycaster();
        this.clickableObjects = []; 
        this.hoveredObject = null;
        
        this.initScene();
        this.initPostProcessing();
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x050508, 0.0012);

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        // High angle view
        this.camera.position.set(0, 60, 120);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.1;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.minDistance = 30;
        this.controls.maxDistance = 450;
    }

    initPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        this.bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.4, 0.4, 0.85);
        this.composer.addPass(this.bloomPass);
        this.composer.addPass(new OutputPass());
    }

    checkIntersections(mouse) {
        if (this.currentState !== SYSTEM_STATE.UNIVERSE) return null;

        this.raycaster.setFromCamera(mouse, this.camera);
        // Intersect invisible colliders
        const intersects = this.raycaster.intersectObjects(this.clickableObjects, false);

        if (intersects.length > 0) {
            // Get the parent object (CoreSun or Planet instance)
            const target = intersects[0].object.userData.parent;
            
            if (this.hoveredObject !== target) {
                this.hoveredObject = target;
                document.body.style.cursor = 'pointer';
                
                // Scale up visual mesh
                if(target.mesh) {
                    gsap.to(target.mesh.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.3, ease: "back.out(1.7)" });
                    if(target.mesh.material.emissive) {
                        gsap.to(target.mesh.material, { emissiveIntensity: 0.6, duration: 0.3 });
                    }
                }
            }
            return target;
        } else {
            if (this.hoveredObject) {
                if(this.hoveredObject.mesh) {
                    gsap.to(this.hoveredObject.mesh.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
                    if(this.hoveredObject.mesh.material.emissive) {
                        gsap.to(this.hoveredObject.mesh.material, { emissiveIntensity: 0.1, duration: 0.3 });
                    }
                }
                this.hoveredObject = null;
                document.body.style.cursor = 'default';
            }
            return null;
        }
    }

    render() {
        this.controls.update();
        this.composer.render();
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }
}