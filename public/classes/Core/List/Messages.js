(function()
{
	"use strict";

	CVMENV.Messages = function()
	{
		this.list;
		this.lang = CVMENV.Singleton.getInstance('Language').getLang();
	};

	CVMENV.Messages.prototype.setList = function(list)
	{	
		this.list = list;
	};

	CVMENV.Messages.prototype.getList = function()
	{	
		return this.list;
	};

	CVMENV.Messages.prototype.get = function(message)
	{	
		if (this.list[message])
		{
			return this.list[message][this.lang];
		}
	};
}());