loadShip = function(onLoad, name){
	var loader	= new THREE.OBJMTLLoader();
	loader.addEventListener('load', function( event ){
			var object3d	= event.content
			object3d.scale.multiplyScalar(1/10000)
			// change emissive color of all object3d material - they are too dark
			object3d.traverse(function(object3d){
				if( object3d.material ){
					object3d.material.emissive.set(0x555555)
					object3d.material.ambient.set('white')
					object3d.material.specular.set(0xFF4400)
				}
			})
			// notify the callback
			onLoad	&& onLoad(object3d)
		});
	var objUrl	= 'game/models/'+name+'/'+name+'.obj';
	var mtlUrl	= 'game/models/'+name+'/'+name+'.mtl';
	loader.load(objUrl, mtlUrl);
};