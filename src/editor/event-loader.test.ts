import { describe, expect, it } from 'vitest';
import loadEvent from './event-loader';
import { GoDownStairsEvent } from '@/event/GoDownStairsEvent';
import { ChangeScreenWarpEvent } from '@/event/ChangeScreenWarpEvent';
import { EventData } from '@/event/Event';

describe('loadEvent', () => {
    it('loads a goDownStairs event', () => {
        const data = {
            animate: true,
            type: 'goDownStairs',
            tile: { row: 1, col: 2 },
            destMap: 'level1',
            destScreen: { row: 3, col: 4 },
            destPos: { row: 5, col: 6 },
        };
        const event = loadEvent(data);
        expect(event).toBeInstanceOf(GoDownStairsEvent);
        expect(event.tile.row).toBe(1);
        expect(event.tile.col).toBe(2);
        expect(event.destMap).toBe('level1');
        expect(event.destScreen.row).toBe(3);
        expect(event.destScreen.col).toBe(4);
        expect(event.destPos.row).toBe(5);
        expect(event.destPos.col).toBe(6);
    });

    it('loads a changeScreenWarp event', () => {
        const data: EventData = {
            type: 'changeScreenWarp',
            destMap: 'overworld',
            destScreen: { row: 7, col: 8 },
            destPos: { row: 9, col: 10 },
            tile: { row: 0, col: 0 },
            animate: true,
        };
        const event = loadEvent(data);
        expect(event).toBeInstanceOf(ChangeScreenWarpEvent);
        expect(event.destMap).toBe('overworld');
        expect(event.destScreen.row).toBe(7);
        expect(event.destScreen.col).toBe(8);
        expect(event.destPos.row).toBe(9);
        expect(event.destPos.col).toBe(10);
    });

    it('throws for unknown event type', () => {
        const data: EventData = {
            type: 'unknownType',
            tile: { row: 0, col: 0 },
            animate: true,
            destMap: 'overworld',
            destScreen: { row: 0, col: 0 },
            destPos:  { row: 0, col: 0 },
        };
        expect(() => loadEvent(data)).toThrow(/Unknown event type/);
    });
});
