UI = function(data) {
	this.data = data;
	var speedEl = $('#currentSpeed');

	this.create = function() {
		$(".dial").knob({
			'min': 0,
			'max': this.data.maxSpeed.toFixed(2) * 100,
			'thickness' : 0.4,
			'angleOffset' : -125,
			'angleArch' : 250,
			'fgColor' : 0xFF9045,
			'bgColor' : 0x3D3D3D
        });
        $(".dial").fadeIn("slow");
	};

	this.update = function(updateData) {
		this.data.velocity = updateData.velocity;
		this.updateSpeed();
	};

	this.updateSpeed = function() {
		speedEl.val(this.data.velocity.toFixed(2) * 100).trigger('change');
	}
};