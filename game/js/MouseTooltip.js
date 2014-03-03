THREE.MouseTooltip = function (o) {

    Object.call(this);

    var defaults = { // default options                
        ResourcesPath: "", // Location of ressoruce file
        ImagesPath: "",
        Scene: null,
        Container: null
    };

    this.options = $.extend(defaults, o); // merge defaults and options object 

    if (this.options.Scene == null || this.options.Container == null) {
        throw "Error : MouseTooltip scene and container inputs must be specified";
        return;
    }
    this.canvas = null;
    this.context = null;
    this.texture = null;
    this.material = null;
    this.mesh = null;
    this.width = 0;
    this.updateDisplay = false;
    this.init(this.options.Scene);

 };

 THREE.MouseTooltip.prototype = Object.create(Object.prototype);

 THREE.MouseTooltip.prototype.init = function (scene) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.options.Container.offsetWidth;
    this.canvas.height = this.options.Container.offsetHeight;
    this.context = this.canvas.getContext('2d');
    this.context.font = "20px Arial";
    this.context.fillStyle = "rgba(0,0,0,0.95)";
    this.context.fillText('', 0, 20);
    this.width = 20;
    this.texture = new THREE.Texture(this.canvas);
    this.texture.needsUpdate = true;

    this.material = new THREE.SpriteMaterial({ map: this.texture/*, useScreenCoordinates: true, alignment: THREE.SpriteAlignment.topLeft */});

    this.mesh = new THREE.Sprite(this.material);
    this.mesh.name = "tooltip";
    this.mesh.scale.set(this.canvas.width/1.5, this.canvas.height/1.5, 1.0);
    this.mesh.material.depthTest = false;
    this.mesh.material.transparent = false;
    this.mesh.matrixAutoUpdate = false;    
    this.mesh.visible = false;
    this.mesh.userData = "";
    scene.add(this.mesh);
};

THREE.MouseTooltip.prototype.setContent = function (message) {
    if (message == this.mesh.userData) {
       return;
    }
    var metrics = this.context.measureText(message);
    var lineHeight = 20;
    this.width = metrics.width + 8;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = "rgba(0,0,0,1)"; // black border
    this.context.beginPath();
    this.context.moveTo(0, (lineHeight + 8) / 2);
    this.context.lineTo(10, (lineHeight + 8) / 2 + 10);
    this.context.lineTo(10, (lineHeight + 8) / 2 - 10);
    this.context.lineTo(0, (lineHeight + 8) / 2);
    this.context.fill();
    this.context.closePath();

    this.context.fillRect(12, 0, this.width, lineHeight + 8);
    this.context.fillStyle = "rgba(255,255,255,1)"; // white filler
    this.context.fillRect(14, 2, this.width - 4, lineHeight + 4);
    this.context.fillStyle = "rgba(0,0,0,1)"; // text color
    this.context.fillText(message, 16, lineHeight);
    this.mesh.userData = message;
    this.texture.needsUpdate = true;
};

THREE.MouseTooltip.prototype.isVisible = function (b) {
    return this.mesh.visible;
};

THREE.MouseTooltip.prototype.hide = function (b) {
    this.mesh.visible = false;
};

THREE.MouseTooltip.prototype.show = function (b) {
   this.mesh.visible = true;
};

THREE.MouseTooltip.prototype.clear = function () {
   this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
   this.texture.needsUpdate = true;
};

THREE.MouseTooltip.prototype.move = function (mouseX, mouseY) {
    this.mesh.position.x = (mouseX - this.options.Container.offsetLeft+16) - this.canvas.width;
    this.mesh.position.y = (mouseY - this.options.Container.offsetTop) -   this.canvas.height;
    this.mesh.position.z = 1;
};