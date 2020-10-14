(function()
{
	"use strict";

	CVMENV.Main = function()
	{
		this.logout;
		this.router;
		this.timeoutBeforeLogin;

		this.run();
	};

	CVMENV.Main.prototype.run = function()
	{	
		CVMENV.Singleton.getInstance('Language', ['fr', 'en']);

		var initValues = new CVMENV.Init(function()
		{
			this.logout = new CVMENV.Logout('mainMenu', this.listenChildren.bind(this));
			this.router = new CVMENV.Router(this.listenChildren.bind(this));

			this.initRoutes();

		}.bind(this));
	};

	CVMENV.Main.prototype.initRoutes = function()
	{
		this.router.setRole('0');
		this.router.add('registration/', 'RegistrationController', 'registration');
		this.router.add('activation/:id/:token', 'AccountActivationController', 'accountActivation').with('id', '[0-9]+').with('token', '([a-z0-9]+)');
		this.router.add('password_reset/:id/:token', 'PasswordResetController#launchPasswordForm', 'passwordResetPasswordForm').with('id', '[0-9]+').with('token', '([a-z0-9]+)');
		this.router.add('password_reset/', 'PasswordResetController#launchMailForm', 'passwordResetMailForm');
		this.router.add('login/', 'LoginController', 'login');
		this.router.add('google-connection/', 'GoogleConnectionController', 'googleConnection');
		this.router.setRole('[1-9][0-9]*');
		this.router.add('my_account/', 'MyAccountController', 'myAccount').with('id', '[0-9]+').with('token', '([a-z0-9]+)');
		this.router.add('member_only/', 'MemberOnlyController', 'memberOnly');
		this.router.setRole('.*');
		this.router.add('/', 'HomeController', 'home');
		this.router.add('404/', 'Page404Controller', '404');

		this.router.init();
	};

	CVMENV.Main.prototype.filterRoute = function(route, user)
	{
		var role = user ? user.role : 0;
		var regex = new RegExp('^' + route.role + '$');

		// User is not authorized to use this route.
		if (!regex.test(role))
		{
			// Visitors.
			if (parseInt(role) === 0)
			{
				// Redirect to the desired route after logging in.
				if (route.name != 'myAccount')
				{
					this.router.redirection = route;
				}
				// Default route redirection for visitors.
				return this.router.namedRoutes['login'];

			}
			// Members.
			else if (parseInt(role) === 1)
			{
				// Default route redirection for members.
				return this.router.namedRoutes['memberOnly'];
			}
		}
		return null;
	};

	CVMENV.Main.prototype.listenChildren = function(response)
	{	
		if (response.auth)
		{
			if (response.auth == 'login')
			{
				this.timeoutBeforeLogin = setTimeout(function()
				{
					this.router.updateRouteByName('memberOnly');

				}.bind(this), 1500);
			}
			else if (response.auth == 'logout')
			{
				this.router.updateRouteByName('login');
			}
		}
		else if (response.controllerLoaded)
		{
			this.logout.update(response.user)
		}
		else if (response.filterRoute)
		{
			return this.filterRoute(response.route, response.user);
		}
	};
}());