<?php

namespace src\Form;

use Core\ {
	AbstractForm,
	Authentification\Auth,
	Facade\Query
};
use src\ {
	Form\PasswordResetForm,
	Schema\UserSchema
};

class ChangePasswordForm extends AbstractForm
{
	private static $fields = [
		"password"
	];

	private static $specialFields = [
        "passwordConfirm" => [
            "required" => true,
            "rules" => ['passwordConfirm']
        ]
	];

	public static function getForm(): array
	{
		$schema = new UserSchema();
		$form = self::mountForm($schema, self::$fields, self::$specialFields);
		$form["oldPassword"] = $schema->getSchema("password");
		return $form;
	}

	public static function updatePassword(): ?array
	{
		$user = self::checkPasswordForLoggedUser(new UserSchema(), $_POST['oldPassword']);

		// Set resetPassword_user with $user to use updatePassword from PasswordResetForm.
		$_SESSION['resetPassword_user'] = $user;
		return PasswordResetForm::updatePassword();
	}
}