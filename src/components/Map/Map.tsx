import * as React from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';


export class Map extends React.Component {
    scene: any
    camera: any
    mount: any
    renderer: any
    frameId: any
    controls: any
    geometry: any
    stars: any[]

    constructor(props: any) {
        super(props)

        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.animate = this.animate.bind(this)
        this.addStars = this.addStars.bind(this)
        this.initStars = this.initStars.bind(this)
        this.stars = []
    }

    componentDidMount() {
        const width = this.mount.clientWidth
        const height = this.mount.clientHeight

        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        )
        this.camera.position.set(400, 200, 0);
        this.controls = new OrbitControls(this.camera)

        // an animation loop is required when either damping or auto-rotation are enabled
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.minDistance = 100;
        this.controls.maxDistance = 500
        this.controls.maxPolarAngle = Math.PI / 2;

        this.renderer = new THREE.WebGLRenderer({ antialias: true })

        this.geometry = new THREE.Geometry();

        this.initStars()

        var starsMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 1.0 });
        var starField = new THREE.Points(this.geometry, starsMaterial);

        this.scene.add(starField);

        this.renderer.setClearColor('#000000')
        this.renderer.setSize(width, height)

        this.controls.update();

        this.mount.appendChild(this.renderer.domElement)

        window.setInterval(this.addStars, 3000);
        this.start()
    }

    initStars() {
        for (var i = 0; i < 320000; i++) {
            var star = new THREE.Vector3();
            star.x = 0 // THREE.Math.randFloatSpread(2000);
            star.y = 0 // THREE.Math.randFloatSpread(2000);
            star.z = 0 // THREE.Math.randFloatSpread(2000);
            this.stars.push(star)
            this.geometry.vertices.push(star);
        }
    }

    addStars() {
        for (var i = 0; i < 320000; i++) {
            this.stars[i].x = THREE.Math.randFloatSpread(2000);
            this.stars[i].y = THREE.Math.randFloatSpread(2000);
            this.stars[i].z = THREE.Math.randFloatSpread(2000);
        }
        console.log('Adding stars.')
        this.geometry.verticesNeedUpdate = true;
    }

    componentWillUnmount() {
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
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

    render() {
        return (

            <div
                style={{ width: window.innerWidth, height: window.innerHeight }}
                ref={(mount) => { this.mount = mount }}
            />
        )
    }
}

/*
class Scene extends React.Component {
  scene: any
  camera: any
  mount: any
  renderer: any
  material: any
  cube: any
  frameId: any

  constructor(props: any) {
    super(props)

    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.animate = this.animate.bind(this)
  }

  componentDidMount() {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: '#433F81' })
    const cube = new THREE.Mesh(geometry, material)

    camera.position.z = 4
    scene.add(cube)
    renderer.setClearColor('#000000')
    renderer.setSize(width, height)

    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    this.material = material
    this.cube = cube

    this.mount.appendChild(this.renderer.domElement)
    this.start()
  }

  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
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
    this.cube.rotation.x += 0.01
    this.cube.rotation.y += 0.01

    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }

  render() {
    return (
      <div
        style={{ width: '400px', height: '400px' }}
        ref={(mount) => { this.mount = mount }}
      />
    )
  }
}
*/
