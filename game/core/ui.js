UI = function(data) {
	this.data = data;
	var speedEl = $('#currentSpeed');

	this.update = function(updateData) {
		this.data.velocity = updateData.velocity;
		this.updateSpeed();
	};

	this.updateSpeed = function() {
		speedEl.val(this.data.velocity.toFixed(2) * 100).trigger('change');
	}
};