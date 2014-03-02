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


var projector, mouse = { x: 0, y: 0 }, INTERSECTED;
var sprite1;
var canvas1, context1, texture1;

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
	}, 2500);

	controls = new THREE.PlayerControls(bounding, scene, shipContainer, camera, renderer.domElement);
	controls.minDistance = 0.1;

	// initialize object to perform world/screen calculations
	projector = new THREE.Projector();
	
	// when the mouse moves, call the given function
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		
	/////// draw text on canvas /////////

	// create a canvas element
	canvas1 = document.createElement('canvas');
	context1 = canvas1.getContext('2d');
	context1.font = "Bold 20px Arial";
	context1.fillStyle = "rgba(0,0,0,0.95)";
    context1.fillText('Hello, world!', 0, 20);
    
	// canvas contents will be used for a texture
	texture1 = new THREE.Texture(canvas1) 
	texture1.needsUpdate = true;
	
	////////////////////////////////////////
	
	var spriteMaterial = new THREE.SpriteMaterial( { map: texture1, useScreenCoordinates: true } );
	
	sprite1 = new THREE.Sprite( spriteMaterial );
	sprite1.scale.set(200,200,1);
	sprite1.position.set( 0, 10, 0 );
	scene.add( sprite1 );	

	//////////////////////////////////////////	

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
				//INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
			// store reference to closest object as current intersection object
			INTERSECTED = intersects[ 0 ].object;
			// store color of closest object (for later restoration)
			//INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
			// set a new color for closest object
			//INTERSECTED.material.color.setHex( 0xffff00 );
			
			// update text, if it has a "name" field.
			if ( intersects[ 0 ].object.name )
			{
			    context1.clearRect(0,0,640,480);
				var message = intersects[ 0 ].object.name;
				var metrics = context1.measureText(message);
				var width = metrics.width;
				context1.fillStyle = "rgba(0,0,0,0.95)"; // black border
				context1.fillRect( 0,0, width+8,20+8);
				context1.fillStyle = "rgba(255,255,255,0.95)"; // white filler
				context1.fillRect( 2,2, width+4,20+4 );
				context1.fillStyle = "rgba(0,0,0,1)"; // text color
				context1.fillText( message, 4,20 );
				texture1.needsUpdate = true;
			}
			else
			{
				context1.clearRect(0,0,300,300);
				texture1.needsUpdate = true;
			}
		}
	} 
	else // there are no intersections
	{
		// restore previous intersection object (if it exists) to its original color
		if ( INTERSECTED ) 
			//INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
		// remove previous intersection object reference
		//     by setting current intersection object to "nothing"
		INTERSECTED = null;
		context1.clearRect(0,0,300,300);
		texture1.needsUpdate = true;
	}

	renderer.clear();

	shaderTiming = (Date.now() - startTime )/ 1000;

    var delta = clock.getDelta();
    if (controls) controls.update(delta);

    view.UpdateWorld(camera);

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

function onDocumentMouseMove( event ) 
{
	// the following line would stop any other event handler from firing
	// (such as the mouse's TrackballControls)
	// event.preventDefault();

	// update sprite position
	sprite1.position.set( event.clientX, event.clientY - 20, 0 );
	
	// update the mouse variable
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}