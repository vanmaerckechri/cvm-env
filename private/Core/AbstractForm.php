<?php

namespace Core;

use Core\ {
	Authentification\Auth,
	Facade\Query,
	Security\ConnectionAttempts
};

abstract class AbstractForm
{
	protected static function mountForm(object $schemaClass, array $fields, array $specialFields = null): ?array
	{
		$output = [];
		$output = self::mountFields($schemaClass, $fields, $output);
		$output = $specialFields !== null ? self::mountSpecialFields($specialFields, $output) : $output;

		return $output;
	}

	protected static function isAlreadyUse(string $table, array $fieldsToTest, ?int $idToExclude = null)
	{
		$list = [];

		foreach ($fieldsToTest as $field => $value)
		{			
			$id = Query::from($table)->select('id')->where("$field = :$field")->setParam("$field", $value)->fetch('id');

			if ($id && (int)$id !== $idToExclude)
			{
				$list[$field] = $value;
			}	
		}

		if (!empty($list))
		{
			return $list;
		}
		
		return null;
	}

	protected static function checkInputs(object $schemaClass, array $fields): ?array
	{
		$output = [];

		for ($i = count($fields) - 1; $i >= 0; $i--)
		{
			$field = $fields[$i];

			$value = $_POST[$field] ?? null;

			// Entry is missing or the values ​​do not respect the rules.
			if ($value === null || self::checkValue($schemaClass, $field, $value) === false)
			{
				return null;
			}

			$output[$field] = $value;
		}

		return $output;
	}

	protected static function checkValue(object $schemaClass, string $field, string $value): bool
	{
		$schema = $schemaClass->getSchema($field);
		$isRequired = $schema['required'];

		$rules = array_merge($schema['rules'], $schema['customRules']);

		foreach ($rules as $key => $values)
		{
			$pattern;

			if (is_array($values))
			{
				// Update custom rules pattern
				$pattern = '/' . FieldRules::get($key) . '/';

				for ($i = count($values) - 1; $i >= 0; $i--)
				{
					$pattern = str_replace("[$i]", $values[$i], $pattern);
				}
			}
			else
			{
				// Standard rule pattern
				$pattern = '/' . FieldRules::get($values) . '/';
			}

			if (!(preg_match($pattern, $value) || ($isRequired === false && strlen($value) === 0)))
			{
				return false;
			}
		}

		return true;
	}

	protected static function checkPasswordForLoggedUser(object $schema, ?string $password = null): array
	{
		// Check if user is connected.
		$user = Auth::user();
		if ($user === null)
		{
			echo json_encode(array("success" => false, "error" => "logout"));
			exit;
		}

		// Check that the password respects its model and that it is the correct one.
		if ($password === null
			|| self::checkValue($schema, "password", $password) === false
			|| password_verify($password, $user['password']) === false)
		{
			ConnectionAttempts::incrementCount($user['username']);
			echo json_encode(array("success" => false, "message" => "passwordFormError"));
			exit;
		}

		return $user;
	}

	private static function mountFields(object $schemaClass, array $fields, array $output): array
	{
		for ($i = count($fields) - 1; $i >= 0; $i--)
		{
			$field = $fields[$i];
			$schema = $schemaClass->getSchema($field);
			$output[$field] = $schema;
		}

		return $output;
	}

	private static function mountSpecialFields(array $specialFields, array $output): array
	{
		foreach($specialFields as $field => $schema) 
		{
			$output[$field] = $schema;
			$rules = $output[$field]['rules'];
		}

		return $output;
	}
};