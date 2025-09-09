import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { InventoryState } from './InventoryState';
import { ZeldaGame } from './ZeldaGame';

describe('InventoryState', () => {
    let game: ZeldaGame;
    let state: InventoryState;
    let setStateSpy: MockInstance<ZeldaGame['setState']>;

    beforeEach(() => {
        game = new ZeldaGame();
        setStateSpy = game.setState = vi.fn();
        state = new InventoryState(game);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('render()', () => {
        it('renders inventory to canvas', () => {
            const drawStringSpy = vi.spyOn(game, 'drawString').mockImplementation(() => {});
            const ctx = game.getRenderingContext();
            state.render(ctx);

            expect(drawStringSpy).toHaveBeenCalledWith(40, 40, 'INVENTORY GOES HERE', ctx);
        });
    });

    describe('update()', () => {
        it('changes state when Enter is pressed', () => {
            game.inputManager.enter = vi.fn(() => true);
            state.update();
            expect(setStateSpy).toHaveBeenCalledOnce();
        });

        it('does not change state if Enter is not pressed', () => {
            game.inputManager.enter = vi.fn(() => false);
            state.update();
            expect(setStateSpy).not.toHaveBeenCalled();
        });
    });
});
