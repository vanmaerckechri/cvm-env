(function()
{
	"use strict";

	CVMENV.DeleteAccountForm = function(formName, form, successMessage, callback)
	{
		CVMENV.Form.call(this, formName, form, successMessage, callback);
	};

	CVMENV.DeleteAccountForm.prototype = Object.create(CVMENV.Form.prototype);
	CVMENV.DeleteAccountForm.prototype.constructor = CVMENV.DeleteAccountForm;

	CVMENV.DeleteAccountForm.prototype.submit = function(e)
	{
		e.preventDefault();

		if (this.isBusy)
		{
			return;
		}

		if (this.checkFields())
		{
			this.isBusy = true;

			var bridge = new CVMENV.Bridge();
			bridge.ask({'action': 'checkPasswordToDeleteAccount'}, this.form, function(response)
			{
				if (response.success === false)
				{
					this.listenServerRequestResult(response);
				}
				else
				{
					var confirmation = new CVMENV.Confirmation("deleteAccountConfirmationModal", this.confirmDelete.bind(this), this.cancelDelete.bind(this));
				}

			}.bind(this));

		}
	};

	CVMENV.DeleteAccountForm.prototype.confirmDelete = function()
	{
		var bridge = new CVMENV.Bridge();
		var action = 'process' + CVMENV.Tools.ucfirst(this.formName);
		bridge.ask({'action': action}, this.form, function(response)
		{
			this.listenServerRequestResult(response);

		}.bind(this));
	};

	CVMENV.DeleteAccountForm.prototype.cancelDelete = function()
	{
		this.addFormSuccessMessage();
		this.callController({"success": true, "cancel": true});
	};
}());