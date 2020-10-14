<?php

include_once 'Tools.php';
include_once 'BuildJavascript.php';
include_once 'BuildViews.php';
include_once 'BuildHtaccess.php';
include_once 'BuildIndexHtml.php';

class BuildManager
{   
	private $isMinimizeJs;
	private $message = '';
	private $subBaseUri = '';

	public function __construct(string $subBaseUri, bool $isMinimizeJs = false)
    {
		$this->isMinimizeJs = $isMinimizeJs;
		$this->subBaseUri = $subBaseUri;
    }

    public function launch(): void
    {
    	// Remove last build
    	if (is_dir('build'))
		{
			Tools::deleteFolder('build');
		}

    	$this->copyDirectories('..\\');
    	
    	BuildJavascript::mount($this->isMinimizeJs);
    	BuildHtaccess::mount($this->subBaseUri);
    	BuildIndexHtml::mount($this->subBaseUri);

    	$this->removeDevModeFromIndexPhp();

    	$this->loadSuccessMessage();
    }

	public function getMessage(): string
    {
    	return $this->message;
    }

    private function copyDirectories(string $path): void
    {
    	if ($this->excludeDir($path))
		{
			return;
		}
		
		$destination = str_replace('..\\', 'build\\', $path);
		$this->createNewDir($destination);

		// Loop for each element in current directory.
	    $scandir = array_diff(scandir($path), array('.','..')); 
		foreach ($scandir as $filename)
		{
			// Target is a file.
			if (!is_dir($path . $filename))
			{
				// Exclude file.
				if ($this->excludeFile($path, $filename))
				{
					continue;
				}
				// Copy file.
				else
				{
					copy($path . $filename, $destination . $filename);
				}
			}
			// Target is a directory.
			else
			{
				$this->copyDirectories($path . $filename . DIRECTORY_SEPARATOR);
			}
		}
    }

    private function excludeDir(string $path): bool
    {
    	if (strpos($path, 'buildManager') !== false 
    		|| strpos($path, '.git') !== false 
    		|| strpos($path, 'public\\classes\\') !== false
    		|| strpos($path, 'public\\views\\') !== false)
		{
			return true;
		}
		return false;
    }

    private function excludeFile(string $path, string $filename): bool
    {
    	if (substr($filename, -5) == '.scss'
    		|| ($path == '..\\' && $filename == '.htaccess')
    		|| ($path == '..\bridge\\' && $filename == 'Bridge.js')
    		|| ($path == '..\public\\' && $filename == 'index.html')
    	   	|| ($path == '..\private\Core\\' && $filename == 'Messages.php'))
		{
			return true;
		}
		return false;
    }

    private function createNewDir(string $destination): void
    {
		if (!is_dir($destination))
		{
			mkdir($destination);
		}
    }

    private function removeDevModeFromIndexPhp()
    {
    	$file = __DIR__ . '/build/private/src/index.php';
    	$contents = file_get_contents($file);
		Tools::writeFile($file, str_replace("App::devMode();", "", $contents));
    }

    private function loadSuccessMessage(): void
    {
    	$this->message = "<p><font color=green>Operation carried out successfully!</font><br><br>";
    	if ($this->subBaseUri == '/buildManager/build/')
    	{
    		$this->message .= "<a href='build\\'>You can try your build here!</a><br><br>";
    	}
    }
}