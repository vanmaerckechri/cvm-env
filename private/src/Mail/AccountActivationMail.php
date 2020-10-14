<?php

namespace src\Mail;

use Core\AbstractMail;

class AccountActivationMail extends AbstractMail
{
	protected static function getHeader(): string
	{
		$header = "From: \"CVM-ENV\"<robot@cvm.com>\n";
		$header .= "Content-Type: text/html; charset=\"UTF-8\"\n";
		$header .= "Content-Transfer-Encoding: 8bit";

		return $header;
	}

	protected static function getSubject(): string
	{
		return '{{en}}Validation of Your Account{{/en}}{{fr}}Validation de Votre Compte{{/fr}}';
	}

	protected static function getMessage(array $vars = []): string
	{
		$link = 'https://' . $_SERVER['SERVER_NAME'] . '/' . $_SESSION['lang']['current'] . '/activation/' . $vars['id'] . '/' . $vars['token_activation'];
		
		ob_start();
		?>
		<div>
			<h1>CVM-ENV</h1>
			<h2>{{en}}Validation of Your Account{{/en}}{{fr}}Validation de Votre Compte{{/fr}}</h2>
			<div>
				<p>{{en}}Welcome! All you have to do is click on the following link to activate your account.{{/en}}{{fr}}Bienvenue! Il ne vous reste plus qu'à cliquer sur le lien suivant pour activer votre compte.{{/fr}}</p>
				<a href="<?=$link?>"><?=$link?></a>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}
}