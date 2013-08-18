<?php
	include "hyperfill_decryptaes.php";
	include "hyperfill_settings.php"

	session_start();
	if(!isset($_SESSION['valid_user'])){
		echo "You are not logged in.\n";
		exit;
	}
	header("Content-type:text/html; charset=utf-8");
	
	$un = $_GET['username'];
	$pw = $_GET['passwd'];
	$aes_server_key = $_SESSION['aes_server_key'];
	$aes_server_iv = $_SESSION['aes_server_iv'];
	
	$un=decryptAES($un, $aes_server_key, $aes_server_iv);
	$pw=decryptAES($pw, $aes_server_key, $aes_server_iv);
	
	$connect=mysql_connect($dbaddr, $dbun, $dbpw);
	
	if(!$connect) 
		echo "failed";
	else
	{
		mysql_select_db($dbname, $connect);
	
		$query = "select user_passwd from user where user_name='$un'";
		$result = mysql_query($query, $connect);
		$row = mysql_fetch_array($result);
	
		if(!$row[0])
			echo "delete-no"; //用户名错误
		else if($row[0])
		{	
			$pw2 = $row[0];
			if($pw2 == $pw)
			{	
				//validation succeed, get the url
				$url = $_GET['url'];
				$query = "delete from form where user_name='$un' and url='$url'";
				mysql_query($query,$connect);	
				echo "delete-yes";
			}
			else
				echo "delete-no";//密码错误
		}
		
		mysql_close();
	}
	
?>
