(function()
{
	"use strict";

	CVMENV.Touchscreen = function(container, callback)
	{
		this.eventManager = new CVMENV.EventManager();
		this.container = container;
		this.callback = callback;
		this.tpCache = new Array();
		this.doubleTapLastTime = 0;
		this.pinchZoom;

		this.initEvents();
	};

	CVMENV.Touchscreen.prototype.initEvents = function()
	{
		this.eventManager.add('touchstartContainerToUpdateFirstPosition', this.container, 'touchstart', this.startHandler.bind(this), {passive: false});
		this.eventManager.add('touchmoveContainerToUpdateCurrentPosition', this.container, 'touchmove', this.moveHandler.bind(this));
		this.eventManager.add('touchendContainerToUpdateLastPosition', this.container, 'touchend', this.endHandler.bind(this));
		this.eventManager.add('touchcancelContainerToUpdateLastPosition', this.container, 'touchcancel', this.endHandler.bind(this));
	};

	CVMENV.Touchscreen.prototype.startHandler = function(ev)
	{
		if (ev.targetTouches.length < 3)
		{
			for (var i = 0, length = ev.targetTouches.length ; i < length; i++)
			{
				this.tpCache.push(ev.targetTouches[i]);
			}
		}		
		
		if (ev.targetTouches.length === 1)
		{
			this.handleDoubleTap(ev);
		}
	};

	CVMENV.Touchscreen.prototype.moveHandler = function(ev)
	{
		if (ev.targetTouches.length == 2)
		{
			this.handlePinchZoom(ev);
		}
		else if (ev.targetTouches.length == 1)
		{
			this.handleSlice(ev);
		}
	};

	CVMENV.Touchscreen.prototype.endHandler = function(ev)
	{
		if (ev.targetTouches.length == 0)
		{
			this.pinchZoom = null;
			this.callback({name: 'end'});
		}
	};

	CVMENV.Touchscreen.prototype.handleDoubleTap = function()
	{
		var currentTime = new Date().getTime();
		var tapLength = currentTime - this.doubleTapLastTime;

		if (tapLength < 500 && tapLength > 0)
		{
			this.doubleTapLastTime = 0;

			var output = {
				name: "doubleTap"
			};
			this.callback(output);
		}
		else
		{
			this.doubleTapLastTime = currentTime;
		}
	};

	CVMENV.Touchscreen.prototype.handleSlice = function(ev)
	{
		if (ev.targetTouches.length == 1 && ev.changedTouches.length == 1)
		{
			var point = -1;

			for (var i = 0, length = this.tpCache.length; i < length; i++)
			{
				if (this.tpCache[i].identifier == ev.targetTouches[0].identifier)
				{
					point = i;
				}
			}

			if (point >= 0)
			{
				var diffX = ev.targetTouches[0].clientX - this.tpCache[point].clientX;
				var diffY = ev.targetTouches[0].clientY - this.tpCache[point].clientY;

				var output = {
					name: "slice",
					originX: this.tpCache[point].clientX,
					originY: this.tpCache[point].clientY,
					currentX: ev.targetTouches[0].clientX,
					currentY: ev.targetTouches[0].clientY,
					translateX: diffX,
					translateY: diffY
				};
				this.callback(output);
			}
			else
			{
				this.tpCache = new Array();
			}
		}
	};

	CVMENV.Touchscreen.prototype.handlePinchZoom = function(ev)
	{
		if (ev.targetTouches.length == 2 && ev.changedTouches.length == 2)
		{
			var point1 = -1, point2 = -1;

			for (var i = 0, length = this.tpCache.length; i < length; i++)
			{
				if (this.tpCache[i].identifier == ev.targetTouches[0].identifier)
				{
					point1 = i;
				}
				if (this.tpCache[i].identifier == ev.targetTouches[1].identifier)
				{
					point2 = i;
				}
			}

			if (point1 >= 0 && point2 >= 0)
			{
				var diffX1 = Math.abs(this.tpCache[point1].clientX - ev.targetTouches[0].clientX);
				var diffX2 = Math.abs(this.tpCache[point2].clientX - ev.targetTouches[1].clientX);
				var diffY1 = Math.abs(this.tpCache[point1].clientY - ev.targetTouches[0].clientY);
				var diffY2 = Math.abs(this.tpCache[point2].clientY - ev.targetTouches[1].clientY);

				if (!this.pinchZoom)
				{
					this.pinchZoom = {
						centerX: this.tpCache[point1].clientX + (Math.abs(diffX1 - diffX2) / 2),
						centerY: this.tpCache[point1].clientY + (Math.abs(diffY1 - diffY2) / 2),
						width: Math.abs(ev.targetTouches[0].clientX - ev.targetTouches[1].clientX),
						height: Math.abs(ev.targetTouches[0].clientY - ev.targetTouches[1].clientY)
					};
				}

				if (diffX1 != 0 || diffX2 != 0 || diffY1 != 0 || diffY2 != 0)
				{
					var width = Math.abs(ev.targetTouches[0].clientX - ev.targetTouches[1].clientX);
					var height = Math.abs(ev.targetTouches[0].clientY - ev.targetTouches[1].clientY);

					var directionX = width === this.pinchZoom.width ? 0 : width > this.pinchZoom.width ? 1 : - 1;
					var directionY = height === this.pinchZoom.height ? 0 : height > this.pinchZoom.height ? 1 : - 1;

					var output = {
						name: "zoom",
						centerX: this.pinchZoom.centerX,
						centerY: this.pinchZoom.centerY,
						directionX: directionX,
						directionY: directionY
					};

					this.pinchZoom.width = width;
					this.pinchZoom.height = height;

					this.callback(output);
				}
			}
			else
			{
				this.tpCache = new Array();
			}
		}
	};

	CVMENV.Touchscreen.prototype.getTranslation = function()
	{
		var x = this.posCurrent.x - this.posFirst.x;
		var y = this.posCurrent.y - this.posFirst.y;
		return {x: x, y: y};
	};

	CVMENV.Touchscreen.prototype.close = function()
	{
		this.eventManager.removeAll();
	};
}());