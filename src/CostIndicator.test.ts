import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { CostIndicator } from './CostIndicator';
import { Octorok } from './enemy/Octorok';
import { Rupee } from './item/Rupee';
import { ZeldaGame } from './ZeldaGame';

const mockImage = {
    draw: vi.fn(),
};

describe('CostIndicator', () => {
    let game: ZeldaGame;
    let indicator: CostIndicator;
    let paintSpy: MockInstance<Rupee['paint']>;
    let updateSpy: MockInstance<Rupee['update']>;
    let drawStringSpy: MockInstance<ZeldaGame['drawString']>;

    beforeEach(() => {
        game = new ZeldaGame();
        paintSpy = vi.spyOn(Rupee.prototype, 'paint').mockImplementation(() => {});
        updateSpy = vi.spyOn(Rupee.prototype, 'update').mockImplementation(() => {});
        game.assets.set('treasures.yellowRupee', mockImage);
        drawStringSpy = vi.spyOn(game, 'drawString').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('constructor()', () => {
        it('initializes with default position and a Rectangle hitBox', () => {
            indicator = new CostIndicator(game);
            expect(indicator.x).toEqual(52);
            expect(indicator.y).toEqual(108);
            expect(indicator.hitBox).toBeDefined();
            expect(indicator.isPartOfInteraction).toEqual(true);
        });

        it('allows custom x/y to be set via constructor args', () => {
            indicator = new CostIndicator(game, 10, 20);
            expect(indicator.x).toEqual(10);
            expect(indicator.y).toEqual(20);
        });
    });

    describe('collidedWith()', () => {
        it('always returns false', () => {
            indicator = new CostIndicator(game);
            expect(indicator.collidedWith(new Octorok(game))).toEqual(false);
        });
    });

    describe('paint()', () => {
        it('calls rupee.paint and game.drawString with expected args', () => {
            indicator = new CostIndicator(game, 52, 108);
            const ctx = game.getRenderingContext();
            indicator.paint(ctx);
            expect(paintSpy).toHaveBeenCalledOnce();
            expect(drawStringSpy).toHaveBeenCalledExactlyOnceWith(64, 112, 'X', ctx);
        });
    });

    describe('update()', () => {
        it('delegates update to the internal rupee', () => {
            indicator = new CostIndicator(game);
            indicator.update();
            expect(updateSpy).toHaveBeenCalledOnce();
        });
    });
});
