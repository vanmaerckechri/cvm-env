(function()
{
	"use strict";

	CVMENV.Form = function(formName, form, callback, fieldsShouldNotBeChecked)
	{
		this.formName = formName;
		this.form = form;
		this.isBusy = false;
		this.callController = callback;
		this.fieldsShouldNotBeChecked = fieldsShouldNotBeChecked;
		this.fields = {};
		this.eventManager = new CVMENV.EventManager();
		this.messageManager = new CVMENV.MessageManager();

		this.init();
	};

	CVMENV.Form.prototype.init = function()
	{
		var bridge = new CVMENV.Bridge();
		var action = 'get' + CVMENV.Tools.ucfirst(this.formName);
		bridge.ask({'action': action}, null, function(form)
		{
			var language = CVMENV.Singleton.getInstance('Language');

			// Init fields
			for (var field in form)
			{	
				if (!this.fieldsShouldNotBeChecked || this.fieldsShouldNotBeChecked.indexOf(field) < 0)
				{
					this.initField(field, form[field], language.getLang());
				}
			}

			// Init submit
			this.eventManager.add('submitEventToSubmitForm', this.form, 'submit', this.submit.bind(this));

		}.bind(this));
	};

	CVMENV.Form.prototype.initField = function(field, fieldInfos, lang)
	{
		this.fields[field] = {};
		this.fields[field].fieldTarget = this.form.querySelector('#' + field);
		this.fields[field].messageTarget = this.form.querySelector('#' + field + 'ConditionMessage');
		this.fields[field].required = fieldInfos.required;

		this.initFieldRules(field, fieldInfos);
		this.initFieldCustomRules(field, fieldInfos);
		this.initFieldMessages(field, lang);
		this.initFieldEvents(field);

		// Perform a validation test on the values ​​already present in the form.
		if (this.fields[field].fieldTarget.hasAttribute('value') && this.fields[field].fieldTarget.getAttribute('value'))
		{
			this.fieldToUpdate(field)
		}
	};

	CVMENV.Form.prototype.initFieldRules = function(field, fieldInfos)
	{
		this.fields[field].rules = {};
		for (var i = 0, length = fieldInfos.rules.length; i < length; i++)
		{
			this.fields[field].rules[fieldInfos.rules[i]] = null;
		}
	};

	CVMENV.Form.prototype.initFieldCustomRules = function(field, fieldInfos)
	{
		for (var rule in fieldInfos.customRules)
		{
			this.fields[field].rules[rule] = fieldInfos.customRules[rule];
		}
	};

	CVMENV.Form.prototype.initFieldEvents = function(field)
	{
		var fieldUcfirst = CVMENV.Tools.ucfirst(field);

		this.eventManager.add('input' + fieldUcfirst + 'FieldToUpdate', this.fields[field].fieldTarget, 'input', this.fieldToUpdate.bind(this, field));
		this.eventManager.add('focus' + fieldUcfirst + 'ToFocusField', this.fields[field].fieldTarget, 'focus', this.focusField.bind(this, field));
		this.eventManager.add('focusout' + fieldUcfirst + 'ToFocusoutField', this.fields[field].fieldTarget, 'focusout', this.focusoutField.bind(this, field));
	};

	CVMENV.Form.prototype.initFieldMessages = function(field, lang)
	{
		var fieldRules = this.fields[field].rules;

		for (var rule in fieldRules)
		{
			var message = CVMENV.Singleton.getInstance('Messages').get(rule);

			// Custom rules
			if (fieldRules[rule] !== null)
			{
				message = this.updateCustomValues(message, fieldRules[rule]);
			}

			CVMENV.Tools.createElement('li', {'id': rule + 'Rule', 'class': 'message'}, this.fields[field].messageTarget, message);
		}
	};

	CVMENV.Form.prototype.updateCustomValues = function(str, values)
	{
		for (var i = values.length - 1; i >= 0; i--)
		{
			str = str.replace('[' + i + ']', values[i]);
		}

		return str;	
	};

	CVMENV.Form.prototype.fieldToUpdate = function(field)
	{
		if (this.isBusy)
		{
			return;
		}

		this.fields[field].isSuccess = true;

		var value = this.fields[field].fieldTarget.value;
		var fieldRules = this.fields[field].rules;

		for (var rule in fieldRules)
		{
			var pattern = CVMENV.Singleton.getInstance('FieldRules').get(rule);

			if (fieldRules[rule] !== null)
			{
				// Custom rules
				pattern = this.updateCustomValues(pattern, fieldRules[rule]);
			}

			var isValide = this.checkValue(field, pattern, value);

			if (!isValide)
			{
				this.fields[field].isSuccess = false;
			}

			this.updateMessage(field, rule, isValide);
		}

		this.updateFieldStatus(field);			
	};

	CVMENV.Form.prototype.checkValue = function(field, pattern, value)
	{
		var regex = new RegExp(pattern);
		return regex.test(value);
	};

	CVMENV.Form.prototype.updateMessage = function(field, rule, isValide)
	{
		var target = this.fields[field].messageTarget.querySelector('#' + rule + 'Rule');
		if (isValide)
		{
			target.classList.add('validation');
		}
		else
		{
			target.classList.remove('validation');
		}
	};

	CVMENV.Form.prototype.focusField = function(field)
	{
		this.updateMessagesBoxVisibility(field, true);
	};

	CVMENV.Form.prototype.focusoutField = function(field)
	{
		this.updateMessagesBoxVisibility(field, false);
		this.updateFieldStatus(field);			
	};

	CVMENV.Form.prototype.updateMessagesBoxVisibility = function(field, isRemoveDisable)
	{
		var action = isRemoveDisable ? 'remove' : 'add';
		this.fields[field].messageTarget.classList[action]('disable');
	};

	CVMENV.Form.prototype.updateFieldStatus = function(field)
	{
		var value = this.fields[field].fieldTarget.value;
		var notRequiredIsEmpty = this.fields[field].required === false && value.length === 0;

		if (notRequiredIsEmpty)
		{
			this.fields[field].fieldTarget.classList.remove('fieldStatusError');
			this.fields[field].fieldTarget.classList.remove('fieldStatusSuccess');
			return;		
		}

		if (this.fields[field].isSuccess)
		{
			this.fields[field].fieldTarget.classList.remove('fieldStatusError');
			this.fields[field].fieldTarget.classList.add('fieldStatusSuccess');
		}
		else
		{
			this.fields[field].fieldTarget.classList.add('fieldStatusError');
			this.fields[field].fieldTarget.classList.remove('fieldStatusSuccess');			
		}
	};

	CVMENV.Form.prototype.submit = function(e)
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
			var action = 'process' + CVMENV.Tools.ucfirst(this.formName);
			bridge.ask({'action': action}, this.form, function(response)
			{
				this.listenServerRequestResult(response);

			}.bind(this));
		}
	};

	CVMENV.Form.prototype.checkFields = function()
	{
		var isSuccess = true;

		for (var field in this.fields)
		{
			if (!(this.fields[field].isSuccess || (this.fields[field].required === false && this.fields[field].fieldTarget.value.length === 0)))
			{
				isSuccess = false;
				this.updateFieldStatus(field);
				this.updateMessagesBoxVisibility(field, true);
			}
		}

		return isSuccess;
	};

	CVMENV.Form.prototype.listenServerRequestResult = function(response)
	{
		this.removeAlreadyUseAndFormSuccessMessages();
		
		if (response.success)
		{
			var message = response.message ? response.message : this.formName + 'Success';
			this.messageManager.displayMessage(message, "success", "#" + this.form.id + " #messageForm", response.customValue);
		}
		else
		{
			this.manageFormError(response);
			this.isBusy = false;
		}
		
		if (this.callController)
		{
			this.callController(response);
		}
	};

	CVMENV.Form.prototype.manageFormError = function(response)
	{	
		if (response.success === false)
		{
			// Field error.
			if (response.alreadyUse)
			{
				var message = CVMENV.Singleton.getInstance('Messages').get('alreadyUse');
				this.addAlreadyUseMessages(response.alreadyUse, message);
			}
			// Global error.
			else
			{
				this.messageManager.displayMessage(response.message, "error", "#" + this.form.id + " #messageForm", response.customValue);
			}
		}
	};

	CVMENV.Form.prototype.removeAlreadyUseAndFormSuccessMessages = function()
	{
		var targets = this.form.querySelectorAll('[id$=AlreadyUseMessage], #messageForm');
		for (var i = targets.length - 1; i >= 0; i--)
		{
			targets[i].classList.add('disable');
			targets[i].textContent = "";
		}
	};

	CVMENV.Form.prototype.addAlreadyUseMessages = function(fields, message)
	{
		for (var field in fields)
		{
			var sms = this.updateCustomValues(message, [fields[field]]);
			var target = this.form.querySelector('#' + field + 'AlreadyUseMessage');
			target.classList.remove('disable');
			target.textContent = sms;
		}
	};
}());