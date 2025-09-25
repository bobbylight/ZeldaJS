import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EnemyGroup } from './EnemyGroup';
import { Link } from './Link';
import { Map } from './Map';
import { Octorok } from './enemy/Octorok';
import { Position } from './Position';
import { Screen } from './Screen';
import { Tileset } from './Tileset';
import { ZeldaGame } from './ZeldaGame';
import { GoDownStairsEvent } from '@/event/GoDownStairsEvent';
import { SCREEN_COL_COUNT, SCREEN_ROW_COUNT } from '@/Constants';

const mockPaintTile = vi.fn();
const mockTileset = {
    paintTile: mockPaintTile,
} as unknown as Tileset;

const mockMap = {
    getTileset: vi.fn(() => mockTileset),
    getTileTypeWalkability: vi.fn(() => 1),
    isLabyrinth: vi.fn(() => false),
    showEvents: false,
} as unknown as Map;

describe('Screen', () => {
    let game: ZeldaGame;
    let screen: Screen;

    beforeEach(() => {
        game = new ZeldaGame();
        game.link = new Link(game);
        screen = new Screen(mockMap, new EnemyGroup());
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('constructor', () => {
        it('generates empty tiles if none are provided', () => {
            expect(screen.getTile(0, 0)).toEqual(0);
        });
    });

    describe('addActor()', () => {
        it('adds an actor to the actors list', () => {
            const actor = new Octorok(game);
            expect(() => {
                screen.addActor(actor);
            }).not.toThrow();
        });
    });

    describe('getTile()', () => {
        it('returns the correct tile value', () => {
            screen.setTile(0, 0, 42);
            expect(screen.getTile(0, 0)).toEqual(42);
        });
    });

    describe('setTile()', () => {
        it('sets the tile at the given position', () => {
            screen.setTile(1, 2, 7);
            expect(screen.getTile(1, 2)).toEqual(7);
        });
    });

    describe('isThrownSwordActorActive()/setThrownSwordActorActive()', () => {
        it('works', () => {
            expect(screen.isThrownSwordActorActive()).toEqual(false);
            screen.setThrownSwordActorActive(true);
            expect(screen.isThrownSwordActorActive()).toEqual(true);
        });
    });

    describe('isWalkable()', () => {
        it('returns false if off screen', () => {
            expect(screen.isWalkable(new Octorok(game), -1, -1)).toEqual(false);
        });

        it('returns true for walkable tile', () => {
            screen.setTile(0, 0, 1);
            vi.spyOn(mockMap, 'getTileTypeWalkability').mockReturnValue(1);
            expect(screen.isWalkable(new Octorok(game), 0, 0)).toEqual(true);
        });
    });

    describe('paint()', () => {
        beforeEach(() => {
            screen.events.push(new GoDownStairsEvent(
                new Position(0, 0),
                'TestMap',
                new Position(0, 0),
                new Position(0, 0),
                false,
                false,
            ));
        });

        it('calls paintRow for each row', () => {
            const ctx = game.getRenderingContext();
            const spy = vi.spyOn(screen, 'paintRow');
            screen.paint(ctx);
            expect(spy).toHaveBeenCalled();
        });

        it('does not render events by default', () => {
            const ctx = game.getRenderingContext();
            const spy = vi.spyOn(ctx, 'strokeRect');
            screen.paint(ctx);
            expect(spy).not.toHaveBeenCalled();
        });

        describe('when the parent map wants to show events', () => {
            beforeEach(() => {
                mockMap.showEvents = true;
            });

            it('renders event rectangles', () => {
                const ctx = game.getRenderingContext();
                const spy = vi.spyOn(ctx, 'strokeRect');
                screen.paint(ctx);
                expect(spy).toHaveBeenCalled();
            });
        });
    });

    describe('paintCol()', () => {
        it('calls tileset.paintTile for each row in the column', () => {
            const ctx = game.getRenderingContext();
            screen.paintCol(ctx, 0, 0);
            expect(mockPaintTile).toHaveBeenCalledTimes(SCREEN_ROW_COUNT);
        });
    });

    describe('paintRow()', () => {
        it('calls tileset.paintTile for each column in the row', () => {
            const ctx = game.getRenderingContext();
            screen.paintRow(ctx, 0, 0);
            expect(mockPaintTile).toHaveBeenCalledTimes(SCREEN_COL_COUNT);
        });
    });

    describe('paintTopLayer()', () => {
        it('paints top layer if labyrinth', () => {
            vi.spyOn(mockMap, 'isLabyrinth').mockReturnValue(true);
            const ctx = game.getRenderingContext();
            const rowSpy = vi.spyOn(screen, 'paintRow');
            const colSpy = vi.spyOn(screen, 'paintCol');
            screen.paintTopLayer(ctx);
            expect(rowSpy).toHaveBeenCalledTimes(2);
            expect(colSpy).toHaveBeenCalledTimes(2);
        });

        it('does nothing if not labyrinth', () => {
            vi.spyOn(mockMap, 'isLabyrinth').mockReturnValue(false);
            const ctx = game.getRenderingContext();
            const rowSpy = vi.spyOn(screen, 'paintRow');
            const colSpy = vi.spyOn(screen, 'paintCol');
            screen.paintTopLayer(ctx);
            expect(rowSpy).not.toHaveBeenCalled();
            expect(colSpy).not.toHaveBeenCalled();
        });
    });

    describe('toJson()', () => {
        it('returns null if unpopulated', () => {
            screen.enemyGroup = undefined;
            screen.events = [];
            expect(screen.toJson()).toEqual(null);
        });

        it('returns screen data if populated', () => {
            screen.setTile(0, 0, 1);
            const result = screen.toJson();
            expect(result?.enemyGroup?.spawnStyle).toEqual(screen.enemyGroup?.spawnStyle);
            expect(result?.enemyGroup?.enemies.length).toEqual(screen.enemyGroup?.enemies.length);
        });
    });

    describe('toString()', () => {
        it('returns a string representation', () => {
            expect(screen.toString()).toMatch(/\[Screen:/);
        });
    });

    describe('update()', () => {
        it('updates actors', () => {
            const actor = new Octorok(game);
            screen.addActor(actor);
            const spy = vi.spyOn(actor, 'update').mockImplementation(() => {});
            screen.update(game);
            expect(spy).toHaveBeenCalledOnce();
        });

        it('updates actions', () => {
            const event = new GoDownStairsEvent(
                new Position(0, 0),
                'TestMap',
                new Position(0, 0),
                new Position(0, 0),
                false,
                false,
            );
            const updateSpy = vi.spyOn(event, 'update').mockImplementation(() => {});
            screen.events.push(event);
            screen.update(game);
            expect(updateSpy).toHaveBeenCalledOnce();
        });
    });
});
