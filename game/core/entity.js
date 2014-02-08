Entity = function(data) {
	this.data = data;
	// Server-side velocity, is not sent to the client
	this.velocity = new THREE.Vector3();

	// a normalized vector pointing in the direction the entity is heading.
	this.heading = new THREE.Vector3();

	//a vector perpendicular to the heading vector
	this.side = new THREE.Vector3();

	// Make additional properties
	if(this.data) {
		this.position = new THREE.Vector3(this.data.x, this.data.y, this.data.z);	
	}
	this.localPosition = new THREE.Vector3();

	/*
	this.rotx = this.rotx === undefined ? 0 : this.rotx;
	this.roty = this.roty === undefined ? 0 : this.roty;
	this.rotz = this.rotz === undefined ? 0 : this.rotz;

	this.rotation = new THREE.Vector3(this.rotx, this.roty, this.rotz);
	*/
	this.loadModel = function(onLoad){
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
		var objUrl	= 'game/models/'+this.model+'/'+this.model+'.obj';
		var mtlUrl	= 'game/models/'+this.model+'/'+this.model+'.mtl';
		loader.load(objUrl, mtlUrl);
	};
}