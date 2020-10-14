(function()
{
	"use strict";

	CVMENV.RegistrationController = function(callRouter, params)
	{
		this.params = params;
		this.callRouter = callRouter;

		this.title = {
			'en': 'CVM-ENV: Registration',
			'fr': 'CVM-ENV: Inscription'
		};
		this.form;
		this.passwordVisibility;

		this.run();
	};

	CVMENV.RegistrationController.prototype.run = function()
	{
		var viewManager = CVMENV.Singleton.getInstance('ViewManager');
		viewManager.loadView('registrationView', this.title, 'comeFromRight', null, this.init.bind(this), this.start.bind(this));
	};

	CVMENV.RegistrationController.prototype.init = function()
	{
		var form = document.getElementById('registrationForm');
		this.form = new CVMENV.RegisterForm('registerForm', form, this.listenForm.bind(this));
		this.passwordVisibility = new CVMENV.PasswordVisibility('passwordVisibility', 'password', 'passwordConfirm');
	};

	CVMENV.RegistrationController.prototype.start = function()
	{
		this.callRouter({'controllerLoaded': true});
	};

	CVMENV.RegistrationController.prototype.listenForm = function(response)
	{
		if (response.success)
		{
			this.form.isBusy = false;
		}
	};

	CVMENV.RegistrationController.prototype.close = function()
	{
		this.passwordVisibility.close();
	};
}());