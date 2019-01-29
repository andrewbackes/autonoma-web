import * as THREE from 'three';

import { Point, Vector } from '.';

import { Bot } from '.';

export class GeometryManager {
    scene: any
    camera: any
    controls: any
    //pointsPerGeometry: number = 380800
    //nextPointIndex: number = 0
    //geometry: any
    path: any[]

    constructor(scene: any, camera: any, controls: any) {
        this.scene = scene;
        this.camera = camera;
        this.controls = controls;
        //this.addPoint = this.addPoint.bind(this)
        //this.addVector = this.addVector.bind(this)
        this.drawPath = this.drawPath.bind(this)
        this.drawPointcloud = this.drawPointcloud.bind(this)
        this.icp = this.icp.bind(this)
        this.deadReckoning = this.deadReckoning.bind(this)
        //this.newPointSet()
        //this.websocket()
        this.http()
    }
    /*
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
    */
    drawPath(path: any[]) {
        const geometry = new THREE.Geometry();
        const material = new THREE.LineBasicMaterial({
            color: 0x00FF00
        })
        path.forEach(p => {
            geometry.vertices.push(
                new THREE.Vector3(p['x'], p['z'], -p['y'])
            );
        });
        const line = new THREE.Line(geometry, material);
        this.scene.add(line)
    }

    deadReckoning(v: any[]) {
        this.drawPointcloud(v, 0x696969)
    }

    icp(v: any[]) {
        //this.drawPointcloud(v, 0x888888)
        //this.drawPointcloud(v, 0xA9A9A9)
        this.drawPointcloud(v, 0x0000FF);
    }

    drawPointcloud(v: any[], color: any) {
        const geometry = new THREE.Geometry();
        const material = new THREE.PointsMaterial({ color: color, size: 3.0 });
        console.log("icp points: " + v.length)
        for (let i = 0; i < v.length; i++) {
            let point = new THREE.Vector3();
            point.x = v[i]['x']
            point.y = v[i]['z']
            point.z = -v[i]['y']
            geometry.vertices.push(point);
        }
        const pointset = new THREE.Points(geometry, material);
        this.scene.add(pointset);
    }

    /*
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
    */
    http() {
        const self = this
        fetch('http://localhost:8080/perception')
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                // console.log(JSON.stringify(myJson));

                // Fitted scans
                const points = myJson['environmentModel']['pointCloud']['points'];
                self.icp(points);

                // Dead reckoning
                const scans = myJson['scans'];
                for (let i = 0; i < scans.length; i++) {
                    self.deadReckoning(scans[i]);
                }
                const path = myJson['path'];
                self.drawPath(path);

                // Bot location
                const location = myJson['vehicle']['location'];
                new Bot(self.scene, {
                    x: location['x'],
                    y: location['z'] + 22,
                    z: -location['y']
                } as Vector)

                const loc = new THREE.Vector3(location['x'], location['z'], -location['y'])
                self.camera.position.x = location['x'];
                self.camera.position.y = location['z'] + 500;
                self.camera.position.z = -location['y'];
                self.controls.target = loc;

            });
    }
}