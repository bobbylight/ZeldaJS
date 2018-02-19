import { Event, EventData } from './Event';
import { Position, PositionData } from '../Position';
import { ZeldaGame } from '../ZeldaGame';
import { AnimationListener } from '../AnimationListener';
import { Animation } from '../Animation';
declare let game: ZeldaGame;

/**
 * An event that denotes that Link is going to warp when moving to a new screen.<p>
 * Note this event only checks for <em>vertical</em> screen changes.  This is because, in Zelda 1, the only time
 * Link warps to a new map when changing screens is when moving down.  If we need this class to be more flexible,
 * and support warping on Link moving north, east or west, we'd likely need to store the "from direction" of the
 * warp in this class.
 */
export class ChangeScreenWarpEvent extends Event<ChangeScreenWarpData> implements AnimationListener {

    static readonly EVENT_TYPE: string = 'changeScreenWarp';

    private readonly _animate: boolean;
    destMap: string;
    destScreen: Position;
    destPos: Position;

    constructor(tile: Position, animate: boolean, destMap: string, destScreen: Position, destPos: Position) {
        super(tile);
        this._animate = animate;
        this.destMap = destMap;
        this.destScreen = destScreen;
        this.destPos = destPos;
    }

    animationCompleted(anim: Animation) {
    }

    clone(): ChangeScreenWarpEvent {
        return new ChangeScreenWarpEvent(this.getTile().clone(), this._animate, this.destMap, this.destScreen.clone(),
            this.destPos.clone());
    }

    execute(): boolean {
        game.setMap(this.destMap, this.destScreen, this.destPos, false);
        if (this._animate) {
            game.audio.stopMusic();
            game.link.exitCave(this);
        }
        return false;
    }

    shouldOccur(): boolean {
        // We don't have to determine whether Link is moving into another screen; the Map
        // class checks for events of this type on screen transitions.
        return false;
    }

    toJson(): ChangeScreenWarpData {

        return {
            type: ChangeScreenWarpEvent.EVENT_TYPE,
            tile: this.tile.toJson(),
            animate: this._animate,
            destMap: this.destMap,
            destScreen: this.destScreen.toJson(),
            destPos: this.destPos.toJson()
        };
    }

    update() {
        // Do nothing
    }
}

export interface ChangeScreenWarpData extends EventData {
    animate: boolean;
    destMap: string;
    destScreen: PositionData;
    destPos: PositionData;
}
