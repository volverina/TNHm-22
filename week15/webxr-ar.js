// Import three
import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';
// Import the default ARButton
import { ARButton } from 'https://unpkg.com/three@0.152.2/examples/jsm/webxr/ARButton.js';

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

        // Add some lights
        scene.add(new THREE.AmbientLight(0xffffff,0.5))
	const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
	scene.add(light);

        // Make a red cube
        let cube = new THREE.Mesh(
            new THREE.BoxGeometry(0.10,0.10,0.10),
            new THREE.MeshLambertMaterial({color:'green'})
        );
        cube.position.set(0, 0.1, -0.3);
        scene.add(cube);

        // Add a button to enter/exit ar to the page
        document.body.appendChild(ARButton.createButton(renderer));

        // Set animation loop
        renderer.setAnimationLoop((time) => {
            renderer.render(scene, camera);
        });

});

