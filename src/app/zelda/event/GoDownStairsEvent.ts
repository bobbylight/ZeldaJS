import { Animation } from '../Animation';
import { AnimationListener } from '../AnimationListener';
import { Position } from '../Position';
import { Event } from './Event';
import { ZeldaGame } from '../ZeldaGame';
declare let game: ZeldaGame;

/**
 * Occurs when Link steps on a stairwell or doorway on the overworld map.
 */
export class GoDownStairsEvent extends Event implements AnimationListener {

    private _animate: boolean;
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
        game.audio.playSound('stairs', false, () => { console.log('sound done'); });
        if (this._animate) {
            game.link.enterCave(this);
        }
        return false;
    }

    getAnimate(): boolean {
        return this._animate;
    }

    shouldOccur(): boolean {
        return game.link.isEntirelyOn(this.tile);
    }

    update() {
        // Do nothing
    }
}
