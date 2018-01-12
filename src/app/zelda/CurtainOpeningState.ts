import { Constants } from './Constants';
import { MainGameState } from './MainGameState';
import { ZeldaGame } from './ZeldaGame';
import { State, Delay } from 'gtp';
declare let game: ZeldaGame;

export class CurtainOpeningState extends State {

    private readonly _mainState: MainGameState;
    private readonly _delay: Delay;
    private _openAmount: number;

    /**
     * A transition into the main game state that mimics that in LoZ for the NES.  The screen is revealed
     * as if a curtain is being opened, 1/2 tile width on each side at a time.
     *
     * @param mainState The state to transition to when the animation is complete.
     */
    constructor(mainState: MainGameState) {
        super();
        this._mainState = mainState;
        this._openAmount = 0;
        this._delay = new Delay({ millis: 70, loop: true, loopCount: 16,
                callback: () => { this._delayCallback.call(this); } });
    }

    private _delayCallback() {
        this._openAmount++;
    }

    render(ctx: CanvasRenderingContext2D) {

        this._mainState.render(ctx);

        const displayedPixelCount: number = this._openAmount * Constants.TILE_WIDTH;
        const coveredPixelCount: number = Constants.SCREEN_WIDTH - displayedPixelCount;

        ctx.fillStyle = 'black';
        const y: number = Constants.HUD_HEIGHT;
        const h: number = Constants.SCREEN_HEIGHT;

        ctx.fillRect(0, y, coveredPixelCount / 2, h);
        ctx.fillRect(Constants.SCREEN_WIDTH - coveredPixelCount / 2, y, coveredPixelCount / 2, h);
    }

    update(delta: number) {

        super.update(delta);

        this._delay.update(delta);
        if (this._delay.isDone()) {
            game.setState(this._mainState);
        }
    }

}
