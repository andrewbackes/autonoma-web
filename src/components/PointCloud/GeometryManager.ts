import * as THREE from 'three';

import { Point, Vector } from '.';

import { Bot } from '.';

export class GeometryManager {
    scene: any
    pointsPerGeometry: number = 380800
    nextPointIndex: number = 0
    geometry: any
    path: any[]

    constructor(scene: any) {
        this.scene = scene;
        this.addPoint = this.addPoint.bind(this)
        this.addVector = this.addVector.bind(this)
        this.drawPath = this.drawPath.bind(this)
        this.newPointSet()
        //this.websocket()
        this.http()
    }

    newPointSet() {
        this.geometry = new THREE.Geometry();
        let pointMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 3.0 });
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

    addPoint(point: Point) {
        this.geometry.vertices[this.nextPointIndex].x = point.vector.x;
        this.geometry.vertices[this.nextPointIndex].y = point.vector.z;
        this.geometry.vertices[this.nextPointIndex].z = -point.vector.y;
        this.geometry.verticesNeedUpdate = true;
        this.nextPointIndex++;
    }

    addVector(v: any) {
        console.log(v);
        this.geometry.vertices[this.nextPointIndex].x = v['x'];
        this.geometry.vertices[this.nextPointIndex].y = v['z'];
        this.geometry.vertices[this.nextPointIndex].z = -v['y'];
        this.geometry.verticesNeedUpdate = true;
        this.nextPointIndex++;
    }

    drawPath(path: any[]) {
        const geometry = new THREE.Geometry();
        const material = new THREE.LineBasicMaterial({
            color: 0x3498DB
        })
        path.forEach(p => {
            geometry.vertices.push(
                new THREE.Vector3(p['x'], p['z'], -p['y'])
            );
        });
        const line = new THREE.Line(geometry, material);
        this.scene.add(line)
        if (path.length > 0) {
            new Bot(this.scene, {
                x: path[path.length - 1]['x'],
                y: path[path.length - 1]['z'] + 22,
                z: -path[path.length - 1]['y']
            } as Vector)
        }
    }

    websocket() {
        const ws = new WebSocket("ws://localhost:8080/scans/dining-room.json");
        //const ws = new WebSocket("ws://localhost:8080/live");
        const self = this
        ws.onmessage = function (evt) {
            self.addPoint(JSON.parse(evt.data) as Point)
        };
        ws.onclose = function () {
            console.log("Websocket closed");
        };
    }

    http() {
        const self = this
        fetch('http://localhost:8080/perception')
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                // console.log(JSON.stringify(myJson));
                const points = myJson['environmentModel']['pointCloud']['points'];
                for (let i = 0; i < points.length; i++) {
                    self.addVector(points[i]);
                }
                const path = myJson['path'];
                self.drawPath(path);
            });
    }
}