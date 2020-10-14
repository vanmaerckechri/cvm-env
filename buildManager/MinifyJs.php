<?php

// The poor man's minimizer!!!

class MinifyJs
{
	public static function convert(string $content): string
	{
		$protectedCoordinates = self::getProtectedCoordinates($content);

		$content = self::update($content, [], 'removeComments');
		$content = self::update($content, $protectedCoordinates, 'removeTabNewLine');
		//$content = self::update($content, $protectedCoordinates, 'addForgottenSemicolons');

		return $content;
	}

	private static function getProtectedCoordinates(string $content): array
	{
		$pattern = "/\"([^\"]+)\"|\'([^\']+)\'|\}(\s+)(return|this)/";

		preg_match($pattern, $content, $matches, PREG_OFFSET_CAPTURE);
		$protectedCoordinates = [];

		foreach ($matches as $matche)
		{
			if ($matches[1] < 0)
			{
				continue;
			}
			$subArray = [];
			$subArray[] = $matche[1];
			$subArray[] = strlen($matche[0]);
			$protectedCoordinates[] = $subArray;
		}

		return $protectedCoordinates;
	}

	private static function update(string $content, array $protectedCoordinates, string $pattern): string
	{
		$infos = self::getReplacementInfo($pattern);

		preg_match_all($infos['pattern'], $content, $matches, PREG_OFFSET_CAPTURE);
					
		if ($matches && $matches[0] && !empty($matches[0]))
		{
			$matches = $matches[0];

			for ($i = count($matches) - 1; $i >= 0; $i--)
			{
				$matche = $matches[$i];
				$start = $matche[1];
				$end = strlen($matche[0]);
				$isReplace = true;

				foreach ($protectedCoordinates as $coordinates)
				{
					if (($start >= $coordinates[0] && $start <= $coordinates[1]) || ($end >= $coordinates[0] && $end <= $coordinates[1]))
					{
						$isReplace = false;
						break;
					}	
				}

				if ($isReplace === true)
				{
					$content = substr_replace($content, $infos['replace'], $start, $end);
				}
			}
		}

		return $content;
	}

	private static function getReplacementInfo(string $pattern): array
	{
		switch ($pattern)
		{
			case 'removeComments':
				return [
					'pattern' => "/(?:(?:\/\*(?:[^*]|(?:\*+[^*\/]))*\*+\/)|(?:(?<!\:|\\\|\'|\")\/\/.*))/m",
					'replace' => ""
				];
			case 'removeTabNewLine':
				return [
					'pattern' => "/\n+|\r+|\t+/",
					'replace' => ""
				];
			case 'addForgottenSemicolons':
				return [
					'pattern' => "/(?<=(\}|\)))(?=(?!(else|elseif|while))\w)/",
					'replace' => ";"
				];
		}
	}
}