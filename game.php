<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>GalaxyShard</title>
		<style>
			body { margin: 0; overflow: hidden; background-color: #000; }
			.webgl-error { font: 15px/30px monospace; text-align: center; color: #fff; margin: 50px; }
			.webgl-error a { color: #fff; }
			.version { position: absolute; color: #FFF; font-family: Tahoma; top: 10px; left: 10px; background: #FF4400; padding: 5px; opacity: .7; border-radius: 6px;}
			.velocity { position: absolute; color: #FFF; bottom: 10px; right: 10px; background: #FF4400; padding: 5px; opacity: .7; border-radius: 6px; }
	    </style>
	</head>
	<body onload="start()" oncontextmenu="return false">
		<div id="interface">
			<div class="version">GalaxyShard Alpha</div>
			<div class="velocity">Speed: <div id="currentSpeed">0.00</div></div>
		</div>
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
		<script src="game/js/ShaderParticles.js"></script>
		<script src="game/js/shaderlist.js"></script>  
		<script src="game/js/lensflare.js"></script>	

		<script src="game/core/environment.js"></script> 		  		
		<script src="game/core/sun.js"></script>
		<script src="game/core/entity.js"></script>
		<script src="game/core/ui.js"></script>
		<script src="game/core/player.js"></script>
		<script src="game/core/view.js"></script>

		<script src="main.js"></script>  
		<script type="text/javascript" src="server/node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.min.js"></script>
	</body>
</html>