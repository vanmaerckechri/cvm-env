(function()
{
	"use strict";

	CVMENV.Singleton = (function()
	{
		var instances = {};

		var createInstance = function(classname, arg)
		{
			var that = Object.create(CVMENV[classname].prototype);
			return CVMENV[classname].apply(that, arg) || that;
		};
		return {
			getInstance: function()
			{
				var classname = Array.prototype.shift.apply(arguments);

				if (!instances[classname])
				{
					instances[classname] = createInstance(classname, arguments);
				}
				return instances[classname];
			}
		};
	})();
}());