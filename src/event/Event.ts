import { Position, PositionData } from '@/Position';

let count = 0;

export abstract class Event<T extends EventData> {
    readonly type: string;
    readonly id: string;
    tile: Position;
    destMap: string;
    destScreen: Position;
    destPos: Position;
    readonly animate: boolean;

    constructor(type: string, tile: Position, destMap: string, destScreen: Position, destPos: Position,
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

    abstract execute(): boolean;

    getTile(): Position {
        return this.tile;
    }

    getAnimate(): boolean {
        return this.animate;
    }

    abstract shouldOccur(): boolean;

    abstract toJson(): T;

    abstract update(): void;
}

export interface EventData {
    type: string;
    tile: PositionData;
    animate: boolean;
    destMap: string;
    destScreen: PositionData;
    destPos: PositionData;
}
