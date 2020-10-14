<?php

namespace Core;

use PDO;

class App
{
	private static $pdo;
	private static $config;

	public static function start(): void
	{
		self::startSession();
	}

	public static function getPdo(): ?PDO
	{
		self::loadPdo();
		return self::$pdo;
	}

	public static function devMode()
	{
		try
		{
			self::getPdo()->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		}
		catch(\PDOException $e)
		{
			
		}
	}
	public static function updateLang(): void
	{
		$_SESSION['lang'] = array();
		$_SESSION['lang']['list'] = isset($_POST['langList']) && !empty($_POST['langList']) ? json_decode($_POST['langList']) : array("en");
		$_SESSION['lang']['current'] = isset($_POST['lang']) && !empty($_POST['lang']) ? $_POST['lang'] : "en";
	}

	private static function startSession(): void
	{
		if (session_status() === PHP_SESSION_NONE)
		{
			session_start();
		}
	}

	private static function loadPdo(): void
	{

		if (!self::$pdo)
		{
			$file = __DIR__ . '/../src/Config/security.json';
			$server = json_decode(file_get_contents($file), true)['server'];
			self::$pdo = new PDO(
				"mysql:host={$server['host']};
				dbname={$server['db']['name']};
				charset={$server['charset']}",
				$server['user'],
				$server['pwd'],
				[
					PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
				]
			);
		}
	}
}