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

	let markerRootHiro = new THREE.Group();
	scene.add(markerRootHiro);
		
	let markerRootKanji = new THREE.Group();
	scene.add(markerRootKanji);

	let markerControlsHiro = new THREEx.ArMarkerControls(arToolkitContext, markerRootHiro, {
		type : 'pattern', patternUrl : "../assets/pattern-hiro.patt"
	});
	
	let markerControlsKanji = new THREEx.ArMarkerControls(arToolkitContext, markerRootKanji, {
		type : 'pattern', patternUrl : "../assets/pattern-kanji.patt"
	});
	

	const boxgeometry = new THREE.BoxGeometry( 1, 1, 1 );

	const boxmaterials = [
		new THREE.MeshBasicMaterial( { map: loader.load( '../assets/cube1.png') } ),
		new THREE.MeshBasicMaterial( { map: loader.load( '../assets/cube2.png') } ),
		new THREE.MeshBasicMaterial( { map: loader.load( '../assets/cube3.png') } ),
		new THREE.MeshBasicMaterial( { map: loader.load( '../assets/cube4.png') } ),
		new THREE.MeshBasicMaterial( { map: loader.load( '../assets/cube5.png') } ),
		new THREE.MeshBasicMaterial( { map: loader.load( '../assets/cube6.png') } ),
	];

	const cube = new THREE.Mesh( boxgeometry, boxmaterials );

	markerRootHiro.add(cube);

	const cylgeometry = new THREE.CylinderGeometry( 0.5, 0.5, 2.0, 32 );
	const cylmaterial = new THREE.MeshLambertMaterial( {color: 0xffff00} );
	const cylinder = new THREE.Mesh( cylgeometry, cylmaterial );
	cylinder.position.z=-2.5;
	cylinder.position.x=5.0;

	markerRootHiro.add(cylinder);

	const video = document.getElementById( 'video' );
	video.play();
	const texture = new THREE.VideoTexture( video );
	var planegeometry=new THREE.PlaneGeometry(1.6, 0.9);
	var planematerial=new THREE.MeshBasicMaterial({color:0xffffff, map:texture});
	var planemesh=new THREE.Mesh(planegeometry, planematerial);
	planemesh.rotation.set(-Math.PI/2, 0, 0);
	//planemesh.scale.set(10, 10, 10);

	markerRootKanji.add(planemesh);


//	markerRootKanji.add( ?? );
		


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

