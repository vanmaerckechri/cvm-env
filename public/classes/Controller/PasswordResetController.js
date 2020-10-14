(function()
{
	"use strict";

	CVMENV.PasswordResetController = function(callRouter, params)
	{
		this.params = params;
		this.callRouter = callRouter;

		this.title = {
			'en': 'CVM-ENV: Reset your Password',
			'fr': 'CVM-ENV: Réinitialisez votre Mot de Passe'
		};

		this.form;
		this.passwordVisibility;
	};

	CVMENV.PasswordResetController.prototype.launchMailForm = function()
	{
		var viewManager = CVMENV.Singleton.getInstance('ViewManager');
		viewManager.loadView('passwordResetMailFormView', this.title, 'comeFromRight', null, this.initMailForm.bind(this), this.startMailForm.bind(this));
	};

	CVMENV.PasswordResetController.prototype.initMailForm = function()
	{
		var form = document.getElementById('passwordResetForm');
		this.form = new CVMENV.Form('passwordResetMailForm', form, this.listenMailForm.bind(this));
	};

	CVMENV.PasswordResetController.prototype.startMailForm = function()
	{
		this.callRouter({'controllerLoaded': true});
	};

	CVMENV.PasswordResetController.prototype.listenMailForm = function(response)
	{
		if (response.success)
		{
			this.form.isBusy = false;
		}
	};

	CVMENV.PasswordResetController.prototype.launchPasswordForm = function()
	{
		var bridge = new CVMENV.Bridge();
		bridge.ask({'action': 'checkPasswordToken', 'id': this.params.id, 'token': this.params.token}, null, function(response)
		{
			if (response.success)
			{
				this.runPasswordForm();
			}
			else
			{
				var messageManager = new CVMENV.MessageManager();		
				var viewManager = CVMENV.Singleton.getInstance('ViewManager');
				viewManager.loadView('passwordResetTokenView', this.title, null, null, messageManager.displayMessage.bind(this, response.message, "error", "#messageForm"));
			}

		}.bind(this));
	};

	CVMENV.PasswordResetController.prototype.runPasswordForm = function()
	{
		var viewManager = CVMENV.Singleton.getInstance('ViewManager');
		viewManager.loadView('passwordResetPasswordFormView', this.title, null, null, this.initPasswordForm.bind(this), this.startPasswordForm.bind(this));
	};

	CVMENV.PasswordResetController.prototype.initPasswordForm = function()
	{
		var form = document.getElementById('passwordResetForm');
		this.form = new CVMENV.RegisterForm('PasswordResetPasswordForm', form, this.listenPasswordForm.bind(this));
		this.passwordVisibility = new CVMENV.PasswordVisibility('passwordVisibility', 'password', 'passwordConfirm');
	};

	CVMENV.PasswordResetController.prototype.startPasswordForm = function()
	{
		this.callRouter({'controllerLoaded': true});
	};

	CVMENV.PasswordResetController.prototype.listenPasswordForm = function(response)
	{
		if (response.success)
		{
			this.callRouter({'auth': 'login'});
		}
		else
		{
			this.form.isBusy = false;
		}
	};

	CVMENV.PasswordResetController.prototype.close = function()
	{
		if (this.passwordVisibility && this.passwordVisibility.close)
		{
			this.passwordVisibility.close();
		}
	};
}());