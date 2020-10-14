<?php

namespace Core;

use Core\App;

abstract class AbstractMail
{
	private static $init;

	public static function send(string $to, array $vars = [])
	{
		if (!self::$init)
		{
			$file = __DIR__ . '/../src/Config/security.json';
			$config = json_decode(file_get_contents($file), true)['mail'];
			self::initSmtp($config);
			self::$init = true;
		}

		$header = static::getHeader();
		$subject = static::selectLang(static::getSubject());
		$message = static::selectLang(static::getMessage($vars));

		mail($to, $subject, $message, $header);
	}

	private static function initSmtp(array $config): void
	{	
		ini_set('SMTP', $config['smtp']);
		ini_set('sendmail_from', $config['sendmail_from']);
		ini_set('smtp_port', $config['smtp_port']);
	}

	private static function selectLang($content): string
	{
		foreach ($_SESSION['lang']['list'] as $lang)
		{
			// clean selected language
			if ($lang == $_SESSION['lang']['current'])
			{
				$regex = '#\{\{' . $lang . '\}\}#';
				$content = preg_replace($regex, '', $content);
				$regex = '#\{\{\/' . $lang . '\}\}#';
				$content = preg_replace($regex, '', $content);
			}
			// delete others language
			else
			{
				$regex = '#\{\{' . $lang . '}}.*\{\{\/' . $lang . '\}\}#';
				$content = preg_replace($regex, '', $content);
			}
		}
		return $content;
	}

	abstract protected static function getHeader(): string;

	abstract protected static function getSubject(): string;

	abstract protected static function getMessage(array $vars = []): string;
}