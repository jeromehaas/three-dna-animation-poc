import * as THREE from 'three';
import { Mesh } from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import dna from '../assets/figures/dna-2.glb';
import * as dat from 'dat.gui';

class Artwork {

	constructor() {
		this.canvas = document.querySelector('canvas');
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
		this.texture = null;
		this.geometry = null;
		this.meshes = {
			plane: null
		};
		this.configs = {
			width: window.innerWidth,
			height: window.innerHeight
		};
		this.loader = null;
		this.dracoLoader = null;
		this.textureLoader = null;
		this.colors = null;
		this.gui = new dat.GUI();
	}

	init = () => {
		this.initCamera();
		this.initControls();
		this.initLoader();
		this.initLight();
		this.resizer();
		this.render();
		this.animate();
	};

	initLoader = () => {
		this.gltfLoader = new GLTFLoader();
		this.dracoLoader = new DRACOLoader();
		this.textureLoader =  new THREE.TextureLoader();
		const particleTexture = this.textureLoader.load('/assets/textures/particles/1.png');
		this.dracoLoader.setDecoderPath('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/');
		this.gltfLoader.setDRACOLoader(this.dracoLoader);
		this.gltfLoader.load(dna, (gltf) => {
			this.geometry = gltf.scene.children[0].geometry;
			let length = this.geometry.attributes.position.array.length;
			this.colors = new Float32Array(length);
			for(let i = 0; i < length; i++) { this.colors[i] = Math.random(); }
			this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
			this.geometry.center();
			this.material = new THREE.PointsMaterial({
				size: 0.02,
				sizeAttenuation: true,
				transparent: true,
				alphaMap: particleTexture,
				vertexColors: true,
				alphaTest: 0.01,
			});
			this.meshes.plane = new THREE.Points( this.geometry, this.material);
			this.meshes.plane.position.set(0, 0, 0);
			this.meshes.plane.rotation.set(0, 0, 4.7);
			this.scene.add(this.meshes.plane);
			this.gui.add(this.meshes.plane.rotation, 'x').min(0).max(10).step(0.1);
			this.gui.add(this.meshes.plane.rotation, 'y').min(0).max(10).step(0.1);
			this.gui.add(this.meshes.plane.rotation, 'z').min(0).max(10).step(0.1);
		});
	};  

	resizer = () => {
		window.addEventListener('resize', () => {
			this.configs.widht = window.innerWidth,
			this.configs.height = window.innerHeight,	
			this.initCamera();
			this.render();
			this.initControls();
		});
	};

	initCamera = () => {
		this.camera = new THREE.PerspectiveCamera(75, this.configs.width / this.configs.height, 0.01, 100);
		this.camera.aspect = window.innerHeight / window.innerWidth;
		this.camera.position.z = 1;
		this.camera.position.x = 7;
	};

	initControls = () => {
		this.controls = new TrackballControls(this.camera, this.canvas);
		this.controls.enableDamping = true;
	};

	initLight = () => {
		this.lights.ground = new THREE.AmbientLight(0xffffff, 0.05);
		this.lights.ground.position.set(-3, 0, 30); 
		this.scene.add(this.lights.ground);
		this.lights.spot = new THREE.PointLight(0xffffff, 0.015);
		this.lights.spot.position.set(0, 0.5, -2); 
		this.scene.add(this.lights.spot);
	};

	render = () => {
		this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true });
		this.renderer.setClearColor( 0x111111 );
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.render(this.scene, this.camera);
	};

	animate = () => {
		const elapsedTime = this.clock.getElapsedTime();
		if (this.meshes.plane) { this.meshes.plane.rotation.y = elapsedTime * 0.1; }
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
		window.requestAnimationFrame(this.animate);
	};

}

const artwork = new Artwork();
artwork.init();
