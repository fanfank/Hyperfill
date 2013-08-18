<?php
header("Content-type:text/html; charset=utf-8");
function decryptAES($originText, $key, $iv, $type="")
{
	$originText = base64_decode($originText);
	$result = mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $key, $originText, MCRYPT_MODE_CBC, $iv);
	return rtrim($result, "\0");
}
?>