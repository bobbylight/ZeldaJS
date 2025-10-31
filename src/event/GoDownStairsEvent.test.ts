import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { SpriteSheet } from 'gtp';
import { GoDownStairsEvent } from './GoDownStairsEvent';
import { ZeldaGame } from '@/ZeldaGame';
import { MainGameState } from '@/MainGameState';
import { Link } from '@/Link';
import { createAnimation } from '@/test-utils';
import { RowColumnPair } from '@/RowColumnPair';

const mockSpriteSheet = {
    drawByIndex: vi.fn(),
} as unknown as SpriteSheet;

describe('GoDownStairsEvent', () => {
    let game: ZeldaGame;
    let tile: RowColumnPair;
    let destScreen: RowColumnPair;
    let destPos: RowColumnPair;
    let event: GoDownStairsEvent;

    beforeEach(() => {
        game = new ZeldaGame();
        game.link = new Link(game);
        tile = { row: 1, col: 2 };
        destScreen = { row: 3, col: 4 };
        destPos = { row: 5, col: 6 };
        event = new GoDownStairsEvent(tile, 'map1', destScreen, destPos, true, true);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('animationCompleted()', () => {
        let setMapSpy: MockInstance<ZeldaGame['setMap']>;
        let setStateSpy: MockInstance<ZeldaGame['setState']>;

        beforeEach(() => {
            setMapSpy = vi.spyOn(game, 'setMap').mockImplementation(() => {});
            setStateSpy = vi.spyOn(game, 'setState').mockImplementation(() => {});
        });

        it('sets map and state with curtain opening if curtainOpenNextScreen is true', () => {
            const anim = createAnimation(game, mockSpriteSheet);
            game.state = new MainGameState(game);
            event.animationCompleted(anim);
            expect(setMapSpy).toHaveBeenCalledExactlyOnceWith('map1', destScreen, destPos, false);
            expect(setStateSpy).toHaveBeenCalledOnce();
        });

        it('sets map without curtain if curtainOpenNextScreen is false', () => {
            event = new GoDownStairsEvent(tile, 'map2', destScreen, destPos, true, false);
            const anim = createAnimation(game, mockSpriteSheet);
            event.animationCompleted(anim);
            expect(setMapSpy).toHaveBeenCalledExactlyOnceWith('map2', destScreen, destPos);
        });
    });

    describe('execute()', () => {
        let enterCaveSpy: MockInstance<Link['enterCave']>;

        beforeEach(() => {
            enterCaveSpy = vi.spyOn(game.link, 'enterCave').mockImplementation(() => {});
        });

        it('stops music', () => {
            const stopMusicSpy = vi.spyOn(game.audio, 'stopMusic').mockImplementation(() => {});
            event.execute(game);
            expect(stopMusicSpy).toHaveBeenCalledOnce();
        });

        it('makes Link enter the cave if animate is true', () => {
            event.execute(game);
            expect(enterCaveSpy).toHaveBeenCalledExactlyOnceWith(event);
        });

        it('does not make Link enter the cave if animate is false', () => {
            event = new GoDownStairsEvent(tile, 'map1', destScreen, destPos, false, true);
            event.execute(game);
            expect(enterCaveSpy).not.toHaveBeenCalled();
        });

        it('returns false and no new events', () => {
            const result = event.execute(game);
            expect(result.done).toEqual(false);
            expect(result.replacementEvents).toBeUndefined();
        });
    });

    describe('shouldOccur()', () => {
        it('returns true if link is walking up onto tile and dir is UP', () => {
            game.link.isWalkingUpOnto = vi.fn(() => true);
            game.link.dir = 'UP';
            expect(event.shouldOccur(game)).toEqual(true);
        });

        it('returns false if link is not walking up onto tile', () => {
            game.link.isWalkingUpOnto = vi.fn(() => false);
            game.link.dir = 'UP';
            expect(event.shouldOccur(game)).toEqual(false);
        });

        it('returns false if link dir is not UP', () => {
            game.link.isWalkingUpOnto = vi.fn(() => true);
            game.link.dir = 'DOWN';
            expect(event.shouldOccur(game)).toEqual(false);
        });
    });

    describe('toJson()', () => {
        it('returns correct event data', () => {
            const json = event.toJson();
            expect(json).toEqual({
                type: event.type,
                tile: { row: 1, col: 2 },
                animate: true,
                destMap: 'map1',
                destScreen: { row: 3, col: 4 },
                destPos: { row: 5, col: 6 },
            });
        });
    });

    describe('update()', () => {
        it('does nothing', () => {
            expect(() => {
                event.update();
            }).not.toThrow();
        });
    });
});
