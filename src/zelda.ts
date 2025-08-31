/*
 * Game bootstrap code.  This can be in an inline <script> tag as well.
 */
import { ZeldaGame } from './ZeldaGame';
import { LoadingState } from './LoadingState';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './Constants';
import { CanvasResizer, StretchMode } from 'gtp';

import './app.css';

declare global {
    interface Window {
        game?: ZeldaGame;
        init: (parent: string, assetRoot?: string) => void;
    }
}

window.init = (parent: string, assetRoot?: string) => {
    window.game = new ZeldaGame({
        assetRoot: assetRoot,
        height: CANVAS_HEIGHT,
        keyRefreshMillis: 300,
        parent,
        targetFps: 60,
        width: CANVAS_WIDTH,
    });
    window.game.setState(new LoadingState());
    window.game.start();

    const userAgent: string = navigator.userAgent.toLowerCase();
    if (userAgent.includes('electron/')) {
        const canvas: HTMLCanvasElement = window.game.canvas;

        window.addEventListener('resize', () => {
            console.log('Resize event received');
            CanvasResizer.resize(canvas, StretchMode.STRETCH_PROPORTIONAL);
        }, false);
    }
};
window.init('parent');
