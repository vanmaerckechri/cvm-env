<?php

include_once 'DomDoc.php';

class BuildIndexHtml
{   
    static public function mount(string $subBaseUri): void
    {
		$doc = DomDoc::get('..\\public\\index.html');
		$doc = self::updateBase($subBaseUri, $doc);
		$doc = self::updateScripts($doc);

	    $result = $doc->saveHTML();
	    // erase the space created by the erased elements 
		$result = preg_replace('/\t+\r\n/', '', $result);

		file_put_contents('build\\public\\index.html', $result);
    }

    static private function updateBase(string $subBaseUri, object $doc): object
    {
    	$tag = $doc->getElementsByTagName('base')[0];
		$tag->setAttribute('href', $subBaseUri);   	

		return $doc;
    }

    static private function updateScripts(object $doc): object
    {
    	$scripts = $doc->getElementsByTagName('script');

		// Remove all scripts tags
		for ($i = count($scripts) - 1; $i >= 0; $i--)
		{
		    $scripts[$i]->parentNode->removeChild($scripts[$i]);
		}

		// Add script tag to load js compilation
		$script = $doc->createElement('script');
		$script->setAttribute('type', 'text/javascript');
		$script->setAttribute('src', 'public/js/app.js');

    	$body = $doc->getElementsByTagName('body')[0];
		$body->appendchild($script);	    	

		return $doc;
    }
}