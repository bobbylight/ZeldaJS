import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Rectangle, SpriteSheet } from 'gtp';
import { Actor, ActorData } from './Actor';
import { ZeldaGame } from './ZeldaGame';
import { Map } from '@/Map';

class TestActor extends Actor {
    override collidedWith(other: Actor): boolean {
        return false;
    }
    override paint(ctx: CanvasRenderingContext2D): void {}
    override update(): void {}
}

const mockSpriteSheet = {
    colCount: 8,
    rowCount: 4,
    size: 32,
    drawByIndex: vi.fn(),
} as unknown as SpriteSheet;


describe('Actor', () => {
    let game: ZeldaGame;
    let actor: TestActor;

    beforeEach(() => {
        game = new ZeldaGame();
        game.assets.set('overworld', mockSpriteSheet);
        actor = new TestActor(game);
        actor.hitBox = new Rectangle(0, 0, 16, 16);
        actor.frozen = false;
        actor.done = false;
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
        document.body.innerHTML = '';
    });

    describe('fromJson()', () => {
        it('sets fields from json', () => {
            const json: ActorData = {
                dir: 'LEFT',
                x: 5,
                y: 7,
                hitBox: new Rectangle(1, 2, 3, 4),
                frozen: true,
                done: true,
            };
            actor.fromJson(json);
            expect(actor.dir).toEqual('LEFT');
            expect(actor.x).toEqual(5);
            expect(actor.y).toEqual(7);
            expect(actor.hitBox).toEqual(json.hitBox);
            expect(actor.frozen).toEqual(true);
            expect(actor.done).toEqual(true);
        });
    });

    describe('getHitBoxStyle()', () => {
        it('returns red', () => {
            expect(actor.getHitBoxStyle()).toEqual('red');
        });
    });

    describe('intersects()', () => {
        it('returns true if hitboxes intersect', () => {
            const other = new TestActor(game);
            other.hitBox = new Rectangle(0, 0, 16, 16);
            vi.spyOn(actor.hitBox, 'intersects').mockReturnValue(true);
            expect(actor.intersects(other)).toEqual(true);
        });

        it('returns false if hitboxes do not intersect', () => {
            const other = new TestActor(game);
            other.hitBox = new Rectangle(100, 100, 16, 16);
            vi.spyOn(actor.hitBox, 'intersects').mockReturnValue(false);
            expect(actor.intersects(other)).toEqual(false);
        });
    });

    describe('isEntirelyOn()', () => {
        it('returns true if actor is entirely on the tile', () => {
            const tile = { row: 0, col: 0 };
            vi.spyOn(Rectangle.prototype, 'containsRect').mockReturnValue(true);
            expect(actor.isEntirelyOn(tile)).toEqual(true);
        });

        it('returns false if actor is not entirely on the tile', () => {
            const tile = { row: 0, col: 0 };
            vi.spyOn(Rectangle.prototype, 'containsRect').mockReturnValue(false);
            expect(actor.isEntirelyOn(tile)).toEqual(false);
        });
    });

    describe('isWalkingUpOnto()', () => {
        it('returns true if actor is moving up and edge is on tile', () => {
            actor.dir = 'UP';
            actor.hitBox = new Rectangle(16, 16, 16, 16);
            const tile = { row: 1, col: 1 };
            expect(actor.isWalkingUpOnto(tile)).toEqual(true);
        });

        it('returns false if not moving up', () => {
            actor.dir = 'DOWN';
            const tile = { row: 0, col: 0 };
            expect(actor.isWalkingUpOnto(tile)).toEqual(false);
        });

        it('returns false if not at tile edge', () => {
            actor.dir = 'UP';
            actor.hitBox = new Rectangle(0, 0, 16, 16);
            const tile = { row: 1, col: 1 };
            vi.spyOn(Rectangle.prototype, 'contains').mockReturnValue(false);
            expect(actor.isWalkingUpOnto(tile)).toEqual(false);
        });
    });

    describe('possiblyPaintHitBox()', () => {
        it('paints hitbox if getPaintHitBoxes returns true', () => {
            vi.spyOn(game, 'getPaintHitBoxes').mockReturnValue(true);
            const ctx = game.getRenderingContext();
            const strokeRectSpy = vi.spyOn(ctx, 'strokeRect');
            const fillRectSpy = vi.spyOn(ctx, 'fillRect');
            actor.hitBox = new Rectangle(1, 2, 3, 4);
            actor.possiblyPaintHitBox(ctx);
            expect(strokeRectSpy).toHaveBeenCalledOnce();
            expect(fillRectSpy).toHaveBeenCalledTimes(2);
        });

        it('does not paint the hitbox if it is 0 width and height', () => {
            vi.spyOn(game, 'getPaintHitBoxes').mockReturnValue(true);
            const ctx = game.getRenderingContext();
            const strokeRectSpy = vi.spyOn(ctx, 'strokeRect');
            const fillRectSpy = vi.spyOn(ctx, 'fillRect');
            actor.hitBox = new Rectangle();
            actor.possiblyPaintHitBox(ctx);
            expect(strokeRectSpy).not.toHaveBeenCalled();
            expect(fillRectSpy).not.toHaveBeenCalled();
        });

        it('does not paint hitbox if getPaintHitBoxes returns false', () => {
            vi.spyOn(game, 'getPaintHitBoxes').mockReturnValue(false);
            const ctx = game.getRenderingContext();
            const fillRectSpy = vi.spyOn(ctx, 'fillRect');
            actor.possiblyPaintHitBox(ctx);
            expect(fillRectSpy).not.toHaveBeenCalled();
        });
    });

    describe('removedFromScreen()', () => {
        it('does not throw an error if there is no removal callback', () => {
            game.map = new Map(game, 'overworld', 2, 2);
            const screen = game.map.currentScreen;
            expect(() => {
                actor.removedFromScreen(screen);
            }).not.toThrowError();
        });

        it('calls the removal callback if specified', () => {
            const onRemove = vi.fn();
            actor.setOnRemove(onRemove);
            game.map = new Map(game, 'overworld', 2, 2);
            const screen = game.map.currentScreen;
            actor.removedFromScreen(screen);
            expect(onRemove).toHaveBeenCalledExactlyOnceWith(screen);
        });
    });

    describe('setLocation()', () => {
        it('sets x and y', () => {
            actor.setLocation(42, 99);
            expect(actor.x).toEqual(42);
            expect(actor.y).toEqual(99);
        });
    });

    describe('toJson()', () => {
        it('returns a JSON representation', () => {
            actor.dir = 'RIGHT';
            actor.x = 1;
            actor.y = 2;
            actor.hitBox = new Rectangle(3, 4, 5, 6);
            actor.frozen = true;
            actor.done = false;
            const json = actor.toJson();
            expect(json).toEqual({
                dir: 'RIGHT',
                x: 1,
                y: 2,
                hitBox: actor.hitBox,
                frozen: true,
                done: false,
            });
        });
    });
});
