import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Link } from './Link';
import { Map } from '@/Map';
import { Octorok } from '@/enemy/Octorok';
import { ZeldaGame } from '@/ZeldaGame';
import { AudioSystem } from 'gtp';
import { Projectile } from '@/Projectile';
import { opposite } from '@/Direction';
import { AnimationListener } from '@/AnimationListener';

const mockAudio = {
    playMusic: vi.fn(),
    playSound: vi.fn(),
};

const screen = {
    removeLinksSwordActor: vi.fn(),
};

const mockMap = {
    currentScreen: screen,
};

const mockSpriteSheet = {
};

describe('Link', () => {
    let link: Link;
    let game: ZeldaGame;

    beforeEach(() => {
        game = new ZeldaGame();
        game.map = mockMap as unknown as Map;
        game.audio = mockAudio as unknown as AudioSystem;
        game.assets.set('enemyDies', mockSpriteSheet);
        game.assets.set('link', mockSpriteSheet);
        link = new Link(game);
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    it('constructor initializes Link properly', () => {
        expect(link.getHealth()).toStrictEqual(6);
        expect(link.getMaxHealth()).toStrictEqual(6);
        expect(link.getBombCount()).toStrictEqual(99);
        expect(link.getRupeeCount()).toStrictEqual(0);
    });

    describe('collidedWith()', () => {
        describe ('the other entity is an Enemy', () => {
            let enemy: Octorok;

            beforeEach(() => {
                enemy = new Octorok();
            });

            it('returns false and does nothing if Link is taking damage', () => {
                link.takingDamage = true;
                expect(link.collidedWith(enemy)).toEqual(false);
            });

            it('removes the sword from the screen', () => {
                const returnValue = link.collidedWith(enemy);
                expect(screen.removeLinksSwordActor).toHaveBeenCalledOnce();
                expect(returnValue).toEqual(false);
            });

            it('unfreezes Link and makes him still', () => {
                link.frozen = true;
                link.step = Link.FRAME_ACTION;
                const returnValue = link.collidedWith(enemy);
                expect(link.frozen).toEqual(false);
                expect(link.step).toEqual(Link.FRAME_STILL);
                expect(returnValue).toEqual(false);
            });

            describe('if Link is still alive', () => {
                it('he takes the appropriate damage', () => {
                    const origHealth = link.getHealth();
                    link.collidedWith(enemy);
                    expect(link.getHealth()).toEqual(origHealth - enemy.getDamage());
                });

                it('plays a sound', () => {
                    link.collidedWith(enemy);
                    expect(game.audio.playSound).toHaveBeenCalledExactlyOnceWith('linkHurt');
                });

                // it('makes Link slide in the direction the enemy is moving', () => {
                //     enemy.dir = 'LEFT';
                //     link.collidedWith(enemy);
                //     expect(link.slidingDir).toEqual(enemy.dir);
                // });

                it('returns false', () => {
                    expect(link.collidedWith(enemy)).toEqual(false);
                });
            });

            describe('if Link dies', () => {
                beforeEach(() => {
                    // TODO: Simplify when link "max health" APIs are added
                    link.incHealth(-link.getHealth() + enemy.getDamage());
                });

                it('he takes the appropriate damage', () => {
                    link.collidedWith(enemy);
                    expect(link.getHealth()).toEqual(0);
                });

                it('plays a sound for link getting hurt', () => {
                    link.collidedWith(enemy);
                    expect(game.audio.playSound).toHaveBeenCalledWith('linkHurt');
                });

                it('plays the music for link dying', () => {
                    link.collidedWith(enemy);
                    expect(game.audio.playMusic).toHaveBeenCalledExactlyOnceWith('linkDies', false);
                });

                it('returns false', () => {
                    expect(link.collidedWith(enemy)).toEqual(false);
                });
            });
        });

        describe ('the other entity is an Projectile', () => {
            let projectile: Projectile;

            beforeEach(() => {
                projectile = new Projectile(0, 0, 0, 0, 'DOWN');
            });

            it('returns false and does nothing if Link is taking damage', () => {
                link.takingDamage = true;
                expect(link.collidedWith(projectile)).toEqual(false);
            });

            it('removes the sword from the screen', () => {
                const returnValue = link.collidedWith(projectile);
                expect(screen.removeLinksSwordActor).toHaveBeenCalledOnce();
                expect(returnValue).toEqual(false);
            });

            it('unfreezes Link and makes him still', () => {
                link.frozen = true;
                link.step = Link.FRAME_ACTION;
                const returnValue = link.collidedWith(projectile);
                expect(link.frozen).toEqual(false);
                expect(link.step).toEqual(Link.FRAME_STILL);
                expect(returnValue).toEqual(false);
            });

            describe('when going the other direction of Link', () => {
                beforeEach(() => {
                    projectile.dir = opposite(link.dir);
                });

                it('plays the shield sound effect', () => {
                    link.collidedWith(projectile);
                    expect(game.audio.playSound).toHaveBeenCalledExactlyOnceWith('shield');
                });

                it('does not damage Link', () => {
                    const origHealth = link.getHealth();
                    link.collidedWith(projectile);
                    expect(link.getHealth()).toEqual(origHealth);
                });

                it('returns false', () => {
                    expect(link.collidedWith(projectile)).toEqual(false);
                });
            });

            describe('if Link is still alive', () => {
                it('he takes the appropriate damage', () => {
                    const origHealth = link.getHealth();
                    link.collidedWith(projectile);
                    expect(link.getHealth()).toEqual(origHealth - projectile.getDamage());
                });

                it('plays a sound', () => {
                    link.collidedWith(projectile);
                    expect(game.audio.playSound).toHaveBeenCalledExactlyOnceWith('linkHurt');
                });

                // it('makes Link slide in the direction the enemy is moving', () => {
                //     enemy.dir = 'LEFT';
                //     link.collidedWith(enemy);
                //     expect(link.slidingDir).toEqual(enemy.dir);
                // });

                it('returns false', () => {
                    expect(link.collidedWith(projectile)).toEqual(false);
                });
            });

            describe('if Link dies', () => {
                beforeEach(() => {
                    // TODO: Simplify when link "max health" APIs are added
                    link.incHealth(-link.getHealth() + projectile.getDamage());
                });

                it('he takes the appropriate damage', () => {
                    link.collidedWith(projectile);
                    expect(link.getHealth()).toEqual(0);
                });

                it('plays a sound for link getting hurt', () => {
                    link.collidedWith(projectile);
                    expect(game.audio.playSound).toHaveBeenCalledWith('linkHurt');
                });

                it('plays the music for link dying', () => {
                    link.collidedWith(projectile);
                    expect(game.audio.playMusic).toHaveBeenCalledExactlyOnceWith('linkDies', false);
                });

                it('returns false', () => {
                    expect(link.collidedWith(projectile)).toEqual(false);
                });
            });
        });
    });

    describe('enterCave()', () => {
        let listener: AnimationListener;

        beforeEach(() => {
            listener = { animationCompleted: vi.fn() };
        });

        it('plays a sound', () => {
            link.enterCave(listener);
            expect(game.audio.playSound).toHaveBeenCalledExactlyOnceWith('stairs', false, expect.anything())
        });

        it('starts an animation', () => {
            expect(link.anim).toBeFalsy();
            link.enterCave(listener);
            expect(link.anim).toBeDefined();
        });
    });

    describe('exitCave()', () => {
        let listener: AnimationListener;

        beforeEach(() => {
            listener = { animationCompleted: vi.fn() };
        });

        it('plays a sound', () => {
            link.exitCave(listener);
            expect(game.audio.playSound).toHaveBeenCalledExactlyOnceWith('stairs', false, expect.anything())
        });

        it('starts an animation', () => {
            expect(link.anim).toBeFalsy();
            link.exitCave(listener);
            expect(link.anim).toBeDefined();
        });
    });

    describe('handleInput()', () => {
        // TODO
    });

    describe('incBombCount()', () => {
        it('plays a sound', () => {
            link.incBombCount(1);
            expect(game.audio.playSound).toHaveBeenCalledExactlyOnceWith('getItem');
        });

        it('increments bomb count', () => {
            link.incBombCount(-link.getBombCount() + 5);
            link.incBombCount(1);
            expect(link.getBombCount()).toEqual(6);
        });

        it("won't go over the max bomb count", () => {
            link.setMaxBombCount(9999);
            link.incBombCount(10000);
            expect(link.getBombCount()).toEqual(9999);
        });
    });

    describe('incHealth()', () => {
        it('plays a sound when health is increased', () => {
            link.incHealth(-link.getHealth() + 1);
            link.incHealth(1);
            expect(game.audio.playSound).toHaveBeenCalledWith('heart');
        });

        it('increments health', () => {
            link.incHealth(-link.getHealth() + 3);
            link.incHealth(2);
            expect(link.getHealth()).toEqual(5);
        });

        it("won't go over the max health", () => {
            link.incHealth(100);
            expect(link.getHealth()).toEqual(link.getMaxHealth());
        });
    });

    describe('incRupeeCount()', () => {
        it('plays a sound', () => {
            link.incRupeeCount(1);
            expect(game.audio.playSound).toHaveBeenCalledExactlyOnceWith('rupee');
        });

        it('increments rupee count', () => {
            link.incRupeeCount(5);
            expect(link.getRupeeCount()).toEqual(5);
        });

        it.skip("won't go over the max rupee count", () => {
            link.incRupeeCount(1000);
            expect(link.getRupeeCount()).toEqual(999);
        });
    });
});
