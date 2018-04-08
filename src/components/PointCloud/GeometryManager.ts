import * as THREE from 'three';
import $ from 'jquery';
import { Vector } from '.';

export class GeometryManager {
    scene: any
    pointsPerGeometry: number = 380800
    nextPointIndex: number = 0
    geometry: any

    constructor(scene: any) {
        this.scene = scene;
        this.addPoint = this.addPoint.bind(this)
        this.newPointSet()
        this.websocket()
    }

    newPointSet() {
        this.geometry = new THREE.Geometry();
        let pointMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 1.0 });
        let pointset = new THREE.Points(this.geometry, pointMaterial);
        for (let i = 0; i < this.pointsPerGeometry; i++) {
            var point = new THREE.Vector3();
            point.x = 0
            point.y = 0
            point.z = 0
            this.geometry.vertices.push(point);
        }
        this.scene.add(pointset);
    }

    addPoint(vector: Vector) {
        this.geometry.vertices[this.nextPointIndex].x = vector.x;
        this.geometry.vertices[this.nextPointIndex].y = vector.y;
        this.geometry.vertices[this.nextPointIndex].z = vector.z;
        this.geometry.verticesNeedUpdate = true;
        this.nextPointIndex++;
    }

    websocket() {
        const ws = new WebSocket("ws://localhost:8080/websocket");
        const self = this
        ws.onmessage = function (evt) {
            self.addPoint(JSON.parse(evt.data) as Vector)
        };
        ws.onclose = function () {
            console.log("Websocket closed");
        };
    }

}