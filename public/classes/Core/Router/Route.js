(function()
{
	"use strict";

	CVMENV.Route = function(name, skeleton, callable, role)
	{
		this.args = {};
		this.params = {};
		this.regexTrimSlash = /^\/+|\/+$/g;

		this.name = name;
		this.skeleton = skeleton.replace(this.regexTrimSlash, '');
		this.path = this.removeParamsFromSkeleton(skeleton);
		this.callable = callable;
		this.role = role;
	};

	CVMENV.Route.prototype.with = function(param, regex)
	{
		this.params[param] = regex.replace('(', '(?:');
		return this;
	};

	CVMENV.Route.prototype.match = function(url)
	{
		url = url.replace(this.regexTrimSlash, '');

		// A ugly URL => https://site?value1=blabla&value2=blibli
		var params = this.saveParamsInUgly(url);

		// Remove ugly params from URL.
		url = url.replace(params, '');

		// A pretty URL => https://site/blabla/blibli
		var regex = this.getPatternForPretty(this.skeleton);
		var matches = url.match(regex);

		// Route doesn't exist!
		if (!matches)
		{
			return false;
		}

		this.saveParamsInPretty(matches);

		return true;
	};

	CVMENV.Route.prototype.saveParamsInUgly = function(url)
	{
		var regex = new RegExp("[\?].*$");
		var params = url.match(regex);

		if (params)
		{
			var paramsSplitted = (params[0].substr(1)).split('&');
			for (var i = paramsSplitted.length - 1; i >= 0; i--)
			{
				var split = paramsSplitted[i].split('=');
				this.args[split[0]] = decodeURIComponent(split[1]);
			}
		}

		return params;
	};

	CVMENV.Route.prototype.saveParamsInPretty = function(values)
	{
		values.shift();

		var i = 0;
		for (var param in this.params)
		{
			this.args[param] = values[i];
			i += 1;
		}
	};

	CVMENV.Route.prototype.getPatternForPretty = function(skeleton)
	{
		for (var param in this.params)
		{
			var regex = new RegExp(':' + param);
			skeleton = skeleton.replace(regex, '(' + this.params[param] + ')');
		}
		return '^' + skeleton + '$';
	};

	CVMENV.Route.prototype.removeParamsFromSkeleton = function(skeleton)
	{
		var regex = new RegExp('\/:.*$');
		return skeleton.replace(regex, '');
	};
}());