(function()
{
	"use strict";

	CVMENV.Oauth = function(){};

	CVMENV.Oauth.prototype.mountLink = function(network, id)
	{
		var bridge = new CVMENV.Bridge();
		bridge.ask({'action': 'getGoogleConnectionConfig'}, null, function(response)
		{
			var lang = 	CVMENV.Singleton.getInstance('Language');
			lang = lang.display ? lang.getLang() + '/' : '';
			
			var method = network + 'Pattern';

			var baseUri = CVMENV.Tools.baseURI() + lang;
			var route = response.route;
			var clientId = response.client_id;

			var googleBtn = document.getElementById(id);
			googleBtn.setAttribute('href', this[method](baseUri, route, clientId));

		}.bind(this));

	};

	CVMENV.Oauth.prototype.googlePattern = function(baseUri, route, clientId)
	{
		return "https://accounts.google.com/o/oauth2/v2/auth?scope=profile email&access_type=online&redirect_uri=" + baseUri + route + "&response_type=code&client_id=" + clientId;
	};
}());