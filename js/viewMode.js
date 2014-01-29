function setupSystemView() {
	makeSolarSystem(solarSystemData);
	makeDebris();
	makeBackground(cameraMaxDistance, 'env02');

	// Camera Settings
	camera.position.set(65+0.5, 0, 65+0.5);
	controls.minDistance = 0.05;
	controls.target.set(65, 0, 65);

	// Axis Helper
	axisHelper = new THREE.AxisHelper( 20 );
	scene.add( axisHelper );
	axisHelper.position.set(65, 0, 65);

	// Actual Ship
	ship = new THREE.Object3D();
	loadShip(function(object3d){
		ship.add(object3d)
	}, 'Shuttle01');
	ship.position.set(65, 0, 65);
	scene.add(ship);
}