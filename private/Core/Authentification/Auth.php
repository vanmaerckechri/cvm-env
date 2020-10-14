<?php

namespace Core\Authentification;

use Core\Facade\Query;

class Auth
{
	public static function user(): ?array
	{
		$id = $_SESSION['auth']['id'] ?? null;

		// Not logged.
		if ($id === null)
		{
			self::removeUserFromSession();
			return null;
		}

		$user = Query::from('user')->select('*')->where("id = :id")->setParam("id", $id)->fetch();

		// User doesn't exist in DB.
		if ($user === null)
		{
			self::removeUserFromSession();
			return null;
		}

		self::checkAccountStatus($user);

		// Account needs to be activated with a validation email.
		if ($user['token_activation'] !== null)
		{
			self::removeUserFromSession();
			return array(
				'needActivation' => true,
				'id' => $user['id'],
				'token_activation' => $user['token_activation'],
				'email' => $user['email'],
				'status' => $user['status']
			);
		}

		self::addUserToSession($user);

		return $_SESSION['auth'];
	}

	public static function login(string $identifierField, string $identifier, string $password): ?array
	{
		// $identifierField = username or email.
		
		$user = Query::from('user')
			->select('*')
			->where("$identifierField = :$identifierField")
			->limit(1)
			->setParam("$identifierField", $identifier)
			->fetch();

		if ($user && password_verify($password, $user['password']))
		{
			self::addUserToSession($user);
		}

		return self::user();
	}

	public static function logout(): void
	{
		self::removeUserFromSession();
	}

	public static function addUserToSession(array $user): void
	{
		$_SESSION['auth'] = $user;
	}

	public static function getUserForClient(): ?array
	{
		$user = self::user();

		if ($user !== null && isset($user['id']))
		{
			return array(
				'id' => $user['id'],
				'firstname' => $user['firstname'],
				'lastname' => $user['lastname'],
				'role' => $user['role'],
				'username' => $user['username'],
				'email' => $user['email']
			);
		}
		return null;
	}

	public static function removeUserFromSession(): void
	{
		$_SESSION['auth'] = null;
	}

	public static function checkAccountStatus(array $user): void
	{
		// Account is ban.
		if ($user['status'] == 0)
		{
			self::removeUserFromSession();
			echo json_encode(["success" => false, "message" => "accountBan"]);
			exit;
		}
	}
}