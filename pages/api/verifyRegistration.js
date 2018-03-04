<?php
	header('Access-Control-Allow-Origin: *');

	include("dupbit.php");

	if (isset($_POST["username"]) and isset($_POST["password"]) and isset($_POST["confirmpassword"]) and isset($_POST["email"])) {

		$username = $_POST["username"];
		$password = $_POST["password"];
		$confirmpassword = $_POST["confirmpassword"];
		$email = $_POST["email"];

		$usernameErrorCode = verifyUsername($username);
		$passwordErrorCode = verifyPassword($password);
		$confirmPasswordErrorCode = verifyPasswordMatch($password, $confirmpassword);
		$emailErrorCode = verifyEmail($email);

		$usernameError = join(" ", decodeErrorCode($usernameErrorCode));
		$passwordError = join(" ", decodeErrorCode($passwordErrorCode));
		$confirmPasswordError = join(" ", decodeErrorCode($confirmPasswordErrorCode));
		$emailError = join(" ", decodeErrorCode($emailErrorCode));

		$errors = array(
			"username" => $usernameError,
			'password' => $passwordError,
			'confirmpassword' => $confirmPasswordError,
			'email' => $emailError
		);

		echo json_encode($errors);

	}
?>	
