<?php 
	include "hyperfill_decryptaes.php";
	include "hyperfill_settings.php";
	header('Content-Type: text/xml');
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

function toCC( $str , $d , $n)
{
	//转换为数字的同时使用rsa加密
	//$cc = {};
	$tmpstr = "";
	$tmpnum = 0;
	for($i=0;$i<16;$i=$i+1)
	{ 
	   $tmpnum=cC($str[$i]);
	   //$tmpnum=$tmpnum*100+cC($str[$i+1]);
	   //然后对其进行加密
	   $ans=1;
	   $dd=$d;
	   //echo $ee;
	   //break;
	   
	   while($dd--)
	   {
	     $ans=($ans*$tmpnum)%$n;
	   }
	   
	   if($ans<10)
	    $tmpstr.="0";
	   if($ans==0)
	   { 
			$tmpstr.="0";
			continue;
	   }
	   $tmpstr=$tmpstr.$ans;
	}
	return $tmpstr;
}
	
	
	$msg = $_POST['req'];
	if($msg == 'whoareyou')
	{
		echo "i am: ".toCC("imserverimserver", 37, 77);
		//echo $response;
	}
?>
