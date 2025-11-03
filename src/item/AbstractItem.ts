import { Actor } from '@/Actor';
import { ZeldaGame } from '@/ZeldaGame';

/**
 * A base class for items that Link can pick up.
 */
export abstract class AbstractItem extends Actor {
    constructor(game: ZeldaGame) {
        super(game);
        this.blinksWhenNew = true;
    }
}
