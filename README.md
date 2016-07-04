## viewport.js
viewport designed to work with pixi.js

## Code Example

        // create a renderer
        renderer = new Renderer({color: 'rgba(0, 0, 0, 0.25)'});

        // create the viewport
        var viewport = new Viewport(renderer, 1000, 1000);

        // move the center
        viewport.moveTo(500, 500);

        // zoom in
        viewport.zoom(500);

## Installation
include renderer.js and viewport.js in your project or add to your workflow

    <script src="renderer.js"></script>
    <script src="viewport.js"></script>

## Example
https://davidfig.github.io/viewport/

see also
* https://davidfig.github.io/debug/
* https://davidfig.github.io/update/
* https://davidfig.github.io/animate/
* https://davidfig.github.io/renderer/

## API Reference

#### Viewport(renderer, width, height, stage)
creates a zoomable and moveable window into a scene
* renderer is of type github.com/davidfig/renderer
* stage is optional and taken from renderer if not specified

#### Viewport.view(width, height, center)
Change view window for viewport

#### Viewport.move(deltaX, deltaY)
moves center of viewport by (deltaX, deltaY)

#### Viewport.moveTo(x, y)
moves center of viewport to (x, y)
* alternatively accepts function (point), where point = {x: x, y: y}

#### Viewport.moveTopLeft(x, y)
move the viewport to (x, y) as calculated from the top-left of the viewport
* alternatively accepts function (point), where point = {x: x, y: y}

#### Viewport.centerView()
Center viewport in the stage

#### Viewport.zoom(zoomDelta, center)
zooms to pixels based on view width

#### Viewport.zoomPinch(amount, min, max, center)
pinch to zoom
* amount, x, & y in screen coordinates
* min and max in world coordinates

#### Viewport.zoomTo(zoomX, zoomY, center)
if zoomX is 0, then ZoomY is used to calculated zoomX

#### Viewport.zoomPercent(percent, center)
zoom by a percent of the current view size

#### Viewport.fitX()
fit entire stage width on screen

#### Viewport.fitY()
fit entire stage _height on screen

#### Viewport.fit()
fit entire stage on screen

#### Viewport.heightTo(height)
change height of view area

#### Viewport.toWorldFromScreen()
transform a world coordinate to a screen coordinate

#### Viewport.toScreenFromWorld(world)
transform a screen coordinate to a world coordinate

#### Viewport.toScreenSize(original)
Transform a number from view size to screen size

#### Viewport.toWorldSize(original)
Transform a number from screen size to view size

#### Viewport.screenHeightInWorld()
return screen height in the world coordinate system

#### Viewport.screenWidthInWorld()
return screen width in the world coordinate system

#### Viewport.screenXtoY(x)
converts an x value to a y value in the screen coordinates

#### Viewport.screenYtoX(y)
converts a y value to an x value in the screen coordinates

## License
MIT License (MIT)