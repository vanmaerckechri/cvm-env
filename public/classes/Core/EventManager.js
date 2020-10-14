(function()
{
	"use strict";

	CVMENV.EventManager = function()
	{
		this.list = {};
	};

	CVMENV.EventManager.prototype.add = function(name, elem, event, method, params)
	{	
		this.list[name] = {elem: elem, event: event, method: method, params: params};

		if (params)
		{
			elem.addEventListener(event, method, params);
		}
		else
		{
			elem.addEventListener(event, method);
		}
	};

	CVMENV.EventManager.prototype.cleanList = function()
	{
		for (var name in this.list)
		{
			if (!document.body.contains(this.list[name].elem))
			{
				this.remove(name);
			}
		}
	};

	CVMENV.EventManager.prototype.remove = function(name)
	{
		if (this.list[name])
		{
			if (this.list[name].params)
			{
				this.list[name].elem.removeEventListener(this.list[name].event, this.list[name].method, this.list[name].params);
			}
			else
			{
				this.list[name].elem.removeEventListener(this.list[name].event, this.list[name].method);
			}

			delete this.list[name];
		}
	};

	CVMENV.EventManager.prototype.removeAll = function()
	{
		for (var name in this.list)
		{
			this.remove(name);
		}
	};
}());