import { Animation } from '../Animation';
import { AnimationListener } from '../AnimationListener';
import { Position, PositionData } from '../Position';
import { Event, EventData } from './Event';
import { ZeldaGame } from '../ZeldaGame';
declare let game: ZeldaGame;

/**
 * Occurs when Link steps on a stairwell or doorway on the overworld map.
 */
export class GoDownStairsEvent extends Event<GoDownStairsEventData> implements AnimationListener {

    static readonly EVENT_TYPE: string = 'goDownStairs';

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
        game.setMap(this.destMap, this.destScreen, this.destPos);
    }

    clone(): GoDownStairsEvent {
        return new GoDownStairsEvent(this.getTile().clone(), this._animate, this.destMap, this.destScreen.clone(),
            this.destPos.clone());
    }

    execute(): boolean {
        game.audio.stopMusic();
        if (this._animate) {
            game.link.enterCave(this);
        }
        return false;
    }

    getAnimate(): boolean {
        return this._animate;
    }

    shouldOccur(): boolean {
        return game.link.isWalkingUpOnto(this.tile) && game.link.dir === 'UP';
        //return game.link.isEntirelyOn(this.tile) && game.link.dir === 'UP';
    }

    toJson(): GoDownStairsEventData {

        return {
            type: GoDownStairsEvent.EVENT_TYPE,
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

export interface GoDownStairsEventData extends EventData {
    animate: boolean;
    destMap: string;
    destScreen: PositionData;
    destPos: PositionData;
}
