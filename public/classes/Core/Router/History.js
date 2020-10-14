(function()
{
	"use strict";

	CVMENV.History = function(updateRoute)
	{
		this.updateRoute = updateRoute;
		this.eventManager = new CVMENV.EventManager();
		this.isUpdateState = true;

		this.initEvents();
	};

	CVMENV.History.prototype.initEvents = function()
	{
		this.eventManager.add('onpopstate', window, 'popstate', this.navigate.bind(this));
	};

	CVMENV.History.prototype.update = function(url, action)
	{
		if (!this.isUpdateState)
		{
			this.isUpdateState = true;
			return;
		}

		history[action]({'url': url}, "", url);
	};

	CVMENV.History.prototype.navigate = function(e)
	{
		if (e.state === null)
		{
			return;
		}
		
		this.isUpdateState = false;
		this.updateRoute(e.state.url, true);
	};
}());