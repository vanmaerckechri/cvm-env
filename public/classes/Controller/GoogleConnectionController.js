(function()
{
	"use strict";

	CVMENV.GoogleConnectionController = function(callRouter, params)
	{
		this.callRouter = callRouter;
		this.params = params;
		
		this.title = {
			'en': 'CVM-ENV: Google Connection',
			'fr': 'CVM-ENV: Connexion Google'
		};
		this.form;

		this.run();

		CVMENV.AbstractHtmlManager.call(this);
	};

	CVMENV.GoogleConnectionController.prototype = Object.create(CVMENV.AbstractHtmlManager.prototype);
	CVMENV.GoogleConnectionController.prototype.constructor = CVMENV.GoogleConnectionController;

	CVMENV.GoogleConnectionController.prototype.run = function()
	{
		var viewManager = CVMENV.Singleton.getInstance('ViewManager');
		viewManager.loadView('googleConnectionView', this.title, 'opacity', null, null, this.start.bind(this));
	};

	CVMENV.GoogleConnectionController.prototype.start = function()
	{
		this.login();
		this.callRouter({'controllerLoaded': true});
	};

	CVMENV.GoogleConnectionController.prototype.login = function()
	{
		var bridge = new CVMENV.Bridge();
		bridge.ask({'action': 'googleConnection', 'code': this.params.code}, null, function(response)
		{
			if (response === null)
			{
				this.callRouter({'auth': 'logout'});
				return;
			}

			// Connection.
			if (response.success)
			{
				var messageManager = new CVMENV.MessageManager();
				messageManager.displayMessage(response.message, "success", "#googleConnectionView #message", response.customValue);
				this.listenForm(response);
			}
			else
			{
				// Error message (account is ban).
				if (response.message)
				{
					var messageManager = new CVMENV.MessageManager();
					messageManager.displayMessage(response.message, "error", "#googleConnectionView #message")
				}
				// First connection, account need a username.
				else
				{
					this.loadHtml('GET', "googleConnectionForm", null, this.initUsernameForm.bind(this));
				}
			}

		}.bind(this));
	};

	CVMENV.GoogleConnectionController.prototype.initUsernameForm = function(content)
	{
		this.translateAndConvertToProperHtml(document.getElementById('formContainer'), content);
		var form = document.getElementById('registrationGoogleForm');
		this.form = new CVMENV.Form('registerGoogleForm', form, this.listenForm.bind(this));
	};


	CVMENV.GoogleConnectionController.prototype.listenForm = function(response)
	{
		if (response.success)
		{
			CVMENV.Storage.set('auth', response.auth);
			this.callRouter({'auth': 'login'});
		}
	};

	CVMENV.GoogleConnectionController.prototype.close = function() {};
}());