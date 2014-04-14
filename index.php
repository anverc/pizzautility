<!DOCTYPE html><?php require('version.php'); ?>
<html class="no-js" manifest="offline.manifest.php">
    <head>
        <meta charset="utf-8">
        <title>Sourdough Starter Helper</title>
        <meta name="description" content="">
        <meta name="HandheldFriendly" content="True">
        <meta name="MobileOptimized" content="320">
        <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0" />
        <meta http-equiv="cleartype" content="on">

        <link rel="apple-touch-icon-precomposed" sizes="144x144" href="img/touch/apple-touch-icon-144x144-precomposed.png">
        <link rel="apple-touch-icon-precomposed" sizes="114x114" href="img/touch/apple-touch-icon-114x114-precomposed.png">
        <link rel="apple-touch-icon-precomposed" sizes="72x72" href="img/touch/apple-touch-icon-72x72-precomposed.png">
        <link rel="apple-touch-icon-precomposed" href="img/touch/apple-touch-icon-57x57-precomposed.png">
        <link rel="shortcut icon" sizes="196x196" href="img/touch/touch-icon-196x196.png">
        <link rel="shortcut icon" href="img/touch/apple-touch-icon.png">

        <!-- Tile icon for Win8 (144x144 + tile color) -->
        <meta name="msapplication-TileImage" content="img/touch/apple-touch-icon-144x144-precomposed.png">
        <meta name="msapplication-TileColor" content="#222222">

        <!-- SEO: If mobile URL is different from desktop URL, add a canonical link to the desktop page -->
        <!--
        <link rel="canonical" href="http://www.example.com/" >
        -->

        <!-- Add to homescreen for Chrome on Android -->
        <meta name="mobile-web-app-capable" content="yes">


        <!-- For iOS web apps. Delete if not needed. https://github.com/h5bp/mobile-boilerplate/issues/94 -->
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        <meta name="apple-mobile-web-app-title" content="SourdoUtility">

        <!-- This script prevents links from opening in Mobile Safari. https://gist.github.com/1042026 -->
        
        <script>(function(a,b,c){if(c in b&&b[c]){var d,e=a.location,f=/^(a|html)$/i;a.addEventListener("click",function(a){d=a.target;while(!f.test(d.nodeName))d=d.parentNode;"href"in d&&(d.href.indexOf("http")||~d.href.indexOf(e.host))&&(a.preventDefault(),e.href=d.href)},!1)}})(document,window.navigator,"standalone")</script>
        

        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/main.css?version=<?php echo $pizzaversion; ?>">
        <script src="js/vendor/modernizr-2.7.1.min.js"></script>
        
        <link rel="stylesheet" href="css/add2home.css">
        <script type="text/javascript" src="js/vendor/add2home.js" charset="utf-8"></script>
    </head>
    <body>

        <!-- Add your site or application content here -->
      <div id='body-wrap'>
        <div id='loading'>loading...</div>
        
        <?php
        foreach (glob("pages/*.html") as $filename)
        {
            include $filename;
        }
        ?>
        
        
      </div>
      
        <script src="js/vendor/jquery-2.1.0.min.js"></script>
        <script src="js/helper.js"></script>
        <script src="js/pizzautils_ui.js?version=<?php echo $pizzaversion; ?>"></script>
        <script src="js/pizzautils_sourdo.js?version=<?php echo $pizzaversion; ?>"></script>
        <script src="js/pizzautils_doughcalc.js?version=<?php echo $pizzaversion; ?>"></script>
        <script src="js/main.js?version=<?php echo $pizzaversion; ?>"></script>

        <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-48345171-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
    </body>
</html>
