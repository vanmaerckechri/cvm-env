(function()
{
	"use strict";

	CVMENV.Storage = function(){};

	CVMENV.Storage.get = function(itemName)
	{	
		return JSON.parse(sessionStorage.getItem(itemName));
	};

	CVMENV.Storage.set = function(itemName, content)
	{	
		sessionStorage.setItem('auth', JSON.stringify(content));
	};

	CVMENV.Storage.remove = function(itemName)
	{	
		sessionStorage.removeItem(itemName);
	};
}());
