/*
 * Game bootstrap code.  This can be in an inline <script> tag as well.
 */
import {ZeldaGame} from './zelda/ZeldaGame';
import {LoadingState} from './zelda/LoadingState';
import {Constants} from './zelda/Constants';

let game: ZeldaGame;

function init(parent: HTMLElement, assetRoot?: string) { // tslint:disable-line:only-arrow-functions no-unused-variable
   'use strict';
   game = new ZeldaGame({
       assetRoot: assetRoot,
       height: Constants.CANVAS_HEIGHT,
       keyRefreshMillis: 300,
       parent: parent,
       targetFps: 60,
       width: Constants.CANVAS_WIDTH
   });
   game.setState(new LoadingState());
   game.start();
}
