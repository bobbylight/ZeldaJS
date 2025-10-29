import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HERO_HITBOX_STYLE } from '@/Constants';
import { ZeldaGame } from '@/ZeldaGame';
import { Link } from '@/Link';
import Image from 'gtp/lib/gtp/Image';
import { BombSmoke } from '@/BombSmoke';
import { Octorok } from '@/enemy/Octorok';
import { Direction } from '@/Direction';
import { Map } from '@/Map';
import { EnemyGroup } from '@/EnemyGroup';

const mockImage = {
    drawByIndex: vi.fn(),
};

const mockScreen = {
    checkForBombableWalls: vi.fn(),
    enemyGroup: new EnemyGroup(),
    paint: vi.fn(),
    paintCol: vi.fn(),
    paintRow: vi.fn(),
    paintTopLayer: vi.fn(),
};

describe('BombSmoke', () => {
    let game: ZeldaGame;
    let bombSmoke: BombSmoke;

    beforeEach(() => {
        game = new ZeldaGame();
        game.map = {
            currentScreen: mockScreen,
            // currentScreenRow: 1,
            // currentScreenCol: 1,
            // rowCount: 10,
            // colCount: 10,
            // getScreen: vi.fn(() => mockScreen),
            // getTileset: () => mockTileset,
            // tileset: mockTileset,
        } as unknown as Map;
        game.link = new Link(game);
        game.assets.set('link', mockImage as unknown as Image);
        bombSmoke = new BombSmoke(game, 'UP', 0, 0);
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('canDamageEnemies', () => {
        it('returns true until the expected frame count passes', () => {
            for (let frame = 1; frame <= 30; frame++) {
                bombSmoke.update();
                expect(bombSmoke.canDamageEnemies()).toEqual(true);
            }

            bombSmoke.update();
            expect(bombSmoke.canDamageEnemies()).toEqual(false);
        });
    });

    describe('collidedWith()', () => {
        it('always returns false', () => {
            const octorock = new Octorok(game);
            expect(bombSmoke.collidedWith(octorock)).equals(false);
        });
    });

    describe('getHitBoxStyle()', () => {
        it('returns the expected string', () => {
            expect(bombSmoke.getHitBoxStyle()).toEqual(HERO_HITBOX_STYLE);
        });
    });

    describe('paint()', () => {
        let ctx: CanvasRenderingContext2D;

        beforeEach(() => {
            ctx = game.getRenderingContext();
        });

        const directions: Direction[] = [ 'DOWN', 'LEFT', 'UP', 'RIGHT' ];
        directions.forEach((dir) => {
            it(`does not error painting ${dir}`, () => {
                bombSmoke.dir = dir;
                expect(() => {
                    bombSmoke.paint(ctx);
                }).not.toThrow();
            });
        });
    });

    describe('update()', () => {
        it('checks for bombable walls occasionally', () => {
            for (let frame = 0; frame < 29; frame++) {
                bombSmoke.update();
                expect(bombSmoke.done).toEqual(false);
            }
            expect(mockScreen.checkForBombableWalls).toHaveBeenCalledTimes(2);
        });

        it('sets the actor to "done" after 30 frames', () => {
            for (let frame = 0; frame < 29; frame++) {
                bombSmoke.update();
                expect(bombSmoke.done).toEqual(false);
            }

            bombSmoke.update();
            expect(bombSmoke.done).toEqual(true);
        });
    });
});
