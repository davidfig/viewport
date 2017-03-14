const PIXI = require('pixi.js');
const Debug = require('yy-debug');
const Update = require('yy-update');
const Animate = require('yy-animate');
const Renderer = require('yy-renderer');
const Random = require('yy-random');
const hljs = require('highlight.js');
const Viewport = require('../viewport/viewport.js');

// debug panel on the bottom right
Debug.init();

// used for automatic rendering
Update.init({debug: Debug, count: true, FPS: true, percent: true});
Animate.init({update: Update});
Update.update();
// create small window for the renderer
let renderer, canvas;
pixi();

var width = 10000;
var height = 10000;

// create the front viewport, attach it to a container, and add stars
const front = renderer.add(new PIXI.Container());
const viewportFront = new Viewport(renderer, width, height, front);
circles(width, height, 75, front, 10000);

next();

// animate the viewport
function next()
{
    const time = Random.range(1000, 4000);
    const options = {renderer: renderer, onDone: next};
    switch (Random.get(3))
    {
    // move the center point of the front viewport
    case 0:
        new Animate.to(viewportFront, {x: Random.get(width), y: Random.get(height)}, time, options);
        break;

    // zoom the front viewport
    case 1:
        new Animate.to(viewportFront, {width: Random.get(width)}, time, options);
        break;

    // zoom and move the front viewport
    case 2:
        new Animate.to(viewportFront, {width: Random.get(width), x: Random.get(width), y: Random.get(height)}, time, options);
        break;
    }
}

// create the stars
function circles(width, height, size, viewport, count)
{
    // set initial position for all circles
    for (var i = 0; i < count; i++)
    {
        var t = circle(size, Math.random() * 0xffffff, viewport);
        t.position.set(Math.random() * width * 3 - width * 1.5, Math.random() * height * 3 - height * 1.5);
    }
}

function circle(size, color, viewport)
{
    var sprite = PIXI.Sprite.fromImage('circle.png');
    sprite.tint = color;
    sprite.width = sprite.height = size / 2 + Math.random() * size / 2;
    viewport.addChild(sprite);
    return sprite;
}

function pixi()
{
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.style.position = 'absolute';
    canvas.style.width = '50%';
    canvas.style.height = '75%';
    canvas.style.left = canvas.offsetWidth / 2 + 'px';
    canvas.style.top = window.innerHeight / 2 - canvas.offsetHeight / 2 + 'px';
    renderer = new Renderer({update: Update, debug: Debug, canvas, color: 0});
}

window.onload = function()
{
    var code = document.getElementById('code');
    var script = document.getElementById('sample');
    code.innerHTML = script.innerHTML;
    hljs.highlightBlock(code);
};