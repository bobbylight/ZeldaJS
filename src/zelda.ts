/*
 * Game bootstrap code.  This can be in an inline <script> tag as well.
 */
import { CanvasResizer, StretchMode } from 'gtp';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './Constants';
import { LoadingState } from './LoadingState';
import { ZeldaGame } from './ZeldaGame';

const game = new ZeldaGame({
    height: CANVAS_HEIGHT,
    keyRefreshMillis: 300,
    parent: 'parent',
    targetFps: 60,
    width: CANVAS_WIDTH,
});
game.setState(new LoadingState(game));
game.start();

const userAgent: string = navigator.userAgent.toLowerCase();
if (userAgent.includes('electron/')) {
    const canvas = game.canvas;

    window.addEventListener('resize', () => {
        console.log('Resize event received');
        CanvasResizer.resize(canvas, StretchMode.STRETCH_PROPORTIONAL);
    }, false);
}
