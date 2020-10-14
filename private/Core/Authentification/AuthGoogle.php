<?php

namespace Core\Authentification;

use Core\Facade\Query;

class AuthGoogle
{
	public static function login(): ?array
	{	
		if (isset($_SESSION['googleProfile']) && !empty($_SESSION['googleProfile']))
		{
			$googleAccount = $_SESSION['googleProfile'];
		}

		if (isset($_POST['code']) && is_string($_POST['code']))
		{
			$googleAccount = (array)Oauth::login('google', $_POST['code']);
		}

		if (!isset($googleAccount) || empty($googleAccount))
		{
			return null;
		}

		$user = self::isAccountExist($googleAccount['email']);
		if ($user !== null)
		{
			$_SESSION['googleProfile'] = null;

			Auth::checkAccountStatus($user);

			self::addUserToSession($user);

			return array("success" => true, "customValue" => $_SESSION["auth"]["username"], "auth" => Auth::getUserForClient(), "message" => "loginFormSuccess");
		}
		else
		{
			$_SESSION['googleProfile'] = $googleAccount;
			return array("success" => false);
		}
	}

	private static function isAccountExist(string $email): ?array
	{
		return Query::from('user')
			->select('*')
			->where("email = :email")
			->limit(1)
			->setParam("email", $email)
			->fetch();
	}

	private static function addUserToSession(array $user)
	{
		$update = array("token_activation" => null);

		Query::update('user')
			->set($update)
			->where("id = :id")
			->setParam("id", $user['id'])
			->execute();

		Auth::addUserToSession($user);
	}
}