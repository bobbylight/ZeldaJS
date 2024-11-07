import { Event, EventData } from '../event/Event';
import { ChangeScreenWarpEventGenerator, GoDownStairsEventGenerator } from './event-generators';
import { Position } from '../Position';
import { GoDownStairsEvent, GoDownStairsEventData } from '../event/GoDownStairsEvent';
import { ChangeScreenWarpData, ChangeScreenWarpEvent } from '../event/ChangeScreenWarpEvent';

export default class EventLoader {
    /**
     * Loads an event from a JSON representation of that event.
     *
     * @param data The JSON data representing the event.
     * @returns The event.
     */
    static load(data: EventData): Event<any> {
        switch (data.type) {
            case 'changeScreenWarp':
                return this.changeScreenWarp(data);
            case 'goDownStairs':
                return this.goDownStairs(data);
            default:
                throw new Error(`Unknown event type: #{data.type}`);
        }
    }

    private static changeScreenWarp(data: EventData): ChangeScreenWarpEvent {
        const eventData: ChangeScreenWarpData = data as GoDownStairsEventData;

        const generator: ChangeScreenWarpEventGenerator = new ChangeScreenWarpEventGenerator();
        generator.setDestination(eventData.destMap, new Position(eventData.destScreen),
            new Position(eventData.destPos));
        return generator.generate();
    }

    private static goDownStairs(data: EventData): GoDownStairsEvent {
        const eventData: GoDownStairsEventData = data as GoDownStairsEventData;

        const generator: GoDownStairsEventGenerator = new GoDownStairsEventGenerator();
        generator.setTile(new Position(eventData.tile));
        generator.setDestination(eventData.destMap, new Position(eventData.destScreen),
            new Position(eventData.destPos));
        return generator.generate();
    }
}
