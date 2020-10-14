(function()
{
	"use strict";

	CVMENV.Router = function(callMain)
	{
		this.callMain = callMain;
		this.history = new CVMENV.History(this.updateRoute.bind(this));
		this.anchorManager = CVMENV.Singleton.getInstance("AnchorManager", this.updateRouteByName.bind(this));
		this.spam = CVMENV.Singleton.getInstance("Spam");
		this.role = '[0-9]+';
		this.routes = [];
		this.namedRoutes = {};
		this.isControllerLoading = false;
		this.redirection;
		this.waitingUrl;
		this.user;
	};

	CVMENV.Router.prototype.init = function()
	{
		var url = window.location.href;
		this.updateRoute(url, true);
	};

	CVMENV.Router.prototype.setRole = function(regex)
	{
		this.role = regex;
	};

	CVMENV.Router.prototype.add = function(skeleton, callable, name)
	{
		var route = new CVMENV.Route(name, skeleton, callable, this.role);
		this.routes.push(route);
		if (name)
		{
			this.namedRoutes[name] = route;
		}
		return route;
	};

	CVMENV.Router.prototype.getCurrentRoute = function()
	{
		for (var i = this.routes.length - 1; i >= 0; i--)
		{
			var route = this.routes[i];

			if (route.match(this.getUrlWithoutBase()))
			{
				return route;
			}
		}

		return null;
	};

	CVMENV.Router.prototype.getUrlWithoutBase = function()
	{
		var lang = CVMENV.Singleton.getInstance('Language').getLang() + '/';
		var url = location.href.replace(CVMENV.Tools.baseURI(), '');
		var regex = new RegExp('^' + lang + '?');
		return url.replace(regex, '');
	};

	CVMENV.Router.prototype.mountUrl = function(skeleton, args)
	{
		var lang = CVMENV.Singleton.getInstance('Language');
		lang = lang.display ? lang.getLang() + '/' : '';
		var url = CVMENV.Tools.baseURI() + lang + skeleton;
		if (args)
		{
			for (var arg in args)
			{
				url = url.replace(':' + arg, args[arg]);
			}
		}
		return url;
	};

	CVMENV.Router.prototype.updateRouteByName = function(routeName, args)
	{
		var skeleton = this.namedRoutes[routeName].skeleton;
		this.updateRoute(this.mountUrl(skeleton, args));
	};

	CVMENV.Router.prototype.updateRoute = function(url, isFirstRoute)
	{
		// If a controller is already busy loading, put the requested url on hold.
		if (this.isControllerLoading)
		{
			this.waitingUrl = url;
			return;
		}

		this.isControllerLoading = true;

		// Check if the user is logged in.
		var lang = CVMENV.Singleton.getInstance('Language');
		var bridge = new CVMENV.Bridge();

		bridge.ask({'action': 'user', 'lang': lang.getLang(), 'langList': JSON.stringify(lang.list)}, null, function(user)
		{
			this.updateUser(user);

			url = this.checkRedirectionAfterLogin(user, url);

			// Update URL.
			this.history.update(url, isFirstRoute ? 'replaceState' : 'pushState');

			// Get current route and filter it before loading the controller.
			var route = this.getRouteFiltered();
			this.loadController(route);

		}.bind(this));
	};

	CVMENV.Router.prototype.updateUser = function(user)
	{
		if (user && user.username && user.id)
		{
			CVMENV.Storage.set('auth', user);
		}
		else
		{
			CVMENV.Storage.remove('auth');
		}

		this.user = user;
	};

	CVMENV.Router.prototype.checkRedirectionAfterLogin = function(user, url)
	{
		if (user && this.redirection)
		{
			url = this.mountUrl(this.redirection.skeleton, this.redirection.args);
		}
		this.redirection = null;
		return url;
	};

	CVMENV.Router.prototype.getRouteFiltered = function()
	{
		var route = this.getCurrentRoute();

		if (route)
		{
			var routeFiltered = this.callMain({'filterRoute': true, 'route': route, 'user': this.user});
			// Redirection following the authentication filter.
			if (routeFiltered !== null)
			{
				route = routeFiltered;
				var url = this.mountUrl(route.skeleton);
				this.history.update(url, 'replaceState');
			}
		}
		else
		{	
			return this.namedRoutes['404'];
		}

		return route;
	};

	CVMENV.Router.prototype.closeLastController = function()
	{
		if (this.controller && this.controller.close)
		{
			this.controller.close();
		}
	};

	CVMENV.Router.prototype.loadController = function(route)
	{
		this.closeLastController();

		var nfo = this.getControllerInfos(route);
		// Instantiate the controller.
		this.controller = new CVMENV[nfo.controller](this.listenController.bind(this), route.args);
		// Start the method.
		if (nfo.method)
		{
			this.controller[nfo.method]();
		}
	};

	CVMENV.Router.prototype.getControllerInfos = function(route)
	{
		var callableSplitted = route.callable.split('#');
		return {controller: callableSplitted[0], method: callableSplitted[1]};
	};

	CVMENV.Router.prototype.listenController = function(response)
	{
		// Controller is loaded.
		if (response.controllerLoaded)
		{
			this.isControllerLoading = false;
			this.lookAtWaitingUrl();
		}

		response.user = this.user;
		this.callMain(response);
	};

	CVMENV.Router.prototype.lookAtWaitingUrl = function()
	{
		if (this.waitingUrl)
		{
			var url = this.waitingUrl;
			this.waitingUrl = null;
			this.updateRoute(url);
		}
	};
}());