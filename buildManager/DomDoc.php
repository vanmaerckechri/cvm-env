<?php

class DomDoc
{
	static public function get(string $target): \DOMDocument
    {
    	$content = file_get_contents($target);
    	$doc = new DOMDocument('1.0', 'utf-8');

       	$internalErrors = libxml_use_internal_errors(true);
		$doc->loadHTML($content);
		libxml_use_internal_errors($internalErrors);

		return $doc;
    }
}