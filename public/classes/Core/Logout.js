(function()
{
	"use strict";

	CVMENV.Logout = function(containerId, callMain)
	{
		this.user;
		this.container = null;

		this.language = CVMENV.Singleton.getInstance('Language');
		this.eventManager = new CVMENV.EventManager();
		this.containerId = containerId;
		this.callMain = callMain;

		CVMENV.AbstractHtmlManager.call(this);
	};

	CVMENV.Logout.prototype = Object.create(CVMENV.AbstractHtmlManager.prototype);
	CVMENV.Logout.prototype.constructor = CVMENV.Logout;

	CVMENV.Logout.prototype.update = function(user)
	{	
		this.user = user;

		var filename;

		if (!user)
		{
			this.selectContent("headerUserConnected", "headerUserNotConnected");
		}
		else
		{
			this.selectContent("headerUserNotConnected", "headerUserConnected");
		}
	};

	CVMENV.Logout.prototype.selectContent = function(elemToRemove, elemToInject)
	{
		CVMENV.Tools.removeDomElement(document.getElementById(elemToRemove));

		if (!document.getElementById(elemToInject))
		{
			this.loadHtml('GET', elemToInject, null, this.injectContent.bind(this));
		}
	};

	CVMENV.Logout.prototype.injectContent = function(content)
	{
		this.container = this.container === null ? document.getElementById(this.containerId) : this.container;
		this.content = this.translateAndConvertToProperHtml(this.container, content);
		this.updateUsername();
		this.initEvents();
	};

	CVMENV.Logout.prototype.updateUsername = function()
	{
		if (!this.user)
		{
			return;
		}

		var target = document.getElementById('myAccountUsername');

		if (target.textContent != this.user.username)
		{
			target.textContent = this.user.username;
		}
	};

	CVMENV.Logout.prototype.initEvents = function()
	{
		this.btn = document.getElementById("logout");
		if (this.btn)
		{
			this.eventManager.add('clickBtnToLogout', this.btn, 'click', this.disconnection.bind(this));
		}
	};

	CVMENV.Logout.prototype.disconnection = function()
	{	
		this.eventManager.removeAll();
		var bridge = new CVMENV.Bridge();
		bridge.ask({'action': 'logout'}, null, function()
		{
			CVMENV.Storage.remove('auth');
			this.callMain({'auth': 'logout'});

		}.bind(this));
	};
}());
