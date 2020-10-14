(function()
{
	"use strict";

	CVMENV.Language = function(list)
	{
		this.index = 0;
		this.display = false;
		this.list = list;

		this.init();
	};

	CVMENV.Language.prototype.init = function()
	{
		this.update();
	};

	CVMENV.Language.prototype.getLang = function()
	{
		return this.list[this.index];
	};

	CVMENV.Language.prototype.isDisplayInUrl = function()
	{
		return this.display;
	};

	CVMENV.Language.prototype.update = function()
	{
		var url = location.href.replace(CVMENV.Tools.baseURI(), '');
		
		for (var i = this.list.length - 1; i >= 0; i--)
		{
			var language = this.list[i];
			var regex = new RegExp('^\/?' + language + '($|\/)', 'i');

			if (url.match(regex))
			{
				this.lastIndex = this.index;
				this.index = i;
				this.display = true;
				break;
			}
		}

		document.documentElement.lang = this.list[this.index];
	};

	CVMENV.Language.prototype.deleteLangNotUsedInContent = function(content)
	{
		for (var i = this.list.length - 1; i >= 0; i--)
		{
			var lang = this.list[i];

			// clean selected language
			if (lang == this.getLang())
			{
				var regex = new RegExp('\{\{' + lang + '\}\}', 'gm');
				content = content.replace(regex, '');
				regex = new RegExp('\{\{\/' + lang + '\}\}', 'gm');
				content = content.replace(regex, '');
			}
			// delete others language
			else
			{
				var regex = new RegExp('\{\{' + lang + '\}\}.*\{\{\/' + lang + '\}\}', 'gm');
				content = content.replace(regex, '');
			}
		}
		return content;
	};
}());