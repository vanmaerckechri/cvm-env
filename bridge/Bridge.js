(function()
{
	"use strict";

	CVMENV.Bridge = function()
	{
		this.respondToMother;
		this.data;

		CVMENV.AbstractAjax.call(this);
	};

	CVMENV.Bridge.prototype = Object.create(CVMENV.AbstractAjax.prototype);
	CVMENV.Bridge.prototype.constructor = CVMENV.Bridge;

	CVMENV.Bridge.prototype.listenServerResponse = function(response)
	{
		if (!response)
		{
			this.respondToMother();
			return;
		}

		response = JSON.parse(response);

		if (response && response.spam)
		{
			var spam = CVMENV.Singleton.getInstance("Spam");
			spam.run(response.time, this.importContent.bind(this));
			return;
		}

		this.respondToMother(response);
	};

	CVMENV.Bridge.prototype.ask = function(datas, form, callback)
	{
		this.respondToMother = callback;

		this.data = form ? new FormData(form) : new FormData();
		for (var name in datas)
		{
			this.data.append(name, datas[name]);
		}

		this.importContent();
	};

	CVMENV.Bridge.prototype.importContent = function(datas, form, callback)
	{
		this.loadContent('POST', 'bridge\\Bridge.php', this.data, this.listenServerResponse.bind(this));
	};
}());