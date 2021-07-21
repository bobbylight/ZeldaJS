/*
 * Game bootstrap code.  This can be in an inline <script> tag as well.
 */
import { ZeldaGame } from './ZeldaGame';
import { LoadingState } from './LoadingState';
import { Constants } from './Constants';
import { CanvasResizer, StretchMode } from 'gtp';

import './app.scss';

(window as any).init = (parent: HTMLElement, assetRoot?: string) => {
    const gameWindow: any = window as any;
    gameWindow.game = new ZeldaGame({
        assetRoot: assetRoot,
        height: Constants.CANVAS_HEIGHT,
        keyRefreshMillis: 300,
        parent: parent,
        targetFps: 60,
        width: Constants.CANVAS_WIDTH
    });
    gameWindow.game.setState(new LoadingState());
    gameWindow.game.start();

    const userAgent: string = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('electron/') > -1) {
        const canvas: HTMLCanvasElement = gameWindow.game.canvas;

        window.addEventListener('resize', () => {
            (console as any).log('Resize event received');
            CanvasResizer.resize(canvas, StretchMode.STRETCH_PROPORTIONAL);
        }, false);
    }
};
