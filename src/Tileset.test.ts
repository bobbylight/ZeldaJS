import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SpriteSheet } from 'gtp';
import { Tileset, TilesetData } from './Tileset';
import { ZeldaGame } from './ZeldaGame';

const mockDrawByIndex = vi.fn();
const mockSpriteSheet = {
    colCount: 8,
    rowCount: 4,
    size: 32,
    drawByIndex: mockDrawByIndex,
} as unknown as SpriteSheet;

describe('Tileset', () => {
    let game: ZeldaGame;
    let tileset: Tileset;

    beforeEach(() => {
        game = new ZeldaGame();
        game.assets.set('overworld', mockSpriteSheet);
        tileset = new Tileset(game);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('load()', () => {
        it('loads the correct SpriteSheet from assets', () => {
            tileset.load('overworld');
            expect(tileset.getName()).toEqual('overworld');
            expect(tileset.colCount).toEqual(8);
            expect(tileset.rowCount).toEqual(4);
            expect(tileset.imageCount).toEqual(32);
        });
    });

    describe('fromJson()', () => {
        it('loads the tileset from JSON data', () => {
            const data: TilesetData = { name: 'overworld' };
            tileset.fromJson(data);
            expect(tileset.getName()).toEqual('overworld');
            expect(tileset.colCount).toEqual(8);
            expect(tileset.rowCount).toEqual(4);
            expect(tileset.imageCount).toEqual(32);
        });
    });

    describe('toJson()', () => {
        it('returns the correct JSON representation', () => {
            tileset.load('overworld');
            expect(tileset.toJson()).toEqual({ name: 'overworld' });
        });
    });

    describe('paintTile()', () => {
        it('calls drawByIndex on the SpriteSheet', () => {
            tileset.load('overworld');
            const ctx = game.getRenderingContext();
            tileset.paintTile(ctx, 5, 10, 20);
            expect(mockDrawByIndex).toHaveBeenCalledWith(ctx, 10, 20, 5);
        });
    });

    describe('isDoorway()', () => {
        it('returns true for tile 61 in overworld', () => {
            tileset.load('overworld');
            expect(tileset.isDoorway(61)).toEqual(true);
        });

        it('returns false for other tiles in overworld', () => {
            tileset.load('overworld');
            expect(tileset.isDoorway(10)).toEqual(false);
        });

        it('returns false for non-overworld tilesets', () => {
            game.assets.set('dungeon', mockSpriteSheet);
            tileset.load('dungeon');
            expect(tileset.isDoorway(61)).toEqual(false);
        });
    });
});
