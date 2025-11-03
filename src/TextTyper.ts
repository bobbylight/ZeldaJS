import { SCREEN_WIDTH, TILE_HEIGHT } from '@/Constants';
import { ZeldaGame } from '@/ZeldaGame';

const DEFAULT_CHAR_DELAY = 100;

/**
 * Renders text 1 character at a time at a given pace. Used for NPCs in caves, etc.
 */
export class TextTyper {
    private readonly x: number;
    private offs: number;
    private curDelay: number;

    constructor(private readonly game: ZeldaGame, private readonly text: string,
                private readonly delay = DEFAULT_CHAR_DELAY) {
        this.offs = game.isEditMode() ? text.length : 0;
        this.curDelay = 0;
        // TODO: Support > 1 line
        this.x = (SCREEN_WIDTH - this.text.length * 8 /* CHAR_WIDTH */) / 2;
    }

    isDone(): boolean {
        return this.offs >= this.text.length;
    }

    paint(ctx: CanvasRenderingContext2D) {
        if (this.offs === 0) {
            return;
        }
        const y = TILE_HEIGHT * 3 - 10;
        this.game.drawString(this.x, y, this.text.substring(0, this.offs), ctx);
    }

    update(delta: number): boolean {
        if (!this.isDone()) {
            this.curDelay += delta;
            if (this.curDelay >= this.delay) {
                this.offs++;
                this.curDelay = 0;
                this.game.audio.playSound('text');
            }
        }
        return this.isDone();
    }
}
