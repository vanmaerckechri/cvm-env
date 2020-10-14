(function()
{
	"use strict";

	CVMENV.Page404Controller = function(callRouter)
	{
		this.callRouter = callRouter;

		this.title = {
			'en': 'CVM-ENV: 404 Error',
			'fr': 'CVM-ENV: Erreur 404'
		};

		this.run();
	};

	CVMENV.Page404Controller.prototype.run = function()
	{
		var viewManager = CVMENV.Singleton.getInstance('ViewManager');
		viewManager.loadView('page404View', this.title, null, null, this.start.bind(this));
	};

	CVMENV.Page404Controller.prototype.start = function()
	{
		this.callRouter({'controllerLoaded': true});
	};
}());