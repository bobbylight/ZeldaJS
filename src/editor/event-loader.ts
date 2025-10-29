import { Event, EventData } from '@/event/Event';
import {
    BombableWallEventGenerator,
    ChangeScreenWarpEventGenerator,
    GoDownStairsEventGenerator,
} from './event-generators';
import { Position } from '@/Position';
import { GoDownStairsEvent, GoDownStairsEventData } from '@/event/GoDownStairsEvent';
import { ChangeScreenWarpData, ChangeScreenWarpEvent } from '@/event/ChangeScreenWarpEvent';
import { BombableWallData, BombableWallEvent } from '@/event/BombableWallEvent';

function bombableWall(data: EventData): BombableWallEvent {
    const eventData: BombableWallData = data;

    const generator: BombableWallEventGenerator = new BombableWallEventGenerator();
    generator.setTile(new Position(eventData.tile));
    generator.setDestination(eventData.destMap, new Position(eventData.destScreen),
        new Position(eventData.destPos));
    return generator.generate();
}

function changeScreenWarp(data: EventData): ChangeScreenWarpEvent {
    const eventData: ChangeScreenWarpData = data;

    const generator: ChangeScreenWarpEventGenerator = new ChangeScreenWarpEventGenerator();
    generator.setDestination(eventData.destMap, new Position(eventData.destScreen),
        new Position(eventData.destPos));
    return generator.generate();
}

function goDownStairs(data: EventData): GoDownStairsEvent {
    const eventData: GoDownStairsEventData = data;

    const generator: GoDownStairsEventGenerator = new GoDownStairsEventGenerator();
    generator.setTile(new Position(eventData.tile));
    generator.setDestination(eventData.destMap, new Position(eventData.destScreen),
        new Position(eventData.destPos));
    return generator.generate();
}

/**
 * Loads an event from a JSON representation of that event.
 *
 * @param data The JSON data representing the event.
 * @returns The event.
 */
const loadEvent = (data: EventData): Event<EventData> => {
    switch (data.type) {
        case 'changeScreenWarp':
            return changeScreenWarp(data);
        case 'goDownStairs':
            return goDownStairs(data);
        case 'bombableWall':
            return bombableWall(data);
        default:
            throw new Error(`Unknown event type: #{data.type}`);
    }
};

export default loadEvent;
