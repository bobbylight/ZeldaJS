import { describe, expect, it } from 'vitest';
import {
    BombableWallEventGenerator,
    ChangeScreenWarpEventGenerator,
    GoDownStairsEventGenerator,
} from './event-generators';

describe('BombableWallEventGenerator', () => {
    describe('generate()', () => {
        it('works', () => {
            const gen = new BombableWallEventGenerator();
            gen.setTile({ row: 3, col: 4 });
            gen.setDestination('map', { row: 1, col: 1 }, { row: 2, col: 2 });
            const actual = gen.generate();
            expect(actual.tile).toEqual({ row: 3, col: 4 });
            expect(actual.destMap).toEqual('map');
            expect(actual.destScreen).toEqual({ row: 1, col: 1 });
            expect(actual.destPos).toEqual({ row: 2, col: 2 });
            expect(actual.getAnimate()).toEqual(true);
        });
    });
});

describe('GoDownStairsEventGenerator', () => {
    describe('generate()', () => {
        it('works', () => {
            const gen = new GoDownStairsEventGenerator();
            gen.setTile({ row: 3, col: 4 });
            gen.setDestination('map', { row: 1, col: 1 }, { row: 2, col: 2 });
            const actual = gen.generate();
            expect(actual.tile).toEqual({ row: 3, col: 4 });
            expect(actual.destMap).toEqual('map');
            expect(actual.destScreen).toEqual({ row: 1, col: 1 });
            expect(actual.destPos).toEqual({ row: 2, col: 2 });
            expect(actual.getAnimate()).toEqual(true);
        });
    });
});

describe('ChangeScreenWarpEventGenerator', () => {
    describe('generate()', () => {
        it('works', () => {
            const gen = new ChangeScreenWarpEventGenerator();
            gen.setTile({ row: 3, col: 4 });
            gen.setDestination('map', { row: 1, col: 1 }, { row: 2, col: 2 });
            const actual = gen.generate();
            expect(actual.tile).toEqual({ row: 3, col: 4 });
            expect(actual.destMap).toEqual('map');
            expect(actual.destScreen).toEqual({ row: 1, col: 1 });
            expect(actual.destPos).toEqual({ row: 2, col: 2 });
            expect(actual.getAnimate()).toEqual(true);
        });
    });
});
