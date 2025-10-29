import { Event, EventData, EventResult } from '@/event/Event';
import { Position } from '@/Position';
import { Animation } from '@/Animation';
import { CurtainOpeningState } from '@/CurtainOpeningState';
import { MainGameState } from '@/MainGameState';
import { ZeldaGame } from '@/ZeldaGame';
import { TILE_HEIGHT, TILE_WIDTH } from '@/Constants';
import { GoDownStairsEvent } from '@/event/GoDownStairsEvent';

/**
 * Event that denotes a bombable wall.
 */
export class BombableWallEvent extends Event<BombableWallData> {
    static readonly EVENT_TYPE: string = 'bombableWall';

    private readonly curtainOpenNextScreen: boolean;
    private occurrable: boolean;

    constructor(tile: Position, destMap: string, destScreen: Position, destPos: Position, animate: boolean,
        curtainOpenNextScreen: boolean) {
        super(BombableWallEvent.EVENT_TYPE, tile, destMap, destScreen, destPos, animate);
        this.curtainOpenNextScreen = curtainOpenNextScreen;
        this.occurrable = false;
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

    clone(): BombableWallEvent {
        return new BombableWallEvent(this.getTile().clone(), this.destMap, this.destScreen.clone(),
            this.destPos.clone(), this.animate, this.curtainOpenNextScreen);
    }

    override execute(game: ZeldaGame): EventResult {
        game.audio.playSound('secret');
        game.map.currentScreen.setTile(this.tile.row, this.tile.col, 61); // Set to door
        return { done: true, replacementEvents: [
            new GoDownStairsEvent(this.tile, this.destMap, this.destScreen,
                this.destPos, this.animate, this.curtainOpenNextScreen),
        ],
        };
    }

    override paint(ctx: CanvasRenderingContext2D) {
        const tile: Position = this.getTile();
        const x: number = tile.col * TILE_WIDTH;
        const y: number = tile.row * TILE_WIDTH;
        ctx.fillStyle = '#00000090';
        ctx.fillRect(x, y, TILE_WIDTH, TILE_HEIGHT);
        super.paint(ctx);
    }

    setShouldOccur(shouldOccur: boolean) {
        this.occurrable = shouldOccur;
    }

    shouldOccur(game: ZeldaGame): boolean {
        return this.occurrable;
    }

    toJson(): BombableWallData {
        return {
            type: this.type,
            tile: this.tile.toJson(),
            animate: this.animate,
            destMap: this.destMap,
            destScreen: this.destScreen.toJson(),
            destPos: this.destPos.toJson(),
        };
    }

    update() {
        // Do nothing
    }
}

export type BombableWallData = EventData;
