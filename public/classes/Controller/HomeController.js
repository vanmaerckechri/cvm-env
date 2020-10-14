(function()
{
	"use strict";

	CVMENV.HomeController = function(callRouter)
	{
		this.callRouter = callRouter;

		this.title = {
			'en': 'CVM-ENV: Home',
			'fr': 'CVM-ENV: Accueil'
		};

		this.run();
	};

	CVMENV.HomeController.prototype.run = function()
	{
		var viewManager = CVMENV.Singleton.getInstance('ViewManager');
		viewManager.loadView('homeView', this.title, 'comeFromTop', null, this.init.bind(this), this.start.bind(this));
	};

	CVMENV.HomeController.prototype.init = function()
	{
	};

	CVMENV.HomeController.prototype.start = function()
	{
		this.callRouter({'controllerLoaded': true}); 
	};

	CVMENV.HomeController.prototype.close = function()
	{
	};
}());