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
	env = new Environment(solarSystemData);
	scene.add(env.Skybox())
	scene.add(env.StarDebris())
	scene.add(env.SolarSystem())

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

		bounding.position.set(data.x, data.y, data.z);
		//controls.center = new THREE.Vector3(data.x, data.y, data.z);
		//scene.add(ship);
		bounding.add(shipContainer);
		bounding.name = player.name+"\'s Ship";

		setInterval(function(){
			socket.emit('player.move', {name: player.name, position: {x: bounding.position.x, y: bounding.position.y, z: bounding.position.z}});
		}, 3000);
		
		scene.add(bounding);
		bounding.setAngularFactor(new THREE.Vector3(0, 0, 0));
		socket.emit('fetch.players');
	});
}

function updateSystemView() {
	//updateGyro();

	/*------------------------------
	 * Socket fetch players
	 *------------------------------*/

	socket.on('fetch.players', function(data) {
		var players = data;
		console.log(players);
		for (var i in players) {
			p = players[i];
			//ships[i] = new THREE.Object3D();
			//loadShip(function(object3d){
			//	ships[i].add(object3d)
			//}, p.ship);

			console.log('Player:'+p.name+' '+p.x+' '+p.y+' '+p.z);
			//scene.add(ships[i]);
			//ships[i].position.set(p.x, p.y, p.z);
		}
	});

	env.update();
}