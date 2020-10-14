<?php

namespace Core;

class InitValuesForClient
{
	public static function get(): array
	{
		$output = [];
		$output['lists'] = [];

		if (isset($_POST['listsToLoad']))
		{
			$listsToLoad = json_decode($_POST['listsToLoad']);

			if (in_array('FieldRules', $listsToLoad))
			{
				$output['lists']['FieldRules'] = FieldRules::getList();
			}
			if (in_array('Messages', $listsToLoad))
			{
				$output['lists']['Messages'] = Messages::getList();
			}
		}

        return $output; 
	}
}