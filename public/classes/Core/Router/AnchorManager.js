(function()
{
	"use strict";

	CVMENV.AnchorManager = function(callRouter)
	{
		this.isBusy = false;
		this.eventManager = new CVMENV.EventManager();
		this.callRouter = callRouter;
		this.uniqueId = 0;
	};

	CVMENV.AnchorManager.prototype.update = function()
	{
		this.eventManager.cleanList();

		this.isBusy = false;
		var list = document.querySelectorAll('[data-href]');
		for (var i = list.length - 1; i >= 0; i--)
		{
			var a = list[i];
			a.setAttribute('href', a.getAttribute('data-href'));
			a.removeAttribute('data-href');
			this.eventManager.add('clickAnchorToCallRoute' + this.uniqueId, a, 'click', this.callRoute.bind(this));
			this.uniqueId += 1;
		}
	};

	CVMENV.AnchorManager.prototype.callRoute = function(e)
	{
		// link ex: routeName(arg01: arg01, arg02: arg02)
		
		e.preventDefault();

		if (!this.isBusy)
		{
			this.isBusy = true;

			var hrefSplitted = (e.target.getAttribute('href')).split('(');
			var routeName = hrefSplitted[0].replace(/^ +| +$/g, '');

			var args;
			if (hrefSplitted[1])
			{
				hrefSplitted[1] = '{' + hrefSplitted[1].replace(')', '}');
				args = JSON.parse(hrefSplitted[1].replace(/\'/g, '"'));
			}

			this.callRouter(routeName, args);
		}
	};
}());