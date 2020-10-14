(function()
{
	"use strict";

	CVMENV.AccountActivationController = function(callRouter, params)
	{
		this.params = params;
		this.callRouter = callRouter;

		this.title = {
			'en': 'CVM-ENV: Account Activation',
			'fr': 'CVM-ENV: Activation du Compte'
		};

		this.run();
	};

	CVMENV.AccountActivationController.prototype.run = function()
	{
		var viewManager = CVMENV.Singleton.getInstance('ViewManager');
		viewManager.loadView('accountActivation', this.title, 'comeFromRight', null, this.init.bind(this), this.start.bind(this));
	};

	CVMENV.AccountActivationController.prototype.init = function()
	{
		this.activation();
	};

	CVMENV.AccountActivationController.prototype.start = function()
	{
		this.callRouter({'controllerLoaded': true});
	};

	CVMENV.AccountActivationController.prototype.activation = function()
	{
		var bridge = new CVMENV.Bridge();
		bridge.ask({'action': 'accountActivation', 'id': this.params.id, 'token': this.params.token}, null, function(response)
		{
			var messageManager = new CVMENV.MessageManager();
			if (response.success)
			{
				messageManager.displayMessage(response.message, "success", "#messageForm");
				this.callRouter({'auth': 'login'});
			}
			else
			{
				messageManager.displayMessage(response.message, "error", "#messageForm");
			}

		}.bind(this));
	};

	CVMENV.AccountActivationController.prototype.close = function() {};
}());