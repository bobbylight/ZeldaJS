import { ZeldaGame } from './ZeldaGame';
import { InputManager, Keys, State, Utils } from 'gtp';
import SpriteSheet from 'gtp/lib/gtp/SpriteSheet';

export class BaseState extends State<ZeldaGame> {
    static readonly INPUT_REPEAT_MILLIS: number = 200;

    private lastConfigKeypressTime: number;
    protected lastSpriteFrameTime: number;

    /**
     * Functionality common amongst all states in this game.
     */
    constructor(game: ZeldaGame) {
        super(game);
        this.lastConfigKeypressTime = Utils.timestamp();
        this.lastSpriteFrameTime = 0;
    }

    protected handleDefaultKeys() {
        // We use a timestamp instead of this.game.playTime since this.game.playTime gets
        // reset, which messes us up
        const time: number = Utils.timestamp(); // this.game.playTime;
        const im: InputManager = this.game.inputManager;

        if (time > this.lastConfigKeypressTime + BaseState.INPUT_REPEAT_MILLIS) {
            // Audio stuff
            if (im.isKeyDown(Keys.KEY_M, true)) {
                this.game.toggleMuted();
                this.lastConfigKeypressTime = time;
            }

            // Debugging actions
            if (im.isKeyDown(Keys.KEY_SHIFT)) {
                const canvasStyle: CSSStyleDeclaration = this.game.canvas.style;

                // Increase canvas size
                if (im.isKeyDown(Keys.KEY_P, true)) {
                    if (!canvasStyle.width) {
                        canvasStyle.width = `${this.game.canvas.clientWidth}px`;
                    }
                    if (!canvasStyle.height) {
                        canvasStyle.height = `${this.game.canvas.clientHeight}px`;
                    }
                    const styleW: string = canvasStyle.width;
                    const styleH: string = canvasStyle.height;
                    canvasStyle.width = `${parseInt(styleW.substring(0, styleW.length - 2), 10) + 1}px`;
                    canvasStyle.height = `${parseInt(styleH.substring(0, styleH.length - 2), 10) + 1}px`;
                    this.game.setStatusMessage(`Canvas size now: (${canvasStyle.width}, ${canvasStyle.height})`);
                    this.lastConfigKeypressTime = time;
                }

                // Decrease canvas size
                else if (im.isKeyDown(Keys.KEY_L, true)) {
                    if (!canvasStyle.width) {
                        canvasStyle.width = `${this.game.canvas.clientWidth}px`;
                    }
                    if (!canvasStyle.height) {
                        canvasStyle.height = `${this.game.canvas.clientHeight}px`;
                    }
                    const styleW: string = canvasStyle.width;
                    const styleH: string = canvasStyle.height;
                    canvasStyle.width = `${parseInt(styleW.substring(0, styleW.length - 2), 10) - 1}px`;
                    canvasStyle.height = `${parseInt(styleH.substring(0, styleH.length - 2), 10) - 1}px`;
                    this.game.setStatusMessage(`Canvas size now: (${canvasStyle.width}, ${canvasStyle.height})`);
                    this.lastConfigKeypressTime = time;
                }
            }
        }
    }

    protected stringWidth(str: string): number {
        const spriteSheet: SpriteSheet = this.game.assets.get('font');
        return spriteSheet.cellW * str.length;
    }
}
