import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { Keys, SpriteSheet, Utils } from 'gtp';
import { BaseState } from './BaseState';
import { ZeldaGame } from './ZeldaGame';

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
    let timestampSpy: MockInstance<typeof Utils.timestamp>;

    beforeEach(() => {
        timestampSpy = vi.spyOn(Utils, 'timestamp');

        game = new ZeldaGame();
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
                vi.spyOn(game.inputManager, 'isKeyDown')
                    .mockImplementation((key: Keys, clear = false) => {
                        return key === Keys.KEY_M && clear;
                    });
                const mutedSpy = vi.spyOn(game, 'toggleMuted');
                state.handleDefaultKeys();
                expect(mutedSpy).toHaveBeenCalledOnce();
            });

            describe('when SHIFT is held', () => {
                it('increases canvas size when P is pressed', () => {
                    vi.spyOn(game.inputManager, 'isKeyDown')
                        .mockImplementation((key: Keys, clear = false) => {
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
                    vi.spyOn(game.inputManager, 'isKeyDown')
                        .mockImplementation((key: Keys, clear = false) => {
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
                    vi.spyOn(game.inputManager, 'isKeyDown')
                        .mockImplementation((key: Keys, clear = false) => {
                            return key === Keys.KEY_SHIFT || key === Keys.KEY_P && clear;
                        });
                    state.handleDefaultKeys();
                    expect(game.canvas.style.width).toEqual(`${origWidth + 1}px`);
                    expect(game.canvas.style.height).toEqual(`${origHeight + 1}px`);
                });

                it('toggles hitboxes when H is pressed', () => {
                    const orig = game.getPaintHitBoxes();
                    vi.spyOn(game.inputManager, 'isKeyDown')
                        .mockImplementation((key: Keys, clear = false) => {
                            return key === Keys.KEY_SHIFT || key === Keys.KEY_H && clear;
                        });
                    state.handleDefaultKeys();
                    expect(game.getPaintHitBoxes()).toEqual(!orig);
                    expect(setStatusMessageSpy).toHaveBeenCalledExactlyOnceWith('Hit boxes are now on');
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
