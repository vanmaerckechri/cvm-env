(function()
{
	"use strict";

	CVMENV.MessageManager = function(){};

	CVMENV.MessageManager.prototype.displayMessage = function(name, action, selector, customValue)
	{	
		var message = this.manageMessageWithCustomValue(CVMENV.Singleton.getInstance('Messages').get(name), customValue);
		this.injectMessage(action, selector, message);
	};

	CVMENV.MessageManager.prototype.manageMessageWithCustomValue = function(message, customValue)
	{
		if (customValue)
		{
			if (typeof customValue == 'string')
			{
				return this.updateCustomValues(message, [customValue]);
			}
			return this.updateCustomValues(message, customValue);
		}	
		return message;
	};

	CVMENV.MessageManager.prototype.updateCustomValues = function(str, values)
	{
		for (var i = values.length - 1; i >= 0; i--)
		{
			str = str.replace('[' + i + ']', values[i]);
		}

		return str;	
	};

	CVMENV.MessageManager.prototype.injectMessage = function(action, selector, message)
	{
		var cssClassToRemove = action == "success" ? "error" : "success";
		var target = document.querySelector(selector);
		target.classList.add(action);
		target.classList.remove(cssClassToRemove, 'disable');
		target.textContent = message;	
	};
}());