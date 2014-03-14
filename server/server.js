var io = require('socket.io').listen(8080);
var _ = require('underscore');

/*------------------------------
 * Player class
 *------------------------------*/
function Player(data) {
	this.name = data.name || "ServerError";
	this.position = data.position || {};
	this.rotation = data.rotation || {};
	this.ship = data.ship;
}

var players = {};

// Establish DB connection
var db = require('monk')('localhost/galaxyshard')
  , users = db.get('users')
  , ships = db.get('ships')
  , systems = db.get('systems')

io.sockets.on('connection', function (socket) {
	socket.on('connect', function(data) {
		users.findOne({name: data.name}).success( function (user) {
			if(user) {
				ships.findOne({ship: user.ships[0].name}).on('success', function(ship) {
					user.ship = _.extend(user.ships[0], ship);

					systems.findById(user.ships[0].location, function(err, system) {
						var response = {
							"user" : user,
							"system" : system
						};
						console.log('Connected: '+data.name);
						players[data.name] = new Player(user);
						socket.emit('connected', response);	
					});
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
