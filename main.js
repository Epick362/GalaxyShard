// Created by Bjorn Sandvik - thematicmapping.org
var width  = window.innerWidth,
	height = window.innerHeight;

var solarSystemData = {
	planets : [
		{
			name : "mercury",
			radius : 4879,
			rotation : 12,
			distance : 57.9,
			revolution : 2.2
		},
		{
			name : "venus",
			radius : 12104,
			rotation : 8,
			distance : 108.2,
			revolution : 1.8
		},
		{
			name : "earth",
			radius : 12756,
			rotation : 6,
			distance : 149.6,
			revolution : 2,
			clouds : true,
			orbit : {
				rotation : {
					x: 0,
					y: 0,
					z: 0
				}
			}
		},
		{
			name : "mars",
			radius : 6792,
			rotation : -3,
			distance : 227.9,
			revolution : 2.5
		},
		{
			name : "jupiter",
			radius : 142984,
			rotation : 2,
			distance : 778.6,
			revolution : 1.3
		},
		{
			name : "saturn",
			radius : 120536,
			rotation : 2,
			distance : 1433.5,
			revolution : 1.4
		},
		{
			name : "uranus",
			radius : 51118,
			rotation : 2,
			distance : 2872.5,
			revolution : 1
		},
		{
			name : "neptune",
			radius : 49528,
			rotation : 1,
			distance : 4495.1,
			revolution : 0.8
		}
	],
	stars: [
		{
			name : "sun",
			radius : 7.35144e9,
			spectral : 0.95
		}
	],
	env: "env05"
};

var viewMode = 1; // 0 = Orbital / 1 = System / 2 = Galaxy 

var gradientCanvas;
var gradientImage;

var ships = {};
var players = {};
var clock = new THREE.Clock();

var cameraMaxDistance = 100000;

var startTime = Date.now();
var shaderTiming = 0;

Physijs.scripts.worker = 'game/js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

THREE.PlayerControls.prototype = Object.create(THREE.EventDispatcher.prototype);

var view = new View(viewMode, solarSystemData);

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

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);

	scene.add(new THREE.AmbientLight(0x444444));

	socket = io.connect('http://localhost:8080');

	scene.add(view.InitializeWorld());


	player = {};
	player.name = prompt('enter name');

	// Actual Ship
	shipContainer = new THREE.Object3D();
	//ship.position.set(0, 3, 0);

	bounding = new Physijs.SphereMesh(
		new THREE.SphereGeometry(.01, 64, 64),
		Physijs.createMaterial(
			new THREE.Material({
				opacity: 0
			}),
			1.0, // high friction
			0.0 // low restitution
		),
		0.1
	);

	socket.emit('connect', {'name': player.name});
	socket.on('connected', function(data) {
		ship = new Ship(data, player.name, data.ship);

		ship.loadModel(function(object3d) {
			shipContainer.add(object3d)
		});

		bounding.position.set(data.position.x, data.position.y, data.position.z);
		bounding.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
		bounding.add(shipContainer);
		bounding.name = player.name+"\'s Ship";
		
		scene.add(bounding)
		bounding.setAngularFactor(new THREE.Vector3(0, 0, 0));
		socket.emit('fetch.players');
	});	

	setInterval(function(){
		socket.emit('player.move', {
						name: player.name, 
						position: {x: bounding.position.x, y: bounding.position.y, z: bounding.position.z},
						rotation: {x: bounding.rotation.x, y: bounding.rotation.y, z: bounding.rotation.z}
					});
		console.log("sync player position");
	}, 2500);

	controls = new THREE.PlayerControls(bounding, scene, shipContainer, camera, renderer.domElement);
	controls.minDistance = 0.1;

	stats = new Stats();
	stats.setMode(0); // 0: fps, 1: ms
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';	
	document.body.appendChild( stats.domElement );	

	webglEl.appendChild(renderer.domElement);

	window.addEventListener('resize', onWindowResize, false );
	
    scene.simulate();
	render();
}

function render() {
	renderer.clear();

	shaderTiming = (Date.now() - startTime )/ 1000;

    var delta = clock.getDelta();
    if (controls) controls.update(delta);

    view.UpdateWorld();

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
