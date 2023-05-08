// Import three
import * as THREE from 'three';
// Import the default ARButton
import { ARButton } from 'three/addons/webxr/ARButton.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


window.addEventListener("DOMContentLoaded", () => {
        // Make a new scene
        let scene = new THREE.Scene();

        let camera = new THREE.PerspectiveCamera();

        // Make a renderer that fills the screen
        let renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        // Turn on VR support
        renderer.xr.enabled = true;
        // Add canvas to the page
        document.body.appendChild(renderer.domElement);

        // Add a button to enter/exit ar to the page
        document.body.appendChild(ARButton.createButton(renderer));


	var loader = new THREE.TextureLoader();

	const boxgeometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );

	const boxmaterials = [
		new THREE.MeshBasicMaterial( { map: loader.load( '../assets/cube1.png') } ),
		new THREE.MeshBasicMaterial( { map: loader.load( '../assets/cube2.png') } ),
		new THREE.MeshBasicMaterial( { map: loader.load( '../assets/cube3.png') } ),
		new THREE.MeshBasicMaterial( { map: loader.load( '../assets/cube4.png') } ),
		new THREE.MeshBasicMaterial( { map: loader.load( '../assets/cube5.png') } ),
		new THREE.MeshBasicMaterial( { map: loader.load( '../assets/cube6.png') } ),
	];

	let cube = new THREE.Mesh( boxgeometry, boxmaterials );
	scene.add( cube );

	const cylgeometry = new THREE.CylinderGeometry( 0.5, 0.5, 2.0, 32 );
	const cylmaterial = new THREE.MeshLambertMaterial( {color: 0xffff00} );
	const cylinder = new THREE.Mesh( cylgeometry, cylmaterial );
	scene.add( cylinder );
	cylinder.position.z=-2.5;
	cylinder.position.x=0.5;

	var lightOne=new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(lightOne);

	var lightTwo=new THREE.PointLight(0xffffff, 0.5);
	scene.add(lightTwo);

	lightTwo.position.set(2.5, 0, -2.5)

	//напівсферичне освітлення
	var lightThree = new THREE.HemisphereLight(0xfffff, 0x080820, 1);
	scene.add(lightThree);

	const video = document.getElementById( 'video' );
	video.play();
	const texture = new THREE.VideoTexture( video );


	var planegeometry=new THREE.PlaneGeometry(1.6, 0.9);
	var planematerial=new THREE.MeshBasicMaterial({color:0xffffff, map:texture});
	var planemesh=new THREE.Mesh(planegeometry, planematerial);
	planemesh.position.set(7.0, -2.0, -10.0);
	planemesh.scale.set(10, 10, 10);
	scene.add(planemesh);

	const video2 = document.getElementById( 'video2' );
	video2.play();
	const texture2 = new THREE.VideoTexture( video2 );
	cylmaterial.map = texture2;

	cube.scale.set(3,3,3);
	cube.position.x = cube.position.x - 1;

	//camera.position.z = 7;
	//camera.position.x = 2;

	//renderer.setClearColor (0x555555);
	//renderer.clear();

	const modelloader = new GLTFLoader();

	modelloader.load( '../assets/pokemon_sudowoodo_-_tree.glb', function ( gltf ) {
		scene.add(gltf.scene);
		gltf.scene.position.set(-0.5,0.2,0);
		gltf.scene.scale.set(2,2,2);
	}, function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	}, function ( error ) {
		console.error( error );
	} );

	modelloader.load( '../assets/tree/scene.gltf', function ( gltf ) {
		scene.add(gltf.scene);
		gltf.scene.position.set(-0.5,-0.2,0);
		gltf.scene.scale.set(0.01,0.01,0.01);
	}, function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	}, function ( error ) {
		console.error( error );
	} );


	let angle = 0, radius = 4.7;


        // Set animation loop
        renderer.setAnimationLoop((time) => {
            	renderer.render(scene, camera);
		lightTwo.position.x = radius * Math.cos(angle) + 0.5;
		lightTwo.position.y = radius * Math.sin(angle);
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
		angle += Math.PI/180;
        });

});

