var io = require('socket.io').listen(8080);

/*------------------------------
 * Player class
 *------------------------------*/
function Player(name, data) {
	this.name = name;
	this.position = data.position;
	this.rotation = data.rotation;
	this.ship = data.ship;
}

var players = {};

// Establish DB connection
var db = require('monk')('localhost/galaxyshard')
  , users = db.get('ships')

io.sockets.on('connection', function (socket) {
	//hash of players active
	
	socket.on('connect', function(data) {
		users.findOne({name: data.name}).success( function (ship) {
			if(ship) {
				console.log('Connected: '+data.name);
				players[data.name] = new Player(data.name, ship);
				socket.emit('connected', ship);	
			}else{
				var p = {
					position: {x: 15, y: 0, z: 15},
					rotation: {x: 0, y: 0, z: 0},
					ship: "Shuttle01"
				};
				users.insert({name: data.name, position: p.position, rotation: p.rotation, ship: p.ship}, function (err, doc) {
					if(err) throw err;

					console.log('User created: '+data.name);
					players[data.name] = new Player(data.name, p);
					socket.emit('connected', p);	
				});
			}		
		});
	});
	

	socket.on('player.move', function (data) {
		players[data.name].position = data.position;
		players[data.name].rotation = data.rotation;

		users.findAndModify({ name: data.name }, { $set: { position: players[data.name].position, rotation: players[data.name].rotation } });
  	});

  	/*------------------------------
  	 * Fetch players
  	 *------------------------------*/
  	socket.on('fetch.players', function(data) {
		io.sockets.emit('fetch.players', players);
  	});
});
