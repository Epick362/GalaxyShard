var io = require('socket.io').listen(8080);

/*------------------------------
 * Player class
 *------------------------------*/
function Player(name, x, y) {
	this.name = name;
	this.x = x;
	this.y = y;
}

var players = {};

var databaseUrl = "galaxyshard"; // "username:password@example.com/mydb"
var collections = ["ships"];
var db = require("mongojs").connect(databaseUrl, collections);

io.sockets.on('connection', function (socket) {
	//hash of players active
	
	socket.on('connect', function(data) {
		players[data.name] = new Player(data.name, 65, 65);
		console.log('Connected:' +data.name);

		db.ships.find({name: "Epick"}, function(err, ships) {
		  if(ships) {
		  	return ships[0];
		  }else{
		  	return 'error';
		  }
		});
	});
	

	socket.on('player.move', function (data) {
		players[data.name].x = data.x;
		players[data.name].y = data.y;

  	});

  	/*------------------------------
  	 * Fetch players
  	 *------------------------------*/
  	socket.on('fetch.players', function(data) {
		socket.emit('fetch.players', players);
  	});

});