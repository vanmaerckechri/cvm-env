(function()
{
	"use strict";

	CVMENV.Confirmation = function(confirmationView, callbackYes, callbackNo)
	{
		this.modalManager;
		this.eventManager = new CVMENV.EventManager();
		this.callbackYes = callbackYes;
		this.callbackNo = callbackNo;
		this.confirmationView = confirmationView;

		this.init();
	};

	CVMENV.Confirmation.prototype.init = function()
	{
		this.modalManager = new CVMENV.ModalManager();
		this.modalManager.load(document.getElementById('app'), this.confirmationView, this.initEvents.bind(this));
	};

	CVMENV.Confirmation.prototype.initEvents = function()
	{
		var confirmBtn = document.getElementById('confirmationBtn');
		this.eventManager.add('clickOnConfirmBtnToDeleteAccount', confirmBtn, 'click', this.confirm.bind(this));

		var cancelBtn = document.getElementById('cancelBtn');
		this.eventManager.add('clickOnCancelBtnToDeleteAccount', cancelBtn, 'click', this.cancel.bind(this));
	};

	CVMENV.Confirmation.prototype.confirm = function()
	{
		this.modalManager.close();
		this.callbackYes();
	};

	CVMENV.Confirmation.prototype.cancel = function()
	{
		this.modalManager.close();
		this.callbackNo();
	};
}());