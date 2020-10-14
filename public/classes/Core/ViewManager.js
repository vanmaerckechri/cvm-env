(function()
{
	"use strict";

	CVMENV.ViewManager = function()
	{
		this.path;
		this.title;
		this.animate;
		this.delay;
		this.initController;
		this.startController;

		this.oldView;
		this.newView;
		this.initAnimationClass;
		this.isInit = false;
		this.additionalContent = [];
		this.container = document.getElementById('views');
		this.language = CVMENV.Singleton.getInstance('Language');

		CVMENV.AbstractHtmlManager.call(this);
	};

	CVMENV.ViewManager.prototype = Object.create(CVMENV.AbstractHtmlManager.prototype);
	CVMENV.ViewManager.prototype.constructor = CVMENV.ViewManager;

	CVMENV.ViewManager.prototype.addAdditionalContent = function(additionalContent)
	{
		this.additionalContent.push(additionalContent);
	};

	CVMENV.ViewManager.prototype.loadView = function(path, title, animate, delay, initController, startController)
	{
		this.path = path;
		this.title = title;
		this.animate = animate;
		this.delay = delay;
		this.initController = initController;
		this.startController = startController;

		this.scrollTopInterval = CVMENV.Tools.scrollTop(document.body, function()
		{
			clearInterval(this.scrollTopInterval);
			this.launch();
			
		}.bind(this));
	};

	CVMENV.ViewManager.prototype.launch = function()
	{
		// Load common elements
		this.injectTemplate();

		// Load view
		this.updateOldView();
		this.loadHtml('GET', this.path, null, this.injectView.bind(this, this.container));
	};

	CVMENV.ViewManager.prototype.injectTemplate = function()
	{
		if (!this.isInit)
		{
			this.isInit = true;
			var tags = ['header', 'footer'];

			for (var i = tags.length - 1; i >= 0; i--)
			{
				var tag = tags[i];
				var container = document.querySelector(tag);

				if (container)
				{
					this.loadHtml('GET', tag, null, this.injectContent.bind(this, container));
				}
			}
		}
	};

	CVMENV.ViewManager.prototype.injectView = function(container, content)
	{
		this.newView = this.injectContent(container, content);
		this.injectAdditionalContent();
		
		if (this.initController)
		{
			this.initController();
		}
		// Start the animation only if there is an old view and if the animation is activated on the new one.
		if (!this.oldView || !this.animate)
		{
			this.close();
		}
		else
		{
			this.launchAnimation();
		}
	};

	CVMENV.ViewManager.prototype.injectContent = function(container, content)
	{
		content = this.translateAndConvertToProperHtml(container, content);
		return content;
	};

	CVMENV.ViewManager.prototype.updateOldView = function()
	{
		if (this.newView)
		{
			this.oldView = this.newView;
			this.oldView.classList.add("viewToRemove");
			this.removeIds(this.oldView);
		}
	};

	CVMENV.ViewManager.prototype.removeIds = function(view)
	{
		var ids = view.querySelectorAll('[id]');
		for (var i = ids.length - 1; i >= 0; i--)
		{
			ids[i].removeAttribute('id');
		}
	};

	CVMENV.ViewManager.prototype.updateTitle = function()
	{
		document.title = this.title[this.language.getLang()];
	};

	// This function is used to add dynamic content before the view is displayed.
	CVMENV.ViewManager.prototype.injectAdditionalContent = function()
	{
		for (var i = 0, length = this.additionalContent.length; i < length; i++)
		{
			var containerId = this.additionalContent[i].container;
			var container = document.getElementById(containerId);
			var content = this.additionalContent[i].content;

			while (content.hasChildNodes())
			{
				container.appendChild(content.removeChild(content.firstChild))
			}
		}
	};

	CVMENV.ViewManager.prototype.launchAnimation = function()
	{
		this.initAnimation();
		
		// Prevent any interaction with the new view before the transition animation ends.
		this.newView.classList.add("animate");

		// Update animation delay
		if (this.delay)
		{
			this.newView.style.animationDelay = this.delay;
		}

		var animation = new CVMENV.AnimationManager(this.newView, this.animate, 'keyframes', this.close.bind(this));
	};

	CVMENV.ViewManager.prototype.initAnimation = function()
	{
		this.initAnimationClass = 'init' + CVMENV.Tools.ucfirst(this.animate);
		this.newView.classList.add(this.initAnimationClass);
	};

	CVMENV.ViewManager.prototype.cleanAnimation = function()
	{
		this.newView.classList.remove(this.initAnimationClass);
		this.newView.classList.remove(this.animate);
	};

	CVMENV.ViewManager.prototype.close = function()
	{
		this.updateTitle();
		this.cleanAnimation();
		this.removeOldContainer();
		this.newView.classList.remove("animate");

		if (this.startController)
		{
			this.startController();
		}
	};

	CVMENV.ViewManager.prototype.removeOldContainer = function()
	{
		if (this.oldView)
		{
			this.container.removeChild(this.container.firstChild);
		}
	};
}());