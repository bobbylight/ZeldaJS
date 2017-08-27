import { Position, PositionData } from '../Position';

export abstract class Event<T extends EventData> {

    protected tile: Position;

    constructor(tile: Position) {
        this.tile = tile;
    }

    abstract execute(): boolean;

    getTile(): Position {
        return this.tile;
    }

    abstract shouldOccur(): boolean;

    abstract toJson(): T;

    abstract update(): void;
}

export interface EventData {
    type: string;
    tile: PositionData;
}
