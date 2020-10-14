(function()
{
	"use strict";

	CVMENV.RegisterForm = function(formName, form, successMessage, callback)
	{
		CVMENV.Form.call(this, formName, form, successMessage, callback);
	};

	CVMENV.RegisterForm.prototype = Object.create(CVMENV.Form.prototype);
	CVMENV.RegisterForm.prototype.constructor = CVMENV.RegisterForm;

	CVMENV.RegisterForm.prototype.checkValue = function(field, pattern, value)
	{
		if (field == 'passwordConfirm')
		{
			if (!this.eventManager.list['inputPasswordToUpdateConfirm'])
			{
				this.eventManager.add('inputPasswordToUpdateConfirm', this.fields['password'].fieldTarget, 'input', this.fieldToUpdate.bind(this, field));
			}
			return this.checkPasswordConfirm(this.fields['password'].fieldTarget.value, value);
		}
		else
		{
			var regex = new RegExp(pattern);
			return regex.test(value);
		}
	};

	CVMENV.RegisterForm.prototype.checkPasswordConfirm = function(passwordValue, passwordConfirmValue)
	{
		return passwordValue === passwordConfirmValue;
	};
}());