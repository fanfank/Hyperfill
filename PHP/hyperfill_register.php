<?php
	header("Content-type:text/html; charset=utf-8");
	include "hyperfill_settings.php";
	
	$un = $_POST['username'];
	$pw = $_POST['passwd'];
	
	$connect=mysql_connect($dbaddr,$dbun,$dbpw);

	if(!$connect) 
		echo "failed";
	else
	{
		mysql_select_db($dbname,$connect);
	
		$query = "select user_name from user where user_name='$un'";
		$result = mysql_query($query, $connect);
		$row = mysql_fetch_array($result);
		
		mysql_free_result($result);
		
		if(!$row[0])
		{	
			$query = "insert into user values(0,'$un','$pw')";
			//echo $un." | ".$pw."<br \>";
			if(!mysql_query($query,$connect))
				echo "failed";
			else
				echo "register-yes"; //注册成功
		}
		else
			echo "register-no";
		
		mysql_close();
	}
?>
