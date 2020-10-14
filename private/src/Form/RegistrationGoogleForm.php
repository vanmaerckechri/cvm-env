<?php

namespace src\Form;

use Core\ {
	AbstractForm,
	Authentification\AuthGoogle
};
use src\Schema\UserSchema;

class RegistrationGoogleForm extends AbstractForm
{
	private static $fields = [
		"username"
	];

	public static function getForm(): array
	{
		return self::mountForm(new UserSchema(), self::$fields);
	}

	public static function record(): ?array
	{
		if (!isset($_SESSION['googleProfile']) || empty($_SESSION['googleProfile']) || !isset($_POST['username']) || empty($_POST['username']))
		{
			return null;
		}

		$_POST['email'] = $_SESSION['googleProfile']['email'];
		$_POST['firstname'] = $_SESSION['googleProfile']['given_name'];
		$_POST['lastname'] = $_SESSION['googleProfile']['family_name'];
		$_POST['password'] = self::randomPassword(15);

		$result = RegistrationForm::record(false);

		if ($result['success'] === false)
		{
			return $result;
		}

		return AuthGoogle::login();
	}

	private static function randomPassword(int $length): string
	{
		$output = '';

		for ($i = ceil($length / 4); $i >= 0; $i--)
		{
			// lowecase
			$output .= chr(rand(97, 122));
			// uppercase
			$output .= chr(rand(65, 90));
			// special char
			$output .= chr(rand(33, 47));
			// number
			$output .= floor(rand(0, 9));
		}

		return substr($output, 0, $length);
	}
}