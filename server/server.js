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

var databaseUrl = "galaxyshard"; // "username:password@example.com/mydb"
var collections = ["ships"];
var db = require("mongojs").connect(databaseUrl, collections);

io.sockets.on('connection', function (socket) {
	//hash of players active
	
	socket.on('connect', function(data) {
		console.log('Connected:' +data.name);

		db.ships.find({name: data.name}, function(err, ships) {
			if(!err && ships) {
				players[data.name] = new Player(data.name, ships[0].x, ships[0].y, ships[0].z, ships[0].ship);
				socket.emit('connected', ships[0]);
			}else{
				console.log('error');
			}
		});
	});
	

	socket.on('player.move', function (data) {
		players[data.name].x = data.x;
		players[data.name].y = data.y;
		players[data.name].z = data.z;

  	});

  	/*------------------------------
  	 * Fetch players
  	 *------------------------------*/
  	socket.on('fetch.players', function(data) {
		socket.emit('fetch.players', players);
  	});

});