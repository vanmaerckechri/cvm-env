(function()
{
	"use strict";

	CVMENV.FieldRules = function()
	{
		this.list;
	};

	CVMENV.FieldRules.prototype.setList = function(list)
	{	
		this.list = list;
	};

	CVMENV.FieldRules.prototype.getList = function()
	{	
		return this.list;
	};

	CVMENV.FieldRules.prototype.get = function(key)
	{	
		if (this.list[key])
		{
			return this.list[key];
		}
	};
}());