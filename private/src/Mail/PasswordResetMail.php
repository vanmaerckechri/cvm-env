<?php

namespace src\Mail;

use Core\AbstractMail;

class PasswordResetMail extends AbstractMail
{
	protected static function getHeader(): string
	{
		$header = "From: CVM-ENV <robot@cvm.com>\n";
		$header .= "Content-Type: text/html; charset=\"UTF-8\"\n";
		$header .= "Content-Transfer-Encoding: 8bit";

		return $header;
	}

	protected static function getSubject(): string
	{
		return '{{en}}Change Password{{/en}}{{fr}}Modification du Mot de Passe{{/fr}}';
	}

	protected static function getMessage(array $vars = []): string
	{
		$link = 'https://' . $_SERVER['SERVER_NAME'] . '/' . $_SESSION['lang']['current'] . '/password_reset/' . $vars['id'] . '/' . $vars['token_password'];
		
		ob_start();
		?>
		<div>
			<h1>CVM-ENV</h1>
			<h2>
				{{en}}Change Password{{/en}}
				{{fr}}Modification du Mot de Passe{{/fr}}
			</h2>
			<div>
				<p>
					{{en}}All you have to do is click on the following link to change your password.{{/en}}
					{{fr}}Il ne vous reste plus qu'à cliquer sur le lien suivant pour modifier votre mot de passe.{{/fr}}
				</p>
				<a href="<?=$link?>"><?=$link?></a>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}
}