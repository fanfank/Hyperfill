<?php
	include "hyperfill_decryptaes.php";
	include "hyperfill_settings.php";

	session_start();
	if(!isset($_SESSION['valid_user'])){
		echo "You are not logged in.\n";
		exit;
	}
	header("Content-type:text/html; charset=utf-8");
	
	$un = $_POST['username'];
	$pw = $_POST['passwd'];
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
			echo "set-no"; //用户名错误
		else if($row[0])
		{	
			$pw2 = $row[0];
			
			if($pw2 == $pw)
			{	
				//validation succeed, get the url
				$url = $_POST['url'];
				$url = urldecode($url);
				
				$ct=$_POST['ct'];
				
				$query = "select content from form where user_name='$un' and url='$url'";
				$result = mysql_query($query, $connect);
				$row = mysql_fetch_array($result);
				
				if(!$row[0])//didn't exist the item
				{
					$query = "insert into form values('$un', '$url', '$ct')";
					mysql_query($query, $connect);
				}
				else //already exist
				{
					$query = "update form set content='$ct' where user_name='$un' and url='$url'";
					mysql_query($query, $connect);
				}
			
				echo "set-yes";
			}
			else
				echo "set-no";//密码错误
		}	
		mysql_close();
	}
?>