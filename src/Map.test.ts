import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Map, MAP_HEADER, MapData } from './Map';
import { ZeldaGame } from './ZeldaGame';
import { createMapData } from '@/test-utils';
import { SpriteSheet } from 'gtp';
import { WALKABILITY_OVERWORLD } from '@/Constants';

const mockSpriteSheet = {
    drawByIndex: vi.fn(),
} as unknown as SpriteSheet;

describe('Map', () => {
    let game: ZeldaGame;
    let map: Map;

    beforeEach(() => {
        game = new ZeldaGame();
        game.assets.set('overworld', mockSpriteSheet);
        map = new Map(game, 'overworld', 2, 2);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('constructor', () => {
        it('initializes with the correct name and screens', () => {
            expect(map.getName()).toEqual('overworld');
            expect(map.rowCount).toEqual(2);
            expect(map.colCount).toEqual(2);
        });
    });

    describe('addRow()', () => {
        it('adds a new row of screens at the specified index', () => {
            const initialRows = map.rowCount;
            map.addRow(1);
            expect(map.rowCount).toEqual(initialRows + 1);
        });
    });

    describe('changeScreensHorizontally()', () => {
        it('exits current screen and enters new screen', () => {
            const exitSpy = vi.spyOn(map.currentScreen, 'exit');
            const nextScreen = map.getScreen(map.currentScreenRow, map.currentScreenCol + 1);
            const enterSpy = vi.spyOn(nextScreen, 'enter');
            map.changeScreensHorizontally(1);
            expect(exitSpy).toHaveBeenCalled();
            expect(enterSpy).toHaveBeenCalledWith(game);
        });
    });

    describe('changeScreensVertically()', () => {
        it('exits current screen and enters new screen', () => {
            const exitSpy = vi.spyOn(map.currentScreen, 'exit');
            const nextScreen = map.getScreen(map.currentScreenRow + 1, map.currentScreenCol);
            const enterSpy = vi.spyOn(nextScreen, 'enter');
            map.changeScreensVertically(1);
            expect(exitSpy).toHaveBeenCalled();
            expect(enterSpy).toHaveBeenCalledWith(game);
        });
    });

    describe('fromJson()', () => {
        it('throws if header is invalid', () => {
            const badData = createMapData({ header: 'BAD_HEADER' });
            expect(() => map.fromJson(badData)).toThrow();
        });

        it('loads all expected data from json', () => {
            const json: MapData = {
                header: MAP_HEADER,
                name: 'testMap',
                screenData: [ [ null, null ], [ null, null ] ],
                tilesetData: {
                    name: 'overworld',
                },
                music: 'testMusic',
                row: 6,
                col: 6,
            };
            map.fromJson(json);
            expect(map.getName()).toEqual('testMap');
            expect(map.rowCount).toEqual(2);
            expect(map.colCount).toEqual(2);
            expect(map.getMusic()).toEqual('testMusic');
            expect(map.currentScreenRow).toEqual(6);
            expect(map.currentScreenCol).toEqual(6);
        });
    });

    describe('currentScreenMusic', () => {
        it('returns per-screen music if set', () => {
            map.getScreen(0, 0).music = 'special';
            map.setCurrentScreen(0, 0);
            expect(map.currentScreenMusic).toEqual('special');
        });

        it('returns map music if per-screen music is not set', () => {
            map.getScreen(0, 0).music = undefined;
            map.setCurrentScreen(0, 0);
            expect(map.currentScreenMusic).toEqual('overworld');
        });
    });

    describe('getTileset()', () => {
        it('returns the tileset', () => {
            expect(map.getTileset().getName()).toEqual('overworld');
        });
    });

    describe('getTilesetName()', () => {
        it('returns the tileset name', () => {
            expect(map.getTilesetName()).toEqual('overworld');
        });
    });

    describe('getTileTypeWalkability()', () => {
        it('returns the walkability for a tile type', () => {
            const expectedWalkability = WALKABILITY_OVERWORLD;
            for (let i = 0; i < expectedWalkability.length; i++) {
                expect(map.getTileTypeWalkability(i)).toEqual(expectedWalkability[i]);
            }
        });
    });

    describe('isLabyrinth()', () => {
        it('returns false for overworld', () => {
            expect(map.isLabyrinth()).toEqual(false);
        });

        it('returns true for level maps', () => {
            const levelMap = new Map(game, 'level1', 2, 2);
            expect(levelMap.isLabyrinth()).toEqual(true);
        });
    });

    describe('setCurrentScreen()', () => {
        it('exits current screen and enters new screen if in bounds', () => {
            const exitSpy = vi.spyOn(map.currentScreen, 'exit');
            const enterSpy = vi.spyOn(map.getScreen(1, 1), 'enter');
            map.setCurrentScreen(1, 1);
            expect(map.currentScreenRow).toEqual(1);
            expect(map.currentScreenCol).toEqual(1);
            expect(exitSpy).toHaveBeenCalled();
            expect(enterSpy).toHaveBeenCalledWith(game);
        });

        it('resets to 0,0 if out of bounds', () => {
            map.setCurrentScreen(10, 10);
            expect(map.currentScreenRow).toEqual(0);
            expect(map.currentScreenCol).toEqual(0);
        });

        it('returns the new screen', () => {
            const screen = map.setCurrentScreen(1, 1);
            expect(screen).toBe(map.getScreen(1, 1));
        });
    });

    describe('toJson()', () => {
        it('returns a MapData object', () => {
            const result = map.toJson();
            expect(result).toEqual(
                expect.objectContaining({
                    header: MAP_HEADER,
                    name: 'overworld',
                }),
            );
        });
    });
});
