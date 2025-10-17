import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Bomb } from './Bomb';
import { Link } from './Link';
import { Map } from './Map';
import { ZeldaGame } from './ZeldaGame';
import { Octorok } from './enemy/Octorok';
import Image from 'gtp/lib/gtp/Image';
import { HERO_HITBOX_STYLE } from '@/Constants';

const mockImage = {
    draw: vi.fn(),
};

describe('Bomb', () => {
    let game: ZeldaGame;
    let bomb: Bomb;

    beforeEach(() => {
        game = new ZeldaGame();
        game.link = new Link(game);
        game.assets.set('treasures.bomb', mockImage as unknown as Image);
        bomb = new Bomb(game);
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe("is placed based on Link's direction", () => {
        describe('when Link is facing DOWN', () => {
            beforeEach(() => {
                game.link.dir = 'DOWN';
                bomb = new Bomb(game);
            });
            it('places bomb below Link', () => {
                expect(bomb.x).toBeGreaterThan(game.link.x);
                expect(bomb.y).toBeGreaterThan(game.link.y);
            });
        });

        describe('when Link is facing LEFT', () => {
            beforeEach(() => {
                game.link.dir = 'LEFT';
                bomb = new Bomb(game);
            });
            it('places bomb to the left of Link', () => {
                expect(bomb.x).toBeLessThan(game.link.x);
                expect(bomb.y).toEqual(game.link.y);
            });
        });

        describe('when Link is facing UP', () => {
            beforeEach(() => {
                game.link.dir = 'UP';
                bomb = new Bomb(game);
            });
            it('places bomb above Link', () => {
                expect(bomb.x).toBeGreaterThan(game.link.x);
                expect(bomb.y).toBeLessThan(game.link.y);
            });
        });

        describe('when Link is facing RIGHT', () => {
            beforeEach(() => {
                game.link.dir = 'RIGHT';
                bomb = new Bomb(game);
            });
            it('places bomb to the right of Link', () => {
                expect(bomb.x).toBeGreaterThan(game.link.x);
                expect(bomb.y).toEqual(game.link.y);
            });
        });
    });

    describe('collidedWith()', () => {
        it('always returns false', () => {
            const other = new Octorok(game);
            expect(bomb.collidedWith(other)).toEqual(false);
        });
    });

    describe('getHitBoxStyle()', () => {
        it('returns the expected string', () => {
            expect(bomb.getHitBoxStyle()).toEqual(HERO_HITBOX_STYLE);
        });
    });

    describe('update()', () => {
        it('unfreezes link at frame === MAX_FRAME - 16', () => {
            game.link.frozen = true;
            for (let i = 0; i < 16; i++) {
                expect(game.link.frozen).toEqual(true);
                bomb.update();
            }
            expect(game.link.frozen).toEqual(false);
            expect(game.link.step).toEqual(Link.FRAME_STILL);
        });

        it('sets done and plays sound at frame === 0', () => {
            const addActorSpy = vi.fn();
            game.map = {
                currentScreen: {
                    addActor: addActorSpy,
                },
            } as unknown as Map;
            const playSoundSpy = vi.spyOn(game.audio, 'playSound');

            for (let i = 0; i < 60; i++) {
                expect(playSoundSpy).not.toHaveBeenCalled();
                bomb.update();
            }
            expect(playSoundSpy).toHaveBeenCalledExactlyOnceWith('bombBlow');
            expect(addActorSpy).toHaveBeenCalledOnce();
            expect(bomb.done).toEqual(true);
        });
    });
});
