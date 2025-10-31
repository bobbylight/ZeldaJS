import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SpriteSheet } from 'gtp';
import { Animation } from './Animation';
import { ZeldaGame } from './ZeldaGame';
import { AnimationListener } from './AnimationListener';

const mockSpriteSheet = {
    cellW: 8,
    cellH: 16,
    drawByIndex: vi.fn(),
} as unknown as SpriteSheet;

describe('Animation', () => {
    let game: ZeldaGame;
    let animation: Animation;

    beforeEach(() => {
        game = new ZeldaGame();
        game.assets.set('test', mockSpriteSheet);
        vi.spyOn(game, 'playTime', 'get').mockReturnValue(0);
        animation = new Animation(game, 5, 10);
        animation.addFrame({ sheet: mockSpriteSheet, index: 0 }, 100);
        animation.addFrame({ sheet: mockSpriteSheet, index: 1 }, 100);
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
        document.body.innerHTML = '';
    });

    describe('constructor', () => {
        it('sets initial x, y, and game', () => {
            expect(animation.getX()).toEqual(5);
            expect(animation.getY()).toEqual(10);
            expect(animation.frameCount).toEqual(2);
        });
    });

    describe('addFrame()', () => {
        it('increases frame count', () => {
            animation.addFrame({ sheet: mockSpriteSheet, index: 2 }, 50);
            expect(animation.frameCount).toEqual(3);
        });
    });

    describe('addListener()', () => {
        it('calls animationFrameUpdate and animationCompleted on update', () => {
            const frameUpdate = vi.fn();
            const completed = vi.fn();
            const listener: AnimationListener = {
                animationFrameUpdate: frameUpdate,
                animationCompleted: completed,
            };
            animation.addListener(listener);

            animation.update(); // First update call initializes

            // Advance to last frame and update to trigger completion
            const playTimeSpy = vi.spyOn(game, 'playTime', 'get');
            playTimeSpy.mockReturnValue(200);
            animation.update(); // Should advance to frame 1 and call frameUpdate
            expect(frameUpdate).toHaveBeenCalledOnce();
            playTimeSpy.mockReturnValue(400);
            animation.update(); // Should complete and call completed
            expect(completed).toHaveBeenCalledOnce();
        });
    });

    describe('frame', () => {
        it('returns the current frame index', () => {
            expect(animation.frame).toEqual(0);
        });
    });

    describe('frameCount', () => {
        it('returns the number of frames', () => {
            expect(animation.frameCount).toEqual(2);
        });
    });

    describe('getCurrentFrameImage()', () => {
        it('returns the current frame image', () => {
            animation.update(); // First call initializes

            vi.spyOn(game, 'playTime', 'get').mockReturnValue(0);
            expect(animation.getCurrentFrameImage().index).toEqual(0);
            vi.spyOn(game, 'playTime', 'get').mockReturnValue(101);
            animation.update();
            expect(animation.getCurrentFrameImage().index).toEqual(1);
        });
    });

    describe('height and width', () => {
        it('returns correct cell size when not done', () => {
            expect(animation.height).toEqual(mockSpriteSheet.cellH);
            expect(animation.width).toEqual(mockSpriteSheet.cellW);
        });

        it('returns 0 when done', () => {
            animation.update(); // First call initializes

            const playTimeSpy = vi.spyOn(game, 'playTime', 'get');
            playTimeSpy.mockReturnValue(200);
            animation.update();
            playTimeSpy.mockReturnValue(400);
            animation.update();
            expect(animation.isDone()).toEqual(true);
            expect(animation.height).toEqual(0);
            expect(animation.width).toEqual(0);
        });
    });

    describe('getX() and getY()', () => {
        it('returns the current x and y', () => {
            expect(animation.getX()).toEqual(5);
            expect(animation.getY()).toEqual(10);
        });
    });

    describe('looping', () => {
        it('returns false by default, true after setting looping', () => {
            expect(animation.looping).toEqual(false);
            animation.looping = true;
            expect(animation.looping).toEqual(true);
        });
    });

    describe('isDone()', () => {
        it('returns false initially, true after animation completes', () => {
            animation.update(); // First call initializes
            expect(animation.isDone()).toEqual(false);

            const playTimeSpy = vi.spyOn(game, 'playTime', 'get');
            playTimeSpy.mockReturnValue(200);
            animation.update();
            playTimeSpy.mockReturnValue(400);
            animation.update();
            expect(animation.isDone()).toEqual(true);
        });
    });

    describe('paint()', () => {
        it('calls drawByIndex on the current frame', () => {
            const drawByIndexSpy = vi.spyOn(mockSpriteSheet, 'drawByIndex');
            const ctx = game.getRenderingContext();
            animation.paint(ctx);
            expect(drawByIndexSpy).toHaveBeenCalledExactlyOnceWith(ctx, 5, 10, 0);
        });
    });

    describe('setX() and setY()', () => {
        it('updates the x and y position', () => {
            animation.setX(42);
            animation.setY(99);
            expect(animation.getX()).toEqual(42);
            expect(animation.getY()).toEqual(99);
        });
    });

    describe('update()', () => {
        beforeEach(() => {
            animation.update(); // First call initializes
        });

        it('does nothing if already done', () => {
            const playTimeSpy = vi.spyOn(game, 'playTime', 'get');
            playTimeSpy.mockReturnValue(200);
            animation.update();
            playTimeSpy.mockReturnValue(400);
            animation.update();
            expect(animation.isDone()).toEqual(true);
            // Should not throw or change state
            animation.update();
            expect(animation.isDone()).toEqual(true);
        });

        it('loops if looping is set', () => {
            animation.looping = true;
            const playTimeSpy = vi.spyOn(game, 'playTime', 'get');
            playTimeSpy.mockReturnValue(200);
            animation.update();
            expect(animation.frame).toEqual(1);
            playTimeSpy.mockReturnValue(400);
            animation.update();
            expect(animation.frame).toEqual(0);
            expect(animation.isDone()).toEqual(false);
        });

        it('loops from a specific frame if loopingFromFrame is set', () => {
            animation.loopingFromFrame = 1;
            const playTimeSpy = vi.spyOn(game, 'playTime', 'get');
            playTimeSpy.mockReturnValue(200);
            animation.update();
            expect(animation.frame).toEqual(1);
            playTimeSpy.mockReturnValue(400);
            animation.update();
            expect(animation.frame).toEqual(1);
        });
    });
});
