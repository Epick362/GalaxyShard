// Created by Bjorn Sandvik - thematicmapping.org
var width  = window.innerWidth,
	height = window.innerHeight;

var solarSystemData = {
		"planets" : [
			{
				"name" : "mercury",
				"radius" : 4879,
				"rotation" : 36,
				"distance" : 57.9 / 5,
				"revolution" : 2.2,
				"orbitColor" : 0x444444
			},
			{
				"name" : "venus",
				"radius" : 12104,
				"rotation" : 6,
				"distance" : 108.2 / 5,
				"revolution" : 1.8,
				"orbitColor" : 0x555555
			},
			{
				"name" : "earth",
				"radius" : 12756,
				"rotation" : 6,
				"distance" : 149.6 / 5,
				"revolution" : 2,
				"clouds" : true,
				"orbitColor" : 0xFF4400
			},
			{
				"name" : "mars",
				"radius" : 6792,
				"rotation" : 6,
				"distance" : 227.9 / 5,
				"revolution" : 2.5,
				"orbitColor" : 0x777777
			},
			{
				"name" : "jupiter",
				"radius" : 142984,
				"rotation" : 6,
				"distance" : 778.6 / 5,
				"revolution" : 1.3,
				"orbitColor" : 0x999999
			},
			{
				"name" : "saturn",
				"radius" : 120536,
				"rotation" : 6,
				"distance" : 1433.5 / 5,
				"revolution" : 1.4,
				"orbitColor" : 0x999999
			},
			{
				"name" : "uranus",
				"radius" : 51118,
				"rotation" : 6,
				"distance" : 2872.5 / 5,
				"revolution" : 1,
				"orbitColor" : 0x999999
			},
			{
				"name" : "neptune",
				"radius" : 49528,
				"rotation" : 6,
				"distance" : 4495.1 / 5,
				"revolution" : 0.8,
				"orbitColor" : 0x999999
			}
		],
		"stars": [
			{
				"name" : "sun",
				"radius" : 7.35144e8,
				"spectral" : 1
			}
		]
	};

var viewMode = 1; // 0 = Orbital / 1 = System / 2 = Galaxy 

var gradientCanvas;
var gradientImage;

var ships = {};
var players = {};
var clock = new THREE.Clock();
var projector, mouse = { x: 0, y: 0 }, INTERSECTED;

var cameraMaxDistance = 100000;

Physijs.scripts.worker = 'game/js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

THREE.PlayerControls.prototype = Object.create(THREE.EventDispatcher.prototype);

//var keyboard = new KeyboardState();

var webglEl = document.getElementById('webgl');

function start(e) {
	if (!Detector.webgl) {
		Detector.addGetWebGLMessage(webglEl);
		return;
	}

	gradientImage = document.createElement('img');
	gradientImage.onload = postStarGradientLoaded;
	gradientImage.src = 'game/images/star_color_modified.png';
}

function postStarGradientLoaded() {
	gradientCanvas = document.createElement('canvas');
	gradientCanvas.width = gradientImage.width;
	gradientCanvas.height = gradientImage.height;
	gradientCanvas.getContext('2d').drawImage( gradientImage, 0, 0, gradientImage.width, gradientImage.height );
	gradientCanvas.getColor = function( percentage ){
		return this.getContext('2d').getImageData(0, 1, 1, 1).data;
	}


	loadShaders( shaderList, function(e){
		//	we have the shaders loaded now...
		shaderList = e;

		initWorld();
	});	
}

function initWorld() {
	scene = new Physijs.Scene();
	scene.addEventListener(
		'update',

	function () {
		scene.simulate();
	});
	scene.setGravity(new THREE.Vector3( 0, 0, 0 ));

	// Camera Settings
	camera = new THREE.PerspectiveCamera(45, width / height, 0.01, cameraMaxDistance);

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(width, height);

	scene.add(new THREE.AmbientLight(0x444444));

	socket = io.connect('http://localhost:8080');

	switch(viewMode) {
		case 0:
			setupOrbitalView();
		break;

		case 1:
			setupSystemView();
		break;

		case 2:
			setupGalaxyView();
		break;
	}

	stats = new Stats();
	stats.setMode(0); // 0: fps, 1: ms
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';	
	document.body.appendChild( stats.domElement );	

	webglEl.appendChild(renderer.domElement);

	window.addEventListener('resize', onWindowResize, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	scene.simulate();
	animate();
}

function animate() {
	requestAnimationFrame(animate);
	update();
	render();
}

function update() {
	// delta = change in time since last call (in seconds)
	var delta = clock.getDelta();
	THREE.AnimationHandler.update(delta);
	if (controls) controls.update(delta);

	// create a Ray with origin at the mouse position
	//   and direction into the scene (camera direction)
	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
	projector.unprojectVector( vector, camera );
	var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	// create an array containing all objects in the scene with which the ray intersects
	var intersects = ray.intersectObjects( scene.children );

	// INTERSECTED = the object in the scene currently closest to the camera 
	//		and intersected by the Ray projected from the mouse position 	
	
	// if there is one (or more) intersections
	if ( intersects.length > 0 )
	{
		// if the closest object intersected is not the currently stored intersection object
		if ( intersects[ 0 ].object != INTERSECTED ) 
		{
			// restore previous intersection object (if it exists) to its original color
			if ( INTERSECTED ) 
				INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
			// store reference to closest object as current intersection object
			INTERSECTED = intersects[ 0 ].object;
			// store color of closest object (for later restoration)
			INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
			// set a new color for closest object
			INTERSECTED.material.color.setHex( 0xffff00 );
		}
	} 
	else // there are no intersections
	{
		// restore previous intersection object (if it exists) to its original color
		if ( INTERSECTED ) 
			INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
		// remove previous intersection object reference
		//     by setting current intersection object to "nothing"
		INTERSECTED = null;
	}
}

function render() {
	renderer.clear();

	switch(viewMode) {
		case 0:
			updateOrbitalView();
		break;

		case 1:
			updateSystemView();
		break;

		case 2:
			setupGalaxyView();
		break;
	}

	renderer.render(scene, camera);

	stats.update();
}

function onDocumentMouseMove( event ) {
	// update the mouse variable
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;	
}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}
