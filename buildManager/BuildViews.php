<?php

include_once 'Tools.php';

class BuildViews
{
	static private $path = '..\\public\\views\\';

	static public function getCompilation(): string
	{
		$compilation = self::compileFiles(array(), self::$path);

		return self::mount($compilation);
	}

	static public function compileFiles(array $compilation, string $path): array
	{
		$scandir = array_diff(scandir($path), array('.','..')); 
		foreach ($scandir as $filename)
		{
			// Target is a file.
			if (!is_dir($path . $filename))
			{
				$content = file_get_contents($path . $filename);
				if (substr($filename, -5) == '.html')
				{
					// Convert the path and file name to a property name for javascript.
					$filename = str_replace('.html', '', $filename);
					$pattern = '/\\/m';
					$subPath = str_replace(self::$path, '', $path);
					$propertyName = str_replace('\\', '_', str_replace('..', '', $subPath . $filename));
					$compilation[$propertyName] = $content;
				}
			}
			// Target is a directory.
			else
			{
				$compilation = self::compileFiles($compilation, $path . $filename . DIRECTORY_SEPARATOR);
			}
		}

		return $compilation;
	}

	static private function mount(array $views): string
	{
		$newContent = 'CVMENV.Views = function(){';
		foreach ($views as $filename => $content)
		{
			$newContent .= 'this.' . lcfirst($filename) . '=' . json_encode($content) . ';';
		}
		$newContent .= '};CVMENV.Views.prototype.get = function(view){if(this[view]){return this[view];}return null;};';
		return $newContent;
	}
}