(function()
{
	"use strict";

	CVMENV.Spam = function()
	{
		this.time;
		this.callback;
		this.modalManager;
		this.timeout;
		this.interval;
	};

	CVMENV.Spam.prototype.run = function(time, callback)
	{
		this.callback = callback;
		this.time = time;

		if (!document.getElementById('spam_timer'))
		{
			this.modalManager = new CVMENV.ModalManager();
			this.modalManager.load(document.getElementById('app'), 'spamModal', this.launchTimer.bind(this));
		}
		else
		{
			this.launchTimer();
		}
	};

	CVMENV.Spam.prototype.launchTimer = function()
	{
		this.launchTimeout();
		this.launchInterval();
	};

	CVMENV.Spam.prototype.launchTimeout = function()
	{
		clearInterval(this.timeout);

		this.timeout = setTimeout(function()
		{
			clearInterval(this.interval);
			this.modalManager.close();
			this.callback();

		}.bind(this), this.time * 1000);
	};

	CVMENV.Spam.prototype.launchInterval = function()
	{
		clearInterval(this.interval);

		var spamTimer = document.getElementById('spam_timer');
		spamTimer.textContent = Math.round(this.time);

		this.interval = setInterval(function()
		{
			this.time -= 1;
			spamTimer.textContent = this.time;

		}.bind(this), 1000);
	};
}());