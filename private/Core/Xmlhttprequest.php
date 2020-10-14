<?php

namespace Core;

class Xmlhttprequest
{
	public static function isAjax(): bool
	{
		if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest')
		{
			return true;
		}
		return false;
	}

	public static function turnOffAjax(): void
	{
		$_SERVER['HTTP_X_REQUESTED_WITH'] = null;
	}
}