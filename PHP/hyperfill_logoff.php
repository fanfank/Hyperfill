<?php
    session_start();
	unset($_SESSION['valid_user']);
	unset($_SESSION['aes_server_key']);
	unset($_SESSION['aes_server_iv']);
	session_destroy();
	echo "logoff-yes";
?>