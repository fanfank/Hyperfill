<?php
function randompw( $length = 8 ) {
    // 密码字符集，可任意添加你需要的字符
    $chars = 'abcdefghijklmnopqrstuvwxyz';

    $password = '';
    for ( $i = 0; $i < $length; $i++ ) 
    {
        // 这里提供两种字符获取方式
        // 第一种是使用 substr 截取$chars中的任意一位字符；
        // 第二种是取字符数组 $chars 的任意元素
        // $password .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
        $password .= $chars[ mt_rand(0, strlen($chars) - 1) ];
    }

    return $password;
}
function cC($c)
{
	switch($c)
	{
		case "a":
		 return 10;
		case "b":
		 return 11;
		case "c":
		 return 12;
		case "d":
		 return 13;
		case "e":
		 return 14;
		case "f":
		 return 15;
		case "g":
		 return 16;
		case "h":
		 return 17;
		case "i":
		 return 18;
		case "j":
		 return 19;
		case "k":
		 return 20;
		case "l":
		 return 21;
		case "m":
		 return 22;
		case "n":
		 return 23;
		case "o":
		 return 24;
		case "p":
		 return 25;
		case "q":
		 return 26;
		case "r":
		 return 27;
		case "s":
		 return 28;
		case "t":
		 return 29;
		case "u":
		 return 30;
		case "v":
		 return 31;
		case "w":
		 return 32;
		case "x":
		 return 33;
		case "y":
		 return 34;
		case "z":
		 return 35;
		default:
		 echo "Non!";
		 break;
	}
}
function toCC( $str , $e , $n)
{
	//转换为数字的同时使用rsa加密
	//$cc = {};
	$tmpstr = "";
	$tmpnum = 0;
	for($i=0;$i<16;$i=$i+2)
	{ 
	   $tmpnum=cC($str[$i]);
	   $tmpnum=$tmpnum*100+cC($str[$i+1]);
	   //然后对其进行加密
	   $ans=1;
	   $ee=$e;
	   //echo $ee;
	   //break;
	   
	   while($ee--)
	   {
	     $ans=($ans*$tmpnum)%$n;
	   }
	   
	   if($ans<1000)
	    $tmpstr.="0";
	   if($ans<100)
	    $tmpstr.="0";
	   if($ans<10)
	    $tmpstr.="0";
	   if($ans==0)
	    $tmpstr.="0";
	   $tmpstr=$tmpstr.$ans;
	}
	return $tmpstr;
}
	session_start();
	$e = $_POST['pubke'];
	$n = $_POST['pubkn'];
	$key = randompw(16);
	$iv = randompw(16);
	//$_SESSION['key'] = $key;
	//$_SESSION['iv'] = $iv;
	$_SESSION['aes_server_key'] = $key;
	$_SESSION['aes_server_iv'] = $iv;
	
	//使用获得的rsa公钥进行加密，先将字母转换为数字，a对应10，依次类推，php中字符串使用句号连接
	$rt = toCC($key,$e,$n);
	$rt = $rt.toCC($iv,$e,$n);
	echo $rt;
?>