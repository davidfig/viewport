## viewport.js
a 2D camera (viewport) designed to work with PIXI.js

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

    npm install yy-viewport

## Example
https://davidfig.github.io/viewport/

see also
* https://davidfig.github.io/debug/
* https://davidfig.github.io/update/
* https://davidfig.github.io/animate/
* https://davidfig.github.io/renderer/

## API Reference
<a name="Viewport"></a>

## Viewport
creates a zoomable and moveable window into a scenerenderer is of type github.com/davidfig/rendererstage is optional and taken from renderer if not specified

**Kind**: global class  

* [Viewport](#Viewport)
    * [new Viewport(renderer, width, height, stage)](#new_Viewport_new)
    * [.view(width, height, [center])](#Viewport+view)
    * [.resize()](#Viewport+resize)
    * [.move(deltaX, deltaY)](#Viewport+move)
    * [.moveTo(x, y)](#Viewport+moveTo)
    * [.moveTopLeft(x, y)](#Viewport+moveTopLeft)
    * [.zoom(zoomDelta, [center])](#Viewport+zoom)
    * [.zoomPinch(x, y, amount, min, max, [center])](#Viewport+zoomPinch)
    * [.zoomTo(zoomX, zoomY, [center])](#Viewport+zoomTo)
    * [.zoomToFit(width, height, [center])](#Viewport+zoomToFit)
    * [.zoomPercent(percent, [center])](#Viewport+zoomPercent)
    * [.fitX()](#Viewport+fitX)
    * [.fitY()](#Viewport+fitY)
    * [.fit()](#Viewport+fit)
    * [.heightTo(height)](#Viewport+heightTo)
    * [.toWorldFromScreen(x, y)](#Viewport+toWorldFromScreen) ⇒ <code>object</code>
    * [.toScreenFromWorld(world)](#Viewport+toScreenFromWorld) ⇒ <code>object</code>
    * [.toScreenSize(original)](#Viewport+toScreenSize) ⇒
    * [.toWorldSize(original)](#Viewport+toWorldSize) ⇒ <code>number</code>
    * [.screenHeightInWorld()](#Viewport+screenHeightInWorld) ⇒ <code>number</code>
    * [.screenWidthInWorld()](#Viewport+screenWidthInWorld) ⇒ <code>number</code>
    * [.screenXtoY(x)](#Viewport+screenXtoY) ⇒ <code>number</code>
    * [.screenYtoX(y)](#Viewport+screenYtoX) ⇒ <code>number</code>
    * [.scaleGet()](#Viewport+scaleGet) ⇒ <code>number</code>

<a name="new_Viewport_new"></a>

### new Viewport(renderer, width, height, stage)

| Param | Type | Description |
| --- | --- | --- |
| renderer | <code>Renderer</code> | from yy-renderer |
| width | <code>number</code> |  |
| height | <code>number</code> |  |
| stage | <code>PIXI.Container</code> |  |

<a name="Viewport+view"></a>

### viewport.view(width, height, [center])
Change view window for viewport

**Kind**: instance method of <code>[Viewport](#Viewport)</code>  

| Param | Type |
| --- | --- |
| width | <code>number</code> | 
| height | <code>number</code> | 
| [center] | <code>PIXI.Point</code> | 

<a name="Viewport+resize"></a>

### viewport.resize()
resizes view based on renderer.width

**Kind**: instance method of <code>[Viewport](#Viewport)</code>  
<a name="Viewport+move"></a>

### viewport.move(deltaX, deltaY)
moves the viewport using a delta (not absolute)

**Kind**: instance method of <code>[Viewport](#Viewport)</code>  

| Param | Type |
| --- | --- |
| deltaX | <code>number</code> | 
| deltaY | <code>number</code> | 

<a name="Viewport+moveTo"></a>

### viewport.moveTo(x, y)
moves the center of the viewport to a specific coordinate

**Kind**: instance method of <code>[Viewport](#Viewport)</code>  

| Param | Type |
| --- | --- |
| x | <code>number</code> &#124; <code>PIXI.Point</code> | 
| y | <code>number</code> | 

<a name="Viewport+moveTopLeft"></a>

### viewport.moveTopLeft(x, y)
moves the top-left of the viewport to a specific coordinate

**Kind**: instance method of <code>[Viewport](#Viewport)</code>  

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 

<a name="Viewport+zoom"></a>

### viewport.zoom(zoomDelta, [center])
changes zoom by zoomDelta; height is changed based on aspect ratio

**Kind**: instance method of <code>[Viewport](#Viewport)</code>  

| Param | Type |
| --- | --- |
| zoomDelta | <code>number</code> | 
| [center] | <code>PIXI.Point</code> | 

<a name="Viewport+zoomPinch"></a>

### viewport.zoomPinch(x, y, amount, min, max, [center])
pinch to zoom

**Kind**: instance method of <code>[Viewport](#Viewport)</code>  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | in screen coordinates |
| y | <code>number</code> | in screen coordinates |
| amount | <code>number</code> |  |
| min | <code>number</code> | world coordinate |
| max | <code>number</code> | in world coordinates |
| [center] | <code>PIXI.Point</code> |  |

<a name="Viewport+zoomTo"></a>

### viewport.zoomTo(zoomX, zoomY, [center])
zooms to a specific value

**Kind**: instance method of <code>[Viewport](#Viewport)</code>  

| Param | Type | Description |
| --- | --- | --- |
| zoomX | <code>number</code> | if === 0 then zoomY is used |
| zoomY | <code>number</code> | only used if zoomX is set to 0 |
| [center] | <code>PIXI.Point</code> |  |

<a name="Viewport+zoomToFit"></a>

### viewport.zoomToFit(width, height, [center])
**Kind**: instance method of <code>[Viewport](#Viewport)</code>  

| Param | Type |
| --- | --- |
| width | <code>number</code> | 
| height | <code>number</code> | 
| [center] | <code>PIXI.Point</code> | 

<a name="Viewport+zoomPercent"></a>

### viewport.zoomPercent(percent, [center])
zoom by a percentage of the current zoom

**Kind**: instance method of <code>[Viewport](#Viewport)</code>  

| Param | Type |
| --- | --- |
| percent | <code>number</code> | 
| [center] | <code>PIXI.Point</code> | 

<a name="Viewport+fitX"></a>

### viewport.fitX()
fit entire stage _width on screen

**Kind**: instance method of <code>[Viewport](#Viewport)</code>  
<a name="Viewport+fitY"></a>

### viewport.fitY()
fit entire stage _height on screen

**Kind**: instance method of <code>[Viewport](#Viewport)</code>  
<a name="Viewport+fit"></a>

### viewport.fit()
fit entire stage on screen

**Kind**: instance method of <code>[Viewport](#Viewport)</code>  
<a name="Viewport+heightTo"></a>

### viewport.heightTo(height)
change _height of view area

**Kind**: instance method of <code>[Viewport](#Viewport)</code>  

| Param | Type |
| --- | --- |
| height | <code>width</code> | 

<a name="Viewport+toWorldFromScreen"></a>

### viewport.toWorldFromScreen(x, y) ⇒ <code>object</code>
transform a world coordinate to a screen coordinate

**Kind**: instance method of <code>[Viewport](#Viewport)</code>  
**Returns**: <code>object</code> - x, y  

| Param | Type |
| --- | --- |
| x | <code>number</code> &#124; <code>PIXI.Point</code> | 
| y | <code>number</code> | 

<a name="Viewport+toScreenFromWorld"></a>

### viewport.toScreenFromWorld(world) ⇒ <code>object</code>
transform a world coordinate to a screen coordinate

**Kind**: instance method of <code>[Viewport](#Viewport)</code>  
**Returns**: <code>object</code> - x, y  

| Param | Type |
| --- | --- |
| world | <code>PIXI.Point</code> | 

<a name="Viewport+toScreenSize"></a>

### viewport.toScreenSize(original) ⇒
Transform a number from view size to screen size

**Kind**: instance method of <code>[Viewport](#Viewport)</code>  
**Returns**: number  

| Param | Type |
| --- | --- |
| original | <code>number</code> | 

<a name="Viewport+toWorldSize"></a>

### viewport.toWorldSize(original) ⇒ <code>number</code>
Transform a number from screen size to view size

**Kind**: instance method of <code>[Viewport](#Viewport)</code>  

| Param | Type |
| --- | --- |
| original | <code>number</code> | 

<a name="Viewport+screenHeightInWorld"></a>

### viewport.screenHeightInWorld() ⇒ <code>number</code>
**Kind**: instance method of <code>[Viewport](#Viewport)</code>  
**Returns**: <code>number</code> - screen _height in the world coordinate system  
<a name="Viewport+screenWidthInWorld"></a>

### viewport.screenWidthInWorld() ⇒ <code>number</code>
**Kind**: instance method of <code>[Viewport](#Viewport)</code>  
**Returns**: <code>number</code> - screen _width in the world coordinate system  
<a name="Viewport+screenXtoY"></a>

### viewport.screenXtoY(x) ⇒ <code>number</code>
converts an x value to a y value in the screen coordinates

**Kind**: instance method of <code>[Viewport](#Viewport)</code>  

| Param | Type |
| --- | --- |
| x | <code>number</code> | 

<a name="Viewport+screenYtoX"></a>

### viewport.screenYtoX(y) ⇒ <code>number</code>
converts a y value to an x value in the screen coordinates

**Kind**: instance method of <code>[Viewport](#Viewport)</code>  

| Param | Type |
| --- | --- |
| y | <code>number</code> | 

<a name="Viewport+scaleGet"></a>

### viewport.scaleGet() ⇒ <code>number</code>
**Kind**: instance method of <code>[Viewport](#Viewport)</code>  
**Returns**: <code>number</code> - scale  

* * *

Copyright (c) 2016 YOPEY YOPEY LLC - MIT License - Documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown)