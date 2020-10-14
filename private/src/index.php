<?php

require_once '../private/Core/Autoloader.php';

use Core\ {
	App,
	InitValuesForClient,
	ListManager,
	Authentification\Auth,
	Authentification\AuthGoogle,
	Authentification\Oauth,
	Security\ConnectionAttempts,
	Security\SpamBreaker
};
use src\Form\ {
	ChangeEmailForm,
	ChangePasswordForm,
	DeleteAccountForm,
	LoginForm,
	PasswordResetForm,
	ProfilForm,
	RegistrationForm,
	RegistrationGoogleForm
};

App::start();
App::devMode();
SpamBreaker::check();
ConnectionAttempts::init(5, 5);
Auth::user();

if (isset($_POST['action']))
{
	// Auth
	if ($_POST['action'] === 'user')
	{
		App::updateLang();
		echo json_encode(Auth::getUserForClient());
	}
	else if ($_POST['action'] === 'logout')
	{
		Auth::logout();
	}
	// Login
	else if ($_POST['action'] === 'getLoginForm')
	{
		echo json_encode(LoginForm::getForm());
	}
	else if ($_POST['action'] === 'processLoginForm')
	{
		ConnectionAttempts::check($_POST['username']);
		echo json_encode(LoginForm::login());
	}
	// Google Connection
	else if ($_POST['action'] === 'getGoogleConnectionConfig')
	{
		echo json_encode(Oauth::getListForClient('google', ['client_id', 'route']));
	}
	else if ($_POST['action'] === 'getRegisterGoogleForm')
	{
		echo json_encode(RegistrationGoogleForm::getForm());
	}
	else if ($_POST['action'] === 'processRegisterGoogleForm')
	{
		echo json_encode(RegistrationGoogleForm::record());
	}
	else if ($_POST['action'] === 'googleConnection')
	{
		echo json_encode(AuthGoogle::login());
	}
	// My Account
	else if ($_POST['action'] === 'getChangePasswordForm')
	{
		echo json_encode(ChangePasswordForm::getForm());
	}
	else if ($_POST['action'] === 'processChangePasswordForm')
	{
		ConnectionAttempts::check($_SESSION['auth']['username']);
		echo json_encode(ChangePasswordForm::updatePassword());
	}
	else if ($_POST['action'] === 'getChangeEmailForm')
	{
		echo json_encode(ChangeEmailForm::getForm());
	}
	else if ($_POST['action'] === 'processChangeEmailForm')
	{
		ConnectionAttempts::check($_SESSION['auth']['username']);
		echo json_encode(ChangeEmailForm::updateEmail());
	}
	else if ($_POST['action'] === 'getProfilForm')
	{
		echo json_encode(ProfilForm::getForm());
	}
	else if ($_POST['action'] === 'processProfilForm')
	{
		ConnectionAttempts::check($_SESSION['auth']['username']);
		echo json_encode(ProfilForm::updateProfil());
	}
	else if ($_POST['action'] === 'getDeleteAccountForm')
	{
		echo json_encode(DeleteAccountForm::getForm());
	}
	else if ($_POST['action'] === 'checkPasswordToDeleteAccount')
	{
		ConnectionAttempts::check($_SESSION['auth']['username']);
		echo json_encode(DeleteAccountForm::checkPassword());
	}
	else if ($_POST['action'] === 'processDeleteAccountForm')
	{
		ConnectionAttempts::check($_SESSION['auth']['username']);
		echo json_encode(DeleteAccountForm::delete());
	}
	// Reset Password
	else if ($_POST['action'] === 'getPasswordResetMailForm')
	{
		echo json_encode(PasswordResetForm::getFormToSendMail());
	}
	else if ($_POST['action'] === 'processPasswordResetMailForm')
	{
		echo json_encode(PasswordResetForm::sendMail());
	}
	else if ($_POST['action'] === 'getPasswordResetPasswordForm')
	{
		echo json_encode(PasswordResetForm::getFormToChangePassword());
	}
	else if ($_POST['action'] === 'checkPasswordToken')
	{
		echo json_encode(PasswordResetForm::checkPasswordToken($_POST['id'], $_POST['token']));
	}
	else if ($_POST['action'] === 'processPasswordResetPasswordForm')
	{
		echo json_encode(PasswordResetForm::updatePassword());
	}
	// Registration
	else if ($_POST['action'] === 'getRegisterForm')
	{
		echo json_encode(RegistrationForm::getForm());
	}
	else if ($_POST['action'] === 'processRegisterForm')
	{
		echo json_encode(RegistrationForm::record());
	}
	else if ($_POST['action'] === 'accountActivation')
	{
		echo json_encode(RegistrationForm::activation($_POST['id'], $_POST['token']));
	}
	// Init
	else if ($_POST['action'] === 'getInitValues')
	{
		echo json_encode(InitValuesForClient::get());
	}
}