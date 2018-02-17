import { Animation } from '../Animation';
import { AnimationListener } from '../AnimationListener';
import { Position, PositionData } from '../Position';
import { Event, EventData } from './Event';
import { ZeldaGame } from '../ZeldaGame';
import { CurtainOpeningState } from '../CurtainOpeningState';
import { MainGameState } from '../MainGameState';
declare let game: ZeldaGame;

/**
 * Occurs when Link steps on a stairwell or doorway on the overworld map.
 */
export class GoDownStairsEvent extends Event<GoDownStairsEventData> implements AnimationListener {

    static readonly EVENT_TYPE: string = 'goDownStairs';

    destMap: string;
    destScreen: Position;
    destPos: Position;
    private readonly animate: boolean;
    private readonly curtainOpenNextScreen: boolean;

    constructor(tile: Position, destMap: string, destScreen: Position, destPos: Position, animate: boolean,
                curtainOpenNextScreen: boolean) {
        super(tile);
        this.destMap = destMap;
        this.destScreen = destScreen;
        this.destPos = destPos;
        this.animate = animate;
        this.curtainOpenNextScreen = curtainOpenNextScreen;
    }

    animationCompleted(anim: Animation) {
        if (this.curtainOpenNextScreen) {
            game.setMap(this.destMap, this.destScreen, this.destPos, false);
            game.setState(new CurtainOpeningState(game.state as MainGameState));
        }
        else {
            game.setMap(this.destMap, this.destScreen, this.destPos);
        }
    }

    clone(): GoDownStairsEvent {
        return new GoDownStairsEvent(this.getTile().clone(), this.destMap, this.destScreen.clone(),
            this.destPos.clone(), this.animate, this.curtainOpenNextScreen);
    }

    execute(): boolean {
        game.audio.stopMusic();
        if (this.animate) {
            game.link.enterCave(this);
        }
        return false;
    }

    getAnimate(): boolean {
        return this.animate;
    }

    shouldOccur(): boolean {
        return game.link.isWalkingUpOnto(this.tile) && game.link.dir === 'UP';
        //return game.link.isEntirelyOn(this.tile) && game.link.dir === 'UP';
    }

    toJson(): GoDownStairsEventData {

        return {
            type: GoDownStairsEvent.EVENT_TYPE,
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

export interface GoDownStairsEventData extends EventData {
    animate: boolean;
    destMap: string;
    destScreen: PositionData;
    destPos: PositionData;
}
