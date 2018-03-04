<?php
	header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);
	header('Access-Control-Allow-Credentials: true');

	include("dupbit.php");

	$logged = isLoggedIn();
	$logDetails = array("logged" => $logged);
	if($logged) {
		$id = getLogin();
		$username = getUsernameById($id);
		$level = getLevelById($id);
		$logDetails["details"] = array("id" => $id, "username" => $username, "level" => $level);
	}
	echo json_encode($logDetails);


?>
