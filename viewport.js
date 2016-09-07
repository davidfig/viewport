// viewport.js <https://github.com/davidfig/viewport>
// license: MIT license <https://github.com/davidfig/viewport/license>
// author: David Figatner
// copyright (c) 2016 YOPEY YOPEY LLC

var tempPoint = new PIXI.Point();

// creates a zoomable and moveable window into a scene
// renderer is of type github.com/davidfig/renderer
// stage is optional and taken from renderer if not specified
var Viewport = function(renderer, width, height, stage)
{
    this.renderer = renderer;
    this.renderers = [renderer];
    this.stage = stage || renderer.stage;
    this.stage.rotation = 0;
    if (width)
    {
        this.center = {x: width / 2, y: height / 2};
        this.view(width, height);
    }
    else
    {
        this.center = {x: 0, y: 0};
    }
};

Object.defineProperty(Viewport.prototype, 'x', {
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

Object.defineProperty(Viewport.prototype, 'y', {
    get: function ()
    {
        return this.center.y;
    },
    set: function(value)
    {
        this.center.y = value;
        this.recalculate();
    }
});

Object.defineProperty(Viewport.prototype, 'rotation', {
    get: function ()
    {
        return this.stage.rotation;
    },
    set: function(value)
    {
        this.stage.rotation = value;
        this.cos = Math.cos(value);
        this.sin = Math.sin(value);
        this.recalculate();
    }
});

Object.defineProperty(Viewport.prototype, 'width', {
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

Object.defineProperty(Viewport.prototype, 'height', {
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
Viewport.prototype.view = function(width, height, center)
{
    if (width !== 0)
    {
        this._width = width;
        this._height = (width * this.renderer.height) / this.renderer.width;
    }
    else
    {
        this._height = height;
        this._width = (height * this.renderer.width) / this.renderer.height;
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
// TODO: this does NOT work
Viewport.prototype.centerView = function()
{
    this.center.x = this.stage.width / this.stage.scale.x / 2;
    this.center.y = this.stage.height / this.stage.scale.y / 2;
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

Viewport.prototype.zoomToFit = function(width, height, center)
{
    if (width > height / this.screenRatio)
    {
        this._width = width;
        this._height = width * this.screenRatio;
    }
    else
    {
        this._height = height;
        this._width = height / this.screenRatio;
    }
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
Viewport.prototype.heightTo = function(height)
{
    this.view(0, height, this.center);
};


// transform a world coordinate to a screen coordinate
Viewport.prototype.toWorldFromScreen = function()
{
    var screen = tempPoint;
    if (arguments.length === 1)
    {
        screen.set(arguments[0].x, arguments[0].y);
    }
    else
    {
        screen.set(arguments[0], arguments[1]);
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
Viewport.prototype.screenHeightInWorld = function()
{
    return this.toWorldSize(this.renderer.height);
};

// return screen _width in the world coordinate system
Viewport.prototype.screenWidthInWorld = function()
{
    return this.toWorldSize(this.renderer.width);
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
    this.stage.scale.set(this.viewToScreenRatio);
    this.stage.pivot.set(this.center.x, this.center.y);
    this.stage.position.set(this._width / 2 * this.stage.scale.x, this._height / 2 * this.stage.scale.y);
    this.topLeft = {x: this.center.x - this._width / 2, y: this.center.y - this._height / 2};
    for (var i = 0; i < this.renderers.length; i++)
    {
        this.renderers[i].dirty = true;
    }
    this.AABB = [this.topLeft.x, this.topLeft.y, this.topLeft.x + this._width, this.topLeft.y + this._height];
    this.bounds = {x: this.topLeft.x, y: this.topLeft.y, width: this._width, height: this._height};
};

// Makes a PIXI.Container or Renderer subject to viewport transforms
// Note: each renderer needs to be the same size as the first renderer
Viewport.prototype.apply = function()
{
    var arg = arguments[0];
    if (arg instanceof Renderer)
    {
        arg.stage.position = this.stage.position;
        arg.stage.scale = this.stage.scale;
        arg.stage.pivot = this.stage.pivot;
        this.renderers.push(arg);
    }
    else
    {
        arg.position = this.stage.position;
        arg.scale = this.stage.scale;
        arg.pivot = this.stage.pivot;
    }
};

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
    module.exports = Viewport;
}

// define globally in case AMD is not available or available but not used
if (typeof window !== 'undefined')
{
    window.Viewport = Viewport;
}