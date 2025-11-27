import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { SpriteSheet } from 'gtp';
import { BombableWallEvent } from './BombableWallEvent';
import { ZeldaGame } from '@/ZeldaGame';
import { MainGameState } from '@/MainGameState';
import { Link } from '@/Link';
import { createAnimation } from '@/test-utils';
import { EnemyGroup } from '@/EnemyGroup';
import { Map } from '@/Map';
import { GoDownStairsEvent } from '@/event/GoDownStairsEvent';
import { RowColumnPair } from '@/RowColumnPair';

const mockSpriteSheet = {
    drawByIndex: vi.fn(),
} as unknown as SpriteSheet;

const mockScreen = {
    checkForBombableWalls: vi.fn(),
    enemyGroup: new EnemyGroup(),
    paint: vi.fn(),
    paintCol: vi.fn(),
    paintRow: vi.fn(),
    paintTopLayer: vi.fn(),
    setTile: vi.fn(),
};

describe('BombableWallEvent', () => {
    let game: ZeldaGame;
    let tile: RowColumnPair;
    let destScreen: RowColumnPair;
    let destPos: RowColumnPair;
    let event: BombableWallEvent;

    beforeEach(() => {
        game = new ZeldaGame();
        game.map = {
            currentScreen: mockScreen,
        } as unknown as Map;
        game.link = new Link(game);
        tile = { row: 1, col: 2 };
        destScreen = { row: 3, col: 4 };
        destPos = { row: 5, col: 6 };
        event = new BombableWallEvent(tile, 'map1', destScreen, destPos, true, true);
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
            event = new BombableWallEvent(tile, 'map2', destScreen, destPos, true, false);
            const anim = createAnimation(game, mockSpriteSheet);
            event.animationCompleted(anim);
            expect(setMapSpy).toHaveBeenCalledExactlyOnceWith('map2', destScreen, destPos);
        });
    });

    describe('execute()', () => {
        it('plays a sound effect', () => {
            const playSoundSpy = vi.spyOn(game.audio, 'playSound').mockImplementation(() => 1);
            event.execute(game);
            expect(playSoundSpy).toHaveBeenCalledExactlyOnceWith('secret');
        });

        it('sets the event tile to a cave opening', () => {
            event.execute(game);
            expect(mockScreen.setTile).toHaveBeenCalledExactlyOnceWith(event.tile.row, event.tile.col, 61);
        });

        it('returns true with a single replacement event', () => {
            const result = event.execute(game);
            expect(result.done).toEqual(true);
            expect(result.replacementEvents?.length).toEqual(1);
            expect(result.replacementEvents?.[0]).toBeInstanceOf(GoDownStairsEvent);
        });
    });

    describe('paint()', () => {
        it('does not throw an error', () => {
            const ctx = game.getRenderingContext();
            expect(() => {
                event.paint(ctx);
            }).not.toThrowError();
        });
    });

    describe('shouldOccur()', () => {
        it('defaults to false', () => {
            expect(event.shouldOccur(game)).toEqual(false);
        });

        it('toggles with its setter', () => {
            event.setShouldOccur(true);
            expect(event.shouldOccur(game)).toEqual(true);
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
