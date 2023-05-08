// Import three
import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';
// Import the default VRButton
import { VRButton } from 'https://unpkg.com/three@0.152.2/examples/jsm/webxr/VRButton.js';

window.addEventListener("DOMContentLoaded", () => {
        // Make a new scene
        let scene = new THREE.Scene();

        // Make a camera. note that far is set to 100, which is better for realworld sized environments
        let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 1.6, 3);
        scene.add(camera);

        // Add some lights
        var light = new THREE.DirectionalLight(0xffffff,0.5);
        light.position.set(1, 1, 1).normalize();
        scene.add(light);

        scene.add(new THREE.AmbientLight(0xffffff,0.5))

        // Make a red cube
        let cube = new THREE.Mesh(
            new THREE.BoxBufferGeometry(1,1,1),
            new THREE.MeshLambertMaterial({color:'red'})
        );
        cube.position.set(0, 1.5, -1);
        scene.add(cube);

        // Make a renderer that fills the screen
        let renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        // Turn on VR support
        renderer.xr.enabled = true;
        // Add canvas to the page
        document.body.appendChild(renderer.domElement);

        // Add a button to enter/exit vr to the page
        document.body.appendChild(VRButton.createButton(renderer));

        // For AR instead, import ARButton at the top
        //    import { ARButton } from 'https://unpkg.com/three/examples/jsm/webxr/ARButton.js';
        // then create the button
        //  document.body.appendChild(ARButton.createButton(renderer));

        // Set animation loop
        renderer.setAnimationLoop((time) => {
            // Rotate the cube
            cube.rotation.y = time / 1000;
            // Draw everything
            renderer.render(scene, camera);
        });

        // Handle browser resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);
});

