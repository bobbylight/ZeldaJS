import { Actor } from './Actor';
import { Direction } from './Direction';
import { ZeldaGame } from '@/ZeldaGame';

/**
 * A base class for entities that can attack and/or be attacked.
 */
export abstract class Character extends Actor {
    static readonly MAX_SLIDE_TICK: number = 30;

    protected slideTick: number;
    protected slidingDir: Direction | null;

    constructor(game: ZeldaGame) {
        super(game);
        this.slideTick = 0;
        this.slidingDir = null;
    }
}
