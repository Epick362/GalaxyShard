Player = function(name, data) {
	this.name = name;
	this.data = data;

	this.ui = new UI(this.data);

	var shipContainer = new THREE.Object3D();

	var bounding = new Physijs.SphereMesh(
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

	this.createShip = function(scene, camera, renderer) {
		ship = new Ship(this.data, this.name);

		ship.loadModel(function(object3d) {
			shipContainer.add(object3d)
		});

		bounding.position.set(this.data.position.x, this.data.position.y, this.data.position.z);
		bounding.rotation.set(this.data.rotation.x, this.data.rotation.y, this.data.rotation.z);
		bounding.add(shipContainer);
		bounding.name = this.name;
		
		this.controls = new THREE.PlayerControls(bounding, scene, shipContainer, camera, renderer.domElement);
		this.controls.minDistance = 0.1;

		this.ui.create();

		socket.emit('fetch.players');
	}

	this.syncPlayer = function() {
		socket.emit('player.move', {
			name: this.name, 
			position: {x: bounding.position.x, y: bounding.position.y, z: bounding.position.z},
			rotation: {x: bounding.rotation.x, y: bounding.rotation.y, z: bounding.rotation.z}
		});
	}
 
	this.getShip = function() {
		return bounding;
	}

	this.update = function(delta) {
		if(this.controls) {
			this.controls.update();
			this.ui.update({velocity: this.controls.getVelocity()});
		}
	}
};