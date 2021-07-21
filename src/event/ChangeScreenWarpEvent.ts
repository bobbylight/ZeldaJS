import { Event, EventData } from './Event';
import { Position } from '../Position';
import { ZeldaGame } from '../ZeldaGame';
import { AnimationListener } from '../AnimationListener';
import { Animation } from '../Animation';
declare let game: ZeldaGame;

/**
 * An event that denotes that Link is going to warp when moving to a new screen.<p>
 * Note this event only checks for <em>vertical</em> screen changes.  This is because, in Zelda 1, the only time
 * Link warps to a new map when changing maps is when moving down.  If we need this class to be more flexible,
 * and support warping on Link moving north, east or west, we'd likely need to store the "from direction" of the
 * warp in this class.
 */
export class ChangeScreenWarpEvent extends Event<ChangeScreenWarpData> implements AnimationListener {
    static readonly EVENT_TYPE: string = 'changeScreenWarp';

    constructor(tile: Position, destMap: string, destScreen: Position, destPos: Position, animate: boolean) {
        super(ChangeScreenWarpEvent.EVENT_TYPE, tile, destMap, destScreen, destPos, animate);
    }

    animationCompleted(anim: Animation) {
    }

    clone(): ChangeScreenWarpEvent {
        return new ChangeScreenWarpEvent(this.getTile().clone(), this.destMap, this.destScreen.clone(),
            this.destPos.clone(), this.animate);
    }

    execute(): boolean {
        game.setMap(this.destMap, this.destScreen, this.destPos, false);
        if (this.animate) {
            game.audio.stopMusic();
            game.link.exitCave(this);
        }
        return false;
    }

    shouldOccur(): boolean {
        // We don't have to determine whether Link is moving into another screen; the Map
        // class checks for value of this type on screen transitions.
        return false;
    }

    toJson(): ChangeScreenWarpData {
        return {
            type: this.type,
            tile: this.tile.toJson(),
            animate: this.animate,
            destMap: this.destMap,
            destScreen: this.destScreen.toJson(),
            destPos: this.destPos.toJson()
        };
    }

    update() {
        // Do nothing
    }
}

export type ChangeScreenWarpData = EventData;
