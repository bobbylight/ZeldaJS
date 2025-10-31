import { Event, EventData } from '@/event/Event';
import { GoDownStairsEvent } from '@/event/GoDownStairsEvent';
import { ChangeScreenWarpEvent } from '@/event/ChangeScreenWarpEvent';
import { BombableWallEvent } from '@/event/BombableWallEvent';
import RowColumnPair from '@/RowColumnPair';

/**
 * Generates an event of some type.
 */
export abstract class EventGenerator<E extends Event<EventData>> {
    readonly type: string;
    protected tile: RowColumnPair;
    protected destMap: string;
    protected destScreen: RowColumnPair;
    protected destPos: RowColumnPair;

    protected constructor(type: string) {
        this.type = type;
    }

    setDestination(destMap: string, destScreen?: RowColumnPair, destPos?: RowColumnPair) {
        this.destMap = destMap;
        this.destScreen = destScreen ? { ...destScreen } : { row: 0, col: 0 };
        this.destPos = destPos ? { ...destPos } : { row: 0, col: 0 };
    }

    setTile(tile: RowColumnPair) {
        this.tile = { ...tile };
    }

    abstract generate(): E;
}

/**
 * Generates "bombable wall" events.
 */
export class BombableWallEventGenerator extends EventGenerator<BombableWallEvent> {
    constructor() {
        super(BombableWallEvent.EVENT_TYPE);
        this.setTile({ row: 0, col: 0 });
        this.setDestination('overworld');
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
        this.setTile({ row: 0, col: 0 });
        this.setDestination('overworld');
    }

    generate(): GoDownStairsEvent {
        return new GoDownStairsEvent(this.tile, this.destMap, this.destScreen, this.destPos, true, true);
    }
}

export class ChangeScreenWarpEventGenerator extends EventGenerator<ChangeScreenWarpEvent> {
    constructor() {
        super(ChangeScreenWarpEvent.EVENT_TYPE);
        this.setTile({ row: 0, col: 0 });
        this.setDestination('overworld');
    }

    generate(): ChangeScreenWarpEvent {
        return new ChangeScreenWarpEvent(this.tile, this.destMap, this.destScreen, this.destPos, true);
    }
}
