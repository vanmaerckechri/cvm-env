<?php

include_once 'Tools.php';

class BuildHtaccess
{
	static public function mount(string $subBaseUri): void
	{
		$content = trim(preg_replace('/\t+/', '',"
			RewriteEngine On

			#RewriteCond %{HTTPS} !=on
			#RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

			RewriteCond %{REQUEST_URI} !^(" . $subBaseUri . "public/|" . $subBaseUri . "bridge/)
			RewriteRule ^(.*)$ " . $subBaseUri . "public/index.html?url=$1 [QSA,L]
		"));

		Tools::writeFile('build\.htaccess', $content);
	}
}