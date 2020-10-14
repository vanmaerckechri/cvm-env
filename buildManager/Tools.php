<?php

class Tools
{
    public static function writeFile(string $path, string $content): void
    {
		file_put_contents($path, $content);
    }

	public static function deleteFolder($dirPath)
    {
		foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dirPath, FilesystemIterator::SKIP_DOTS), RecursiveIteratorIterator::CHILD_FIRST) as $path)
		{
	        $path->isDir() && !$path->isLink() ? rmdir($path->getPathname()) : unlink($path->getPathname());
		}	
		rmdir($dirPath);
	}
}