// viewport.js <https://github.com/davidfig/viewport>
// license: MIT license <https://github.com/davidfig/viewport/license>
// author: David Figatner
// copyright (c) 2017 YOPEY YOPEY LLC

// creates a zoomable and moveable window into a scene
// renderer is of type github.com/davidfig/renderer
// stage is optional and taken from renderer if not specified
module.exports = class Viewport
{
    constructor(renderer, width, height, stage)
    {
        this.renderer = renderer;
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
    }


    get x()
    {
        return this.center.x;
    }
    set x(value)
    {
        this.center.x = value;
        this.recalculate();
    }

    get y()
    {
        return this.center.y;
    }
    set y(value)
    {
        this.center.y = value;
        this.recalculate();
    }

    get rotation()
    {
        return this.stage.rotation;
    }
    set rotation(value)
    {
        this.stage.rotation = value;
        this.cos = Math.cos(value);
        this.sin = Math.sin(value);
        this.recalculate();
    }

    get width()
    {
        return this._width;
    }
    set width(value)
    {
        this._width = value;
        this.recalculate();
    }

    get height()
    {
        return this._height;
    }
    set height(value)
    {
        this._height = value;
        this.recalculate();
    }

    // Change view window for viewport
    view(width, height, center)
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
    }

    resize()
    {
        this.view(this.renderer.width, 0);
    }

    move(deltaX, deltaY)
    {
        this.center.x += deltaX;
        this.center.y += deltaY;
        this.recalculate();
    }

    // moves the viewport to
    // alternatively accepts function (point), where point = {x: x, y: y}
    moveTo(x, y)
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
    }

    // move the viewport to (x, y) as calculated from the top-left of the viewport
    moveTopLeft(x, y)
    {
        this.center.x = x + this._width / 2;
        this.center.y = y + this._height / 2;
        this.recalculate();
    }

    // zooms to pixels based on view _width
    zoom(zoomDelta, center)
    {
        this._width += zoomDelta;
        this._height += zoomDelta * this.screenRatio;
        if (center)
        {
            this.center.x = center.x;
            this.center.y = center.y;
        }
        this.recalculate();
    }

    // pinch to zoom
    // amount, x, & y in screen coordinates; min and max in world coordinates
    zoomPinch(x, y, amount, min, max, center)
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
    }

    // if zoomX is 0, then ZoomY is used to calculated zoomX
    zoomTo(zoomX, zoomY, center)
    {
        this._width = zoomX || zoomY / this.screenRatio;
        this._height = zoomY || zoomX * this.screenRatio;
        if (center)
        {
            this.center.x = center.x;
            this.center.y = center.y;
        }
        this.recalculate();
    }

    zoomToFit(width, height, center)
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
    }

    zoomPercent(percent, center)
    {
        this._width += this._width * percent;
        this._height += this._height * percent;
        if (center)
        {
            this.center.x = center.x;
            this.center.y = center.y;
        }
        this.recalculate();
    }

    // fit entire stage _width on screen
    fitX()
    {
        this.view(this.stage.width, 0);
    }

    // fit entire stage _height on screen
    fitY()
    {
        this.view(0, this.stage.height);
    }

    // fit entire stage on screen
    fit()
    {
        if (this.stage.width / this.stage.height > this.renderer.width / this.renderer.height)
        {
            this.fitX();
        }
        else
        {
            this.fitY();
        }
    }

    // change _height of view area
    heightTo(height)
    {
        this.view(0, height, this.center);
    }

    // transform a world coordinate to a screen coordinate
    toWorldFromScreen()
    {
        const screen = {};
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

        if (this.stage.rotation)
        {
            const x = (screen.x - this.renderer.width / 2) * this.screenToViewRatio;
            const y = (screen.y - this.renderer.height / 2) * this.screenToViewRatio;
            const rotatedX = x * this.cos + y * this.sin;
            const rotatedY = y * this.cos - x * this.sin;
            return {x: rotatedX + this.center.x, y: rotatedY + this.center.y};
        }
        else
        {
            const x = this.center.x + (screen.x - this.renderer.width / 2) * this.screenToViewRatio;
            const y = this.center.y + (screen.y - this.renderer.height / 2) * this.screenToViewRatio;
            return {x, y};
        }
    }

    // transform a screen coordinate to a world coordinate
    toScreenFromWorld(world)
    {
        if (this.stage.rotation)
        {
            const x = world.x - this.center.x;
            const y = world.y - this.center.y;
            const rotatedX = x * this.cos - y * this.sin;
            const rotatedY = y * this.cos + x * this.sin;
            return {x: (rotatedX + this._width / 2) * this.viewToScreenRatio, y: (rotatedY + this._height / 2) * this.viewToScreenRatio};
        }
        return {x: (world.x - this.center.x + this._width / 2) * this.viewToScreenRatio, y: (world.y - this.center.y + this._height / 2) * this.viewToScreenRatio};
    }

    // Transform a number from view size to screen size
    toScreenSize(original)
    {
        return original * this.viewToScreenRatio;
    }

    // Transform a number from screen size to view size
    toWorldSize(original)
    {
        return original * this.screenToViewRatio;
    }

    // return screen _height in the world coordinate system
    screenHeightInWorld()
    {
        return this.toWorldSize(this.renderer.height);
    }

    // return screen _width in the world coordinate system
    screenWidthInWorld()
    {
        return this.toWorldSize(this.renderer.width);
    }

    // converts an x value to a y value in the screen coordinates
    screenXtoY(x)
    {
        return x * this.renderer.height / this.renderer.width;
    }

    // converts a y value to an x value in the screen coordinates
    screenYtoX(y)
    {
        return y * this.renderer.width / this.renderer.height;
    }

    scaleGet()
    {
        return this.stage.scale.x;
    }

    // recalucates and repositions
    recalculate()
    {
        this.screenToViewRatio = this._width / this.renderer.width;
        this.viewToScreenRatio = this.renderer.width / this._width;
        this.screenRatio = this.renderer.height / this.renderer.width;
        this.stage.scale.set(this.viewToScreenRatio);
        this.stage.pivot.set(this.center.x, this.center.y);
        this.stage.position.set(this._width / 2 * this.stage.scale.x, this._height / 2 * this.stage.scale.y);
        this.topLeft = {x: this.center.x - this._width / 2, y: this.center.y - this._height / 2};
        this.AABB = [this.topLeft.x, this.topLeft.y, this.topLeft.x + this._width, this.topLeft.y + this._height];
        this.bounds = {x: this.topLeft.x, y: this.topLeft.y, width: this._width, height: this._height};
    }
}