<?php

namespace Core\Security;

class SpamBreaker
{
	public static function check(): void
	{
		self::init();
		$elapsed = self::checkElapsedTime();
		self::updateCountRequest($elapsed);

		if ($_SESSION['spam']['countRequest'] > 50)
		{
			echo json_encode(["spam" => true, "time" => 10]);
			exit;
		}
	}

	private static function init(): void
	{
		$_SESSION['spam'] = !isset($_SESSION['spam']) ? [] : $_SESSION['spam'];
		$_SESSION['spam']['countRequest'] = !isset($_SESSION['spam']['countRequest']) ? 0 : $_SESSION['spam']['countRequest'];
		$_SESSION['spam']['lastTime'] = !isset($_SESSION['spam']['lastTime']) ? microtime(true) : $_SESSION['spam']['lastTime'];
	}

	private static function checkElapsedTime(): float
	{
		$now = microtime(true);
		$elapsed = $now - $_SESSION['spam']['lastTime'];
		$_SESSION['spam']['lastTime'] = $now;
		return $elapsed;		
	}

	private static function updateCountRequest(float $elapsed): void
	{
		$_SESSION['spam']['countRequest'] += 1;

		if ($elapsed > 10)
		{
			$_SESSION['spam']['countRequest'] = 0;
		}
	}
}