(function()
{
	"use strict";

	CVMENV.AnimationManager = function(container, animationName, animationType, callBack)
	{
		this.eventManager = new CVMENV.EventManager();
		this.container = container;
		this.callBack = callBack;
		this.animationName = animationName;
		this.animationType = animationType;
		this.endEventName;
		this.run();
	};

	CVMENV.AnimationManager.prototype.run = function()
	{
		this.initEvents();
		this.launchAnimation();
	};

	CVMENV.AnimationManager.prototype.initEvents = function()
	{
		this.endEventName = this.animationType === 'transition' ? this.getTransitionEndEventName() : this.getAnimationEndEventName();
		this.eventManager.add('endAnimationToClose', this.container, this.endEventName, this.close.bind(this, true));
	};

	CVMENV.AnimationManager.prototype.close = function(isCallBack)
	{
		this.eventManager.removeAll();
		if (isCallBack === true)
		{
			this.callBack();
		}
	};

	CVMENV.AnimationManager.prototype.launchAnimation = function()
	{
		this.container.classList.add(this.animationName);
	};

	CVMENV.AnimationManager.prototype.getTransitionEndEventName = function()
	{
		var transitions =
		{
			"transition"      : "transitionend",
			"OTransition"     : "oTransitionEnd",
			"MozTransition"   : "transitionend",
			"WebkitTransition": "webkitTransitionEnd"
		};
		return this.getEndEventName(transitions);
	};

	CVMENV.AnimationManager.prototype.getAnimationEndEventName = function()
	{
		var animations =
		{
		    "animation"      : "animationend",
		    "OAnimation"     : "oAnimationEnd",
		    "MozAnimation"   : "animationend",
		    "WebkitAnimation": "webkitAnimationEnd"
		};
		return this.getEndEventName(animations);
	};

	CVMENV.AnimationManager.prototype.getEndEventName = function(types)
	{
		var bodyStyle = document.body.style;
		for(var type in types)
		{
			if(bodyStyle[type] != undefined)
			{
				return types[type];
			} 
		}
	};
}());