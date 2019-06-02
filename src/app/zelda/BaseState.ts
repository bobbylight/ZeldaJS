import { ZeldaGame } from './ZeldaGame';
import { State, BaseStateArgs, Utils, InputManager, Keys } from 'gtp';
import SpriteSheet from 'gtp/lib/gtp/SpriteSheet';
declare let game: ZeldaGame;

export class BaseState extends State<ZeldaGame> {

    private _lastConfigKeypressTime: number;
    protected _lastSpriteFrameTime: number;

    /**
     * Functionality common amongst all states in this game.
     */
    constructor(args?: ZeldaGame | BaseStateArgs<ZeldaGame>) {
        super(args);
        this._lastConfigKeypressTime = Utils.timestamp();
        this._lastSpriteFrameTime = 0;
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
            if (im.isKeyDown(Keys.KEY_SHIFT)) {

                const canvasStyle: CSSStyleDeclaration = game.canvas.style;

                // Increase canvas size
                if (im.isKeyDown(Keys.KEY_P, true)) {
                    if (!canvasStyle.width) {
                        canvasStyle.width = game.canvas.clientWidth + 'px';
                    }
                    if (!canvasStyle.height) {
                        canvasStyle.height = game.canvas.clientHeight + 'px';
                    }
                    const styleW: string = canvasStyle.width;
                    const styleH: string = canvasStyle.height;
                    canvasStyle.width = (parseInt(styleW.substring(0, styleW.length - 2), 10) + 1) + 'px';
                    canvasStyle.height = (parseInt(styleH.substring(0, styleH.length - 2), 10) + 1) + 'px';
                    game.setStatusMessage(`Canvas size now: (${canvasStyle.width}, ${canvasStyle.height})`);
                    this._lastConfigKeypressTime = time;
                }

                // Decrease canvas size
                else if (im.isKeyDown(Keys.KEY_L, true)) {
                    if (!canvasStyle.width) {
                        canvasStyle.width = game.canvas.clientWidth + 'px';
                    }
                    if (!canvasStyle.height) {
                        canvasStyle.height = game.canvas.clientHeight + 'px';
                    }
                    const styleW: string = canvasStyle.width;
                    const styleH: string = canvasStyle.height;
                    canvasStyle.width = (parseInt(styleW.substring(0, styleW.length - 2), 10) - 1) + 'px';
                    canvasStyle.height = (parseInt(styleH.substring(0, styleH.length - 2), 10) - 1) + 'px';
                    game.setStatusMessage(`Canvas size now: (${canvasStyle.width}, ${canvasStyle.height})`);
                    this._lastConfigKeypressTime = time;
                }

            }

        }

    }

    protected stringWidth(str: string): number {
        const spriteSheet: SpriteSheet = game.assets.get('font');
        return spriteSheet.cellW * str.length;
    }

}
