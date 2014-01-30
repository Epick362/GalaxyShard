function setupOrbitalView() {
	planet = solarSystemData.planets[6];

	makeDebris();
	makeBackground(cameraMaxDistance, 'env02');
	// Camera Settings
	camera.position.set(KMToLY(planet.radius) * 15, 0, KMToLY(planet.radius) * 15);
	controls.minDistance = KMToLY(planet.radius) * 15;
	controls.target.set(0, 0, 0);

	// Disable orbiting
	planet.orbit = false;
	planet.object = addPlanetToScene(planet);

	scene.add(planet.object);
}

function updateOrbitalView() {
	updatePlanet(planet);
}

function setupSystemView() {
	makeSolarSystem(solarSystemData);
	makeDebris();
	makeBackground(cameraMaxDistance, 'env02');

	// Camera Settings
	camera.position.set(65+0.5, 0, 65+0.5);
	controls.minDistance = 0.05;
	controls.target.set(65, 0, 65);

	// Actual Ship
	ship = new THREE.Object3D();
	loadShip(function(object3d){
		ship.add(object3d)
	}, 'Shuttle01');

	ship.position.set(65, 0, 65);
	scene.add(ship);

	/*------------------------------
	 * Socket fetch players
	 *------------------------------*/

	socket.on('fetch.players',function(data) {
		var players = data;
		for (var i in players) {
			p = players[i];
			console.log('Player: '+ p.name);
		}
	});
}

function updateSystemView() {
	updateGyro();

	for (var i = planets.length - 1; i >= 0; i--) {
		planet = planets[i];
		updatePlanet(planet);

		var time = new Date();
		angle = time * planet.revolution * 0.00001;

		planet.object.position.set(planet.distance * Math.cos(angle), 0, planet.distance * Math.sin(angle));
	};
}