<?php 
  header('Content-type: text/cache-manifest');
  require('version.php');
  
?>CACHE MANIFEST
# <?php echo $pizzaversion; ?>

CACHE:

<?php
if ($iscache == false) {
  echo "NETWORK:";
}
?>



#HTML
index.php

#CSS
css/normalize.css
css/main.css?version=<?php echo $pizzaversion; ?>

css/add2home.css

#JS
js/main.js?version=<?php echo $pizzaversion; ?>

js/helper.js
js/plugins.js

js/vendor/modernizr-2.7.1.min.js
js/vendor/jquery-2.1.0.min.js
js/vendor/add2home.js

js/pizzautils_sourdo.js?version=<?php echo $pizzaversion; ?>

js/pizzautils_doughcalc.js?version=<?php echo $pizzaversion; ?>

js/pizzautils_ui.js?version=<?php echo $pizzaversion; ?>


# network

<?php
if ($iscache == true) {
  echo "NETWORK:";
}
?>



http://www.google-analytics.com/ga.js
http://www.google-analytics.com/__utm.gif
