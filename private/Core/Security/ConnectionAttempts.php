<?php

namespace Core\Security;

use Core\Facade\Query;

class ConnectionAttempts
{
	private static $maxAttempts;
	private static $timeInMinToWait;

	public static function init(int $maxAttempts = 5, int $timeInMinToWait = 5): void
	{
		self::$maxAttempts = $maxAttempts;
		self::$timeInMinToWait = $timeInMinToWait;
	}

	public static function check(?string $username = null): void
	{
		if ($username === null)
		{
			return;
		}

		$user = self::getUserConnectionAttempt($username);
		$elapsed = self::getElapsedTime($user['time']);

		if ($elapsed < self::$timeInMinToWait)
		{
			$count = (int)$user['count'];

			if ($count >= self::$maxAttempts)
			{
				echo json_encode(["success" => false, "message" => "passwordTooManyFailedAttempts", "customValue" => [self::$maxAttempts, self::$timeInMinToWait]]);
				self::cleanDb();
				exit;
			}
		}
		// x minutes without failed attemps => reset count.
		else
		{
			self::updateCount($username, 1);
		}
	}

	public static function incrementCount(?string $username = null): void
	{
		if ($username === null)
		{
			return;
		}

		$user = self::getUserConnectionAttempt($username);

		$count = (int)$user['count'] + 1;

		if ($count <= self::$maxAttempts)
		{
			self::updateCount($username, $count);
		}
	}

	private static function updateCount(string $username, int $value): void
	{
		Query::update('connection_attempt')
			->set(['count' => $value])
			->where("username = :username")
			->setParam("username", $username)
			->execute();

		self::updateTime($username);
	}

	private static function updateTime(string $username): void
	{
		$currentDate = new \DateTime();
		$currentDate = $currentDate->format('Y-m-d H:i:s');

		Query::update('connection_attempt')
			->set(['time' => $currentDate])
			->where("username = :username")
			->setParam("username", $username)
			->execute();
	}

	private static function getUserConnectionAttempt(string $username): array
	{
		$user = Query::from('connection_attempt')
			->select('*')
			->where("username = :username")
			->limit(1)
			->setParam("username", $username)
			->fetch();

		if ($user === null)
		{
			$user = Query::into('connection_attempt')
				->insert(["username" => $username, "time" => (new \DateTime())->format('Y-m-d H:i:s')])
				->execute();

			return self::getUserConnectionAttempt($username);
		}

		return $user;
	}

	private static function cleanDb(): void
	{
		$users = Query::from('connection_attempt')
			->select('*')
			->fetchAll();

		$where = "";

		for ($i = count($users) - 1; $i >= 0; $i--)
		{
			$elapsed = self::getElapsedTime($users[$i]['time']);

			if ($elapsed > self::$timeInMinToWait)
			{
				$where .= 'id = ' . $users[$i]['id'];
				if ($i > 1)
				{
					$where .= " or ";
				}
			}
		}

		if ($where === "")
		{
			return;
		}

		var_dump($where);

		Query::delete()
			->from('connection_attempt')
			->where($where)
			->execute();
	}

	private static function getElapsedTime(string $time): int
	{
		$lastTime = new \DateTime($time);
		$elapsed = $lastTime->diff(new \DateTime());
		$minutes = $elapsed->days * 24 * 60;
		$minutes += $elapsed->h * 60;
		$minutes += $elapsed->i;

		return $minutes;
	}
}