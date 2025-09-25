import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { Sword } from './Sword';
import { Link } from './Link';
import { Map } from './Map';
import { ZeldaGame } from './ZeldaGame';
import { Octorok } from '@/enemy/Octorok';
import { AudioSystem } from 'gtp';
import { Screen } from '@/Screen';

const mockDrawByIndex = vi.fn();
const mockSpriteSheet = {
    drawByIndex: mockDrawByIndex,
};

const screen = {
    addActor: vi.fn(),
    isThrownSwordActorActive: vi.fn(),
    removeLinksSwordActor: vi.fn(),
    setThrownSwordActorActive: vi.fn(),
} as unknown as Screen;

const mockMap = {
    currentScreen: screen,
};

describe('Sword', () => {
    let game: ZeldaGame;

    beforeEach(() => {
        game = new ZeldaGame();
        game.assets.set('link', mockSpriteSheet);
        game.link = new Link(game);
        game.link.w = 16;
        game.link.h = 16;
        game.map = mockMap as unknown as Map;
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    it('initializes position for DOWN', () => {
        game.link.dir = 'DOWN';
        game.link.x = 5;
        game.link.y = 7;
        const sword = new Sword(game);
        expect(sword.x).toBe(game.link.x);
        expect(sword.y).toBe(game.link.y + 12);
    });

    it('initializes position for LEFT', () => {
        game.link.dir = 'LEFT';
        game.link.x = 10;
        game.link.y = 15;
        const sword = new Sword(game);
        expect(sword.x).toBe(game.link.x - 12);
        expect(sword.y).toBe(game.link.y);
    });

    it('initializes position for UP', () => {
        game.link.dir = 'UP';
        game.link.x = 8;
        game.link.y = 12;
        const sword = new Sword(game);
        expect(sword.x).toBe(game.link.x);
        expect(sword.y).toBe(game.link.y - 12);
    });

    it('initializes position for RIGHT', () => {
        game.link.dir = 'RIGHT';
        game.link.x = 20;
        game.link.y = 30;
        const sword = new Sword(game);
        expect(sword.x).toBe(game.link.x + 12);
        expect(sword.y).toBe(game.link.y);
    });

    it('collidedWith always returns false', () => {
        const sword = new Sword(game);
        expect(sword.collidedWith(new Octorok(game))).toBe(false);
    });

    describe('getHitBoxStyle()', () => {
        it('returns blue', () => {
            const sword = new Sword(game);
            expect(sword.getHitBoxStyle()).toEqual('blue');
        });
    });

    describe('update()/paint()', () => {
        let ctx: CanvasRenderingContext2D;

        beforeEach(() => {
            ctx = game.getRenderingContext();
        });

        describe('when Link is facing DOWN', () => {
            beforeEach(() => {
                game.link.dir = 'DOWN';
            });

            it('is only rendered for 11 frames', () => {
                const sword = new Sword(game);

                for (let i = 0; i < 16; i++) {
                    sword.update();
                    sword.paint(ctx);
                }

                expect(mockDrawByIndex).toHaveBeenCalledTimes(11);
            });
        });

        describe('when Link is facing RIGHT', () => {
            beforeEach(() => {
                game.link.dir = 'RIGHT';
            });

            it('is only rendered for the 11 frames', () => {
                const sword = new Sword(game);

                for (let i = 0; i < 16; i++) {
                    sword.update();
                    sword.paint(ctx);
                }

                expect(mockDrawByIndex).toHaveBeenCalledTimes(11);
            });
        });

        describe('when Link is facing LEFT', () => {
            beforeEach(() => {
                game.link.dir = 'LEFT';
            });

            it('is only rendered for the 11 frames', () => {
                const sword = new Sword(game);

                for (let i = 0; i < 16; i++) {
                    sword.update();
                    sword.paint(ctx);
                }

                expect(mockDrawByIndex).toHaveBeenCalledTimes(11);
            });
        });

        describe('when Link is facing UP', () => {
            beforeEach(() => {
                game.link.dir = 'UP';
            });

            it('is only rendered for the 11 frames', () => {
                const sword = new Sword(game);

                for (let i = 0; i < 16; i++) {
                    sword.update();
                    sword.paint(ctx);
                }

                expect(mockDrawByIndex).toHaveBeenCalledTimes(11);
            });
        });

        describe('shooting a sword', () => {
            let addActorSpy: MockInstance<Screen['addActor']>;
            let playSoundSpy: MockInstance<AudioSystem['playSound']>;
            let setThrownSwordActorActiveSpy: MockInstance<Screen['setThrownSwordActorActive']>;

            beforeEach(() => {
                addActorSpy = vi.spyOn(screen, 'addActor');
                playSoundSpy = vi.spyOn(game.audio, 'playSound');
                setThrownSwordActorActiveSpy = vi.spyOn(screen, 'setThrownSwordActorActive');
            });

            describe('when Link is at full health', () => {
                beforeEach(() => {
                    const sword = new Sword(game);
                    for (let i = 0; i < 16; i++) {
                        sword.update();
                        sword.paint(ctx);
                    }
                });

                it('shoots a sword beam', () => {
                    expect(addActorSpy).toHaveBeenCalledOnce();
                });

                it('sets the "thrown sword" flag', () => {
                    expect(setThrownSwordActorActiveSpy).toHaveBeenCalledExactlyOnceWith(true);
                });

                it('plays a sound', () => {
                    expect(playSoundSpy).toHaveBeenCalledExactlyOnceWith('swordShoot');
                });

                describe('when the sword beam is done', () => {
                    let addAnimationSpy: MockInstance<ZeldaGame['addAnimation']>;

                    beforeEach(() => {
                        addAnimationSpy = vi.spyOn(game, 'addAnimation');
                        const projectile = addActorSpy.mock.calls[0][0];
                        projectile.removedFromScreen(screen);
                    });

                    it('clears the "thrown sword" flag', () => {
                        expect(setThrownSwordActorActiveSpy).toHaveBeenLastCalledWith(false);
                    });

                    it('renders an animation', () => {
                        expect(addAnimationSpy).toHaveBeenCalledTimes(4);
                    });

                    it('updates the animations succesfully', () => {
                        const playTimeSpy = vi.spyOn(game, 'playTime', 'get');
                        expect(() => {
                            playTimeSpy.mockReturnValue(16);
                            game.updateAnimations();
                            playTimeSpy.mockReturnValue(64);
                            game.updateAnimations();
                        }).not.toThrow();
                    });
                });
            });

            describe('when Link is not at full health', () => {
                beforeEach(() => {
                    vi.spyOn(game.link, 'getShouldThrowSword').mockReturnValue(false);
                    const sword = new Sword(game);
                    for (let i = 0; i < 16; i++) {
                        sword.update();
                        sword.paint(ctx);
                    }
                });

                it('does not shoot a sword beam', () => {
                    expect(addActorSpy).not.toHaveBeenCalled();
                });

                it('does not play a sound', () => {
                    expect(playSoundSpy).not.toHaveBeenCalled();
                });
            });
        })
    });
});
