function makeSolarSystem(){
	var solarSystem = new THREE.Object3D();

	//var oortCloud = makeOortCloud();
	//solarSystem.add( oortCloud );

	// var kuiperBelt = makeKuiperBelt();
	// solarSystem.add( kuiperBelt );

	// represent the orbit path of planetry bodies in the solar system
	//	use kilometers and convert to light years
	//	mercury
	//var mercuryOrbit = createSpaceRadius( KMToLY(55000000), /*0x90745D*/ 0xffffff );
	//solarSystem.add( mercuryOrbit );
	var mercury = createPlanet( 55000000, 2439.7 );
	solarSystem.add( mercury );

	//	venus
	//var venusOrbit = createSpaceRadius( KMToLY(108000000), /*0x9E4738*/ 0xffffff );
	//solarSystem.add( venusOrbit );
	var venus = createPlanet( 108000000, 6051.8 );
	solarSystem.add( venus );

	//	earth
	//var earthOrbit = createSpaceRadius( KMToLY(150000000), /*0x887F98*/ 0xffffff );
	//solarSystem.add( earthOrbit );

	var earth = createPlanet( 150000000, 6378.1 );
	solarSystem.add( earth );

	//	the moon? sure why not...
	// you can't even see it...
	//earth.add( createSpaceRadius( KMToLY(402652), 0xffffff, 16.0 ) );

	//	mars
	//solarSystem.add( createSpaceRadius( KMToLY(230000000), /*0xCE6747*/ 0xffffff ) );	
	var mars = createPlanet( 230000000, 3396.2 );
	solarSystem.add( mars );

	//	jupiter
	//solarSystem.add( createSpaceRadius( KMToLY(778000000), /*0xCE6747*/ 0xffffff ) );
	var jupiter = createPlanet( 778000000, 71492.2 );
	solarSystem.add( jupiter );

	//	saturn
	//solarSystem.add( createSpaceRadius( KMToLY(1400000000), /*0xCE6747*/ 0xffffff ) );
	var saturn = createPlanet( 1400000000, 60268 );
	solarSystem.add( saturn );

	//	uranus
	//solarSystem.add( createSpaceRadius( KMToLY(3000000000), /*0xCE6747*/ 0xffffff ) );
	var uranus = createPlanet( 3000000000, 25559 );
	solarSystem.add( uranus );

	//	neptune
	//solarSystem.add( createSpaceRadius( KMToLY(4500000000), /*0xCE6747*/ 0xffffff ) );
	var neptune = createPlanet( 4500000000, 24764  );
	solarSystem.add( neptune );

	solarSystem.dynamic = true;

	//oortCloud.update = function(){
	//	if( camera.position.z > 40 && camera.position.z < 600 )
	//		this.visible = true;
	//	else
	//		this.visible = false;
	//}

	//makeSunEarthDiagram();

	//	pluto?
	//	still not a planet	
	return solarSystem;
}

function createPlanet( distanceToSunKM, radiusKM ){
	var planetGeo = new THREE.SphereGeometry( KMToLY( radiusKM ), 12, 8 );
	var planet = new THREE.Mesh( planetGeo );
	planet.position.x = KMToLY(distanceToSunKM);
	return planet;	
}