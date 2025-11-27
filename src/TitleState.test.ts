import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { Image, Keys, SpriteSheet } from 'gtp';
import { TitleState } from './TitleState';
import { ZeldaGame } from './ZeldaGame';

const mockSpriteSheet = {
    drawByIndex: vi.fn(),
};

describe('TitleState', () => {
    let game: ZeldaGame;
    let state: TitleState;
    const mockImageDraw = vi.fn();

    beforeEach(() => {
        game = new ZeldaGame();
        game.assets.set('title', { draw: mockImageDraw } as unknown as Image);
        game.assets.set('font', mockSpriteSheet as unknown as SpriteSheet);
        state = new TitleState(game);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('enter()', () => {
        it('adds a touch listener to the canvas', () => {
            const addEventListenerSpy = vi.spyOn(game.canvas, 'addEventListener');
            state.enter(game);
            expect(addEventListenerSpy).toHaveBeenCalledOnce();
        });
    });

    describe('leaving()', () => {
        it('removes the touch listener from the canvas', () => {
            const removeEventListenerSpy = vi.spyOn(game.canvas, 'removeEventListener');
            state.leaving(game);
            expect(removeEventListenerSpy).toHaveBeenCalledOnce();
        });
    });

    describe('handleStart()', () => {
        it('starts the game', () => {
            const spy = vi.spyOn(game, 'startNewGame').mockImplementation(() => {});
            state.handleStart();
            expect(spy).toHaveBeenCalledOnce();
        });

        it('changes the game state', () => {
            vi.spyOn(game, 'startNewGame').mockImplementation(() => {});
            const setStateSpy = vi.spyOn(game, 'setState').mockImplementation(() => {});
            state.handleStart();
            expect(setStateSpy).toHaveBeenCalledOnce();
        });
    });

    describe('render()', () => {
        let drawStringSpy: MockInstance<ZeldaGame['drawString']>;

        beforeEach(() => {
            drawStringSpy = vi.spyOn(game, 'drawString').mockImplementation(() => {});
        });

        it('renders the title screen', () => {
            const ctx = game.getRenderingContext();
            state.render(ctx);
            expect(mockImageDraw).toHaveBeenCalledExactlyOnceWith(ctx, 0, 0);
        });

        describe('if audio is initialized', () => {
            beforeEach(() => {
                vi.spyOn(game.audio, 'isInitialized').mockReturnValue(true);
                state.render(game.getRenderingContext());
            });

            it('does not render the no sound message', () => {
                expect(drawStringSpy).not.toHaveBeenCalled();
            });
        });

        describe('if audio is not initialized', () => {
            beforeEach(() => {
                vi.spyOn(game.audio, 'isInitialized').mockReturnValue(false);
                state.render(game.getRenderingContext());
            });

            it('renders the no sound message', () => {
                expect(drawStringSpy).toHaveBeenCalledTimes(3);
            });
        });
    });

    describe('update()', () => {
        it('updates the state (no-op if not implemented)', () => {
            expect(() => {
                state.update(16);
            }).not.toThrow();
        });

        describe('when Enter is pressed', () => {
            beforeEach(() => {
                vi.spyOn(game.inputManager, 'isKeyDown').mockImplementation((key: Keys) => {
                    return key === Keys.KEY_ENTER;
                });
            });

            it('starts the game', () => {
                const spy = vi.spyOn(game, 'startNewGame').mockImplementation(() => {});
                state.enter(game);
                vi.spyOn(game, 'playTime', 'get').mockReturnValue(game.playTime + 1000);
                state.update(16);
                expect(spy).toHaveBeenCalledOnce();
            });
        });
    });
});
