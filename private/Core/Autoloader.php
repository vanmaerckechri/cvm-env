<?php

namespace Core;

Class Autoloader
{
	public static function init():void
	{
		self::register();
	}

	private static function register(): void
	{
		spl_autoload_register(array(__CLASS__, 'autoload'));
	}

	private static function autoload($className)
	{
		$file = '..\\private\\' . $className . '.php';
		$file = str_replace('\\', DIRECTORY_SEPARATOR, $file);

		if (file_exists($file))
		{
			include_once $file;
		}
	}
}

Autoloader::init();