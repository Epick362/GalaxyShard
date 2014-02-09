<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>GalaxyShard</title>
	    <link rel="stylesheet" type="text/css" href="website/css/bootstrap.min.css" />
	    <link rel="stylesheet" type="text/css" href="website/css/bootstrap-theme.min.css" />
		<style>
			body { margin: 0; overflow: hidden; background-color: #000; }
			.webgl-error { font: 15px/30px monospace; text-align: center; color: #fff; margin: 50px; }
			.webgl-error a { color: #fff; }
	    </style>
	</head>
	<body onload="start()" oncontextmenu="return false">
		<div id="webgl"></div>
		<script src="website/js/jquery-2.0.3.min.js"></script>
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

		<script src="game/core/environment.js"></script> 		  		
		<script src="game/core/sun.js"></script>
		<script src="game/core/entity.js"></script>
		<script src="game/core/player.js"></script>
		<script src="game/core/view.js"></script>

		<script src="main.js"></script>  
		<script type="text/javascript" src="server/node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.min.js"></script>
	</body>
</html>