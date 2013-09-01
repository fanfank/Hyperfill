<?php 
	include "hyperfill_decryptaes.php";
	include "hyperfill_settings.php";
	session_start();
	if(!isset($_SESSION['valid_user'])){
		echo "You are not logged in.\n";
		exit;
	}
	header('Content-Type: text/xml');
	
	$un = $_POST['username'];
	//echo $un."<br />";
	$aes_server_key = $_SESSION['aes_server_key'];
	$aes_server_iv = $_SESSION['aes_server_iv'];
	
	$un=decryptAES($un, $aes_server_key, $aes_server_iv);
	//echo $un."<br />";
	$response="<?xml version=\"1.0\" encoding=\"GB2312\"?>\n";
	//$response = new DOMDocument("1.0");
	$response.="<records>\n";
	
	$db = new mysqli($dbaddr, $dbun, $dbpw, $dbname);

	$query = 'select * from form where user_name ="'.$un.'";';
	$result = $db->query($query);
	
	$num = $result->num_rows;
	//if(!$result) {echo "noresult"; return; };
	//if(!$num) {echo "nonum"; return; };
	//if(!$num)	$num = 0;
	$response.="<username>".$un."</username>\n";
	$response.="<num>".$num."</num>\n";
	
	for($i = 0; $i < $num; $i++)
	{
		$row = $result->fetch_assoc();
		$response.="<record>\n";
		$response.="<url>".urlencode($row['url'])."</url>\n";
		
		$ct = $row['content'];
		//$ct = mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $privateKey, $ct, MCRYPT_MODE_CBC, $iv);
		//$ct = base64_encode($ct);
		//$ct = urlencode($ct);
		
		$response.="<content>".$ct."</content>\n";
		$response.="</record>\n";
	}
	
	$response.="</records>\n";
	echo $response;
	
?>
