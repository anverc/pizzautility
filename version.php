<?php
$pizzaversion = "0.2014.04.13.0011";
$iscache = true;

// attempt to not use application cache outside of the main site
if ($_SERVER['HTTP_HOST'] != "pizzautility.makebendrink.com")
{
  $iscache = false;
  //Set no caching
  header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
  header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT"); 
  header("Cache-Control: no-store, no-cache, must-revalidate"); 
  header("Cache-Control: post-check=0, pre-check=0", false);
  header("Pragma: no-cache");
  
  $time = time();
  //$pizzaversion = "{$pizzaversion}.{$time}";
}

?>