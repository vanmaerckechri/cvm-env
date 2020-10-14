<?php

namespace Core\Facade;

use Core\App;
use Core\QueryBuilder;

class Query
{
	public static function __callStatic($method, $arguments)
	{
		$query = new QueryBuilder(App::getPdo());
		return call_user_func_array([$query, $method], $arguments);
	}
}