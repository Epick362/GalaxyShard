<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>GalaxyShard - Ingame</title>
		<style>
			body { margin: 0; overflow: hidden; background-color: #000; }
			.webgl-error { font: 15px/30px monospace; text-align: center; color: #fff; margin: 50px; }
			.webgl-error a { color: #fff; }
			.version { position: absolute; color: #FFF; font-family: Arial; top: 10px; left: 10px; background: #FF9045; padding: 5px; border-radius: 6px; }
			.velocity { position: absolute; color: #FFF; bottom: 10px; left: 50%; margin-left: -95px; background: transparent;}
	    </style>
		<link rel="icon" href="website/images/favicon.png" type="image/png" />
		<link rel="shortcut icon" href="/favicon.ico" />		
	</head>
	<body onload="start()" oncontextmenu="return false">
		<div id="interface">
			<div class="version">GalaxyShard Alpha</div>
			<div class="velocity">
				<input type="text" class="dial" id="currentSpeed" value="0" data-fgColor="#FF9045" data-bgColor="#3D3D3D" />
			</div>
		</div>
		<div id="webgl"></div>
		<script src="website/js/jquery-2.0.3.min.js"></script>
		<script src="game/js/jquery.knob.js"></script>
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
		<script>
			$(function() {
				$(".dial").knob({
					'min': 0,
					'thickness' : 0.4,
					'angleOffset' : -125,
					'angleArc' : 250,
					'readonly' : true
		        });
			});
		</script>
		<script type="text/javascript" src="server/node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.min.js"></script>
	</body>
</html>