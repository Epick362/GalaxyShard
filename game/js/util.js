function toTHREEColor( colorString ){
	return new THREE.Color( parseInt( colorString.substr(1) , 16)  );
}

var monthNames = new Array(12);
monthNames[0] = "January";
monthNames[1] = "February";
monthNames[2] = "March";
monthNames[3] = "April";
monthNames[4] = "May";
monthNames[5] = "June";
monthNames[6] = "July";
monthNames[7] = "August";
monthNames[8] = "September";
monthNames[9] = "October";
monthNames[10] = "November";
monthNames[11] = "December";			

function toMonthName( monthNumber ){
	return monthNames[monthNumber];
}	

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function gup( name )
{
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );
	if( results == null )
	return "";
	else
	return results[1];
}

function wrap(value, min, rangeSize) {
	rangeSize-=min;
    while (value < min) {
    	value += rangeSize;
	}
	return value % rangeSize;
}

THREE.Curve.Utils.createLineGeometry = function( points ) {
	var geometry = new THREE.Geometry();
	for( var i = 0; i < points.length; i ++ ) {
		geometry.vertices.push( points[i] );
	}
	return geometry;
};

function getAbsOrigin( object3D ){
	var mat = object3D.matrixWorld;
	var worldpos = new THREE.Vector3();
	worldpos.x = mat.n14;
	worldpos.y = mat.n24;
	worldpos.z = mat.n34;
	return worldpos;
}

var projector = new THREE.Projector();
function screenXY(object){	
  var vector = projector.projectVector(new THREE.Vector3().getPositionFromMatrix(object.matrixWorld), camera);  
	var result = new Object();
    var windowWidth = window.innerWidth;
    var minWidth = 1280;
    if(windowWidth < minWidth) {
        windowWidth = minWidth;
    }
	result.x = Math.round( vector.x * (windowWidth/2) ) + windowWidth/2;
	result.y = Math.round( (0-vector.y) * (window.innerHeight/2) ) + window.innerHeight/2;
	return result;
}	

function buildHexColumnGeo(rad, height){
	var points = [];
	var ang = 0;
	var sixth = 2*Math.PI / 6;
	for(var i=0; i<7; i++){					
		var x = Math.cos(ang) * rad;
		var y = -Math.sin(ang) * rad;
		points.push( new THREE.Vector2(x,y) );
		ang += sixth;
	}
	var shape = new THREE.Shape(points);

	var options = {
		size: 			0,
		amount: 		height,
		steps: 			1,
		bevelEnabled:  	false,
	};
	var extrudedGeo = new THREE.ExtrudeGeometry(shape, options);
	return extrudedGeo;	    	
}

 function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function roundNumber(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

function wrap(value, min, rangeSize) {
  rangeSize-=min;
    while (value < min) {
      value += rangeSize;
  }
  return value % rangeSize;
}

function constrain(v, min, max){
  if( v < min )
    v = min;
  else
  if( v > max )
    v = max;
  return v;
}

function random(low, high) {
  if (low >= high) return low;
  var diff = high - low;
  return (Math.random() * diff) + low;
}

function map( value, istart, istop, ostart, ostop) {
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}