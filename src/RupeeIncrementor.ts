import { ZeldaGame } from '@/ZeldaGame';

const RUPEE_DELAY = 48;

/**
 * Wrapper around logic that increments Link's rupee count at a slow drip. If
 * Link collects a blue rupee, he doesn't get 5 rupees immediately; he gets 1
 * rupee every 1 or 2 frames until he gets all 5. This class wraps that logic,
 * along with the proper sound effects.
 */
export class RupeeIncrementor {
    private rupeesToGive: number;
    private rupeesToGiveDelay: number;
    private refillingRupeesSoundId: number | undefined;
    private extraRefillFrames: number;

    constructor() {
        this.rupeesToGive = 0;
        this.rupeesToGiveDelay = 0;
        this.refillingRupeesSoundId = 0;
        this.extraRefillFrames = 0;
    }

    getRemainingRupees(): number {
        return this.rupeesToGive;
    }

    decrement(game: ZeldaGame, rupeeCount: number) {
        if (rupeeCount <= 0) {
            return;
        }
        this.rupeesToGive -= rupeeCount;
        this.refillingRupeesSoundId = game.audio.playSound('refilling', true);
        this.rupeesToGiveDelay = RUPEE_DELAY;
    }

    increment(game: ZeldaGame, rupeeCount: number) {
        // TODO: Fix this!
        if (rupeeCount <= 0) {
            return;
        }
        this.rupeesToGive += rupeeCount;
        // TODO: This should probably be moved into callers
        game.audio.playSound('rupee');
        if (this.rupeesToGive === 1) {
            this.rupeesToGive = 0;
            game.link.incRupeeCount(1);
            this.rupeesToGiveDelay = 0;
        }
        else {
            this.refillingRupeesSoundId = game.audio.playSound('refilling', true);
            this.rupeesToGiveDelay = RUPEE_DELAY;
        }
    }

    // NOTE: This isn't quite right. I'm trying to mimic the sound by trial and error,
    // but can't quite get it...
    updateRupees(game: ZeldaGame, delta: number) {
        this.rupeesToGiveDelay = Math.max(0, this.rupeesToGiveDelay - delta);

        if (this.rupeesToGiveDelay === 0 && this.rupeesToGive !== 0) {
            if (this.rupeesToGive > 0) {
                game.link.incRupeeCount(1);
                this.rupeesToGive--;
            }
            else {
                game.link.incRupeeCount(-1);
                this.rupeesToGive++;
            }
            if (this.rupeesToGive === 0) {
                this.extraRefillFrames = 3;
            }
            else {
                this.rupeesToGiveDelay = RUPEE_DELAY;
            }
        }
        else if (this.extraRefillFrames > 0) {
            this.extraRefillFrames--;
            if (this.extraRefillFrames === 0 && this.refillingRupeesSoundId) {
                game.audio.stopSound(this.refillingRupeesSoundId);
            }
        }
    }
}
