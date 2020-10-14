<?php

namespace src\Form;

use Core\ {
	AbstractForm,
	Authentification\Auth,
	Facade\Query
};
use src\ {
	Schema\UserSchema,
	Mail\AccountActivationMail
};

class RegistrationForm extends AbstractForm
{
	private static $fields = [
		"username",
		"email",
		"firstname",
		"lastname",
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
		return self::mountForm(new UserSchema(), self::$fields, self::$specialFields);
	}

	public static function record(bool $sendMail = true): ?array
	{
		$newUser = self::checkInputs(new UserSchema(), self::$fields);

		if ($newUser !== null)
		{
			$list = self::isAlreadyUse('user', ['username' => $newUser['username'], 'email' => $newUser['email']]);
			if ($list !== null)
			{
				return array("success" => false, "alreadyUse" => $list);
			}

			$newUser['password'] = password_hash($newUser['password'], PASSWORD_DEFAULT);
			$newUser['token_activation'] = md5(microtime(TRUE)*100000);

			$id = Query::into('user')
				->insert($newUser)
				->execute()
				->lastInsertId();

			if ($sendMail === true)
			{
				AccountActivationMail::send($newUser['email'], ['id' => $id, 'token_activation' => $newUser['token_activation']]);
			}

			return array("success" => true);
		}

		return array("success" => false);
	}

	public static function activation(string $id, string $token_activation): array
	{
		$user = Query::from('user')
			->select('*')
			->where("id = :id AND token_activation = :token_activation")
			->limit(1)
			->setParam("id", $id)
			->setParam("token_activation", $token_activation)
			->fetch();

		if ($user !== null)
		{
			Query::update('user')
				->set(["token_activation" => null])
				->where("id = :id")
				->setParam("id", $user['id'])
				->execute();

			Auth::addUserToSession($user);

			return array("success" => true, "message" => "accountActivationSuccess");
		}
		return array("success" => false, "message" => "tokenError");
	}
}