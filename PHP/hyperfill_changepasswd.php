<?php
	header("Content-type:text/html; charset=utf-8");
	include "hyperfill_decryptaes.php";
	include "hyperfill_settings.php"
	session_start();
	if(!isset($_SESSION['valid_user'])){
		echo "You are not logged in.\n";
		exit;
	}
	
	//$privateKey = "subswlbpplkolaww";
	//$iv     	= "encryptedivforhf";
	$aes_server_key = $_SESSION['aes_server_key'];
	$aes_server_iv = $_SESSION['aes_server_iv'];
	
	$un = $_POST['username'];
	$opw = $_POST['oldpasswd'];
	$npw = $_POST['newpasswd'];
	$ncts = $_POST['newcontents'];
	
	$ncts = rtrim($ncts, " ");
	$un=decryptAES($un, $aes_server_key, $aes_server_iv);
	$opw=decryptAES($opw, $aes_server_key, $aes_server_iv);
	$npw=decryptAES($npw, $aes_server_key, $aes_server_iv);
	
	$db = new mysqli($dbaddr, $dbun, $dbpw, $dbname);
	if(!$db){
		$response = 2;
		echo $response;
		return;
	}
	
	$val = 'select * from user where user_name = "'.$un.'" and user_passwd = "'.$opw.'";';

	$res_val= $db->query($val);
	
	$num = $res_val->num_rows;
	if($num != 1){
		$response = 1;
		echo $response;
		return ;
	}
	else{
		$upd_pd = 'update user set user_passwd="'.$npw.'" where user_name="'.$un.'";';
		$res_updpd = $db->query($upd_pd);
		
		if($res_updpd||$db->affected_rows == 1)
		{
			$a = explode(' ', $ncts);
			$num_a = count($a);
			
			if($num_a >= 2)
				for($i = 0; $i < $num_a; $i+=2)
				{
					$upd_ct = 'update form set content="'.$a[$i+1].'" where user_name="'.$un.'" and url="'.$a[$i].'";';
					$res_updct = $db->query($upd_ct);
				}
			$response = 0;
		}
		else
			$response = 3; 
		
		echo $response;
		return ;
	}
?>
