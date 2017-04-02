import {Animation} from '../Animation';
import {AnimationListener} from '../AnimationListener';
import {Position} from '../Position';
import {Event} from './Event';
import {ZeldaGame} from '../ZeldaGame';
declare let game: ZeldaGame;

/**
 * Occurs when Link steps on a stairwel or doorway on the overworld map.
 */
export class GoDownStairsEvent extends Event implements AnimationListener {

    private _animate: boolean;
    private _destMap: string;
    private _destScreen: Position;
    private _destPos: Position;

    constructor(tile: Position, animate: boolean, destMap: string, destScreen: Position, destPos: Position) {
        super(tile);
        this._animate = animate;
        this._destMap = destMap;
        this._destScreen = destScreen;
        this._destPos = destPos;
    }

    animationCompleted(anim: Animation) {
        game.setMap(this._destMap, this._destScreen, this._destPos);
    }

    execute(): boolean {
        game.audio.playSound('stairs', false, () => { console.log('sound done'); });
        if (this._animate) {
            game.link.enterCave(this);
        }
        return false;
    }

    shouldOccur(): boolean {
        return game.link.isEntirelyOn(this.tile);
    }

    update() {
        // Do nothing
    }
}
