<?php

include_once 'Tools.php';
include_once 'MinifyJs.php';
include_once 'DomDoc.php';
include_once 'BuildViews.php';
include_once('..\\private\\Core\\Messages.php');
include_once('..\\private\\Core\\FieldRules.php');

class BuildJavascript
{
	static public function mount(bool $isMinimizeJs): void
    {
    	$compileJs = self::compileFiles($isMinimizeJs);
		$compileViews = BuildViews::getCompilation();
		$content = '(function(){"use strict"; var CVMENV = {};' . $compileJs . $compileViews . 'var main = new CVMENV.Main();}());';
		
		$path = 'build\\public\\js\\';
		mkdir($path);
		Tools::writeFile($path . 'app.js', $content);
    }

	static private function compileFiles($isMinimizeJs): string
	{
		$compilation = '';

		$doc = DomDoc::get('..\\public\\index.html');
		$scripts = $doc->getElementsByTagName('script');

		// Add content of files in compilation.
		for ($i = 0, $length = count($scripts); $i < $length; $i++)
		{
		    if($scripts[$i]->hasAttribute('src'))
		    {
		    	$target = $scripts[$i]->getAttribute('src');
		    	$content = "\r\n" . file_get_contents('..\\' . $target);

		    	// Inject list to some classes
				$content = self::injectListToClass($target, ['Messages', 'FieldRules'], $content);

		    	$content = self::cleanContent($content);

		    	if ($isMinimizeJs === true)
		    	{
		    		$content = MinifyJs::convert($content);
		    	}

				$compilation .= $content;
		    }
		}

		return $compilation;
	}

	static private function injectListToClass(string $target, array $classnames, string $content): string
	{
		foreach ($classnames as $classname)
    	{
    		$filename = $classname . '.js';

    		if (strpos($target, $filename))
	    	{
	    		$content = str_replace('this.list;', 'this.list = ' . json_encode(call_user_func(array('Core\\' . $classname, 'getList'))) . ';', $content);
	    	}
    	}

    	return $content;
	}

	static private function cleanContent(string $content): string
	{
		$pattern = '/^[\n|\r]*\(function\(\)[\n|\r]*\{[\n|\r|\t]*[\"|\']use strict[\"|\'];[\n|\r|\t]*/';
		$content = preg_replace($pattern, '', $content);
		$pattern = '/[\n|\r]*\}\(\)\);[\n|\r|\t]*$/';
		$content = preg_replace($pattern, '', $content);

		return $content;
	}
}