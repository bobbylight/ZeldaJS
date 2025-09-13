import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { BaseState } from './BaseState';
import { ZeldaGame } from './ZeldaGame';
import { Keys, Utils } from 'gtp';
import SpriteSheet from 'gtp/lib/gtp/SpriteSheet';

const mockSpriteSheet = {
    cellW: 8,
} as unknown as SpriteSheet;

class TestableState extends BaseState {
    override handleDefaultKeys() {
        super.handleDefaultKeys();
    }

    override stringWidth(str: string): number {
        return super.stringWidth(str);
    }
}

describe('BaseState', () => {
    let game: ZeldaGame;
    let state: TestableState;
    let timestampSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        timestampSpy = vi.spyOn(Utils, 'timestamp');

        game = new ZeldaGame();
        game.setStatusMessage = vi.fn();
        game.toggleMuted = vi.fn();
        game.assets.set('font', mockSpriteSheet);

        // Set up the state to have started "in the past"
        timestampSpy.mockReturnValueOnce(0);
        state = new TestableState(game);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('handleDefaultKeys()', () => {
        let setStatusMessageSpy: MockInstance<ZeldaGame['setStatusMessage']>;

        beforeEach(() => {
            timestampSpy.mockReturnValue(1000);
            setStatusMessageSpy = vi.spyOn(game, 'setStatusMessage');
        });

        describe('when enough time has passed', () => {
            it('toggles mute when M is pressed', () => {
                game.inputManager.isKeyDown = vi.fn((key: Keys, clear: boolean) => key === Keys.KEY_M && clear);
                const mutedSpy = vi.spyOn(game, 'toggleMuted');
                state.handleDefaultKeys();
                expect(mutedSpy).toHaveBeenCalledOnce();
            });

            describe('when SHIFT is held', () => {
                it('increases canvas size when P is pressed', () => {
                    game.inputManager.isKeyDown = vi.fn((key: Keys, clear: boolean) => {
                        return key === Keys.KEY_SHIFT || key === Keys.KEY_P && clear;
                    });
                    game.canvas.style.width = '256px';
                    game.canvas.style.height = '240px';
                    state.handleDefaultKeys();
                    expect(game.canvas.style.width).toEqual('257px');
                    expect(game.canvas.style.height).toEqual('241px');
                    expect(setStatusMessageSpy).toHaveBeenCalledExactlyOnceWith('Canvas size now: (257px, 241px)');
                });

                it('decreases canvas size when L is pressed', () => {
                    game.inputManager.isKeyDown = vi.fn((key: Keys, clear: boolean) => {
                        return key === Keys.KEY_SHIFT || key === Keys.KEY_L && clear;

                    });
                    game.canvas.style.width = '256px';
                    game.canvas.style.height = '240px';
                    state.handleDefaultKeys();
                    expect(game.canvas.style.width).toEqual('255px');
                    expect(game.canvas.style.height).toEqual('239px');
                    expect(setStatusMessageSpy).toHaveBeenCalledExactlyOnceWith('Canvas size now: (255px, 239px)');
                });

                it('initializes canvas style if not set before resizing', () => {
                    const origWidth = game.canvas.clientWidth;
                    const origHeight = game.canvas.clientHeight;
                    game.canvas.style.width = '';
                    game.canvas.style.height = '';
                    game.inputManager.isKeyDown = vi.fn((key: Keys, clear: boolean) => {
                        return key === Keys.KEY_SHIFT || key === Keys.KEY_P && clear;
                    });
                    state.handleDefaultKeys();
                    expect(game.canvas.style.width).toEqual(`${origWidth + 1}px`);
                    expect(game.canvas.style.height).toEqual(`${origHeight + 1}px`);
                });
            });
        });

        it('does nothing if not enough time has passed', () => {
            const mutedSpy = vi.spyOn(game, 'toggleMuted');
            timestampSpy.mockReturnValue(100);
            state.handleDefaultKeys();
            expect(mutedSpy).not.toHaveBeenCalled();
            expect(setStatusMessageSpy).not.toHaveBeenCalled();
        });
    });

    describe('stringWidth()', () => {
        it('returns correct width for a string', () => {
            const result = state.stringWidth('abc');
            expect(result).toEqual(mockSpriteSheet.cellW * 3);
        });
    });
});
