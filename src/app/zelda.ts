/*
 * Game bootstrap code.  This can be in an inline <script> tag as well.
 */
import { ZeldaGame } from './zelda/ZeldaGame';
import { LoadingState } from './zelda/LoadingState';
import { Constants } from './zelda/Constants';
import { CanvasResizer, StretchMode } from 'gtp';

// Webpack makes you import your HTML and CSS.  WTF?
import '../less/all.less';
import '../html/index.html';

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
