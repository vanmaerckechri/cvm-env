(function()
{
	"use strict";

	CVMENV.ModalManager = function()
	{
		this.container;
		this.callback;

		CVMENV.AbstractHtmlManager.call(this);
	};

	CVMENV.ModalManager.prototype = Object.create(CVMENV.AbstractHtmlManager.prototype);
	CVMENV.ModalManager.prototype.constructor = CVMENV.ModalManager;

	CVMENV.ModalManager.prototype.load = function(container, path, callback)
	{
		this.container = container;
		this.callback = callback;
		this.loadHtml('GET', path, null, this.injectContent.bind(this));
	};

	CVMENV.ModalManager.prototype.injectContent = function(content)
	{
		this.translateAndConvertToProperHtml(this.container, content);
		this.callback();
	};

	CVMENV.ModalManager.prototype.close = function()
	{
		var modalContainer = document.getElementById('modalContainer');
		this.container.removeChild(modalContainer);
	};
}());