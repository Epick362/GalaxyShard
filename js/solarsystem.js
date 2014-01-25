var segments = 64;
var planets = [];

function makeSolarSystem(data) {
	solarsystem = new THREE.Object3D();

	// Create stars in solarsystem
	for (var i = data.stars.length - 1; i >= 0; i--) {
		star = makeSun(
		 	{
		 		radius: KMToLY(data.stars[i].radius),
		 		spectral: data.stars[i].spectral
		 	}
		 );
		solarsystem.add(star);
	};

	// Create planets in solarsystem
	for (var i = data.planets.length - 1; i >= 0; i--) {
		planets[i] = data.planets[i];
		planets[i].object = addPlanetToScene(data.planets[i]);
		solarsystem.add(planets[i].object);
	};

	return solarsystem;
}

function updateSolarSystem() {
	updateGyro();

	for (var i = planets.length - 1; i >= 0; i--) {
		planet = planets[i];
		planet.object.rotation.y += planet.rotation / 10000;

		var time = new Date();
		angle = time * planet.revolution * 0.00001;

		planet.object.position.set(planet.distance * Math.cos(angle), 0, planet.distance * Math.sin(angle));
	};
}

function createPlanet(radius, name) {
	if(name == "earth") {
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
	}else{
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/planets/'+name+'map.jpg'),
				specular:    new THREE.Color('grey')					
			})
		);
	}
}

function createClouds(radius) {
	return new THREE.Mesh(
		new THREE.SphereGeometry(radius + radius * 0.003, segments, segments),			
		new THREE.MeshPhongMaterial({
			map:         THREE.ImageUtils.loadTexture('images/fair_clouds_4k.png'),
			transparent: true
		})
	);		
}

function addPlanetToScene(options) {
	radius = KMToLY(options.radius) * 6;
	rotation = options.rotation;

	var planet = new THREE.Object3D();
	var planetOrbit = new THREE.Object3D();

    var object = createPlanet(radius, options.name);
	object.rotation.y = rotation; 
	planet.add(object)

	if(options.clouds && options.clouds === true) {
	    var clouds = createClouds(radius);
		clouds.rotation.y = rotation;
		//planet.add(clouds)
	}

	planet.position.x = options.distance;

	return planet;
}