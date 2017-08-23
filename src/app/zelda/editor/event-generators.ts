import { Event } from '../event/Event';
import { GoDownStairsEvent } from '../event/GoDownStairsEvent';
import { Position } from '../Position';

/**
 * Generates an event of some type.
 */
export abstract class EventGenerator<E extends Event> {

    protected tile: Position;

    setTile(tile: Position) {
        this.tile = tile;
    }

    abstract generate(): E;
}

/**
 * Generates "go down stairs" events.
 */
export class GoDownStairsEventGenerator extends EventGenerator<GoDownStairsEvent> {

    private destMap: string;
    private destScreen: Position;
    private destPos: Position;

    setDestination(destMap: string, destScreen: Position, destPos: Position) {
        this.destMap = destMap;
        this.destScreen = destScreen;
        this.destPos = destPos;
    }

    generate(): GoDownStairsEvent {
        return new GoDownStairsEvent(this.tile, true, this.destMap, this.destScreen, this.destPos);
    }
}