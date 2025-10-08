import { Actor } from '@/Actor';
import { ZeldaGame } from '@/ZeldaGame';

const NEW_FRAME_COUNT = 75; // 1.25 seconds

/**
 * A base class for items that Link can pick up.
 */
export abstract class AbstractItem extends Actor {
    // TODO: Convert to millis once millis are passed to update()
    protected visibleFrameCount: number;
    protected blinksWhenNew: boolean;

    constructor(game: ZeldaGame) {
        super(game);
        this.visibleFrameCount = 0;
        this.blinksWhenNew = true;
    }

    override paint(ctx: CanvasRenderingContext2D) {
        if (this.blinksWhenNew && this.visibleFrameCount > NEW_FRAME_COUNT || this.visibleFrameCount % 8 < 4) {
            this.paintImpl(ctx);
        }
    }

    abstract paintImpl(ctx: CanvasRenderingContext2D): void;

    update() {
        this.visibleFrameCount++;
    }
}
