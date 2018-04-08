import * as React from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';

import { GeometryManager, Bot } from '.';

export class Vector {
  x: number
  y: number
  z: number
}

export class Point {
  origin: Vector
  orientation: any
  vector: Vector
}

class PointCloudState {
  width: number
  height: number
}

interface PointCloudProps {
  geometryManager: any
}

export class PointCloud extends React.Component<PointCloudProps, PointCloudState> {
  scene: any
  camera: any
  mount: any
  renderer: any
  frameId: any
  controls: any

  constructor(props: PointCloudProps) {
    super(props)
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.animate = this.animate.bind(this)
    this.resize = this.resize.bind(this);
    this.state = { width: 1080, height: 768 }
  }

  componentDidMount() {

    window.addEventListener("resize", this.resize);

    const width = this.mount.clientWidth
    const height = this.mount.clientHeight

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      2000
    )
    this.camera.position.set(400, 200, 0);
    this.controls = new OrbitControls(this.camera)

    // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.minDistance = 0;
    this.controls.maxDistance = 5000
    // this.controls.maxPolarAngle = Math.PI / 2;

    this.renderer = new THREE.WebGLRenderer({ antialias: true })

    // this.createPointCloud()
    this.scene.add(new THREE.AxesHelper(20));

    this.renderer.setClearColor('#000000')
    this.renderer.setSize(width, height)

    this.controls.update();

    this.mount.appendChild(this.renderer.domElement)

    this.start()
    this.resize()
    new this.props.geometryManager(this.scene)
    new Bot(this.scene)
  }

  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
    window.removeEventListener("resize", this.resize);
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId)
  }

  animate() {
    this.controls.update();
    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }

  resize() {
    let width = 1080;
    const container = document.getElementById('point-cloud-container');
    if (container) {
      const rect = container.getBoundingClientRect();
      width = rect.width;
    }
    const height = width * 3 / 4
    if (this.renderer) {
      this.renderer.setSize(width, height)
    }
    this.setState({ width: width, height: height });
  }

  render() {
    return (
      <div id="point-cloud-container">
        <div
          style={{ width: this.state.width, height: this.state.height }}
          ref={(mount) => { this.mount = mount }}
        />
      </div>
    )
  }
}
