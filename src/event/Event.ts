import { ZeldaGame } from '@/ZeldaGame';
import { TILE_HEIGHT, TILE_WIDTH } from '@/Constants';
import { RowColumnPair } from '@/RowColumnPair';

let count = 0;

export interface EventResult {
    done: boolean;
    replacementEvents?: Event<EventData>[];
}

export abstract class Event<T extends EventData> {
    readonly type: string;
    readonly id: string;
    tile: RowColumnPair;
    destMap: string;
    destScreen: RowColumnPair;
    destPos: RowColumnPair;
    readonly animate: boolean;

    constructor(type: string, tile: RowColumnPair, destMap: string, destScreen: RowColumnPair, destPos: RowColumnPair,
        animate: boolean) {
        this.type = type;
        count++;
        this.id = count.toString(10);
        this.tile = tile;
        this.destMap = destMap;
        this.destScreen = destScreen;
        this.destPos = destPos;
        this.animate = animate;
    }

    abstract execute(game: ZeldaGame): EventResult;

    getAnimate(): boolean {
        return this.animate;
    }

    paint(ctx: CanvasRenderingContext2D) {
        const x: number = this.tile.col * TILE_WIDTH;
        const y: number = this.tile.row * TILE_WIDTH;
        ctx.strokeStyle = 'red';
        ctx.strokeRect(x, y, TILE_WIDTH, TILE_HEIGHT);
    }

    abstract shouldOccur(game: ZeldaGame): boolean;

    abstract toJson(): T;

    abstract update(): void;
}

export interface EventData {
    type: string;
    tile: RowColumnPair;
    animate: boolean;
    destMap: string;
    destScreen: RowColumnPair;
    destPos: RowColumnPair;
}
