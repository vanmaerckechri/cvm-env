(function()
{
	"use strict";

	CVMENV.AbstractAjax = function(){};

	CVMENV.AbstractAjax.prototype.getHttpRequest = function()
	{
		if (window.XMLHttpRequest)
		{
			return new XMLHttpRequest();
		}
		else
		{
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
	};

	CVMENV.AbstractAjax.prototype.loadContent = function(method, path, data, callback)
	{
		var httpRequest =  this.getHttpRequest();
		httpRequest.addEventListener('readystatechange', this.manageHttpRequest.bind(this, httpRequest, callback));
		httpRequest.open(method, path, true);
		httpRequest.setRequestHeader('X-Requested-With', 'xmlhttprequest');
		httpRequest.send(data);
	};

	CVMENV.AbstractAjax.prototype.manageHttpRequest = function(httpRequest, callback)
	{
		if (httpRequest.readyState === 4 && httpRequest.status === 200)
		{
			callback(httpRequest.responseText);
		}
	};
}());