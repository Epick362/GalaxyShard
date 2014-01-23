// Created by Bjorn Sandvik - thematicmapping.org
var width  = window.innerWidth,
	height = window.innerHeight;

// Earth params
var radius   = 0.5,
	segments = 64,
	rotation = 6,
	coordinates = [10, 0, 10];  

var gradientCanvas;
var gradientImage;

var webglEl = document.getElementById('webgl');

function start(e) {
	if (!Detector.webgl) {
		Detector.addGetWebGLMessage(webglEl);
		return;
	}

	gradientImage = document.createElement('img');
	gradientImage.onload = postStarGradientLoaded;
	gradientImage.src = 'images/star_color_modified.png';	
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

	camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
	camera.position.set(coordinates[0] + 1.5, coordinates[1] + 1, coordinates[2] + 1.5);

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(width, height);

	scene.add(new THREE.AmbientLight(0x333333));

	star = addStarToScene(.5, 32, [0, 0, 0], null);
	//scene.add(star)

	planet = addPlanetToScene(radius, segments, coordinates, true);
	scene.add(planet)

	stars = createStars(400, 64);
	scene.add(stars);

	sun = makeSun(
	 	{
	 		radius: 2,
	 		spectral: 1
	 	}
	 );
	scene.add(sun);
	sun.position.set(0, 0, 0);

	axisHelper = new THREE.AxisHelper( 8 );
	scene.add( axisHelper );

	controls = new THREE.TrackballControls(camera);
	controls.target.set(coordinates[0], coordinates[1], coordinates[2]);

	webglEl.appendChild(renderer.domElement);

	render();
}

function render() {
	renderer.clear();

	controls.update();
	planet.rotation.y += 0.0005;	
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

function createStar(radius, segments) {
	return new THREE.Mesh(
		new THREE.SphereGeometry(radius, segments, segments),
		new THREE.MeshPhongMaterial({
			map:         THREE.ImageUtils.loadTexture('images/sunmap.jpg')				
		})
	);		
}

function addStarToScene(radius, segments, position, luminosity) {
	var star = new THREE.Object3D();

	var light = new THREE.PointLight(0xffffff, 1, 200);
	star.add(light)

	var object = createStar(radius, segments);
	star.add(object);
	star.position.set(position[0], position[1], position[2]);

	return star;
}

function createPlanet(radius, segments) {
	return new THREE.Mesh(
		new THREE.SphereGeometry(radius, segments, segments),
		new THREE.MeshPhongMaterial({
			map:         THREE.ImageUtils.loadTexture('images/2_no_clouds_4k.jpg'),
			bumpMap:     THREE.ImageUtils.loadTexture('images/elev_bump_4k.jpg'),
			bumpScale:   0.01,
			specularMap: THREE.ImageUtils.loadTexture('images/water_4k.png'),
			specular:    new THREE.Color('grey')								
		})
	);
}

function createClouds(radius, segments) {
	return new THREE.Mesh(
		new THREE.SphereGeometry(radius + 0.003, segments, segments),			
		new THREE.MeshPhongMaterial({
			map:         THREE.ImageUtils.loadTexture('images/fair_clouds_4k.png'),
			transparent: true
		})
	);		
}

function addPlanetToScene(radius, segments, position, withclouds) {
	var planet = new THREE.Object3D();

    var object = createPlanet(radius, segments);
	object.rotation.y = rotation; 
	planet.add(object)

	if(withclouds === true) {
	    var clouds = createClouds(radius, segments);
		clouds.rotation.y = rotation;
		planet.add(clouds)
	}

	planet.position.set(position[0], position[1], position[2]);
	return planet;
}

function createStars(radius, segments) {
	return new THREE.Mesh(
		new THREE.SphereGeometry(radius, segments, segments), 
		new THREE.MeshBasicMaterial({
			map:  THREE.ImageUtils.loadTexture('images/galaxy_starfield.png'), 
			side: THREE.BackSide
		})
	);
}
