## viewport.js
viewport designed to work with pixi.js

## Code Example

        // debug panel on the bottom right
        Debug.init();

        // used for automatic rendering
        Update.init();
        Update.update();

        // create small window for the renderer
        var renderer, div;
        pixi();

        var width = 10000;
        var height = 10000;

        // create the back viewport, attach it to a container, and add stars
        var back = renderer.add(new PIXI.Container());
        var viewportBack = new Viewport(renderer, div.offsetWidth, div.offsetHeight, back);
        circles(div.offsetWidth, div.offsetHeight, 10, back);

        // create the front viewport, attach it to a container, and add stars
        var front = renderer.add(new PIXI.Container());
        var viewport = new Viewport(renderer, width, height, front);
        circles(width, height, 100, front);

        next();

        // animate the viewport
        function next()
        {
            var choice = Math.round(Math.random() * 3);
            var time = 1000 + Math.random() * 3000;
            var options = {renderer: renderer, onDone: next};
            var ease = null;
            switch (choice)
            {
                // move the center point of the front viewport
                case 0:
                    var x = Math.random() * width;
                    var y = Math.random() * height;
                    Animate.to(viewport, {x: x, y: y}, time, options, ease);
                break;

                // rotate the two viewports
                case 1:
                    var rotation = Math.random() * Math.PI * 2;
                    Animate.to(viewport, {rotation: rotation}, time, {renderer: renderer, onDone: next, onEach:
                        function(elapsed, object)
                        {
                            viewportBack.rotation = object.rotation;
                        }
                    }, ease);
                break;

                // zoom the front viewport
                case 2:
                    var zoomX = Math.random() * width;
                    Animate.to(viewport, {width: zoomX}, time, options, ease);
                break;

                // zoom and move the front viewport
                case 3:
                    var x = Math.random() * width;
                    var y = Math.random() * height;
                    var zoomX = Math.random() * width;
                    Animate.to(viewport, {width: zoomX, x: x, y: y}, time, options, ease);
                break;
            }
        }

        // create the stars
        function circles(width, height, size, stage)
        {
            // set initial position for all circles
            for (var i = 0; i < 500; i++)
            {
                var t = circle(size, Math.random() * 0xffffff, stage);
                t.position.set(Math.random() * width * 3 - width * 1.5, Math.random() * height * 3 - height * 1.5);
            }
        }

        function circle(size, color, stage)
        {
            var sprite = PIXI.Sprite.fromImage('circle.png');
            sprite.tint = color;
            sprite.width = sprite.height = size / 2 + Math.random() * size / 2;
            stage.addChild(sprite);
            return sprite;
        }

        function pixi()
        {
            div = document.createElement('div');
            document.body.appendChild(div);
            div.style.position = 'absolute';
            div.style.width = '50%';
            div.style.height = '75%';
            div.style.left = div.offsetWidth / 2 + 'px';
            div.style.top = window.innerHeight / 2 - div.offsetHeight / 2 + 'px';
            renderer = new Renderer({div: div, color: 'rgba(0, 0, 0, 0.25)'});
        }

## Installation
include renderer.js and viewport.js in your project or add to your workflow

    <script src="renderer.js"></script>
    <script src="viewport.js"></script>

## Example
https://davidfig.github.io/viewport/

see also
https://davidfig.github.io/debug/
https://davidfig.github.io/update/
https://davidfig.github.io/animate/
https://davidfig.github.io/renderer/

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