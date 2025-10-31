import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AudioSystem } from 'gtp';
import {
    createEnemyDiesAnimation,
    createLinkDyingAnimation,
    createReflectedProjectileAnimation,
    createStairsDownAnimation, createStairsUpAnimation,
} from '@/Animations';
import { Link } from '@/Link';
import { ZeldaGame } from '@/ZeldaGame';
import { Map } from '@/Map';
import { Octorok } from '@/enemy/Octorok';
import { Projectile } from '@/Projectile';
import { Direction } from '@/Direction';

const mockPlayMusic = vi.fn();
const mockPlaySound = vi.fn();
const mockAudio = {
    playMusic: mockPlayMusic,
    playSound: mockPlaySound,
};

const mockMap = {
    currentScreen: screen,
};

const mockSpriteSheet = {
    drawByIndex: vi.fn(),
};

describe('Animations', () => {
    let link: Link;
    let game: ZeldaGame;

    beforeEach(() => {
        game = new ZeldaGame();
        game.map = mockMap as unknown as Map;
        game.audio = mockAudio as unknown as AudioSystem;
        game.assets.set('enemyDies', mockSpriteSheet);
        game.assets.set('enemies', mockSpriteSheet);
        game.assets.set('link', mockSpriteSheet);
        link = new Link(game);
        game.link = link;
    });

    describe('createEnemyDiesAnimation()', () => {
        let enemy: Octorok;

        beforeEach(() => {
            enemy = new Octorok(game);
        });

        it('works if no listener is provided', () => {
            expect(() => {
                createEnemyDiesAnimation(game, enemy, 0, 0);
            }).not.toThrow();
        });

        it('calls the completed callback if provided', () => {
            const listener = {
                animationFrameUpdate: vi.fn(),
                animationCompleted: vi.fn(),
            };
            const anim = createEnemyDiesAnimation(game, enemy, 0, 0, listener);

            vi.spyOn(game, 'playTime', 'get').mockReturnValue(0);
            anim.update(); // First call initializes

            for (let i = 0; i < 11; i++) {
                vi.spyOn(game, 'playTime', 'get').mockReturnValue((i + 1) * 31);
                anim.update();
                expect(listener.animationFrameUpdate).toHaveBeenCalledTimes(i + 1);
            }

            vi.spyOn(game, 'playTime', 'get').mockReturnValue(12 * 31);
            anim.update();
            expect(listener.animationCompleted).toHaveBeenCalledExactlyOnceWith(anim);
        });
    });

    describe('createLinkDyingAnimation()', () => {
        it('works if no listener is provided', () => {
            expect(() => {
                createLinkDyingAnimation(game, link, 0, 0);
            }).not.toThrow();
        });

        it('calls the completed callback if provided', () => {
            const listener = {
                animationFrameUpdate: vi.fn(),
                animationCompleted: vi.fn(),
            };
            const anim = createLinkDyingAnimation(game, link, 0, 0, listener);

            vi.spyOn(game, 'playTime', 'get').mockReturnValue(0);
            anim.update(); // First call initializes

            // 1001ms to cover the longest frame
            for (let i = 0; i < 32; i++) {
                vi.spyOn(game, 'playTime', 'get').mockReturnValue((i + 1) * 1001);
                anim.update();
                expect(listener.animationFrameUpdate).toHaveBeenCalledTimes(i + 1);
            }

            vi.spyOn(game, 'playTime', 'get').mockReturnValue(33 * 1001);
            anim.update();
            expect(listener.animationCompleted).toHaveBeenCalledExactlyOnceWith(anim);
        });
    });

    describe('createReflectedProjectileAnimation()', () => {
        let enemy: Octorok;
        let projectile: Projectile;

        beforeEach(() => {
            enemy = new Octorok(game);
            projectile = Projectile.create(game, enemy, 'enemies',0, 12, 0, 0, 'UP');
        });

        const directions: Direction[] = [ 'DOWN', 'LEFT', 'UP', 'RIGHT' ];
        directions.forEach((dir) => {
            describe(`for direction ${dir}`, () => {
                beforeEach(() => {
                    projectile.dir = dir;
                });

                it('works if no listener is provided', () => {
                    expect(() => {
                        createReflectedProjectileAnimation(game, projectile, 0, 0);
                    }).not.toThrow();
                });

                it('calls the completed callback if provided', () => {
                    const listener = {
                        animationFrameUpdate: vi.fn(),
                        animationCompleted: vi.fn(),
                    };
                    const anim = createReflectedProjectileAnimation(game, projectile, 0, 0, listener);

                    vi.spyOn(game, 'playTime', 'get').mockReturnValue(0);
                    anim.update(); // First call initializes

                    for (let i = 0; i < 14; i++) {
                        vi.spyOn(game, 'playTime', 'get').mockReturnValue((i + 1) * 31);
                        anim.update();
                        expect(listener.animationFrameUpdate).toHaveBeenCalledTimes(i + 1);
                    }

                    vi.spyOn(game, 'playTime', 'get').mockReturnValue(16 * 31);
                    anim.update();
                    expect(listener.animationCompleted).toHaveBeenCalledExactlyOnceWith(anim);
                });
            });
        });
    });

    describe('createStairsDownAnimation()', () => {
        it('works if no listener is provided', () => {
            expect(() => {
                createStairsDownAnimation(game, link, 0, 0);
            }).not.toThrow();
        });

        it('calls the completed callback if provided', () => {
            const listener = {
                animationFrameUpdate: vi.fn(),
                animationCompleted: vi.fn(),
            };
            const anim = createStairsDownAnimation(game, link, 0, 0, listener);

            vi.spyOn(game, 'playTime', 'get').mockReturnValue(0);
            anim.update(); // First call initializes

            for (let i = 0; i < 7; i++) {
                vi.spyOn(game, 'playTime', 'get').mockReturnValue((i + 1) * 121);
                anim.update();
                expect(listener.animationFrameUpdate).toHaveBeenCalledTimes(i + 1);
            }

            vi.spyOn(game, 'playTime', 'get').mockReturnValue(8 * 121);
            anim.update();
            expect(listener.animationCompleted).toHaveBeenCalledExactlyOnceWith(anim);
        });
    });

    describe('createStairsUpAnimation()', () => {
        it('works if no listener is provided', () => {
            expect(() => {
                createStairsUpAnimation(game, link, 0, 0);
            }).not.toThrow();
        });

        it('calls the completed callback if provided', () => {
            const listener = {
                animationFrameUpdate: vi.fn(),
                animationCompleted: vi.fn(),
            };
            const anim = createStairsUpAnimation(game, link, 0, 0, listener);

            vi.spyOn(game, 'playTime', 'get').mockReturnValue(0);
            anim.update(); // First call initializes

            for (let i = 0; i < 7; i++) {
                vi.spyOn(game, 'playTime', 'get').mockReturnValue((i + 1) * 121);
                anim.update();
                expect(listener.animationFrameUpdate).toHaveBeenCalledTimes(i + 1);
            }

            vi.spyOn(game, 'playTime', 'get').mockReturnValue(8 * 121);
            anim.update();
            expect(listener.animationCompleted).toHaveBeenCalledExactlyOnceWith(anim);
        });
    });
});
