import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { InventorySlideState } from './InventorySlideState';
import { ZeldaGame } from './ZeldaGame';
import { BaseState } from './BaseState';

class MockState extends BaseState {
    override render = vi.fn();
    override update = vi.fn();
}

describe('InventorySlideState', () => {
    let game: ZeldaGame;
    let topState: MockState;
    let bottomState: MockState;
    let state: InventorySlideState;

    beforeEach(() => {
        game = new ZeldaGame();
        topState = new MockState(game);
        bottomState = new MockState(game);
        state = new InventorySlideState(game, topState, bottomState, true);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('render()', () => {
        it('renders top and bottom states with correct transforms (down)', () => {
            const ctx = game.getRenderingContext();
            const translateSpy = vi.spyOn(ctx, 'translate');
            const resetSpy = vi.spyOn(ctx, 'resetTransform');
            state.render(ctx);
            expect(topState.render).toHaveBeenCalledOnce();
            expect(bottomState.render).toHaveBeenCalledOnce();
            expect(translateSpy).toHaveBeenCalledTimes(2);
            expect(resetSpy).toHaveBeenCalledOnce();
        });

        it('renders with correct transforms (up)', () => {
            state = new InventorySlideState(game, topState, bottomState, false);
            const ctx = game.getRenderingContext();
            state.render(ctx);
            expect(topState.render).toHaveBeenCalledOnce();
            expect(bottomState.render).toHaveBeenCalledOnce();
        });
    });

    describe('update()', () => {
        let setStateSpy: MockInstance<ZeldaGame['setState']>;

        beforeEach(() => {
            setStateSpy = vi.spyOn(game, 'setState').mockImplementation(() => {});
        });

        it('does not update the game state if it is too early', () => {
            state.update(16);
            expect(setStateSpy).not.toHaveBeenCalled();
        });

        it('updates the game state if enough time has passed', () => {
            // TODO: Get rid of magic constants
            for (let loopCount = 0; loopCount < 10; loopCount++) {
                state.update(70);
            }
            expect(setStateSpy).toHaveBeenCalledExactlyOnceWith(topState);
        });
    });
});
