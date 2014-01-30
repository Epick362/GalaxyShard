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

	scene.add(solarsystem);
}

function updatePlanet(planet) {
	planet.object.rotation.y += planet.rotation / 10000;
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

function addPlanetToScene(options) {
	radius = KMToLY(options.radius) * 6;
	rotation = options.rotation;

	var planet = new THREE.Object3D();
	var planetOrbit = new THREE.Object3D();

    var object = createPlanet(radius, options.name);
	object.rotation.y = rotation; 
	planet.add(object)

	if(options.orbit != false) {
		// Create Orbit Lines
		var resolution = 100;
		var amplitude = options.distance;
		var size = 360 / resolution;

		var geometry = new THREE.Geometry();
		var material = new THREE.LineBasicMaterial( { color: options.orbitColor, opacity: 1.0} );
		for(var i = 0; i <= resolution; i++) {
		    var segment = ( i * size ) * Math.PI / 180;
		    geometry.vertices.push( new THREE.Vector3( Math.cos( segment ) * amplitude, 0, Math.sin( segment ) * amplitude ) );         
		}

		var line = new THREE.Line( geometry, material );
		scene.add(line);
		// Create Orbit Lines END

		planet.position.x = options.distance;
	}

	return planet;
}