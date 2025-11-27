import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { ChangeScreenWarpEvent } from './ChangeScreenWarpEvent';
import { ZeldaGame } from '@/ZeldaGame';
import { Link } from '@/Link';
import { RowColumnPair } from '@/RowColumnPair';

describe('ChangeScreenWarpEvent', () => {
    let game: ZeldaGame;
    let tile: RowColumnPair;
    let destScreen: RowColumnPair;
    let destPos: RowColumnPair;
    let event: ChangeScreenWarpEvent;

    beforeEach(() => {
        game = new ZeldaGame();
        game.link = new Link(game);
        tile = { row: 1, col: 2 };
        destScreen = { row: 3, col: 4 };
        destPos = { row: 5, col: 6 };
        event = new ChangeScreenWarpEvent(tile, 'map1', destScreen, destPos, true);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('execute()', () => {
        let setMapSpy: MockInstance<ZeldaGame['setMap']>;
        let stopMusicSpy: MockInstance<ZeldaGame['audio']['stopMusic']>;
        let exitCaveSpy: MockInstance<Link['exitCave']>;

        beforeEach(() => {
            setMapSpy = vi.spyOn(game, 'setMap').mockImplementation(() => {});
            stopMusicSpy = vi.spyOn(game.audio, 'stopMusic').mockImplementation(() => {});
            exitCaveSpy = vi.spyOn(game.link, 'exitCave').mockImplementation(() => {});
        });

        it('sets the map', () => {
            event.execute(game);
            expect(setMapSpy).toHaveBeenCalledExactlyOnceWith('map1', destScreen, destPos, false);
        });

        it('stops music', () => {
            event.execute(game);
            expect(stopMusicSpy).toHaveBeenCalledOnce();
        });

        it('makes Link exit the cave', () => {
            event.execute(game);
            expect(exitCaveSpy).toHaveBeenCalledExactlyOnceWith(event);
        });

        it('returns false and no new events', () => {
            const result = event.execute(game);
            expect(result.done).toEqual(false);
            expect(result.replacementEvents).toBeUndefined();
        });

        describe('when animate is false', () => {
            beforeEach(() => {
                event = new ChangeScreenWarpEvent(tile, 'map1', destScreen, destPos, false);
            });

            it('does not stop the music', () => {
                event.execute(game);
                expect(stopMusicSpy).not.toHaveBeenCalled();
            });

            it('does not make Link exit the cave', () => {
                event.execute(game);
                expect(exitCaveSpy).not.toHaveBeenCalled();
            });
        });
    });

    describe('shouldOccur()', () => {
        it('returns false always', () => {
            expect(event.shouldOccur()).toEqual(false);
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
