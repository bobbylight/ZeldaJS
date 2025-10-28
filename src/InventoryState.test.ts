import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { InventoryState } from './InventoryState';
import { ZeldaGame } from './ZeldaGame';
import { Image } from 'gtp';
import { Link } from '@/Link';
import { Map } from '@/Map';

const mockImage = {
    draw: vi.fn(),
} as unknown as Image;

const mockMap = {
    currentScreenCol: 0,
    currentScreenRow: 0,
} as unknown as Map;

describe('InventoryState', () => {
    let game: ZeldaGame;
    let state: InventoryState;
    let setStateSpy: MockInstance<ZeldaGame['setState']>;

    beforeEach(() => {
        game = new ZeldaGame();
        game.map = mockMap;
        game.link = new Link(game);
        game.assets.set('hud', mockImage);
        game.assets.set('treasures.emptyHeart', mockImage);
        game.assets.set('treasures.fullHeart', mockImage);
        game.assets.set('treasures.bomb', mockImage);
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
            const drawStringSpy = vi.spyOn(game, 'drawStringImpl').mockImplementation(() => {});
            const ctx = game.getRenderingContext();
            state.render(ctx);

            expect(drawStringSpy).toHaveBeenCalledWith(expect.any(Number), expect.any(Number), 'INVENTORY', ctx, 'fontRed');
            expect(drawStringSpy).toHaveBeenCalledWith(expect.any(Number), expect.any(Number), 'USE B BUTTON', ctx, 'font');
            expect(drawStringSpy).toHaveBeenCalledWith(expect.any(Number), expect.any(Number), 'FOR THIS', ctx, 'font');
            expect(drawStringSpy).toHaveBeenCalledWith(expect.any(Number), expect.any(Number), 'TRIFORCE', ctx, 'fontRed');
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
