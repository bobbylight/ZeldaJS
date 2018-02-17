import { Event } from '../event/Event';
import { GoDownStairsEvent } from '../event/GoDownStairsEvent';
import { Position } from '../Position';
import { ChangeScreenWarpEvent } from '../event/ChangeScreenWarpEvent';

/**
 * Generates an event of some type.
 */
export abstract class EventGenerator<E extends Event<any>> {

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

    constructor() {
        super();
        this.setTile(new Position());
        this.setDestination('overworld', new Position(), new Position());
    }

    setDestination(destMap: string, destScreen: Position, destPos: Position) {
        this.destMap = destMap;
        this.destScreen = destScreen;
        this.destPos = destPos;
    }

    generate(): GoDownStairsEvent {
        return new GoDownStairsEvent(this.tile, this.destMap, this.destScreen, this.destPos, true, true);
    }

    toString(): string {
        return '[GoDownStairsEventGenerator]';
    }
}

export class ChangeScreenWarpEventGenerator extends EventGenerator<ChangeScreenWarpEvent> {

    private destMap: string;
    private destScreen: Position;
    private destPos: Position;

    constructor() {
        super();
        this.setTile(new Position());
        this.setDestination('overworld', new Position(), new Position());
    }

    setDestination(destMap: string, destScreen: Position, destPos: Position) {
        this.destMap = destMap;
        this.destScreen = destScreen;
        this.destPos = destPos;
    }

    generate(): ChangeScreenWarpEvent {
        return new ChangeScreenWarpEvent(this.tile, true, this.destMap, this.destScreen, this.destPos);
    }

    toString(): string {
        return '[ChangeScreenWarpEventGenerator]';
    }
}
