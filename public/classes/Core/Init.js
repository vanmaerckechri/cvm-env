(function()
{
	"use strict";

	CVMENV.Init = function(callMain)
	{
		this.callMain = callMain;

		this.run();
	};

	CVMENV.Init.prototype.run = function()
	{
		var listsToLoad = this.getListsNeedToBeUpdate();

		if (listsToLoad.length > 0)
		{
			var bridge = new CVMENV.Bridge();
			bridge.ask({'action': 'getInitValues', 'listsToLoad': JSON.stringify(listsToLoad)}, null, function(response)
			{
				this.updateLists(response.lists);
				this.callMain();

			}.bind(this));
		}
		else
		{
			this.callMain();
		}
	};

	CVMENV.Init.prototype.getListsNeedToBeUpdate = function(token)
	{
		var listsToLoad = [];
		var lists = ["Messages", "FieldRules"];

		for (var i = lists.length - 1; i >= 0; i--)
		{
			if (!CVMENV.Singleton.getInstance(lists[i]).getList())
			{
				listsToLoad.push(lists[i]);
			}
		}

		return listsToLoad;
	};


	CVMENV.Init.prototype.updateLists = function(lists)
	{
		for (var list in lists)
		{
			CVMENV.Singleton.getInstance(CVMENV.Tools.ucfirst(list)).setList(lists[list]);
		}

	};
}());