var scene, camera, renderer;

var arToolkitSource, arToolkitContext;

window.addEventListener("DOMContentLoaded", () => {

	scene = new THREE.Scene();

	let ambientLight = new THREE.AmbientLight( 0xcccccc, 0.5 );
	scene.add( ambientLight );
				
	camera = new THREE.Camera();
	scene.add(camera);

	renderer = new THREE.WebGLRenderer({
		antialias : true,
		alpha: true
	});

	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild( renderer.domElement );

	////////////////////////////////////////////////////////////
	// setup arToolkitSource
	////////////////////////////////////////////////////////////

	arToolkitSource = new THREEx.ArToolkitSource({
		// type of source - ['webcam', 'image', 'video']
		sourceType: "webcam",
		// url of the source - valid if sourceType = image|video
		sourceUrl: null,

		// resolution of at which we initialize the source image
		sourceWidth: 1280,
		sourceHeight: 720,
		// resolution displayed for the source
		displayWidth: 1280,
		displayHeight: 720	
	});

	arToolkitSource.init(onResize);
	
	// handle resize event
	window.addEventListener('resize', onResize);
	
	////////////////////////////////////////////////////////////
	// setup arToolkitContext
	////////////////////////////////////////////////////////////	

	// create atToolkitContext
	arToolkitContext = new THREEx.ArToolkitContext({
		// debug - true if one should display artoolkit debug canvas, false otherwise
		debug: false,
		// url of the camera parameters
		cameraParametersUrl: '../ar/camera_para.dat',
		// the mode of detection - ['color', 'color_and_matrix', 'mono', 'mono_and_matrix']
		detectionMode: 'mono',
		// type of matrix code - valid iif detectionMode end with 'matrix' - [3x3, 3x3_HAMMING63, 3x3_PARITY65, 4x4, 4x4_BCH_13_9_3, 4x4_BCH_13_5_5]
		//matrixCodeType: '3x3',
		// Pattern ratio for custom markers
		//patternRatio: 0.5,
		// Labeling mode for markers - ['black_region', 'white_region']
		// black_region: Black bordered markers on a white background, white_region: White bordered markers on a black background
		//labelingMode: 'black_region',
		// tune the maximum rate of pose detection in the source image
		//maxDetectionRate: 60,
		// resolution of at which we detect pose in the source image
		canvasWidth: 1280,
		canvasHeight: 720,
		// enable image smoothing or not for canvas copy - default to true
		// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled
		imageSmoothingEnabled : true,
	});
	
	// copy projection matrix to camera when initialization complete
	arToolkitContext.init( () => {
		camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
	});

	////////////////////////////////////////////////////////////
	// setup markerRoots
	////////////////////////////////////////////////////////////

	let loader = new THREE.TextureLoader();
	let texture = loader.load( '../assets/plants.jpg' );
		
	let patternArray = ["pattern-letterA.patt", "pattern-letterB.patt", "pattern-letterC.patt", "pattern-letterD.patt", "pattern-letterF.patt", "pattern-letterG.patt", "pattern-kanji.patt", "pattern-hiro.patt"];

	for (let i = 0; i < patternArray.length; i++)
	{
		let markerRoot = new THREE.Group();
		scene.add(markerRoot);
		let markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
			type : 'pattern', 
			patternUrl : "../assets/" + patternArray[i]
		});
	
		let mesh = new THREE.Mesh( 
			new THREE.BoxGeometry(1,1,1), 
			new THREE.MeshBasicMaterial({color:Math.random()*0xffffff, map:texture, transparent:true, opacity:0.5}) 
		);
		mesh.position.y = 1/2;
		markerRoot.add( mesh );
	}

	requestAnimationFrame(animate);
});


function onResize()
{
	arToolkitSource.onResizeElement();
	arToolkitSource.copyElementSizeTo(renderer.domElement);
	if ( arToolkitContext.arController !== null )
		arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
}


function animate()
{
	requestAnimationFrame(animate);
	// update artoolkit on every frame
	if ( arToolkitSource.ready !== false )
		arToolkitContext.update( arToolkitSource.domElement );
	renderer.render( scene, camera );
}

