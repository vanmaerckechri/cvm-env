(function()
{
	"use strict";

	CVMENV.MemberOnlyController = function(callRouter)
	{
		this.callRouter = callRouter;

		this.title = {
			'en': 'CVM-ENV: Member Only',
			'fr': 'CVM-ENV: Uniquement pour les Membres'
		};

		this.run();
	};

	CVMENV.MemberOnlyController.prototype.run = function()
	{
		var viewManager = CVMENV.Singleton.getInstance('ViewManager');
		viewManager.loadView('memberOnlyView', this.title, 'comeFromTop', null, null, this.start.bind(this));
	};

	CVMENV.MemberOnlyController.prototype.start = function()
	{
		this.callRouter({'controllerLoaded': true}); 
	};

	CVMENV.MemberOnlyController.prototype.close = function()
	{
	};
}());