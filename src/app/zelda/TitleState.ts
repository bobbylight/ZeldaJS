import { BaseState } from './BaseState';
import { CurtainOpeningState } from './CurtainOpeningState';
import { MainGameState } from './MainGameState';
import { ZeldaGame } from './ZeldaGame';
import { BaseStateArgs, Game, Image, InputManager } from 'gtp';
declare let game: ZeldaGame;

export class TitleState extends BaseState {

    private _lastKeypressTime: number;

    /**
     * State that renders the title screen.
     * @constructor
     */
    constructor(args?: ZeldaGame | BaseStateArgs) {
        super(args);
    }

    enter() {

        super.enter(game);

        game.canvas.addEventListener('touchstart', this.handleStart, false);
        this._lastKeypressTime = game.playTime;
    }

    leaving(game: Game) {
        game.canvas.removeEventListener('touchstart', this.handleStart, false);
    }

    handleStart() {
        console.log('Yee, touch detected!');
        this._startGame();
    }

    render(ctx: CanvasRenderingContext2D) {

        this.game.clearScreen();

        // Title banner
        const title: Image = game.assets.get('title');
        title.draw(ctx, 0, 0);

        if (!game.audio.isInitialized()) {
            this._renderNoSoundMessage();
        }
    }

    private _renderNoSoundMessage() {

        const w: number = game.getWidth();

        let text: string = 'SOUND IS DISABLED AS';
        let x: number = (w - this.stringWidth(text)) / 2;
        let y: number = game.getHeight() - 20 - 9 * 3;
        this.getGame().drawString(x, y, text);
        text = 'YOUR BROWSER DOES NOT';
        x = ( w - this.stringWidth(text)) / 2;
        y += 9;
        this.getGame().drawString(x, y, text);
        text = 'SUPPORT WEB AUDIO';
        x = (w - this.stringWidth(text)) / 2;
        y += 9;
        this.getGame().drawString(x, y, text);
    }

    _startGame() {
        game.startNewGame();
        game.setState(new CurtainOpeningState(new MainGameState()));
    }

    update(delta: number) {

        this.handleDefaultKeys();

        const playTime: number = game.playTime;
        if (playTime > this._lastKeypressTime + BaseState.INPUT_REPEAT_MILLIS + 100) {

            const im: InputManager = game.inputManager;

            if (im.enter(true)) {
                this._startGame();
            }
        }

    }
}
