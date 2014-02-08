Ship = function(data, name, model) {
	this = data;
	this.name = name;
	this.model = model;
}

Ship.prototype = new Entity();