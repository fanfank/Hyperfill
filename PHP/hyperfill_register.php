<?php
	header("Content-type:text/html; charset=utf-8");
	
	$un=$_GET['username'];
	$pw=$_GET['passwd'];
	
	//$connect=mysql_connect('127.0.0.1:3306','root','uiop');
	$connect=mysql_connect('127.0.0.1:3306','root','123abc');

	if(!$connect) 
		echo "failed";
	else
	{
		mysql_select_db("hyperfill",$connect);
	
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
