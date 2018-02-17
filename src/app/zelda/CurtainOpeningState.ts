import { Constants } from './Constants';
import { ZeldaGame } from './ZeldaGame';
import { State, Delay } from 'gtp';
import { MainGameState } from './MainGameState';
declare let game: ZeldaGame;

export class CurtainOpeningState extends State {

    private readonly mainState: MainGameState;
    private readonly delay: Delay;
    private openAmount: number;

    /**
     * A transition into the main game state that mimics that in LoZ for the NES.  The screen is revealed
     * as if a curtain is being opened, 1/2 tile width on each side at a time.
     *
     * @param mainState The state to transition to when the animation is complete.
     */
    constructor(mainState: MainGameState) {
        super();
        this.mainState = mainState;
        this.openAmount = 0;
        this.delay = new Delay({ millis: 70, loop: true, loopCount: 16, callback: this.delayCallback.bind(this) });
    }

    private delayCallback() {
        this.openAmount++;
    }

    render(ctx: CanvasRenderingContext2D) {

        this.mainState.render(ctx);

        const displayedPixelCount: number = this.openAmount * Constants.TILE_WIDTH;
        const coveredPixelCount: number = Constants.SCREEN_WIDTH - displayedPixelCount;

        ctx.fillStyle = 'black';
        const y: number = Constants.HUD_HEIGHT;
        const h: number = Constants.SCREEN_HEIGHT;

        ctx.fillRect(0, y, coveredPixelCount / 2, h);
        ctx.fillRect(Constants.SCREEN_WIDTH - coveredPixelCount / 2, y, coveredPixelCount / 2, h);
    }

    update(delta: number) {

        super.update(delta);

        this.delay.update(delta);
        if (this.delay.isDone()) {
            game.setState(this.mainState);
        }
    }

}
