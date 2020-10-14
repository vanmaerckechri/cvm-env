<?php

namespace src\Form;

use Core\{
	AbstractForm,
	Authentification\Auth,
	Facade\Query
};
use src\{
	mail\PasswordResetMail,
	Schema\UserSchema
};

class PasswordResetForm extends AbstractForm
{
	private static $fieldToSendMail = [
		"email"
	];

	private static $fieldToChangePassword = [
		"password"
	];

	private static $specialFieldToChangePassword = [
        "passwordConfirm" => [
            "required" => true,
            "rules" => ['passwordConfirm']
        ]
	];

	public static function getFormToSendMail(): array
	{
		return self::mountForm(new UserSchema(), self::$fieldToSendMail);
	}

	public static function getFormToChangePassword(): array
	{
		return self::mountForm(new UserSchema(), self::$fieldToChangePassword, self::$specialFieldToChangePassword);
	}

	public static function sendMail(): ?array
	{
		$fields = self::checkInputs(new UserSchema(), self::$fieldToSendMail);

		if ($fields['email'] !== null)
		{
			$user = Query::from('user')
				->select('*')
				->where("email = :email")
				->limit(1)
				->setParam("email", $fields['email'])
				->fetch();

			if ($user !== null)
			{
				if ($user['status'] == 0)
				{
					return array("success" => false, "message" => "accountBan");
				}

				$token_password = md5(microtime(TRUE)*100000);

				Query::update('user')
					->set(["token_password" => $token_password])
					->where("id = :id")
					->setParam("id", $user['id'])
					->execute();

				PasswordResetMail::send($user['email'], ['id' => $user['id'], 'token_password' => $token_password]);

				return array("success" => true);
			}
		}
		
		return array("success" => false, "message" => "passwordResetMailFormError");
	}

	public static function checkPasswordToken(string $id, string $token_password): array
	{
		$user = Query::from('user')
			->select('*')
			->where("id = :id AND token_password = :token_password")
			->limit(1)
			->setParam("id", $id)
			->setParam("token_password", $token_password)
			->fetch();

		if ($user !== null)
		{
			$_SESSION['resetPassword_user'] = $user;

			return array("success" => true);
		}
		return array("success" => false, "message" => "tokenError");
	}

	public static function updatePassword(): ?array
	{
		$newUser = self::checkInputs(new UserSchema(), self::$fieldToChangePassword);

		if ($newUser !== null && isset($_SESSION['resetPassword_user']) && !empty($_SESSION['resetPassword_user']))
		{
			$password = password_hash($newUser['password'], PASSWORD_DEFAULT);

			Query::update('user')
				->set(["password" => $password, "token_activation" => null, "token_password" => null])
				->where("id = :id")
				->setParam("id", $_SESSION['resetPassword_user']['id'])
				->execute();

			Auth::addUserToSession($_SESSION['resetPassword_user']);

			$_SESSION['resetPassword_user'] = null;

			return array("success" => true, "message" => 'passwordResetPasswordFormSuccess');
		}

		return array("success" => false);
	}
}