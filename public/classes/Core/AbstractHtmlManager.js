(function()
{
	"use strict";

	CVMENV.AbstractHtmlManager = function()
	{
		this.language = CVMENV.Singleton.getInstance('Language');

		CVMENV.AbstractAjax.call(this);
	};

	CVMENV.AbstractHtmlManager.prototype = Object.create(CVMENV.AbstractAjax.prototype);
	CVMENV.AbstractHtmlManager.prototype.constructor = CVMENV.AbstractHtmlManager;

	CVMENV.AbstractHtmlManager.prototype.loadHtml = function(method, path, data, callback)
	{
		path = path.replace(/\//g, '\\');
		// build version - js format (only one server request -> app.js)
		if (!this.loadJsVer(path, callback.bind(this)))
		{
			// dev version - html file (server request for each call)
			this.loadContent(method, '\\public\\views\\' + path + '.html', data, callback.bind(this));
		}
	};

	CVMENV.AbstractHtmlManager.prototype.loadJsVer = function(path, callback)
	{
		if (CVMENV.Views)
		{
			var views = new CVMENV.Views();
			var view = path.replace(/\\/g, '_');
			var viewContent = views.get(view);
			if (viewContent)
			{
				callback(viewContent);
				return true;
			}
		}
		return false;
	};

	CVMENV.AbstractHtmlManager.prototype.translateAndConvertToProperHtml = function(container, content)
	{
		content = this.language.deleteLangNotUsedInContent(content);
		content = CVMENV.Tools.convertToProperHtml(content);
		container.appendChild(content);

		var anchorManager = CVMENV.Singleton.getInstance("AnchorManager");
		anchorManager.update();

		return content;
	};
}());