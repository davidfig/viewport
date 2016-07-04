/*
    viewport.js <https://github.com/davidfig/viewport>
    License: MIT license <https://github.com/davidfig/viewport/license>
    Author: David Figatner
    Copyright (c) 2016 YOPEY YOPEY LLC
*/ (function(){

// creates a zoomable and moveable window into a scene
// renderer is of type github.com/davidfig/renderer
// stage is optional and taken from renderer if not specified
Viewport = function(renderer, _width, _height, stage)
{
    this.renderer = renderer;
    this.stage = stage || renderer.stage;
    this.stage.rotation = 0;
    this.center = {x: _width / 2, y: _height / 2};
    this.view(_width, _height);
};

Object.defineProperty(Viewport.prototype, "x", {
    get: function ()
    {
        return this.center.x;
    },
    set: function(value)
    {
        this.center.x = value;
        this.recalculate();
    }
});

Object.defineProperty(Viewport.prototype, "y", {
    get: function ()
    {
        return this.center.y;
    },
    set: function(value)
    {
        this.center.y = value;
    }
});

Object.defineProperty(Viewport.prototype, "rotation", {
    get: function ()
    {
        return this.stage.rotation;
    },
    set: function(value)
    {
        this.stage.rotation = value;
        this.cos = Math.cos(value);
        this.sin = Math.sin(value);
    }
});

Object.defineProperty(Viewport.prototype, "width", {
    get: function ()
    {
        return this._width;
    },
    set: function(value)
    {
        this._width = value;
        this.recalculate();
    }
});

Object.defineProperty(Viewport.prototype, "height", {
    get: function ()
    {
        return this._height;
    },
    set: function(value)
    {
        this._height = value;
        this.recalculate();
    }
});

// Change view window for viewport
Viewport.prototype.view = function(_width, _height, center)
{
    if (_width !== 0)
    {
        this._width = _width;
        this._height = (_width * this.renderer.height) / this.renderer.width;
    }
    else
    {
        this._height = _height;
        this._width = (_height * this.renderer.width) / this.renderer.height;
    }
    if (center)
    {
        this.center.x = center.x;
        this.center.y = center.y;
    }
    this.recalculate();
};

Viewport.prototype.resize = function()
{
    this.view(this.renderer.width, 0);
};

Viewport.prototype.move = function(deltaX, deltaY)
{
    this.center.x += deltaX;
    this.center.y += deltaY;
    this.recalculate();
};

// moves the viewport to
// alternatively accepts function (point), where point = {x: x, y: y}
Viewport.prototype.moveTo = function(x, y)
{
    if (arguments.length === 1)
    {
        this.center.x = arguments[0].x;
        this.center.y = arguments[0].y;
    }
    else
    {
        this.center.x = x;
        this.center.y = y;
    }
    this.recalculate();
};

// move the viewport to (x, y) as calculated from the top-left of the viewport
Viewport.prototype.moveTopLeft = function(x, y)
{
    this.center.x = x + this._width / 2;
    this.center.y = y + this._height / 2;
    this.recalculate();
};

// Center viewport in the stage
Viewport.prototype.centerView = function()
{
    this.center.x = this.stage.width / 2;
    this.center.y = this.stage.height / 2;
    this.recalculate();
};

// zooms to pixels based on view _width
Viewport.prototype.zoom = function(zoomDelta, center)
{
    this._width += zoomDelta;
    this._height += zoomDelta * this.screenRatio;
    if (center)
    {
        this.center.x = center.x;
        this.center.y = center.y;
    }
    this.recalculate();
};

// pinch to zoom
// amount, x, & y in screen coordinates; min and max in world coordinates
Viewport.prototype.zoomPinch = function(amount, min, max, center)
{
    var change = amount + this._width;
    change = (change < min) ? min : change;
    change = (change > max) ? max : change;
    var deltaX, deltaY;
    if (center)
    {
        this.center = this.toWorldFromScreen(center);
        deltaX = (this.renderer.width / 2 - x) / this.renderer.width;
        deltaY = (this.renderer.height / 2 - y) / this.renderer.height;
    }
    this._width = change;
    this._height = change * this.screenRatio;
    if (center)
    {
        this.center.x += this._width * deltaX;
        this.center.y += this._height * deltaY;
    }
    this.recalculate();
};

// if zoomX is 0, then ZoomY is used to calculated zoomX
Viewport.prototype.zoomTo = function(zoomX, zoomY, center)
{
    this._width = zoomX || zoomY / this.screenRatio;
    this._height = zoomY || zoomX * this.screenRatio;
    if (center)
    {
        this.center.x = center.x;
        this.center.y = center.y;
    }
    this.recalculate();
};

Viewport.prototype.zoomPercent = function(percent, center)
{
    this._width += this._width * percent;
    this._height += this._height * percent;
    if (center)
    {
        this.center.x = center.x;
        this.center.y = center.y;
    }
    this.recalculate();
};

// fit entire stage _width on screen
Viewport.prototype.fitX = function()
{
    this.view(this.stage.width, 0);
};

// fit entire stage _height on screen
Viewport.prototype.fitY = function()
{
    this.view(0, this.stage.height);
};

// fit entire stage on screen
Viewport.prototype.fit = function()
{
    if (this.stage.width / this.stage.height > this.renderer.width / this.renderer.height)
    {
        this.fitX();
    }
    else
    {
        this.fitY();
    }
};

// change _height of view area
Viewport.prototype._heightTo = function(_height)
{
    this.view(0, _height, this.center);
};


// transform a world coordinate to a screen coordinate
Viewport.prototype.toWorldFromScreen = function()
{
    var screen = {x: 0, y: 0};
    if (arguments.length === 1)
    {
        screen.x = arguments[0].x;
        screen.y = arguments[0].y;
    }
    else
    {
        screen.x = arguments[0];
        screen.y = arguments[1];
    }

    var point;
    if (this.stage.rotation)
    {
        var x = (screen.x - this.renderer.width / 2) * this.screenToViewRatio;
        var y = (screen.y - this.renderer.height / 2) * this.screenToViewRatio;
        var rotatedX = x * this.cos + y * this.sin;
        var rotatedY = y * this.cos - x * this.sin;
        point = new PIXI.Point(rotatedX + this.center.x, rotatedY + this.center.y);
    }
    else
    {
        var x = this.center.x + (screen.x - this.renderer.width / 2) * this.screenToViewRatio;
        var y = this.center.y + (screen.y - this.renderer.height / 2) * this.screenToViewRatio;
        point = new PIXI.Point(x, y);
    }
    return point;
};


// transform a screen coordinate to a world coordinate
Viewport.prototype.toScreenFromWorld = function(world)
{
    var point;
    if (this.stage.rotation)
    {
        var x = world.x - this.center.x;
        var y = world.y - this.center.y;
        var rotatedX = x * this.cos - y * this.sin;
        var rotatedY = y * this.cos + x * this.sin;
        var x = (rotatedX + this._width / 2) * this.viewToScreenRatio;
        var y = (rotatedY + this._height / 2) * this.viewToScreenRatio;
        point = new PIXI.Point(x, y);
    }
    else
    {
        var x = (world.x - this.center.x + this._width / 2) * this.viewToScreenRatio;
        var y = (world.y - this.center.y + this._height / 2) * this.viewToScreenRatio;
        point = new PIXI.Point(x, y);
    }
    return point;
};

// Transform a number from view size to screen size
Viewport.prototype.toScreenSize = function(original)
{
    return original * this.viewToScreenRatio;
};

// Transform a number from screen size to view size
Viewport.prototype.toWorldSize = function(original)
{
    return original * this.screenToViewRatio;
};


// return screen _height in the world coordinate system
Viewport.prototype.screen_heightInWorld = function()
{
    return this.toWorldSize(this.renderer.height);
};

// return screen _width in the world coordinate system
Viewport.prototype.screen_widthInWorld = function()
{
    return this.toWorldSize(this.renderer.width);
};

Viewport.prototype.world_width = function()
{
    return this.stage.width;
};

Viewport.prototype.world_height = function()
{
    return this.stage.height;
};

// converts an x value to a y value in the screen coordinates
Viewport.prototype.screenXtoY = function(x)
{
    return x * this.renderer.height / this.renderer.width;
};

// converts a y value to an x value in the screen coordinates
Viewport.prototype.screenYtoX = function(y)
{
    return y * this.renderer.width / this.renderer.height;
};

Viewport.prototype.scaleGet = function()
{
    return this.stage.scale.x;
};

// recalucates and repositions
Viewport.prototype.recalculate = function()
{
    this.screenToViewRatio = this._width / this.renderer.width;
    this.viewToScreenRatio = this.renderer.width / this._width;
    this.screenRatio = this.renderer.height / this.renderer.width;

    this.stage.scale.x = this.stage.scale.y = this.viewToScreenRatio;
    this.stage.pivot.x = this.center.x;
    this.stage.pivot.y = this.center.y;
    this.stage.position.x = this._width / 2 * this.stage.scale.x;
    this.stage.position.y = this._width / 2 * this.stage.scale.y;

    this.renderer.dirty = true;
};

/* OLD FUNCTIONS THAT I'VE NOT CONVERTED YET (WAITING UNTIL I NEED THEM)

// Makes another PIXI.Container subject to viewport transforms
Viewport.prototype.apply = function(container)
{
    container.position = this.stage.position;
    container.scale = this.stage.scale;
    container.pivot = this.stage.pivot;
};

Viewport.prototype.clampX = function()
{
    if (this.size.view.x <= this.size.world.x)
    {
        if (this.center.x - this.size.view.x / 2 < 0)
        {
            this.center.x = this.size.view.x / 2;
        }
        if (this.center.x + this.size.view.x / 2 > this.size.world.x)
        {
            this.center.x = this.size.world.x - this.size.view.x / 2;
        }
    }
    this.recalculate();
};

Viewport.prototype.clampY = function()
{
    if (this.size.view.y <= this.size.world.y)
    {
        if (this.center.y - this.size.view.y / 2 < 0)
        {
            this.center.y = this.size.view.y / 2;
        }
        if (this.center.y + this.size.view.y / 2 > this.size.world.y)
        {
            this.center.y = this.size.world.y - this.size.view.y / 2;
        }
    }
    this.recalculate();
};

Viewport.prototype.clamp = function() {
    if (this.size.view.x <= this.size.world.x)
    {
        if (this.center.x - this.size.view.x / 2 < 0)
        {
            this.center.x = this.size.view.x / 2;
        }
        if (this.center.x + this.size.view.x / 2 > this.size.world.x)
        {
            this.center.x = this.size.world.x - this.size.view.x / 2;
        }
    }
    if (this.size.view.y <= this.size.world.y)
    {
        if (this.center.y - this.size.view.y / 2 < 0)
        {
            this.center.y = this.size.view.y / 2;
        }
        if (this.center.y + this.size.view.y / 2 > this.size.world.y)
        {
            this.center.y = this.size.world.y - this.size.view.y / 2;
        }
    }
    this.recalculate();
};

// only works with a 100% div (default div)
Viewport.prototype.uncrop = function()
{
    var div = this.renderer.div;
    div.style.left = 0;
    div.style.top = 0;
    div.style._width = '100%';
    div.style._height = '100%';
};

Viewport.prototype.crop = function()
{
    var div = this.renderer.div;
    var _width = this.size.world.x * this.stage.scale.x;
    var _height = this.size.world.y * this.stage.scale.y;
    div.style._width = _width + 'px';
    div.style._height = _height + 'px';
    this.left = this.size.screen.x / 2 - _width / 2;
    this.top = this.size.screen.y / 2 - _height / 2;
    div.style.left =  this.left + 'px';
    div.style.top = this.top + 'px';
    this.stage.pivot.x = 0;
    this.stage.pivot.y = 0;
    this.stage.position.x = 0;
    this.stage.position.y = 0;
};

*/

// add support for AMD (Asynchronous Module Definition) libraries such as require.js.
if (typeof define === 'function' && define.amd)
{
    define(function()
    {
        return {
            Viewport: Viewport
        };
    });
}

// add support for CommonJS libraries such as browserify.
if (typeof exports !== 'undefined')
{
    exports.Viewport = Viewport;
}

// define globally in case AMD is not available or available but not used
if (typeof window !== 'undefined')
{
    window.Viewport = Viewport;
} })();