import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Link } from './Link';
import { AnimationProjectileRenderInfo, GoingOffScreenBehavior, Projectile } from './Projectile';
import { SpriteSheet } from 'gtp';
import { ZeldaGame } from './ZeldaGame';
import { Octorok } from '@/enemy/Octorok';
import { Animation } from '@/Animation';
import { createAnimation } from '@/test-utils';
import { ENEMY_HITBOX_STYLE, HERO_HITBOX_STYLE } from '@/Constants';

const mockDrawByIndex = vi.fn();

const mockSpriteSheet = {
    colCount: 8,
    rowCount: 4,
    size: 32,
    drawByIndex: mockDrawByIndex,
} as unknown as SpriteSheet;

describe('Projectile', () => {
    let game: ZeldaGame;

    beforeEach(() => {
        game = new ZeldaGame();
        game.assets.set('enemies', mockSpriteSheet);
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    it('initializes with correct position and direction', () => {
        const p = Projectile.create(game, null, 'enemies', 2, 3, 10, 20, 'UP');
        expect(p.x).toEqual(10);
        expect(p.y).toEqual(20);
        expect(p.dir).toEqual('UP');
    });

    describe('collidedWith()', () => {
        let p: Projectile;

        describe('when target is "any"', () => {
            beforeEach(() => {
                p = Projectile.create(game, null, 'enemies', 0, 0, 0, 0, 'DOWN');
                p.setTarget('any');
            });

            it('returns true and sets done if colliding with Link', () => {
                const link = new Link(game);
                expect(p.collidedWith(link)).toEqual(true);
                expect(p.done).toEqual(true);
            });

            it('returns true if colliding with non-Link', () => {
                expect(p.collidedWith(new Octorok(game))).toEqual(true);
                expect(p.done).toEqual(true);
            });
        });

        describe('when target is "link"', () => {
            beforeEach(() => {
                p = Projectile.create(game, null, 'enemies', 0, 0, 0, 0, 'DOWN');
            });

            it('returns true and sets done if colliding with Link', () => {
                const link = new Link(game);
                expect(p.collidedWith(link)).toEqual(true);
                expect(p.done).toEqual(true);
            });

            it('returns false if colliding with non-Link', () => {
                expect(p.targets('link')).toEqual(true); // The default
                expect(p.collidedWith(new Octorok(game))).toEqual(false);
                expect(p.done).toEqual(false);
            });
        });

        describe('when target is "enemy"', () => {
            beforeEach(() => {
                p = Projectile.create(game, null, 'enemies', 0, 0, 0, 0, 'DOWN');
                p.setTarget('enemy');
            });

            it('returns false if colliding with Link', () => {
                const link = new Link(game);
                expect(p.collidedWith(link)).toEqual(false);
                expect(p.done).toEqual(false);
            });

            it('returns true and sets done if colliding with non-Link', () => {
                expect(p.collidedWith(new Octorok(game))).toEqual(true);
                expect(p.done).toEqual(true);
            });
        });
    });

    describe('getBlockedImageSheetAndIndex()', () => {
        it('returns the expected value for sheet-based projectiles', () => {
            const p = Projectile.create(game, null, 'enemies', 0, 0, 0, 0, 'LEFT');
            expect(p.getBlockedImageSheetAndIndex()).toEqual({
                sheet: mockSpriteSheet,
                index: 0,
            });
        });

        it('returns the expected value for animation-based projectiles', () => {
            const animRenderInfo: AnimationProjectileRenderInfo = {
                type: 'animation',
                animation: createAnimation(game, mockSpriteSheet),
            };
            const p = new Projectile(game, animRenderInfo, 0, 0, 'LEFT');
            expect(p.getBlockedImageSheetAndIndex()).toEqual({
                sheet: mockSpriteSheet,
                index: 0,
            });
        });
    });

    describe('getDamage() and setDamage()', () => {
        it('getDamage returns default and setDamage updates value', () => {
            const p = Projectile.create(game, null, 'enemies', 0, 0, 0, 0, 'LEFT');
            expect(p.getDamage()).toEqual(1);
            p.setDamage(5);
            expect(p.getDamage()).toEqual(5);
        });
    });

    describe('getHitBoxStyle()', () => {
        it('defaults to red', () => {
            const p = Projectile.create(game, null, 'enemies', 0, 0, 0, 0, 'LEFT');
            expect(p.getHitBoxStyle()).toEqual(ENEMY_HITBOX_STYLE);
        });

        it('returns blue if targeting enemies', () => {
            const p = Projectile.create(game, null, 'enemies', 0, 0, 0, 0, 'LEFT');
            p.setTarget('enemy');
            expect(p.getHitBoxStyle()).toEqual(HERO_HITBOX_STYLE);
        });
    });

    it('getSource() returns the source', () => {
        const octorok = new Octorok(game);
        const p = Projectile.create(game, octorok, 'enemies', 1, 2, 5, 6, 'LEFT');
        expect(p.getSource()).toEqual(octorok);
    });

    describe('paint()', () => {
        describe('when a sprite sheet index is used', () => {
            it('draws the projectile at correct index', () => {
                const p = Projectile.create(game, null, 'enemies', 1, 2, 5, 6, 'LEFT');
                const ctx = game.getRenderingContext();
                p.paint(ctx);
                expect(mockDrawByIndex).toHaveBeenCalledWith(ctx, 5, 6, 32);
            });
        });

        describe('when an animation is used', () => {
            let animation: Animation;
            let p: Projectile;

            beforeEach(() => {
                animation = createAnimation(game, mockSpriteSheet);
                const animRenderInfo: AnimationProjectileRenderInfo = {
                    type: 'animation',
                    animation,
                }
                p = new Projectile(game, animRenderInfo, 0, 0, 'LEFT');
            });

            it('paints the animation', () => {
                const animPaintSpy = vi.spyOn(animation, 'paint').mockImplementation(() => {});
                const ctx = game.getRenderingContext();
                p.paint(ctx);
                expect(animPaintSpy).toHaveBeenCalledExactlyOnceWith(ctx);
            });
        });
    });

    describe('setTarget()', () => {
        it('targets just enemies when set to that value', () => {
            const p = Projectile.create(game, null, 'enemies', 1, 2, 5, 6, 'LEFT');
            p.setTarget('enemy');
            expect(p.targets('link')).toEqual(false);
            expect(p.targets('enemy')).toEqual(true);
        });

        it('targets everything when set to "any"', () => {
            const p = Projectile.create(game, null, 'enemies', 1, 2, 5, 6, 'LEFT');
            p.setTarget('any');
            expect(p.targets('link')).toEqual(true);
            expect(p.targets('enemy')).toEqual(true);
        });
    });

    describe('targets()', () => {
        it('defaults to targeting Link', () => {
            const p = Projectile.create(game, null, 'enemies', 1, 2, 5, 6, 'LEFT');
            expect(p.targets('link')).toEqual(true);
        });

        it('by default, returns false for targeting enemies', () => {
            const p = Projectile.create(game, null, 'enemies', 1, 2, 5, 6, 'LEFT');
            expect(p.targets('enemy')).toEqual(false);
        });
    });

    describe('update()', () => {
        const goingOffScreenBehaviors: GoingOffScreenBehavior[] = [ 'completelyOffScreen', 'onEdgeTile' ];

        goingOffScreenBehaviors.forEach((behavior) => {
            describe(`when going off screen behavior is ${behavior}`, () => {
                it('moves projectile DOWN and sets done if out of bounds', () => {
                    const p = Projectile.create(game, null, 'enemies', 0, 0, 0, 100, 'DOWN');
                    p.setGoingOffScreenBehavior(behavior);
                    p.h = 8;
                    for (let i = 0; i < 100; i++) {
                        p.update();
                        if (p.done) break;
                    }
                    expect(p.done).toEqual(true);
                });

                it('moves projectile UP and sets done if out of bounds', () => {
                    const p = Projectile.create(game, null, 'enemies', 0, 0, 0, 0, 'UP');
                    p.setGoingOffScreenBehavior(behavior);
                    p.h = 8;
                    p.update();
                    expect(p.y).toBeLessThan(0);
                    if (p.y < -p.h) expect(p.done).toEqual(true);
                });

                it('moves projectile LEFT and sets done if out of bounds', () => {
                    const p = Projectile.create(game, null, 'enemies', 0, 0, 0, 0, 'LEFT');
                    p.setGoingOffScreenBehavior(behavior);
                    p.w = 8;
                    p.update();
                    expect(p.x).toBeLessThan(0);
                    if (p.x < -p.w) expect(p.done).toEqual(true);
                });

                it('moves projectile RIGHT and sets done if out of bounds', () => {
                    const p = Projectile.create(game, null, 'enemies', 0, 0, 300, 0, 'RIGHT');
                    p.setGoingOffScreenBehavior(behavior);
                    p.w = 8;
                    for (let i = 0; i < 100; i++) {
                        p.update();
                        if (p.done) break;
                    }
                    expect(p.done).toEqual(true);
                });
            });
        })

        it('sets hitBox correctly', () => {
            const p = Projectile.create(game, null, 'enemies', 0, 0, 10, 20, 'DOWN');
            p.w = 16;
            p.h = 16;
            const setSpy = vi.spyOn(p.hitBox, 'set');
            p.update();
            expect(setSpy).toHaveBeenCalledWith(p.x + 4, p.y + 3, 8, 10);
        });

        describe('when rendering an animation', () => {
            let animation: Animation;
            let p: Projectile;

            beforeEach(() => {
                animation = createAnimation(game, mockSpriteSheet);
                const animRenderInfo: AnimationProjectileRenderInfo = {
                    type: 'animation',
                    animation,
                }
                p = new Projectile(game, animRenderInfo, 0, 0, 'LEFT');
            });

            it('updates the animation', () => {
                const animUpdateSpy = vi.spyOn(animation, 'update').mockImplementation(() => {});
                p.update();
                expect(animUpdateSpy).toHaveBeenCalledOnce();
            });
        })
    });
});
