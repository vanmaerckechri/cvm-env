<?php

namespace src\Form;

use Core\ {
	AbstractForm,
	Authentification\Auth,
	Facade\Query,
	Security\ConnectionAttempts
};
use src\ {
	Schema\UserSchema,
	Mail\AccountActivationMail
};

class LoginForm extends AbstractForm
{
	private static $fields = [
		"username",
		"password"
	];

	public static function getForm(): array
	{
		return self::mountForm(new UserSchema(), self::$fields);
	}

	public static function login(): array
	{
		// Check if user input respects the field rule (special case with username/email: don't use self::checkInputs).
		$UserSchema = new UserSchema();

		$isIdentifierValid = self::checkValue($UserSchema, "username", $_POST['username']);
		$identifierField = "username";

		if ($isIdentifierValid === false)
		{
			$isIdentifierValid = self::checkValue($UserSchema, "email", $_POST['username']);
			$identifierField = "email";
		}

		$isPasswordValid = self::checkValue($UserSchema, "password", $_POST['password']);

		if ($isIdentifierValid === true && $isPasswordValid === true)
		{
			$auth = Auth::login($identifierField, $_POST['username'], $_POST['password']);

			if ($auth !== null)
			{
				// Account is ban.
				if (isset($auth['accountBan']))
				{
					return array("success" => false, "message" => "accountBan");
				}
				// Account needs to be activated with a validation email.
				else if (isset($auth['needActivation']))
				{
					AccountActivationMail::send($auth['email'], ['id' => $auth['id'], 'token_activation' => $auth['token_activation']]);
					
					return array("success" => false, "message" => "accountNeedValidation");
				}
				else
				{
					return array("success" => true, "message" => "loginFormSuccess", "customValue" => $auth["username"]);
				}
			}
		}
		ConnectionAttempts::incrementCount($_POST['username']);
		return array("success" => false, "message" => "loginFormError");
	}
}