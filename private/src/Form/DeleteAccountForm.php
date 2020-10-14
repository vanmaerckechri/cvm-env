<?php

namespace src\Form;

use Core\ {
	AbstractForm,
	Authentification\Auth,
	Facade\Query
};
use src\Schema\UserSchema;

class DeleteAccountForm extends AbstractForm
{
	public static function getForm(): array
	{
		$form = array();
		$form["passwordToDeleteAccount"] = (new UserSchema())->getSchema("password");
		return $form;
	}

	public static function checkPassword(): array
	{
		$user = self::checkPasswordForLoggedUser(new UserSchema(), $_POST['passwordToDeleteAccount']);

		return array("success" => true);
	}

	public static function delete(): array
	{
		$user = self::checkPasswordForLoggedUser(new UserSchema(), $_POST['passwordToDeleteAccount']);

		Query::delete()
			->from('user')
			->where("id = :id")
			->setParam("id", $user['id'])
			->execute();

		Auth::removeUserFromSession();

		return array("success" => true, "message" => "deleteAccountFormSuccess");
	}
}