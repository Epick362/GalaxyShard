var io = require('socket.io').listen(8080);
var _ = require('underscore');

/*------------------------------
 * Player class
 *------------------------------*/
function Player(data) {
	this.name = data.name || "ServerError";
	this.position = data.ship.position || {};
	this.rotation = data.ship.rotation || {};
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
		console.log('ehehe');
		user = {
			"name" : "Epick",
			"ships" : [
				{
					"location" : "53167e61a4b8a311ec37216e",
					"name" : "Shuttle02",
					"position" : {
						"x" : 174.3366088867188,
						"y" : 0,
						"z" : -80.11202239990234
					},
					"rotation" : {
						"x" : 0,
						"y" : -0.6275748730334242,
						"z" : 0
					}
				}
			]
		};
		system = {
		    "planets" : [
		        {
		            "name" : "mercury",
		            "radius" : 4879,
		            "rotation" : 12,
		            "distance" : 57.9,
		            "revolution" : 2.2
		        },
		        {
		            "name" : "venus",
		            "radius" : 12104,
		            "rotation" : 8,
		            "distance" : 108.2,
		            "revolution" : 1.8
		        },
		        {
		            "name" : "earth",
		            "radius" : 12756,
		            "rotation" : 6,
		            "distance" : 149.6,
		            "revolution" : 2,
		            "clouds" : true,
		            "orbit" : {
		                "rotation" : {
		                    "x" : 0,
		                    "y" : 0,
		                    "z" : 0
		                }
		            },
		            "moons" : [
		                {
		                    "name" : "moon",
		                    "distance" : 4.384,
		                    "radius" : 3474,
		                    "revolution" : 2,
		                    "rotation" : -6,
		                    "orbit" : {
		                        "rotation" : {
		                            "x" : 0.45,
		                            "y" : 0,
		                            "z" : -0.25
		                        }
		                    }
		                }
		            ]
		        },
		        {
		            "name" : "mars",
		            "radius" : 6792,
		            "rotation" : -3,
		            "distance" : 227.9,
		            "revolution" : 2.5
		        },
		        {
		            "name" : "jupiter",
		            "radius" : 142984,
		            "rotation" : 2,
		            "distance" : 778.6,
		            "revolution" : 1.3,
		            "moons" : [
		                {
		                    "name" : "Io",
		                    "distance" : 40.421,
		                    "radius" : 3642,
		                    "revolution" : 1.27,
		                    "rotation" : 2.1,
		                    "orbit" : {
		                        "rotation" : {
		                            "x" : 0.65,
		                            "y" : 0,
		                            "z" : -0.15
		                        }
		                    }
		                },
		                {
		                    "name" : "Europa",
		                    "distance" : 42.671,
		                    "radius" : 3122,
		                    "revolution" : 1.27,
		                    "rotation" : 2.1,
		                    "orbit" : {
		                        "rotation" : {
		                            "x" : -0.25,
		                            "y" : 0,
		                            "z" : 0.75
		                        }
		                    }
		                },
		                {
		                    "name" : "Ganymede",
		                    "distance" : 62.07,
		                    "radius" : 5262,
		                    "revolution" : 1.27,
		                    "rotation" : 2.1,
		                    "orbit" : {
		                        "rotation" : {
		                            "x" : 0.25,
		                            "y" : -0.3,
		                            "z" : 0.75
		                        }
		                    }
		                },
		                {
		                    "name" : "Callisto",
		                    "distance" : 64.88200000000001,
		                    "radius" : 4821,
		                    "revolution" : 1.27,
		                    "rotation" : 2.1,
		                    "orbit" : {
		                        "rotation" : {
		                            "x" : 0.15,
		                            "y" : 0.6000000000000001,
		                            "z" : 0.15
		                        }
		                    }
		                }
		            ]
		        },
		        {
		            "name" : "saturn",
		            "radius" : 120536,
		            "rotation" : 2,
		            "distance" : 1433.5,
		            "revolution" : 1.4
		        },
		        {
		            "name" : "uranus",
		            "radius" : 51118,
		            "rotation" : 2,
		            "distance" : 2872.5,
		            "revolution" : 1
		        },
		        {
		            "name" : "neptune",
		            "radius" : 49528,
		            "rotation" : 1,
		            "distance" : 4495.1,
		            "revolution" : 0.8
		        }
		    ],
		    "stars" : [
		        {
		            "name" : "sun",
		            "radius" : 7351440000,
		            "spectral" : 0.95
		        }
		    ],
		    "env" : "env04",
		    "name" : "Terran Alliance Home System"
		};
		ship = {
		    "maxSpeed" : 24,
		    "acceleration" : 0.03,
		    "name" : "Terran Transport Vessel",
		    "ship" : "Shuttle02"
		};
		user.ship = _.extend(user.ships[0], ship);
		var response = {
			"user" : user,
			"system" : system
		};
		console.log('Connected: '+data.name);
		players[data.name] = new Player(user);
		socket.emit('connected', response);
	});

	socket.on('player.move', function (data) {
		players[data.name].position = data.position;
		players[data.name].rotation = data.rotation;

		users.findAndModify({ name: data.name }, { $set: { "ships.0.position": players[data.name].position, "ships.0.rotation": players[data.name].rotation } });
  	});

  	/*------------------------------
  	 * Fetch players
  	 *------------------------------*/
  	socket.on('fetch.players', function(data) {
		io.sockets.emit('fetch.players', players);
  	});
});
