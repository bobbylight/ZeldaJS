import { Event, EventData, EventResult } from './Event';
import { Animation } from '@/Animation';
import { AnimationListener } from '@/AnimationListener';
import { ZeldaGame } from '@/ZeldaGame';
import { CurtainOpeningState } from '@/CurtainOpeningState';
import { MainGameState } from '@/MainGameState';
import { RowColumnPair } from '@/RowColumnPair';

/**
 * Occurs when Link steps on a stairwell or doorway on the overworld map.
 */
export class GoDownStairsEvent extends Event<GoDownStairsEventData> implements AnimationListener {
    static readonly EVENT_TYPE: string = 'goDownStairs';

    private readonly curtainOpenNextScreen: boolean;

    constructor(tile: RowColumnPair, destMap: string, destScreen: RowColumnPair, destPos: RowColumnPair, animate: boolean,
        curtainOpenNextScreen: boolean) {
        super(GoDownStairsEvent.EVENT_TYPE, tile, destMap, destScreen, destPos, animate);
        this.curtainOpenNextScreen = curtainOpenNextScreen;
    }

    animationCompleted(anim: Animation) {
        if (this.curtainOpenNextScreen) {
            anim.game.setMap(this.destMap, this.destScreen, this.destPos, false);
            anim.game.setState(new CurtainOpeningState(anim.game, anim.game.state as MainGameState));
        }
        else {
            anim.game.setMap(this.destMap, this.destScreen, this.destPos);
        }
    }

    override execute(game: ZeldaGame): EventResult {
        game.audio.stopMusic();
        if (this.animate) {
            game.link.enterCave(this);
        }
        return { done: false };
    }

    shouldOccur(game: ZeldaGame): boolean {
        return game.link.isWalkingUpOnto(this.tile) && game.link.dir === 'UP';
        // return game.link.isEntirelyOn(this.tile) && game.link.dir === 'UP';
    }

    toJson(): GoDownStairsEventData {
        return {
            type: this.type,
            tile: this.tile,
            animate: this.animate,
            destMap: this.destMap,
            destScreen: this.destScreen,
            destPos: this.destPos,
        };
    }

    update() {
        // Do nothing
    }
}

export type GoDownStairsEventData = EventData;
