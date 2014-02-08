Ship = function(data, name, model) {
	this.name = name;
	this.model = model;
}

Ship.prototype = new Entity();