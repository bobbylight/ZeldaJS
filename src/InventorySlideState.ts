import { CANVAS_HEIGHT } from './Constants';
import { ZeldaGame } from './ZeldaGame';
import { State, Delay } from 'gtp';
declare let game: ZeldaGame;

export class InventorySlideState extends State<ZeldaGame> {
    private readonly topState: State<ZeldaGame>;
    private readonly bottomState: State<ZeldaGame>;
    private readonly down: boolean;
    private readonly delay: Delay;
    private downAmount: number;

    /**
     * A transition that slides one screen down or up to show another.
     *
     * @param topState The state that should be on "top."
     * @param bottomState The state to transition to when the animation is complete.
     * @param down Whether to slide down vs. up.
     */
    constructor(topState: State<ZeldaGame>, bottomState: State<ZeldaGame>, down: boolean = true) {
        super();
        this.topState = topState;
        this.bottomState = bottomState;
        this.down = down;
        this.downAmount = 0;
        this.delay = new Delay({ millis: 70, loop: true, loopCount: 10, callback: this.delayCallback.bind(this) });
    }

    private delayCallback() {
        this.downAmount++;
    }

    override render(ctx: CanvasRenderingContext2D) {
        const dir: number = this.down ? -1 : 1;

        const displayedPixelCount: number = this.downAmount * (CANVAS_HEIGHT / 10);
        ctx.translate(0, (CANVAS_HEIGHT - displayedPixelCount) * dir);
        this.topState.render(ctx);

        ctx.translate(0, -CANVAS_HEIGHT * dir);
        this.bottomState.render(ctx);

        ctx.resetTransform();
    }

    override update(delta: number) {
        super.update(delta);

        this.delay.update(delta);
        if (this.delay.isDone()) {
            game.setState(this.down ? this.topState : this.topState);
        }
    }
}
