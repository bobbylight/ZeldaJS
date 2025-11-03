import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { Image, Keys, SpriteSheet } from 'gtp';
import { MainGameState } from './MainGameState';
import { ChangeScreenWarpEvent } from './event/ChangeScreenWarpEvent';
import { Link } from './Link';
import { Map } from './Map';
import { Screen } from './Screen';
import { ZeldaGame } from './ZeldaGame';

const mockImage = {
    draw: vi.fn(),
} as unknown as Image;

const mockSpriteSheet = {
    drawByIndex: vi.fn(),
} as unknown as SpriteSheet;

describe('MainGameState', () => {
    let game: ZeldaGame;
    let state: MainGameState;

    beforeEach(() => {
        game = new ZeldaGame();
        game.assets.set('hud', mockImage);
        game.assets.set('treasures.fullHeart', mockImage as unknown as Image);
        game.assets.set('treasures.halfHeart', mockImage as unknown as Image);
        game.assets.set('treasures.emptyHeart', mockImage as unknown as Image);
        game.assets.set('treasures.bomb', mockImage as unknown as Image);
        game.assets.set('font', mockSpriteSheet);
        game.assets.set('link', mockSpriteSheet);
        game.assets.set('overworld', mockSpriteSheet);
        game.link = new Link(game);
        game.map = new Map(game, 'overworld', 2, 2);
        game.maps = {
            overworld: game.map,
            level1: game.map,
        };
        game.paintAnimations = vi.fn();
        state = new MainGameState(game);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('changeScreenHorizontally()', () => {
        it('calls map.changeScreensHorizontally and sets sliding state', () => {
            const spy = vi.spyOn(game.map, 'changeScreensHorizontally');
            state.changeScreenHorizontally(1);
            expect(spy).toHaveBeenCalledExactlyOnceWith(1);
        });
    });

    describe('changeScreenVertically()', () => {
        it('executes ChangeScreenWarpEvent if present', () => {
            const event = new ChangeScreenWarpEvent(
                { row: 0, col: 0 },
                'overworld',
                { row: 1, col: 1 },
                { row: 1, col: 2 },
                false,
            );
            const changeScreensVerticallySpy = vi.spyOn(game.map, 'changeScreensVertically');
            const executeSpy = vi.spyOn(event, 'execute');
            const screen = game.map.currentScreen;
            screen.events.push(event);
            state.changeScreenVertically(1);
            expect(executeSpy).toHaveBeenCalledExactlyOnceWith(game);
            expect(screen.events).toHaveLength(1); // Prior screen's event is not removed

            // We short-circuit the normal screen change
            expect(changeScreensVerticallySpy).not.toHaveBeenCalled();
        });

        it('calls map.changeScreensVertically and sets sliding state if no warp event', () => {
            const spy = vi.spyOn(game.map, 'changeScreensVertically');
            state.changeScreenVertically(1);
            expect(spy).toHaveBeenCalledWith(1);
        });

        it('logs error if multiple ChangeScreenWarpEvents', () => {
            const event1 = new ChangeScreenWarpEvent(
                { row: 0, col: 0 },
                'overworld',
                { row: 1, col: 1 },
                { row: 1, col: 2 },
                false,
            );
            const event2 = new ChangeScreenWarpEvent(
                { row: 0, col: 0 },
                'overworld',
                { row: 1, col: 1 },
                { row: 1, col: 2 },
                false,
            );
            game.map.currentScreen.events.push(event1, event2);
            const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            state.changeScreenVertically(1);
            expect(errorSpy).toHaveBeenCalledOnce();
        });
    });

    describe('enter()', () => {
        let mockPlayMusic: MockInstance<ZeldaGame['audio']['playMusic']>;
        beforeEach(() => {
            mockPlayMusic = vi.spyOn(game.audio, 'playMusic');
        });

        it('plays the screen music if set and not "none"', () => {
            game.map.currentScreen.music = 'labyrinth';
            state.enter(game);
            expect(mockPlayMusic).toHaveBeenCalledWith('labyrinth', true);
        });

        it('does not play music if set to "none"', () => {
            game.map.currentScreen.music = 'none';
            state.enter(game);
            expect(mockPlayMusic).not.toHaveBeenCalled();
        });

        [ null, undefined ].forEach((music) => {
            it(`plays the map default music if set to ${music}`, () => {
                game.map.currentScreen.music = music;
                state.enter(game);
                expect(mockPlayMusic).toHaveBeenCalledExactlyOnceWith('overworld', true);
            });
        });
    });

    describe('render()', () => {
        let screenPaintSpy: MockInstance<Screen['paint']>;
        let screenPaintActorsSpy: MockInstance<Screen['paintActors']>;
        let screenPaintTopLayerSpy: MockInstance<Screen['paintTopLayer']>;

        beforeEach(() => {
            screenPaintSpy = vi.spyOn(game.map.currentScreen, 'paint');
            screenPaintActorsSpy = vi.spyOn(game.map.currentScreen, 'paintActors');
            screenPaintTopLayerSpy = vi.spyOn(game.map.currentScreen, 'paintTopLayer');
        });

        it('renders current screen when not sliding', () => {
            const ctx = game.getRenderingContext();
            state.render(ctx);
            expect(screenPaintSpy).toHaveBeenCalledWith(ctx);
            expect(screenPaintActorsSpy).toHaveBeenCalledWith(ctx);
            expect(screenPaintTopLayerSpy).toHaveBeenCalledWith(ctx);
        });

        it('renders sliding transition when moving to the screen on the right', () => {
            state.changeScreenHorizontally(1);
            const ctx = game.getRenderingContext();
            state.render(ctx);
            expect(screenPaintSpy).toHaveBeenCalled();
            expect(screenPaintTopLayerSpy).toHaveBeenCalled();
        });

        it('renders sliding transition when moving to the screen on the left', () => {
            state.changeScreenHorizontally(-1);
            const ctx = game.getRenderingContext();
            state.render(ctx);
            expect(screenPaintSpy).toHaveBeenCalled();
            expect(screenPaintTopLayerSpy).toHaveBeenCalled();
        });

        it('renders sliding transition when moving to the screen above', () => {
            state.changeScreenVertically(-1);
            const ctx = game.getRenderingContext();
            state.render(ctx);
            expect(screenPaintSpy).toHaveBeenCalled();
            expect(screenPaintTopLayerSpy).toHaveBeenCalled();
        });

        it('renders sliding transition when moving to the screen below', () => {
            state.changeScreenVertically(1);
            const ctx = game.getRenderingContext();
            state.render(ctx);
            expect(screenPaintSpy).toHaveBeenCalled();
            expect(screenPaintTopLayerSpy).toHaveBeenCalled();
        });
    });

    describe('update()', () => {
        let setStatusMessageSpy: MockInstance<ZeldaGame['setStatusMessage']>;

        beforeEach(() => {
            setStatusMessageSpy = vi.spyOn(game, 'setStatusMessage');
        });

        it('updates only Link if link.done', () => {
            game.link.done = true;
            const linkUpdateSpy = vi.spyOn(game.link, 'update');
            state.update(16);
            expect(linkUpdateSpy).toHaveBeenCalled();
        });

        it("updates Link's x-coordinate if sliding left", () => {
            const initialX = game.link.x;
            state.changeScreenHorizontally(1);
            state.update(16);
            state.update(16);
            state.update(16);
            expect(game.link.x).toBeGreaterThan(initialX);
        });

        it("updates Link's x-coordinate if sliding right", () => {
            const initialX = game.link.x;
            state.changeScreenHorizontally(-1);
            state.update(16);
            state.update(16);
            state.update(16);
            expect(game.link.x).toBeLessThan(initialX);
        });

        it("updates Link's y-coordinate if sliding up", () => {
            const initialY = game.link.y;
            state.changeScreenVertically(1);
            state.update(16);
            state.update(16);
            state.update(16);
            expect(game.link.y).toBeGreaterThan(initialY);
        });

        it("updates Link's y-coordinate if sliding down", () => {
            const initialY = game.link.y;
            state.changeScreenVertically(-1);
            state.update(16);
            state.update(16);
            state.update(16);
            expect(game.link.y).toBeLessThan(initialY);
        });

        it('updates current screen, animations and rupees if not sliding and Link is not animating', () => {
            vi.spyOn(game.link, 'isAnimationRunning').mockReturnValue(false);
            const screenUpdateSpy = vi.spyOn(game.map.currentScreen, 'update');
            const updateAnimationsSpy = vi.spyOn(game, 'updateAnimations');
            const updateRupeesSpy = vi.spyOn(game, 'updateRupees');
            state.update(16);
            expect(screenUpdateSpy).toHaveBeenCalledExactlyOnceWith(game, 16);
            expect(updateAnimationsSpy).toHaveBeenCalledOnce();
            expect(updateRupeesSpy).toHaveBeenCalledOnce();
        });

        it('does not update current screen and animations Link is animating', () => {
            vi.spyOn(game.link, 'isAnimationRunning').mockReturnValue(true);
            const screenUpdateSpy = vi.spyOn(game.map.currentScreen, 'update');
            const updateAnimationsSpy = vi.spyOn(game, 'updateAnimations');
            state.update(16);
            expect(screenUpdateSpy).not.toHaveBeenCalled();
            expect(updateAnimationsSpy).not.toHaveBeenCalled();
        });

        it('calls link.handleInput if not sliding and no greeting is being typed', () => {
            const handleInputSpy = vi.spyOn(game.link, 'handleInput').mockImplementation(() => false);
            state.enter(game);
            state.update(16);
            expect(handleInputSpy).toHaveBeenCalledWith(game.inputManager);
        });

        it('does not call link.handleInput a greeting is being typed', () => {
            vi.spyOn(game.map.currentScreen, 'isGreetingBeingTyped').mockReturnValue(true);
            const handleInputSpy = vi.spyOn(game.link, 'handleInput').mockImplementation(() => false);
            state.enter(game);
            state.update(16);
            expect(handleInputSpy).not.toHaveBeenCalled();
        });

        it('starts the transition to show the inventory if the user presses Enter', () => {
            game.inputManager.enter = vi.fn(() => true);
            const setStateSpy = vi.spyOn(game, 'setState');
            state.update(16);
            expect(setStateSpy).toHaveBeenCalledOnce();
        });

        it('warps the player to the starting screen if Shift+S is typed', () => {
            vi.spyOn(game.inputManager, 'isKeyDown')
                .mockImplementation((key: Keys) => key === Keys.KEY_SHIFT || key === Keys.KEY_S);
            const setMapSpy = vi.spyOn(game, 'setMap').mockImplementation(() => {});
            state.enter(game);
            state.update(16);
            expect(setMapSpy).toHaveBeenCalledOnce();
            expect(setStatusMessageSpy).toHaveBeenCalledExactlyOnceWith('Warped to: start screen');
        });

        it('warps the player to the Level 1 entrance if Shift+1 is typed', () => {
            vi.spyOn(game.inputManager, 'isKeyDown')
                .mockImplementation((key: Keys) => key === Keys.KEY_SHIFT || key === Keys.KEY_1);
            const setMapSpy = vi.spyOn(game, 'setMap').mockImplementation(() => {});
            state.enter(game);
            state.update(16);
            expect(setMapSpy).toHaveBeenCalledOnce();
            expect(setStatusMessageSpy).toHaveBeenCalledExactlyOnceWith('Warped to: Level 1');
        });

        it('toggles sword shooting strategy if Shift+W is typed', () => {
            vi.spyOn(game.inputManager, 'isKeyDown')
                .mockImplementation((key: Keys) => key === Keys.KEY_SHIFT || key === Keys.KEY_W);
            const spy = vi.spyOn(game.link, 'toggleSwordThrowingStrategy');
            state.enter(game);
            state.update(16);
            expect(spy).toHaveBeenCalledOnce();
            expect(setStatusMessageSpy).toHaveBeenCalledExactlyOnceWith('Set sword throwing strategy to always');
        });

        it('calls link.update if not transitioning to the Inventory screen', () => {
            game.inputManager.enter = vi.fn(() => false);
            const linkUpdateSpy = vi.spyOn(game.link, 'update');
            state.update(16);
            expect(linkUpdateSpy).toHaveBeenCalledOnce();
        });
    });
});
