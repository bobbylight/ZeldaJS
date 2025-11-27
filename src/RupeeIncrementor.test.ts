import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { AudioSystem } from 'gtp';
import { RupeeIncrementor } from '@/RupeeIncrementor';
import { ZeldaGame } from '@/ZeldaGame';
import { Link } from '@/Link';

describe('RupeeIncrementor', () => {
    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('decrement()', () => {
        let incrementor: RupeeIncrementor;
        let game: ZeldaGame;
        let playSoundSpy: MockInstance<AudioSystem['playSound']>;
        let stopSoundSpy: MockInstance<AudioSystem['stopSound']>;

        beforeEach(() => {
            incrementor = new RupeeIncrementor();
            game = new ZeldaGame();
            game.link = new Link(game);
            playSoundSpy = vi.spyOn(game.audio, 'playSound').mockImplementation(() => 1);
            stopSoundSpy = vi.spyOn(game.audio, 'stopSound').mockImplementation(() => true);
        });

        [ 0, -1 ].forEach((rupeeCount) => {
            it(`does nothing if rupee count is ${rupeeCount}`, () => {
                game.link.incRupeeCount(-255);
                incrementor.decrement(game, rupeeCount);
                expect(game.link.getRupeeCount()).toEqual(0);
                expect(playSoundSpy).not.toHaveBeenCalled();

                // An decrement still does nothing
                incrementor.updateRupees(game, 48);
                expect(game.link.getRupeeCount()).toEqual(0);
                expect(playSoundSpy).not.toHaveBeenCalled();
            });
        });

        it('works if rupeeCount === 1', () => {
            expect(incrementor.getRemainingRupees()).toEqual(0);
            incrementor.decrement(game, 1);
            incrementor.updateRupees(game, 48);
            expect(game.link.getRupeeCount()).toEqual(254);
            expect(playSoundSpy).toHaveBeenCalledExactlyOnceWith('refilling', true);
        });

        describe('when rupeeCount === 5', () => {
            beforeEach(() => {
                incrementor.decrement(game, 5);
            });

            it('initially plays the rupee sound and starts looping the refill sound', () => {
                expect(game.link.getRupeeCount()).toEqual(255);
                expect(playSoundSpy).toHaveBeenCalledWith('refilling', true);
            });

            it('eventually stops playing the refill sound', () => {
                for (let i = 0; i < 5; i++) {
                    incrementor.updateRupees(game, 48);
                    expect(game.link.getRupeeCount()).toEqual(255 - i - 1);
                }

                for (let frame = 0; frame < 3; frame++) {
                    incrementor.updateRupees(game, 48);
                    if (frame < 2) {
                        expect(stopSoundSpy).not.toHaveBeenCalled();
                    }
                    else {
                        expect(stopSoundSpy).toHaveBeenCalledOnce();
                    }
                }
            });
        });
    });

    describe('increment()', () => {
        let incrementor: RupeeIncrementor;
        let game: ZeldaGame;
        let playSoundSpy: MockInstance<AudioSystem['playSound']>;
        let stopSoundSpy: MockInstance<AudioSystem['stopSound']>;

        beforeEach(() => {
            incrementor = new RupeeIncrementor();
            game = new ZeldaGame();
            game.link = new Link(game);
            playSoundSpy = vi.spyOn(game.audio, 'playSound').mockImplementation(() => 1);
            stopSoundSpy = vi.spyOn(game.audio, 'stopSound').mockImplementation(() => true);
        });

        [ 0, -1 ].forEach((rupeeCount) => {
            it(`does nothing if rupee count is ${rupeeCount}`, () => {
                game.link.incRupeeCount(-255);
                incrementor.increment(game, rupeeCount);
                expect(game.link.getRupeeCount()).toEqual(0);
                expect(playSoundSpy).not.toHaveBeenCalled();

                // An increment still does nothing
                incrementor.updateRupees(game, 48);
                expect(game.link.getRupeeCount()).toEqual(0);
                expect(playSoundSpy).not.toHaveBeenCalled();
            });
        });

        it('works if rupeeCount === 1', () => {
            expect(incrementor.getRemainingRupees()).toEqual(0);
            incrementor.increment(game, 1);
            expect(game.link.getRupeeCount()).toEqual(256);
            expect(playSoundSpy).toHaveBeenCalledExactlyOnceWith('rupee');
        });

        describe('when rupeeCount === 5', () => {
            beforeEach(() => {
                incrementor.increment(game, 5);
            });

            it('initially plays the rupee sound and starts looping the refill sound', () => {
                expect(game.link.getRupeeCount()).toEqual(255);
                expect(playSoundSpy).toHaveBeenCalledTimes(2);
                expect(playSoundSpy).toHaveBeenCalledWith('rupee');
                expect(playSoundSpy).toHaveBeenCalledWith('refilling', true);
            });

            it('eventually stops playing the refill sound', () => {
                for (let i = 0; i < 5; i++) {
                    incrementor.updateRupees(game, 48);
                    expect(game.link.getRupeeCount()).toEqual(255 + i + 1);
                }

                for (let frame = 0; frame < 3; frame++) {
                    incrementor.updateRupees(game, 48);
                    if (frame < 2) {
                        expect(stopSoundSpy).not.toHaveBeenCalled();
                    }
                    else {
                        expect(stopSoundSpy).toHaveBeenCalledOnce();
                    }
                }
            });
        });
    });
});
