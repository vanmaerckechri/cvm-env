(function()
{
	"use strict";

	CVMENV.MyAccountController = function(callRouter)
	{
		this.callRouter = callRouter;

		this.title = {
			'en': 'CVM-ENV: My Account',
			'fr': 'CVM-ENV: Mon compte'
		};

		this.changePasswordForm;
		this.oldPasswordVisibility;
		this.newPasswordVisibility;

		this.changeEmailForm;
		this.passwordToChangeEmailVisibility;

		this.profilForm;
		this.passwordForProfilVisibility;

		this.deleteAccountForm;
		this.passwordToDeleteAccountVisibility;

		this.run();
	};

	CVMENV.MyAccountController.prototype.run = function()
	{
		var viewManager = CVMENV.Singleton.getInstance('ViewManager');
		viewManager.loadView('myAccountView', this.title, 'comeFromRight', null, this.init.bind(this), this.start.bind(this));
	};

	CVMENV.MyAccountController.prototype.init = function()
	{
		this.initForms(["changePassword", "changeEmail", 'profil', 'deleteAccount']);
	};

	CVMENV.MyAccountController.prototype.initForms = function(form)
	{
		this.initFormContent();

		for (var i = form.length - 1; i >= 0; i--)
		{
			var formTarget = document.getElementById(form[i] + "Form");

			if (form[i] == "changePassword")
			{
				this.changePasswordForm = new CVMENV.RegisterForm("changePasswordForm", formTarget, this.listenForm.bind(this, "changePasswordForm"), ["oldPassword"]);
				this.oldPasswordVisibility = new CVMENV.PasswordVisibility('oldPasswordVisibility', 'oldPassword');
				this.newPasswordVisibility = new CVMENV.PasswordVisibility('passwordVisibility', 'password', 'passwordConfirm');
			}
			else if (form[i] == "changeEmail")
			{
				this.changeEmailForm = new CVMENV.Form("changeEmailForm", formTarget, this.listenForm.bind(this, "changeEmailForm"), ["passwordToChangeEmail"]);
				this.passwordToChangeEmailVisibility = new CVMENV.PasswordVisibility('passwordToChangeEmailVisibility', 'passwordToChangeEmail');
			}
			else if (form[i] == "profil")
			{
				this.profilForm = new CVMENV.Form("profilForm", formTarget, this.listenForm.bind(this, "profilForm"), ["passwordForProfil"]);
				this.passwordForProfilVisibility = new CVMENV.PasswordVisibility('passwordForProfilVisibility', 'passwordForProfil');
			}
			else
			{
				this.deleteAccountForm = new CVMENV.DeleteAccountForm("deleteAccountForm", formTarget, this.listenForm.bind(this, "deleteAccountForm"), ["passwordToDeleteAccount"]);
				this.passwordToDeleteAccountVisibility = new CVMENV.PasswordVisibility('passwordToDeleteAccountVisibility', 'passwordToDeleteAccount');
			}
		}
	};

	CVMENV.MyAccountController.prototype.initFormContent = function(form)
	{
		var auth = CVMENV.Storage.get('auth');
		document.getElementById('firstname').setAttribute('value', auth.firstname);
		document.getElementById('lastname').setAttribute('value', auth.lastname);
		document.getElementById('email').setAttribute('value', auth.email);
	};

	CVMENV.MyAccountController.prototype.start = function()
	{
		this.callRouter({'controllerLoaded': true});
	};

	CVMENV.MyAccountController.prototype.listenForm = function(formName, response)
	{
		if (response.success)
		{
			if (formName == "deleteAccountForm" && response.cancel === false)
			{
				this.close();
				
				this.timeout = setTimeout(function()
				{
					this.callRouter({'auth': 'logout'});				

				}.bind(this), 1500)
			}
			else
			{
				this[formName].isBusy = false;
			}
		}
		else
		{
			if (response.error == 'logout')
			{
				this.callRouter({'auth': 'logout'});
				return;
			}
		}
		this.cleanPasswordInput(formName);
	};

	CVMENV.MyAccountController.prototype.cleanPasswordInput = function(formName)
	{
		var form = document.getElementById(formName);
		var targets = form.querySelectorAll('[data-type=password]');
		for (var i = targets.length - 1; i >= 0; i--)
		{
			targets[i].value = '';
		}
	};

	CVMENV.MyAccountController.prototype.close = function()
	{
		var visibilityList = ["oldPasswordVisibility", "newPasswordVisibility", "passwordToChangeEmailVisibility", "passwordForProfilVisibility", "passwordToDeleteAccountVisibility"];

		for (var i = visibilityList.length - 1; i >= 0; i--)
		{
			this[visibilityList[i]].close();
		}
	};
}());