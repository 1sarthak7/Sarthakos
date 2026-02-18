import * as THREE from 'three';
import { SunShader } from '../utils/Shaders.js';

export class CoreSun {
    constructor(scene) {
        this.scene = scene;
        
        // Data required for the click handler in main.js
        this.data = {
            type: 'sun',
            url: "https://sarthakbhopale.in/"
        };

        this.meshGroup = new THREE.Group();

        // 1. Visual Sun
        const geometry = new THREE.IcosahedronGeometry(7, 40); 
        this.material = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            vertexShader: SunShader.vertex,
            fragmentShader: SunShader.fragment,
            side: THREE.DoubleSide,
            transparent: true
        });

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.meshGroup.add(this.mesh);
        
        // 2. Invisible Collider
        const colliderGeo = new THREE.SphereGeometry(8, 12, 12);
        const colliderMat = new THREE.MeshBasicMaterial({ visible: false });
        this.collider = new THREE.Mesh(colliderGeo, colliderMat);
        // IMPORTANT: parent points to 'this' class instance
        this.collider.userData = { parent: this }; 
        this.meshGroup.add(this.collider);

        // 3. Light
        this.light = new THREE.PointLight(0xffaa00, 400, 300);
        this.light.castShadow = true;
        this.light.shadow.bias = -0.0001;
        this.meshGroup.add(this.light);

        // 4. Glow
        const spriteMat = new THREE.SpriteMaterial({
            map: new THREE.TextureLoader().load('https://assets.codepen.io/127738/glow.png'),
            color: 0xff4400,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(40, 40, 1);
        this.meshGroup.add(sprite);

        this.scene.add(this.meshGroup);
    }

    update(time) {
        this.material.uniforms.uTime.value = time;
        this.mesh.rotation.y = time * 0.02;
    }
}