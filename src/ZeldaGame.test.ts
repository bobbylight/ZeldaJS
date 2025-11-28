import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { AudioSystem, SpriteSheet } from 'gtp';
import { ZeldaGame } from './ZeldaGame';
import { Link } from './Link';
import { Map } from './Map';
import { Octorok } from './enemy/Octorok';
import { Screen } from './Screen';
import { createAnimation, createMapData } from '@/test-utils';

const mockSpriteSheet = {
    colCount: 8,
    rowCount: 4,
    size: 32,
    drawByIndex: vi.fn(),
} as unknown as SpriteSheet;

const mockFontSheet = {
    colCount: 16,
    drawByIndex: vi.fn(),
} as unknown as SpriteSheet;

const mockPlayMusic = vi.fn();
const mockAudio = {
    playMusic: mockPlayMusic,
    playSound: vi.fn(),
};

let mockMap: Map;
let mockSetCurrentScreen: MockInstance<Map['setCurrentScreen']>;
let mockCurrentScreenIsWalkable: MockInstance<Screen['isWalkable']>;

describe('ZeldaGame', () => {
    let game: ZeldaGame;

    beforeEach(() => {
        mockCurrentScreenIsWalkable = vi.fn().mockReturnValue(true);
        mockSetCurrentScreen = vi.fn();
        mockMap = {
            currentScreen: {
                isWalkable: mockCurrentScreenIsWalkable,
            },
            get currentScreenMusic() {
                return 'overworld';
            },
            setCurrentScreen: mockSetCurrentScreen,
            setCurrentScreenMusic: 'overworld',
            showEvents: false,
        } as unknown as Map;

        game = new ZeldaGame();
        game.link = new Link(game);
        game.assets.set('enemyDies', mockSpriteSheet);
        game.assets.set('overworld', mockSpriteSheet);
        game.assets.set('font', mockFontSheet);
        game.assets.set('overworldData', createMapData({ name: 'overworld' }));
        game.assets.set('level1Data', createMapData({ name: 'level1' }));
        game.audio = mockAudio as unknown as AudioSystem;
        // Provide a map for isWalkable and setMap tests
        game.maps = {
            overworld: mockMap,
            level1: mockMap,
        };
        game.map = mockMap;
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('addEnemyDiesAnimation()', () => {
        it('adds an Animation to the animations list', () => {
            const enemy = new Octorok(game);
            expect(() => {
                game.addEnemyDiesAnimation(enemy);
            }).not.toThrow();
        });
    });

    describe('paintAnimations()', () => {
        it('calls paint on each animation', () => {
            const anim = createAnimation(game, mockSpriteSheet);
            const mockPaint = vi.spyOn(anim, 'paint');
            game.addAnimation(anim);
            const ctx = game.getRenderingContext();
            game.paintAnimations(ctx);
            expect(mockPaint).toHaveBeenCalledWith(ctx);
        });
    });

    describe('drawString()', () => {
        const mockFontImage = {
            drawByIndex: vi.fn(),
        };

        it('draws a string', () => {
            game.assets.set('font', mockFontImage);
            const ctx = game.getRenderingContext();
            const text = 'HELLO1-.>@!\' ';
            game.drawString(10, 10, text, ctx);
            expect(mockFontImage.drawByIndex).toHaveBeenCalledTimes(text.length);
        });
    });

    describe('isEditMode()', () => {
        it('defaults to false', () => {
            expect(game.isEditMode()).toEqual(false);
        });

        it('can be set to true', () => {
            const editModeGame = new ZeldaGame({
                editMode: true,
                height: 100,
                width: 100,
            });
            expect(editModeGame.isEditMode()).toEqual(true);
        });
    });

    describe('isWalkable()', () => {
        it('delegates to map.currentScreen.isWalkable', () => {
            const actor = new Octorok(game);
            expect(game.isWalkable(actor, 1, 2)).toEqual(true);
            expect(mockCurrentScreenIsWalkable).toHaveBeenCalledWith(actor, 1, 2);
        });
    });

    describe('linkDied()', () => {
        it('plays music if not in editMode', () => {
            game.linkDied();
            expect(mockPlayMusic).toHaveBeenCalledWith('linkDies', false);
        });

        it('does not play music in editMode', () => {
            const editModeGame = new ZeldaGame({
                editMode: true,
                height: 100,
                width: 100,
            });
            editModeGame.audio = mockAudio as unknown as AudioSystem;
            editModeGame.linkDied();
            expect(mockPlayMusic).not.toHaveBeenCalled();
        });
    });

    describe('getPaintHitBoxes()', () => {
        it('returns false', () => {
            expect(game.getPaintHitBoxes()).toEqual(false);
        });
    });

    describe('getRenderingContext()', () => {
        it('returns a 2D context from the canvas', () => {
            const ctx = game.getRenderingContext();
            expect(ctx).toBeDefined();
        });

        it('throws if context is not available', () => {
            const badGame = new ZeldaGame();
            vi.spyOn(badGame.canvas, 'getContext').mockReturnValue(null);
            expect(() => badGame.getRenderingContext()).toThrow();
        });
    });

    describe('incRupees() / updateRupees()', () => {
        it('works', () => {
            expect(game.link.getRupeeCount()).toEqual(255);
            game.incRupees(1);
            game.updateRupees(48);
            expect(game.link.getRupeeCount()).toEqual(256);
            game.incRupees(-1);
            game.updateRupees(48);
            expect(game.link.getRupeeCount()).toEqual(255);
        });
    });

    describe('resumeMusic()', () => {
        describe('when not in edit mode', () => {
            it('resumes music if music is set', () => {
                vi.spyOn(game.map, 'currentScreenMusic', 'get').mockReturnValue('overworld');
                game.resumeMusic();
                expect(mockPlayMusic).toHaveBeenCalledWith('overworld', true);
            });

            it('does not resume music if music is not set', () => {
                vi.spyOn(game.map, 'currentScreenMusic', 'get').mockReturnValue(null);
                game.resumeMusic();
                expect(mockPlayMusic).not.toHaveBeenCalled();
            });

            it('does not resume music if music is "none"', () => {
                vi.spyOn(game.map, 'currentScreenMusic', 'get').mockReturnValue('none');
                game.resumeMusic();
                expect(mockPlayMusic).not.toHaveBeenCalled();
            });
        });

        it('does not resume music if in editMode', () => {
            const editModeGame = new ZeldaGame({
                editMode: true,
                height: 100,
                width: 100,
            });
            editModeGame.map = { currentScreenMusic: 'overworld' } as unknown as Map;
            editModeGame.audio = mockAudio as unknown as AudioSystem;
            editModeGame.resumeMusic();
            expect(mockPlayMusic).not.toHaveBeenCalled();
        });
    });

    describe('setMap()', () => {
        it('sets the map, current screen, and Link location, and starts music', () => {
            const destScreen = { row: 1, col: 2 };
            const destPos = { row: 3, col: 4 };
            game.setMap('overworld', destScreen, destPos, true);
            expect(game.map).toEqual(mockMap);
            expect(mockSetCurrentScreen).toHaveBeenCalledWith(1, 2);
            expect(game.link.x).toEqual(4 * 16);
            expect(game.link.y).toEqual(3 * 16);
            expect(mockPlayMusic).toHaveBeenCalled();
        });

        it('does not start music if immediatelyStartMusic is false', () => {
            const destScreen = { row: 1, col: 2 };
            const destPos = { row: 3, col: 4 };
            game.setMap('overworld', destScreen, destPos, false);
            expect(mockPlayMusic).not.toHaveBeenCalled();
        });
    });

    describe('startNewGame()', () => {
        it('loads maps, sets map, and initializes link', () => {
            game.startNewGame();
            expect(game.map).toEqual(game.maps.overworld);
            expect(game.link).toBeDefined();
            expect(game.link.x).toEqual(100);
            expect(game.link.y).toEqual(100);
        });

        it('does not initialize link if initLink is false', () => {
            game.startNewGame(false);
            expect(game.link).toBeDefined();
        });

        describe('when in editMode', () => {
            beforeEach(() => {
                game = new ZeldaGame({
                    editMode: true,
                    height: 100,
                    width: 100,
                });
                game.assets.set('overworld', mockSpriteSheet);
                game.assets.set('overworldData', createMapData({ name: 'overworld' }));
                game.assets.set('level1Data', createMapData({ name: 'level1' }));
                game.maps = {
                    overworld: mockMap,
                    level1: mockMap,
                };
                game.map = mockMap;
            });

            it('highlights tiles that contain events', () => {
                game.startNewGame();
                expect(game.map.showEvents).toEqual(true);
            });
        });
    });

    describe('updateAnimations()', () => {
        it('updates and removes done animations', () => {
            const anim1 = createAnimation(game, mockSpriteSheet);
            const anim2 = createAnimation(game, mockSpriteSheet);
            const anim1Update = vi.spyOn(anim1, 'update');
            const anim2Update = vi.spyOn(anim2, 'update');
            vi.spyOn(anim2, 'isDone').mockReturnValue(true);
            game.addAnimation(anim1);
            game.addAnimation(anim2);
            game.link.done = false;
            game.updateAnimations();
            expect(anim1Update).toHaveBeenCalled();
            expect(anim2Update).toHaveBeenCalled();
            //expect(game.animations).toEqual([ anim1 ]);
        });

        it('does nothing if Link is done', () => {
            game.link.done = true;
            const anim = createAnimation(game, mockSpriteSheet);
            const animUpdate = vi.spyOn(anim, 'update');
            game.addAnimation(anim);
            game.updateAnimations();
            expect(animUpdate).not.toHaveBeenCalled();
        });
    });
});
