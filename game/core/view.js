View = function(mode, data) {
	this.mode = mode;
	this.data = data;
	this.env = new Environment(this.data);

	this.InitializeWorld = function() {
		this.initialize = new Initialize(this.mode, this.data);
		return this.initialize.init();
	};

	this.UpdateWorld = function() {
		this.update = new Update();
		return this.update.init();
	};
};

Initialize = function(mode, data) {
	this.mode = mode;
	this.data = data;
	this.objectContainer = new THREE.Object3D();

	this.init = function() {
		console.log(this.mode);
		switch(this.mode) {
			case 0: return this.Orbital();
			break;

			case 1: 
				console.log('kol');
				return this.System();
			break;

			case 2: return this.Galaxy();
			break;
		}
	};

	this.Orbital = function() {

	};

	this.System = function() {
		this.objectContainer.add(this.env.Skybox())
		this.objectContainer.add(this.env.StarDebris())
		this.objectContainer.add(this.env.SolarSystem())

		player = {};
		player.name = prompt('enter name');

		// Actual Ship
		var shipContainer = new THREE.Object3D();
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
			bounding.add(shipContainer);
			bounding.name = player.name+"\'s Ship";
			
			this.objectContainer.add(bounding)
			bounding.setAngularFactor(new THREE.Vector3(0, 0, 0));
			socket.emit('fetch.players');
		});	

		return this.objectContainer;
	};

	this.Galaxy = function() {
		
	};
};
Initialize.prototype = new View();

Update = function(mode, data) {
	this.mode = mode;
	this.data = data;
	this.init = function() {
		switch(this.mode) {
			case 0: return this.Orbital();
			break;

			case 1: return this.System();
			break;

			case 2: return this.Galaxy();
			break;
		}
	};

	this.Orbital = function() {
		
	};

	this.System = function() {
		this.env.update()
	};

	this.Galaxy = function() {
		
	};
};
Update.prototype = new View();
/*
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

function updateSystemView() {
	//updateGyro();

	/*------------------------------
	 * Socket fetch players
	 *------------------------------*/
/*
	socket.on('fetch.players', function(data) {
		var players = data;
		console.log(players);
		for (var i in players) {
			p = players[i];
			ships[i] = new THREE.Object3D();
			loadShip(function(object3d){
				ships[i].add(object3d)
			}, p.ship);

			console.log('Player:'+p.name+' '+p.x+' '+p.y+' '+p.z);
			scene.add(ships[i]);
			ships[i].position.set(p.x, p.y, p.z);
		}
	});
	env.update();
}
*/