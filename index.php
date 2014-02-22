<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
		<title>GalaxyShard</title>
		<link rel="stylesheet" type="text/css" href="website/css/bootstrap.min.css" />
		<link rel="stylesheet" type="text/css" href="website/css/carousel.css" />
		<link rel="stylesheet" type="text/css" href="website/css/custom.css" />

		<link rel="icon" href="website/images/favicon.png" type="image/png" />
		<link rel="shortcut icon" href="/favicon.ico" />		
	</head>
	<body>
		<div class="navbar-wrapper">
		  <div class="container">

			<div class="navbar navbar-inverse navbar-static-top" role="navigation">
			  <div class="container">
				<div class="navbar-header">
				  <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				  </button>
				  <a class="navbar-brand" href="#"><img src="website/images/GalaxyShard.png" width="8" height="16" /></a>
				</div>
				<div class="navbar-collapse collapse">
				  <ul class="nav navbar-nav">
					<li class="active"><a href="#">Home</a></li>
					<li><a href="game.php">Game</a></li>
					<li><a href="#contact">Contact</a></li>
					<li class="dropdown">
					  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown <b class="caret"></b></a>
					  <ul class="dropdown-menu">
						<li><a href="#">Action</a></li>
						<li><a href="#">Another action</a></li>
						<li><a href="#">Something else here</a></li>
						<li class="divider"></li>
						<li class="dropdown-header">Nav header</li>
						<li><a href="#">Separated link</a></li>
						<li><a href="#">One more separated link</a></li>
					  </ul>
					</li>
				  </ul>
				</div>
			  </div>
			</div>

		  </div>
		</div>


		<div class="image-promo">
			<div class="container">
				<div class="content">
					The best browser MMORPG game in the universe <br /><small>- Albert Einstein</small>			
				</div>
			</div>
		</div>
		<!-- Marketing messaging and featurettes
		================================================== -->
		<!-- Wrap the rest of the page in another container to center all the content. -->

		<div class="container page">

		<center>
			<iframe class="youtube-player" type="text/html" width="640" height="385" src="http://www.youtube.com/embed/FZPCiqBLPM8?controls=0" allowfullscreen frameborder="0">
			</iframe>
		</center>

		  <hr class="featurette-divider">

		  <!-- /END THE FEATURETTES -->


		  <!-- FOOTER -->
		  <footer>
			<p class="pull-right"><a href="#">Back to top</a></p>
			<p>&copy; 2014 Stardream, Inc. &middot; <a href="#">Privacy</a> &middot; <a href="#">Terms</a></p>
		  </footer>

		</div><!-- /.container -->

		
		<script src="website/js/jquery-2.0.3.min.js"></script>
		<script src="website/js/bootstrap.min.js"></script>
		<script src="website/js/holder.js"></script>
		<script type="text/javascript">
			jQuery(document).ready(function($) {
				b=parseFloat(-150);// Initial value for the first background (bk 0)
				var scrollTop = $(window).scrollTop();
				var scroll_actually= new Array();// Identifies the X and Y values for the background
			 
				$(window).scroll(function(){//This is not the cleanest way to do this, I'm just keeping it short.
					if(scrollTop>$(this).scrollTop()) // Scroll up
					{
						if (getScrollTop()<=400 && getScrollTop()>=0)// Identifies the position for the first background when a scroll event occurs
						{
								b=b+20;
								$('.image-promo').css('backgroundPosition', '0 '+b+'px');
						}
					}
					else
					{// Scroll down
						if (getScrollTop()>=0 && getScrollTop()<=400)
						{
							  b=b-20;
							  $('.image-promo').css('backgroundPosition', '0 '+b+'px');
						}
					}
					if (getScrollTop()==0)// Adjusts the positions values and resets them to zero during a scroll up event
					{
						$('.image-promo').css('backgroundPosition', '0 -150px');
					}
				  scrollTop = $(this).scrollTop();
				});
			});

			function getScrollTop(){ //  Verifies the total sum in pixels of the whole page
			 
				if(typeof pageYOffset!= 'undefined'){
					// Most browsers
					return pageYOffset;
				}
				else{
					var B= document.body; //IE 'quirks'
					var D= document.documentElement; //IE with doctype
					D= (D.clientHeight)? D: B;
					return D.scrollTop;
				}
			}
		</script>
	</body>
</html>