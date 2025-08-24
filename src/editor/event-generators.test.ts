import { describe, it, expect } from 'vitest';
import { GoDownStairsEventGenerator, ChangeScreenWarpEventGenerator } from './event-generators';
import { Position } from '../Position';

describe('GoDownStairsEventGenerator', () => {
    describe('generate()', () => {
        it('works', () => {
            const gen = new GoDownStairsEventGenerator();
            gen.setTile(new Position(3, 4));
            gen.setDestination('map', new Position(1, 1), new Position(2, 2));
            const actual = gen.generate();
            expect(actual.tile).toEqual(new Position(3, 4));
            expect(actual.destMap).toEqual('map');
            expect(actual.destScreen).toEqual(new Position(1, 1));
            expect(actual.destPos).toEqual(new Position(2, 2));
            expect(actual.getAnimate()).toEqual(true);
        });
    });
});

describe('ChangeScreenWarpEventGenerator', () => {
    describe('generate()', () => {
        it('works', () => {
            const gen = new ChangeScreenWarpEventGenerator();
            gen.setTile(new Position(3, 4));
            gen.setDestination('map', new Position(1, 1), new Position(2, 2));
            const actual = gen.generate();
            expect(actual.tile).toEqual(new Position(3, 4));
            expect(actual.destMap).toEqual('map');
            expect(actual.destScreen).toEqual(new Position(1, 1));
            expect(actual.destPos).toEqual(new Position(2, 2));
            expect(actual.getAnimate()).toEqual(true);
        });
    });
});
