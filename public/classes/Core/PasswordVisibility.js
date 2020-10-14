(function()
{
	"use strict";

	CVMENV.PasswordVisibility = function(btnId, pwdId, pwdConfirmationId)
	{
		this.btn = document.getElementById(btnId);
		this.pwd = document.getElementById(pwdId);
		this.pwdConfirmation = pwdConfirmationId !== null ? document.getElementById(pwdConfirmationId) : null;
		this.eventManager = new CVMENV.EventManager();

		this.initEvents();
	};

	CVMENV.PasswordVisibility.prototype.initEvents = function()
	{
		this.eventManager.add('clickBtnToToggleVisibility', this.btn, 'click', this.toggleVisibility.bind(this));
	};

	CVMENV.PasswordVisibility.prototype.toggleVisibility = function()
	{
		var list = [this.pwd, this.pwdConfirmation];

		for (var i = list.length - 1; i >= 0; i--)
		{
			var target = list[i];

			if (target)
			{
				if (target.getAttribute('type') == 'password')
				{
					target.setAttribute('type', 'text');
					this.btn.classList.add('text');
					this.btn.classList.remove('pwd');
				}
				else
				{
					target.setAttribute('type', 'password');
					this.btn.classList.add('pwd');
					this.btn.classList.remove('text');
				}
			}
		}
	};

	CVMENV.PasswordVisibility.prototype.close = function()
	{	
		this.eventManager.removeAll();
	};
}());
