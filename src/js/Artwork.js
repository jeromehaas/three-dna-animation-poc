import * as THREE from 'three';
import { Mesh } from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { gsap } from 'gsap';

class Artwork {

	constructor() {
		this.canvas = document.querySelector('canvas.preview__artwork');
		this.scene = new THREE.Scene();	
		this.clock = new THREE.Clock();
		this.camera = null;
		this.raycaster = null;
		this.lights = {
			ground: null,
			spot: null,
			spot2: null
		};
		this.controls = null;
		this.debugger = null;
		this.meshes = {
			cube: {
				material: null,
				geomerty: null,
				mesh: null
			}, 
			plane: {
				material: null,
				geometry: null,
				mesh: null
			}
		};
		this.configs = {
			width: this.canvas.clientWidth,
			height: this.canvas.clientWidth
		};
	}

	init = () => {
		this.initCamera();
		this.initLight();
		this.initColorSwitcher();
		this.createCube();
		this.createPlane();
		this.resizer();
		this.render();
		this.animate();
		this.initColorSwitcher();
	};


	resizer = () => {
		window.addEventListener('resize', () => {
			this.configs.widht = this.canvas.clientWidth,
			this.configs.height = this.canvas.clientWidth,	
			this.initCamera();
			this.render();
			this.initControls();
		});
	};

	initCamera = () => {
		this.camera = new THREE.PerspectiveCamera(75, this.configs.width / this.configs.height, 1, 100);
		this.camera.position.z = 4;
	};

	initColorSwitcher = () => {
		setInterval(() => {
			let colors = ['rgb(0,255,248)', 'rgb(21,38,53)', 'rgb(255,255,255)'];
			let randomNumber = Math.floor(Math.random() * colors.length);
			let randomColor = colors[randomNumber];
			let threeColor = new THREE.Color(randomColor);
			gsap.to(this.meshes.cube.material.color, 5, {
				r: threeColor.r,
				g: threeColor.g,
				b: threeColor.b,
			});
		}, 5000);
	};

	initControls = () => {
		this.controls = new TrackballControls(this.camera, this.canvas);
		this.controls.enableDamping = true;
	};

	initLight = () => {
		this.lights.ground = new THREE.PointLight(0xffffff, 0.75);
		this.lights.ground.position.set(-3, 0, 30); 
		this.scene.add(this.lights.ground);
		this.lights.spot = new THREE.PointLight(0xffffff, 0.15);
		this.lights.spot.position.set(0, 0.5, -2); 
		this.scene.add(this.lights.spot);
	};

	createCube = () => {
		this.meshes.cube.geometry = new THREE.BoxBufferGeometry(1, 1, 1);
		this.meshes.cube.material = new THREE.MeshNormalMaterial();
		this.meshes.cube.material.shininess = 60;
		this.meshes.cube.material.opacity = 0.75;
		this.meshes.cube.material.transparent = true;
		this.meshes.cube.mesh = new Mesh( this.meshes.cube.geometry, this.meshes.cube.material);
		this.meshes.cube.mesh.rotation.x = 4;
		this.meshes.cube.mesh.rotation.y = 4;
		this.scene.add(this.meshes.cube.mesh);
	};

	createPlane = () => {
		this.meshes.plane.geometry = new THREE.SphereBufferGeometry(25, 80, 80, 7.5, 2.5, 0, 1.2);
		this.meshes.plane.geometry.thethaStart = 0;
		this.meshes.plane.geometry.thethaLenght = 0.8;
		this.meshes.plane.material = new THREE.MeshPhysicalMaterial();
		this.meshes.plane.material.color = new THREE.Color(0x015895);
		this.meshes.plane.material.shininess = 100;
		this.meshes.plane.material.metallness = 40;
		this.meshes.plane.material.side = THREE.DoubleSide;
		this.meshes.plane.mesh = new Mesh( this.meshes.plane.geometry, this.meshes.plane.material);
		this.meshes.plane.mesh.rotation.x = 4.6;
		this.meshes.plane.mesh.rotation.y = 2.25;
		this.meshes.plane.mesh.rotation.z = 0;
		this.meshes.plane.mesh.position.x = 0;
		this.meshes.plane.mesh.position.y = 22;
		this.meshes.plane.mesh.position.z = 9;
		this.scene.add(this.meshes.plane.mesh);
	};

	render = () => {
		this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true });
		this.renderer.setClearColor( 0x000000, 0 );
		this.renderer.setSize(this.configs.width, this.configs.height);
		this.renderer.render(this.scene, this.camera);
	};

	animate = () => {
		const elapsedTime = this.clock.getElapsedTime();
		this.meshes.cube.mesh.rotation.z = elapsedTime * 0.5;
		this.renderer.render(this.scene, this.camera);
		window.requestAnimationFrame(this.animate);
	};

}

export default Artwork;
