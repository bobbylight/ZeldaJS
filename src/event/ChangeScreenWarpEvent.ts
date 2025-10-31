import { Event, EventData, EventResult} from './Event';
import { ZeldaGame } from '@/ZeldaGame';
import { AnimationListener } from '@/AnimationListener';
import { Animation } from '@/Animation';
import { RowColumnPair } from '@/RowColumnPair';

/**
 * An event that denotes that Link is going to warp when moving to a new screen.<p>
 * Note this event only checks for <em>vertical</em> screen changes.  This is because, in Zelda 1, the only time
 * Link warps to a new map when changing maps is when moving down.  If we need this class to be more flexible,
 * and support warping on Link moving north, east or west, we'd likely need to store the "from direction" of the
 * warp in this class.
 */
export class ChangeScreenWarpEvent extends Event<ChangeScreenWarpData> implements AnimationListener {
    static readonly EVENT_TYPE: string = 'changeScreenWarp';

    constructor(tile: RowColumnPair, destMap: string, destScreen: RowColumnPair, destPos: RowColumnPair, animate: boolean) {
        super(ChangeScreenWarpEvent.EVENT_TYPE, tile, destMap, destScreen, destPos, animate);
    }

    animationCompleted(anim: Animation) {
    }

    override execute(game: ZeldaGame): EventResult {
        game.setMap(this.destMap, this.destScreen, this.destPos, false);
        if (this.animate) {
            game.audio.stopMusic();
            game.link.exitCave(this);
        }
        return { done: false };
    }

    shouldOccur(): boolean {
        // We don't have to determine whether Link is moving into another screen; the Map
        // class checks for value of this type on screen transitions.
        return false;
    }

    toJson(): ChangeScreenWarpData {
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

export type ChangeScreenWarpData = EventData;
