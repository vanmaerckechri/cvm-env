<?php

namespace src\Form;

use Core\ {
	AbstractForm,
	Authentification\Auth,
	Facade\Query
};
use src\Schema\UserSchema;

class ProfilForm extends AbstractForm
{
	private static $fields = [
		"firstname",
		"lastname"
	];

	public static function getForm(): array
	{
		$schema = new UserSchema();
		$form = self::mountForm($schema, self::$fields);
		$form["passwordForProfil"] = $schema->getSchema("password");
		return $form;
	}

	public static function updateProfil(): array
	{
		$user = self::checkPasswordForLoggedUser(new UserSchema(), $_POST['passwordForProfil']);

		if (!isset($_POST['firstname']) || !isset($_POST['lastname']))
		{
			return array('success' => false);
		}

		Query::update('user')
			->set(["firstname" => $_POST["firstname"], "lastname" => $_POST["lastname"]])
			->where("id = :id")
			->setParam("id", $user['id'])
			->execute();

		return array('success' => true, "message" => "profilFormSuccess");
	}
}