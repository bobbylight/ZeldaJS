import {ZeldaGame} from './ZeldaGame';
import {State, Game, BaseStateArgs, Utils, InputManager, Keys} from 'gtp';
declare let game: ZeldaGame;

export class BaseState extends State {

    private _lastConfigKeypressTime: number;
    protected _lastSpriteFrameTime: number;

    /**
     * Functionality common amongst all states in this game.
     * @constructor
     */
    constructor(args?: Game | BaseStateArgs) {
        super(args);
        this._lastConfigKeypressTime = Utils.timestamp();
        this._lastSpriteFrameTime = 0;
    }

    protected getGame(): ZeldaGame {
        return game;
    }

    static get INPUT_REPEAT_MILLIS(): number {
        return 200;
    }

    protected handleDefaultKeys() {

        // We use a timestamp instead of game.playTime since game.playTime gets
        // reset, which messes us up
        const time: number = Utils.timestamp(); // this.game.playTime;
        const im: InputManager = this.game.inputManager;

        if (time > (this._lastConfigKeypressTime + BaseState.INPUT_REPEAT_MILLIS)) {

            // Audio stuff
            if (im.isKeyDown(Keys.KEY_M, true)) {
                game.toggleMuted();
                this._lastConfigKeypressTime = time;
            }

            // Debugging actions
            if (im.isKeyDown(Keys.KEY_Z)) {

                // Increase canvas size
                if (im.isKeyDown(Keys.KEY_P, true)) {
                    if (!game.canvas.style.width) {
                        game.canvas.style.width = game.canvas.width + 'px';
                    }
                    if (!game.canvas.style.height) {
                        game.canvas.style.height = game.canvas.height + 'px';
                    }
                    const styleW: string = game.canvas.style.width;
                    const styleH: string = game.canvas.style.height;
                    game.canvas.style.width = (parseInt(styleW.substring(0, styleW.length - 2), 10) + 1) + 'px';
                    game.canvas.style.height = (parseInt(styleH.substring(0, styleH.length - 2), 10) + 1) + 'px';
                    game.setStatusMessage('Canvas size now: (' + game.canvas.style.width + ', ' + game.canvas.style.height + ')');
                    this._lastConfigKeypressTime = time;
                }

                // Decrease canvas size
                else if (im.isKeyDown(Keys.KEY_L, true)) {
                    if (!game.canvas.style.width) {
                        game.canvas.style.width = game.canvas.width + 'px';
                    }
                    if (!game.canvas.style.height) {
                        game.canvas.style.height = game.canvas.height + 'px';
                    }
                    const styleW: string = game.canvas.style.width;
                    const styleH: string = game.canvas.style.height;
                    game.canvas.style.width = (parseInt(styleW.substring(0, styleW.length - 2), 10) - 1) + 'px';
                    game.canvas.style.height = (parseInt(styleH.substring(0, styleH.length - 2), 10) - 1) + 'px';
                    game.setStatusMessage('Canvas size now: (' + game.canvas.style.width + ', ' + game.canvas.style.height + ')');
                    this._lastConfigKeypressTime = time;
                }

            }

        }

    }

    protected stringWidth(str: string): number {
        return game.assets.get('font').cellW * str.length;
    }

}
