import { Event, EventData } from '@/event/Event';
import { GoDownStairsEvent } from '@/event/GoDownStairsEvent';
import { Position } from '@/Position';
import { ChangeScreenWarpEvent } from '@/event/ChangeScreenWarpEvent';
import { BombableWallEvent } from '@/event/BombableWallEvent';

/**
 * Generates an event of some type.
 */
export abstract class EventGenerator<E extends Event<EventData>> {
    readonly type: string;
    protected tile: Position;
    protected destMap: string;
    protected destScreen: Position;
    protected destPos: Position;

    protected constructor(type: string) {
        this.type = type;
    }

    setDestination(destMap: string, destScreen: Position, destPos: Position) {
        this.destMap = destMap;
        this.destScreen = destScreen;
        this.destPos = destPos;
    }

    setTile(tile: Position) {
        this.tile = tile;
    }

    abstract generate(): E;
}

/**
 * Generates "bombable wall" events.
 */
export class BombableWallEventGenerator extends EventGenerator<BombableWallEvent> {
    constructor() {
        super(BombableWallEvent.EVENT_TYPE);
        this.setTile(new Position());
        this.setDestination('overworld', new Position(), new Position());
    }

    generate(): BombableWallEvent {
        return new BombableWallEvent(this.tile, this.destMap, this.destScreen, this.destPos, true, true);
    }
}

/**
 * Generates "go down stairs" value.
 */
export class GoDownStairsEventGenerator extends EventGenerator<GoDownStairsEvent> {
    constructor() {
        super(GoDownStairsEvent.EVENT_TYPE);
        this.setTile(new Position());
        this.setDestination('overworld', new Position(), new Position());
    }

    generate(): GoDownStairsEvent {
        return new GoDownStairsEvent(this.tile, this.destMap, this.destScreen, this.destPos, true, true);
    }
}

export class ChangeScreenWarpEventGenerator extends EventGenerator<ChangeScreenWarpEvent> {
    constructor() {
        super(ChangeScreenWarpEvent.EVENT_TYPE);
        this.setTile(new Position());
        this.setDestination('overworld', new Position(), new Position());
    }

    generate(): ChangeScreenWarpEvent {
        return new ChangeScreenWarpEvent(this.tile, this.destMap, this.destScreen, this.destPos, true);
    }
}
