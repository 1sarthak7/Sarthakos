import * as THREE from 'three';
import { AtmosphereShader } from '../utils/Shaders.js';

export class Planet {
    constructor(scene, data) {
        this.scene = scene;
        this.data = data;
        
        this.angle = data.angle;
        this.meshGroup = new THREE.Group();
        
        // 1. Visual Planet
        const geometry = new THREE.IcosahedronGeometry(data.size, 16); 
        this.material = new THREE.MeshStandardMaterial({
            color: data.color,
            roughness: 0.6,
            metalness: 0.2,
            emissive: data.color,
            emissiveIntensity: 0.1,
            flatShading: false
        });
        
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        // Apply Tilt
        this.mesh.rotation.z = data.tilt;
        this.meshGroup.add(this.mesh);

        // 2. Invisible Collider
        const colliderGeo = new THREE.SphereGeometry(data.size * 1.5, 8, 8);
        const colliderMat = new THREE.MeshBasicMaterial({ visible: false });
        this.collider = new THREE.Mesh(colliderGeo, colliderMat);
        this.collider.userData = { parent: this }; 
        this.meshGroup.add(this.collider);

        // 3. Atmosphere
        const atmoGeo = new THREE.IcosahedronGeometry(data.size * 1.3, 12);
        const atmoMat = new THREE.ShaderMaterial({
            vertexShader: AtmosphereShader.vertex,
            fragmentShader: AtmosphereShader.fragment,
            uniforms: { uColor: { value: new THREE.Color(data.color) } },
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        });
        this.atmosphere = new THREE.Mesh(atmoGeo, atmoMat);
        this.meshGroup.add(this.atmosphere);

        // 4. Orbit Line (Fixed: Horizontal)
        this.createOrbit();

        this.scene.add(this.meshGroup);
    }

    createOrbit() {
        const points = [];
        const segments = 128;
        const radius = this.data.orbitRadius;
        
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            points.push(new THREE.Vector3(
                Math.cos(theta) * radius,
                0, // Y is 0 for horizontal orbit
                Math.sin(theta) * radius
            ));
        }
        
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 });
        const line = new THREE.Line(geo, mat);
        this.scene.add(line);
    }

    update(time) {
        this.angle += this.data.orbitSpeed * 0.005;
        this.meshGroup.position.x = Math.cos(this.angle) * this.data.orbitRadius;
        this.meshGroup.position.z = Math.sin(this.angle) * this.data.orbitRadius;
        this.mesh.rotation.y += 0.01;
    }
}