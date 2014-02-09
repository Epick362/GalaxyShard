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
		planets[i] = new PlanetBody({x: 0, y: 0, z: 0}, data.planets[i]);
		solarsystem.add(planets[i].createPlanet());
	};

	scene.add(solarsystem);
}