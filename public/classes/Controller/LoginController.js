(function()
{
	"use strict";

	CVMENV.LoginController = function(callRouter)
	{
		this.callRouter = callRouter;

		this.title = {
			'en': 'CVM-ENV: Connection',
			'fr': 'CVM-ENV: Connexion'
		};
		this.timeoutBeforeLogin = null;
		this.form;
		this.passwordVisibility;

		this.run();
	};

	CVMENV.LoginController.prototype.run = function()
	{
		var viewManager = CVMENV.Singleton.getInstance('ViewManager');
		viewManager.loadView('loginView', this.title, 'comeFromRight', null, this.init.bind(this), this.start.bind(this));
	};

	// The view is loaded but the page is not yet displayed.
	CVMENV.LoginController.prototype.init = function()
	{
		CVMENV.Singleton.getInstance('Oauth').mountLink('google', 'googleBtn');

		var form = document.getElementById('loginForm');
		this.form = new CVMENV.Form('loginForm', form, this.listenForm.bind(this), ["username", "password"]);
		this.passwordVisibility = new CVMENV.PasswordVisibility('passwordVisibility', 'password');
	};

	// The view is displayed.
	CVMENV.LoginController.prototype.start = function()
	{
		this.callRouter({'controllerLoaded': true});
	};

	CVMENV.LoginController.prototype.listenForm = function(response)
	{
		if (response.success)
		{
			this.callRouter({'auth': 'login'});
		}
	};

	CVMENV.LoginController.prototype.close = function()
	{
		this.passwordVisibility.close();
	};
}());