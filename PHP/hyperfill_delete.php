<?php 
	include "hyperfill_decryptaes.php";
	include "hyperfill_settings.php"
	session_start();
	if(!isset($_SESSION['valid_user'])){
		echo "You are not logged in.\n";
		exit;
	}
	
	$un = $_POST['username'];
	$urls = $_POST['urls'];
	$aes_server_key = $_SESSION['aes_server_key'];
	$aes_server_iv = $_SESSION['aes_server_iv'];
	
	$un=decryptAES($un, $aes_server_key, $aes_server_iv);

	$url = explode(' ', $urls);
	$num = count($url);
	$urlset = "(";
	for($i = 0; $i < $num - 2; $i++)
	{
		$urlset.='"'.$url[$i].'",';
	}
	$urlset.='"'.$url[$num-2].'")';
	
	$db = new mysqli($dbaddr, $dbun, $dbpw, $dbname);
	$query = 'delete from form where user_name="'.$un.'" and url in '.$urlset.';';
	//echo $query;
	if($db->query($query)) {
		$response = $db->affected_rows;
	}
	else { 
		$response = -1;
	}
	echo $response;
	
?>
