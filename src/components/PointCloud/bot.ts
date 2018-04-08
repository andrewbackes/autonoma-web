import * as THREE from 'three';
import { Vector } from '.';

export class Orientation {
    yaw: number
    pitch: number
    roll: number
}

export class Bot {
    scene: any
    meshes: any[] = []
    geometries: any[] = []
    origin: Vector = { x: 0, y: 0, z: 0 }

    constructor(scene: any) {
        this.scene = scene;
        this.draw()
        this.setOrigin = this.setOrigin.bind(this)
        this.setOrigin({ x: 0, y: 0, z: 0 })
    }

    public setOrigin(pos: Vector) {
        this.meshes.forEach(mesh => {
            mesh.position.set(
                mesh.position.x - this.origin.x + pos.x,
                mesh.position.y - this.origin.y + pos.y,
                mesh.position.z - this.origin.z + pos.z
            );
        })
        this.origin = pos;
    }

    public setOrientation(orientation: Orientation) {

    }

    private draw() {
        const offset: Vector = { x: 0, y: -15, z: 0 }
        const color = 'grey'
        const material = new THREE.MeshBasicMaterial({ color: color });

        // body
        const body = new THREE.BoxGeometry(18, 11, 11);
        const bodyMesh = new THREE.Mesh(body, material);
        bodyMesh.position.set(offset.x, offset.y, offset.z)
        this.scene.add(bodyMesh);
        this.meshes.push(bodyMesh);

        // wheels
        const wheelGeometry = new THREE.CylinderGeometry(3, 3, 4, 32);

        // back left
        const wheelMesh1 = new THREE.Mesh(wheelGeometry, material);
        wheelMesh1.position.set(offset.x + 6, offset.y - 5, offset.z + 8)
        wheelMesh1.rotation.x = Math.PI / 2
        this.scene.add(wheelMesh1);

        // back right
        const wheelMesh2 = new THREE.Mesh(wheelGeometry, material);
        wheelMesh2.position.set(offset.x + 6, offset.y - 5, offset.z - 8)
        wheelMesh2.rotation.x = Math.PI / 2
        this.scene.add(wheelMesh2);

        // front left
        const wheelMesh3 = new THREE.Mesh(wheelGeometry, material);
        wheelMesh3.position.set(offset.x - 6, offset.y - 5, offset.z + 8)
        wheelMesh3.rotation.x = Math.PI / 2
        this.scene.add(wheelMesh3);

        // front right
        const wheelMesh4 = new THREE.Mesh(wheelGeometry, material);
        wheelMesh4.position.set(offset.x - 6, offset.y - 5, offset.z - 8)
        wheelMesh4.rotation.x = Math.PI / 2
        this.scene.add(wheelMesh4);

        this.meshes.push(wheelMesh1);
        this.meshes.push(wheelMesh2);
        this.meshes.push(wheelMesh3);
        this.meshes.push(wheelMesh4);

        // roofmount base
        const base = new THREE.BoxGeometry(9, 5, 5);
        const baseMesh = new THREE.Mesh(base, material);
        baseMesh.position.set(offset.x + 2, offset.y + 8, offset.z)
        this.scene.add(baseMesh);
        this.meshes.push(baseMesh);

        // roofmount bracket
        const bracketLeft = new THREE.BoxGeometry(2, 5, 1);
        const bracketLeftMesh = new THREE.Mesh(bracketLeft, material);
        bracketLeftMesh.position.set(offset.x, offset.y + 15, offset.z - 2)
        this.scene.add(bracketLeftMesh);
        this.meshes.push(bracketLeftMesh);
        const bracketRight = new THREE.BoxGeometry(2, 5, 1);
        const bracketRightMesh = new THREE.Mesh(bracketRight, material);
        bracketRightMesh.position.set(offset.x, offset.y + 15, offset.z + 2)
        this.scene.add(bracketRightMesh);
        this.meshes.push(bracketRightMesh);
        const bracketBottom = new THREE.BoxGeometry(2, 1, 5);
        const bracketBottomMesh = new THREE.Mesh(bracketBottom, material);
        bracketBottomMesh.position.set(offset.x, offset.y + 12, offset.z)
        this.scene.add(bracketBottomMesh);
        this.meshes.push(bracketBottomMesh);

        // drive belt
        const cogGeometry = new THREE.CylinderGeometry(1, 1, 1, 32);
        const cog = new THREE.Mesh(cogGeometry, material);
        cog.position.set(offset.x, offset.y + 11, offset.z)
        this.scene.add(cog);
        this.meshes.push(cog);

        // lidar
        const lenseGeo = new THREE.CylinderGeometry(1, 1, 4, 32);
        const lense1 = new THREE.Mesh(lenseGeo, material);
        lense1.position.set(offset.x - 2, offset.y + 17, offset.z)
        lense1.rotation.z = Math.PI / 2
        this.scene.add(lense1);
        this.meshes.push(lense1);
        const lense2 = new THREE.Mesh(lenseGeo, material);
        lense2.position.set(offset.x - 2, offset.y + 15, offset.z)
        lense2.rotation.z = Math.PI / 2
        this.scene.add(lense2);
        this.meshes.push(lense2);
        const lidarBack = new THREE.BoxGeometry(1, 3, 5);
        const lidarBackMesh = new THREE.Mesh(lidarBack, material);
        lidarBackMesh.position.set(offset.x, offset.y + 16, offset.z)
        this.scene.add(lidarBackMesh);
        this.meshes.push(lidarBackMesh);
    }
}
