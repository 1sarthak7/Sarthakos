import * as THREE from 'three';

export class Starfield {
    constructor(scene) {
        this.scene = scene;
        const count = 4000;
        
        // Use Icosahedron for star geometry (lower poly than sphere)
        const geometry = new THREE.IcosahedronGeometry(0.12, 0);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        
        // InstancedMesh for rendering 4000 objects in 1 draw call
        this.mesh = new THREE.InstancedMesh(geometry, material, count);
        
        const dummy = new THREE.Object3D();
        
        for(let i=0; i<count; i++) {
            // Spherical distribution
            const r = 120 + Math.random() * 500; 
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            dummy.position.set(
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.sin(phi) * Math.sin(theta),
                r * Math.cos(phi)
            );
            
            const scale = 0.5 + Math.random();
            dummy.scale.set(scale, scale, scale);
            
            dummy.updateMatrix();
            this.mesh.setMatrixAt(i, dummy.matrix);
        }
        
        this.mesh.instanceMatrix.needsUpdate = true;
        this.scene.add(this.mesh);
    }

    update(time) {
        // Slow rotation of the universe
        this.mesh.rotation.y = time * 0.005;
    }
}