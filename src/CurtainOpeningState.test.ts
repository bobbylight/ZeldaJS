import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { SpriteSheet } from 'gtp';
import { CurtainOpeningState } from './CurtainOpeningState';
import { MainGameState } from './MainGameState';
import { ZeldaGame } from './ZeldaGame';
import { Map } from '@/Map';

const mockSpriteSheet = {
    drawByIndex: vi.fn(),
} as unknown as SpriteSheet;

describe('CurtainOpeningState', () => {
    let game: ZeldaGame;
    let mainGameState: MainGameState;
    let state: CurtainOpeningState;

    beforeEach(() => {
        game = new ZeldaGame();
        game.assets.set('overworld', mockSpriteSheet)
        game.map = new Map(game, 'overworld', 2, 2);
        mainGameState = new MainGameState(game);

        state = new CurtainOpeningState(game, mainGameState);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('render()', () => {
        let mainStateRenderSpy: MockInstance<MainGameState['render']>;

        beforeEach(() => {
            mainStateRenderSpy = vi.spyOn(mainGameState, 'render').mockImplementation(() => {});
        });

        it('draws the main game state first', () => {
            const ctx = game.getRenderingContext();
            state.render(ctx);
            expect(mainStateRenderSpy).toHaveBeenCalledExactlyOnceWith(ctx);
        });

        it('draws the curtain rectangles', () => {
            const ctx = game.getRenderingContext();
            const fillRectSpy = vi.spyOn(ctx, 'fillRect');
            state.render(ctx);
            expect(fillRectSpy).toHaveBeenCalledTimes(2);
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
            for (let loopCount = 0; loopCount < 16; loopCount++) {
                state.update(70);
            }
            expect(setStateSpy).toHaveBeenCalledExactlyOnceWith(mainGameState);
        });
    });
});
