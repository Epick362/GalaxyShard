var io = require('socket.io').listen(8080);

/*------------------------------
 * Player class
 *------------------------------*/
function Player(name, x, y, z, ship) {
	this.name = name;
	this.x = x;
	this.y = y;
	this.z = z;
	this.ship = ship;
}

var players = {};

// Establish DB connection
var db = require('monk')('localhost/galaxyshard')
  , users = db.get('ships')

io.sockets.on('connection', function (socket) {
	//hash of players active
	
	socket.on('connect', function(data) {
		users.findOne({name: data.name}).on('success', function (ship) {
			console.log('Connected:' +data.name);
			players[data.name] = new Player(data.name, ship.x, ship.y, ship.z, ship.ship);
			socket.emit('connected', ship);			
		});
	});
	

	socket.on('player.move', function (data) {
		players[data.name].x = data.position.x;
		players[data.name].y = data.position.y;
		players[data.name].z = data.position.z;
/*
		ships.updateById(players[data.name].id, {x: players[data.name].x, y: players[data.name].y, z: players[data.name].z}, function (err, doc) {
			if (err) throw err;
		});
*/
  	});

  	/*------------------------------
  	 * Fetch players
  	 *------------------------------*/
  	socket.on('fetch.players', function(data) {
		io.sockets.emit('fetch.players', players);
  	});
});
