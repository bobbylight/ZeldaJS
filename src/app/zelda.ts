/*
 * Game bootstrap code.  This can be in an inline <script> tag as well.
 */
//var TILE_SIZE = 8;//16;
let CANVAS_WIDTH: number = 256;
let CANVAS_HEIGHT: number = 240;
let game: zelda.ZeldaGame;

function init(parent: HTMLElement, assetRoot?: string) { // tslint:disable-line:only-arrow-functions no-unused-variable
   'use strict';
   game = new zelda.ZeldaGame({
       assetRoot: assetRoot,
       height: CANVAS_HEIGHT,
       keyRefreshMillis: 300,
       parent: parent,
       targetFps: 60,
       width: CANVAS_WIDTH
   });
   game.setState(new zelda.LoadingState());
   game.start();
}
