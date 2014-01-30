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

var cameraMaxDistance = 100000;

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
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, width / height, 0.01, cameraMaxDistance);

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(width, height);

	scene.add(new THREE.AmbientLight(0x444444));
	controls = new THREE.TrackballControls(camera);
	controls.maxDistance = cameraMaxDistance / 50;

	socket = io.connect('http://localhost:8080');
	socket.emit('connect', {'name': 'Epick'});

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

	render();
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

	controls.update();
	requestAnimationFrame(render);
	renderer.render(scene, camera);

	stats.update();
}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}
