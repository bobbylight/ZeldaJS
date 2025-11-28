import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Image, Rectangle } from 'gtp';
import { EnemyGroup } from './EnemyGroup';
import { Link } from './Link';
import { Map } from './Map';
import { Octorok } from './enemy/Octorok';
import { Screen } from './Screen';
import { Tileset } from './Tileset';
import { ZeldaGame } from './ZeldaGame';
import { GoDownStairsEvent } from '@/event/GoDownStairsEvent';
import { SCREEN_COL_COUNT, SCREEN_ROW_COUNT, TILE_HEIGHT, TILE_WIDTH } from '@/Constants';
import { BombableWallEvent } from '@/event/BombableWallEvent';
import { RowColumnPair } from '@/RowColumnPair';
import { ShopScreenInteraction } from '@/ScreenInteraction';
import { TextTyper } from '@/TextTyper';

const mockImage = {
    draw: vi.fn(),
};

const mockPaintTile = vi.fn();
const mockTileset = {
    paintTile: mockPaintTile,
} as unknown as Tileset;

const mockScreen = {
    checkForBombableWalls: vi.fn(),
    enemyGroup: new EnemyGroup(),
    paint: vi.fn(),
    paintCol: vi.fn(),
    paintRow: vi.fn(),
    paintTopLayer: vi.fn(),
    setTile: vi.fn(),
};

const mockMap = {
    currentScreen: mockScreen,
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
        game.assets.set('treasures.bomb', mockImage as unknown as Image);
        game.assets.set('treasures.yellowRupee', mockImage as unknown as Image);
        game.map = mockMap;
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

    describe('checkForBombableWalls', () => {
        let tile: RowColumnPair;
        let destMap: string;
        let destScreen: RowColumnPair;
        let destPos: RowColumnPair;

        beforeEach(() => {
            tile = { row: 0, col: 0 };
            destMap = 'test-map';
            destScreen = { row: 0, col: 0 };
            destPos = { row: 0, col: 0 };
        });

        it('does nothing for other event types', () => {
            const event = new GoDownStairsEvent(tile, destMap, destScreen, destPos, true, true);
            screen.events.push(event);
            screen.checkForBombableWalls(new Rectangle(
                tile.col * TILE_WIDTH, tile.row * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT),
            );
            expect(event.shouldOccur(game)).toEqual(false);
            expect(screen.events.length).toEqual(1);
        });

        describe('for bombable wall events', () => {
            let event: BombableWallEvent;

            beforeEach(() => {
                event = new BombableWallEvent(tile, destMap, destScreen, destPos, true, true);
                screen.events.push(event);
            });

            it('does nothing if the bomb explosion does not intersect the proper tile', () => {
                screen.checkForBombableWalls(new Rectangle(1000, 1000, TILE_WIDTH, TILE_HEIGHT));
                expect(event.shouldOccur(game)).toEqual(false);
                expect(screen.events.length).toEqual(1);
            });

            it('marks the bombable wall event to occur if there is an intersection', () => {
                screen.checkForBombableWalls(new Rectangle(
                    tile.col * TILE_WIDTH, tile.row * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT),
                );
                expect(event.shouldOccur(game)).toEqual(true);
                expect(screen.events.length).toEqual(1);
            });
        });
    });

    describe('enter()', () => {
        describe('when there is an enemy group', () => {
            beforeEach(() => {
                screen = new Screen(mockMap, new EnemyGroup('random', [
                    {
                        type: 'Octorok',
                        id: '123',
                    },
                    {
                        type: 'Lynel',
                        id: '456',
                        count: 3,
                    },
                ]));
            });

            describe('the first time the screen is entered', () => {
                it('adds an actor for each enemy', () => {
                    expect(screen.getActorCount()).toEqual(0);
                    screen.enter(game);
                    expect(screen.getActorCount()).toEqual(4);
                });
            });

            describe('when the screen is entered a second time', () => {
                it('reloads the enemies', () => {
                    screen.enter(game);
                    expect(screen.getActorCount()).toEqual(4);
                    screen.exit();
                    screen.enter(game);
                    expect(screen.getActorCount()).toEqual(4);
                });

                it.todo('loads the first N enemies in the list if any were killed', () => {
                    // TODO: Implement me
                });
            });

            describe('when there is an interaction', () => {
                let interaction: ShopScreenInteraction;

                beforeEach(() => {
                    interaction = {
                        type: 'shop',
                        greeting: 'Test greeting',
                        seller: 'merchant',
                        items: [
                            {
                                type: 'bomb',
                                price: 10,
                            },
                        ],
                    };
                    screen.setScreenInteraction(interaction);
                });

                it('starts typing the greeting', () => {
                    expect(screen.isGreetingBeingTyped()).toEqual(false);
                    screen.enter(game);
                    expect(screen.isGreetingBeingTyped()).toEqual(true);
                });

                it('adds actors for the seller, the items and the cost indicator', () => {
                    expect(screen.getActorCount()).toEqual(0);
                    screen.enter(game);
                    // 4 enemies and the 3 actors for the shop
                    expect(screen.getActorCount()).toEqual(4 + 5);
                });
            });
        });
    });

    describe('getScreenInteraction() / setScreenInteraction()', () => {
        it('works', () => {
            expect(screen.getScreenInteraction()).not.toBeDefined();
            const interaction: ShopScreenInteraction = {
                type: 'shop',
                items: [ {
                    type: 'bomb',
                    price: 10,
                } ],
                seller: 'merchant',
                greeting: 'Test greeting',
            };
            screen.setScreenInteraction(interaction);
            expect(screen.getScreenInteraction()).toEqual(interaction);
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

    describe('isGreetingBeingTyped()', () => {
        const interaction: ShopScreenInteraction = {
            type: 'shop',
            items: [ {
                type: 'bomb',
                price: 10,
            } ],
            seller: 'merchant',
            greeting: 'Test greeting',
        };

        it('returns false if not typing', () => {
            expect(screen.isGreetingBeingTyped()).toEqual(false);
        });

        it('returns true if typing', () => {
            screen.setScreenInteraction(interaction);
            screen.enter(game); // Needed to initialize the interaction
            expect(screen.isGreetingBeingTyped()).toEqual(true);
        });

        it('returns false if was typing, but the greeting has completed', () => {
            vi.spyOn(TextTyper.prototype, 'isDone').mockReturnValue(true);

            screen.setScreenInteraction(interaction);
            screen.enter(game); // Needed to initialize the interaction
            expect(screen.isGreetingBeingTyped()).toEqual(false);
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
                { row: 0, col: 0 },
                'TestMap',
                { row: 0, col: 0 },
                { row: 0, col: 0 },
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

    describe('reload()', () => {
        it('does not throw', () => {
            expect(() => {
                screen.reload(game);
            }).not.toThrow();
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
            screen.update(game, 16);
            expect(spy).toHaveBeenCalledOnce();
        });

        it('updates actions', () => {
            const event = new GoDownStairsEvent(
                { row: 0, col: 0 },
                'TestMap',
                { row: 0, col: 0 },
                { row: 0, col: 0 },
                false,
                false,
            );
            const occurrableEvent = new BombableWallEvent(
                { row: 0, col: 0 },
                'Testap',
                { row: 0, col: 0 },
                { row: 0, col: 0 },
                false,
                false,
            );
            occurrableEvent.setShouldOccur(true);
            const updateSpy = vi.spyOn(event, 'update').mockImplementation(() => {});
            const update2Spy = vi.spyOn(occurrableEvent, 'update').mockImplementation(() => {});
            screen.events.push(event, occurrableEvent);
            screen.update(game, 16);

            expect(updateSpy).toHaveBeenCalledOnce();
            expect(update2Spy).toHaveBeenCalledOnce();
            expect(screen.events.length).toEqual(2);
            expect(screen.events[0]).toEqual(event);
            expect(screen.events[1]).not.toEqual(occurrableEvent); // a GoDownStairsEvent
        });

        describe('when text is being typed', () => {
            const interaction: ShopScreenInteraction = {
                type: 'shop',
                greeting: 'Test greeting',
                seller: 'merchant',
                items: [
                    {
                        type: 'bomb',
                        price: 10,
                    },
                ],
            };

            beforeEach(() => {
                screen.setScreenInteraction(interaction);
                screen.enter(game); // To initialize the interaction
            });

            it('updates the text typer', () => {
                const typerUpdateSpy = vi.spyOn(TextTyper.prototype, 'update').mockImplementation(() => false);
                screen.update(game, 16);
                expect(typerUpdateSpy).toHaveBeenCalledExactlyOnceWith(16);
            });

            it('does not update Link', () => {
                const linkUpdateSpy = vi.spyOn(game.link, 'update').mockImplementation(() => {});
                screen.update(game, 16);
                expect(linkUpdateSpy).not.toHaveBeenCalled();
            });
        });
    });
});
