(function()
{
	"use strict";

	CVMENV.Tools = function(){};

	CVMENV.Tools.ucfirst = function(str)
	{
    	return str.charAt(0).toUpperCase() + str.slice(1);
	};

	CVMENV.Tools.baseURI = function()
	{
		var baseUri = document.baseUri;
		if (typeof baseUri == "undefined")
		{
			baseUri = document.querySelector('base').href;
		}
		return baseUri;
	};

	CVMENV.Tools.createElement = function(tag, attributes, container, content)
	{
		var elem = document.createElement(tag);

		if (attributes)
		{
			for (var attribute in attributes)
			{
				elem.setAttribute(attribute, attributes[attribute]);
			}
		}
		if (content)
		{
			elem.textContent = content;
		}
		if (container)
		{
			container.appendChild(elem);
		}

		return elem;
	};

	CVMENV.Tools.convertToProperHtml = function(content)
	{	
		var container = document.createElement('div');
		container.innerHTML = content;
		return container.firstChild;
	};

	CVMENV.Tools.removeDomElement = function(element)
	{	
		if (element && element.parentNode)
		{
			element.parentNode.removeChild(element);
		}
	};

	CVMENV.Tools.checkMobile = function()
	{
		var mobiles = [
	        /Android/i,
	        /webOS/i,
	        /iPhone/i,
	        /iPad/i,
	        /iPod/i,
	        /BlackBerry/i,
	        /Windows Phone/i
    	];

    	for (var i = mobiles.length - 1; i >= 0; i--)
    	{
    		if (navigator.userAgent.match(mobiles[i]))
    		{
    			return true;
    		}
    	}
    	return false;
	};

	CVMENV.Tools.scrollTop = function(target, callback)
	{
		target.style.pointerEvents = 'none';
		var tempo = Math.ceil(target.scrollTop / 10);
		var startTime = new Date();

		return setInterval(function()
		{
			target.scrollTop -= tempo;
			
			if (target.scrollTop <= 0 || new Date() - startTime > 500)
			{
				target.style.pointerEvents = '';
				target.scrollTop = 0;
				callback();
			}
		}.bind(this), 16);
	};
}());