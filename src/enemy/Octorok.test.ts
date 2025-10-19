import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { Link } from '@/Link';
import { Octorok } from './Octorok';
import { ZeldaGame } from '@/ZeldaGame';
import { AudioSystem, SpriteSheet } from 'gtp';
import { Map } from '@/Map';
import { Sword } from '@/Sword';

const mockDrawByIndex = vi.fn();
const mockSpriteSheet = {
    drawByIndex: mockDrawByIndex,
} as unknown as SpriteSheet;

const mockImage = {
    draw: vi.fn(),
};

describe('Octorok', () => {
    let game: ZeldaGame;

    beforeEach(() => {
        game = new ZeldaGame();
        game.assets.set('enemies', mockSpriteSheet);
        game.assets.set('overworld', mockSpriteSheet);
        game.assets.set('enemyDies', mockSpriteSheet);
        game.assets.set('treasures.yellowRupee', mockImage);
        game.map = new Map(game, 'overworld', 2, 2);
        game.link = new Link(game);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('constructor()', () => {
        it('initializes a red Octorok with correct defaults', () => {
            const octorok = new Octorok(game, 'red');
            expect(octorok.strength).toEqual('red');
            expect(octorok.enemyName).toEqual('redOctorok');
        });

        it('initializes a blue Octorok with correct defaults', () => {
            const octorok = new Octorok(game, 'blue');
            expect(octorok.strength).toEqual('blue');
            expect(octorok.enemyName).toEqual('blueOctorok');
        });
    });

    describe('collidedWith()', () => {
        describe("when doesn't take damage from the other actor", () => {
            let enemy: Octorok;

            beforeEach(() => {
                enemy = new Octorok(game);
            });

            it('returns false', () => {
                const octorok = new Octorok(game);
                expect(octorok.collidedWith(enemy)).toEqual(false);
            });

            it('does no damage', () => {
                const octorok = new Octorok(game);
                octorok.collidedWith(enemy);
                expect(octorok.done).toEqual(false);
            });
        });

        describe('when does take damage from the other actor', () => {
            let sword: Sword;
            let playSoundSpy: MockInstance<AudioSystem['playSound']>;

            beforeEach(() => {
                sword = new Sword(game);
                playSoundSpy = vi.spyOn(game.audio, 'playSound').mockImplementation(() => 1);
            });

            describe('when not already taking damage', () => {
                describe('when dies with the hit', () => {
                    it('returns true', () => {
                        const octorok = new Octorok(game);
                        expect(octorok.collidedWith(sword)).toEqual(true);
                    });

                    it('kills the enemy', () => {
                        const octorok = new Octorok(game);
                        octorok.collidedWith(sword);
                        expect(octorok.done).toEqual(true);
                    });

                    it('plays a sound effect', () => {
                        const octorok = new Octorok(game);
                        octorok.collidedWith(sword);
                        expect(playSoundSpy).toHaveBeenCalledExactlyOnceWith('enemyDie');
                    });

                    it('adds an animation of the enemy dying', () => {
                        const animSpy = vi.spyOn(game, 'addEnemyDiesAnimation')
                            .mockImplementation(() => {});
                        const octorok = new Octorok(game);
                        octorok.collidedWith(sword);
                        expect(animSpy).toHaveBeenCalledExactlyOnceWith(octorok);
                    });
                });

                describe('when does not die with the hit', () => {
                    it('returns false', () => {
                        const octorok = new Octorok(game, 'blue');
                        expect(octorok.collidedWith(sword)).toEqual(false);
                    });

                    it('does not kill the enemy', () => {
                        const octorok = new Octorok(game, 'blue');
                        octorok.collidedWith(sword);
                        expect(octorok.done).toEqual(false);
                    });

                    it('does not play the "enemy dies" sound effect', () => {
                        const octorok = new Octorok(game, 'blue');
                        octorok.collidedWith(sword);
                        expect(playSoundSpy).not.toHaveBeenLastCalledWith('enemyDie');
                    });

                    it('adds an animation of the enemy dying', () => {
                        const animSpy = vi.spyOn(game, 'addEnemyDiesAnimation')
                            .mockImplementation(() => {});
                        const octorok = new Octorok(game, 'blue');
                        octorok.collidedWith(sword);
                        expect(animSpy).not.toHaveBeenCalled();
                    });
                });
            });

            describe('when already taking damage', () => {
                it('returns false', () => {
                    const octorok = new Octorok(game);
                    octorok.takingDamage = true;
                    expect(octorok.collidedWith(sword)).toEqual(false);
                });

                it('does not kill the octorok', () => {
                    const octorok = new Octorok(game);
                    octorok.takingDamage = true;
                    octorok.collidedWith(sword);
                    expect(octorok.done).toEqual(false);
                });
            })
        });
    });

    describe('paint()', () => {
        it('does not throw', () => {
            const octorok = new Octorok(game);
            const ctx = game.getRenderingContext();
            expect(() => {
                octorok.paint(ctx);
            }).not.toThrowError();
        });
    });

    describe('setLocationToSpawnPoint()', () => {
        it('sets location to a walkable point', () => {
            const octorok = new Octorok(game);
            const screen = game.map.currentScreen;
            const isWalkableSpy = vi.spyOn(screen, 'isWalkable')
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(true);
            octorok.setLocationToSpawnPoint(screen);
            expect(isWalkableSpy).toHaveBeenCalledTimes(2);
            expect(octorok.x % 16).toEqual(0);
            expect(octorok.y % 16).toEqual(0);
        });
    });

    describe('update()', () => {
        it('does not throw when a projectile is being spawned', () => {
            vi.spyOn(game, 'randomInt').mockReturnValue(0);
            const octorok = new Octorok(game);
            expect(() => {
                octorok.update();
            }).not.toThrowError();
        });

        it('does not throw when a projectile is not being spawned', () => {
            vi.spyOn(game, 'randomInt').mockReturnValue(1);
            const octorok = new Octorok(game);
            expect(() => {
                octorok.update();
            }).not.toThrowError();
        });
    })
});
