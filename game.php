<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Space MMO - Game</title>
	    <link rel="stylesheet" type="text/css" href="game/css/gumby.css" />
		<style>
			body { margin: 0; overflow: hidden; background-color: #000; }
			.webgl-error { font: 15px/30px monospace; text-align: center; color: #fff; margin: 50px; }
			.webgl-error a { color: #fff; }
	    </style>
	</head>
	<body onload="start()" oncontextmenu="return false">
		<div id="webgl"></div>
		<script src="game/js/jquery-2.0.3.min.js"></script>
		<script src="game/js/gumby.min.js"></script>
		<script src="game/js/three.min.js"></script>
		<script src="game/js/physi.js"></script>
		<script src="game/js/OBJLoader.js"></script>
		<script src="game/js/MTLLoader.js"></script>
		<script src="game/js/OBJMTLLoader.js"></script>
		<script src="game/js/stats.min.js"></script>
		<script src="game/js/util.js"></script>
		<script src="game/js/spacehelpers.js"></script>		
		<script src="game/js/Detector.js"></script>		
		<script src="game/js/PlayerControls.js"></script>
		<script src="game/js/shaderlist.js"></script>  
		<script src="game/js/lensflare.js"></script>	
		<script src="game/js/background.js"></script> 		  		
		<script src="game/js/sun.js"></script> 		
		<script src="game/js/solarsystem.js"></script>
		<script src="game/js/ship.js"></script>
		<script src="game/js/entity.js"></script>
		<script src="game/js/viewMode.js"></script>

		<script src="main.js"></script>  
		<script type="text/javascript" src="server/node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.min.js"></script>
	</body>
</html>