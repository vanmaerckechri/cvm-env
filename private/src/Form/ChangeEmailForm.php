<?php

namespace src\Form;

use Core\ {
	AbstractForm,
	Authentification\Auth,
	Facade\Query
};
use src\Schema\UserSchema;

class ChangeEmailForm extends AbstractForm
{
	private static $fields = [
		"email"
	];

	public static function getForm(): array
	{
		$schema = new UserSchema();
		$form = self::mountForm($schema, self::$fields);
		$form["passwordToChangeEmail"] = $schema->getSchema("password");
		return $form;
	}

	public static function updateEmail(): array
	{
		$user = self::checkPasswordForLoggedUser(new UserSchema(), $_POST['passwordToChangeEmail']);

		if (!isset($_POST['email']))
		{
			return array("success" => false);
		}

		$list = self::isAlreadyUse('user', ['email' => $_POST['email']], $user['id']);
		if ($list !== null)
		{
			return array("success" => false, "alreadyUse" => $list);
		}

		Query::update('user')
			->set(["email" => $_POST['email']])
			->where("id = :id")
			->setParam("id", $user['id'])
			->execute();

		return array("success" => true, "message" => "changeEmailFormSuccess");
	}
}