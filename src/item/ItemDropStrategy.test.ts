import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Heart } from './Heart';
import { ItemDropStrategy } from './ItemDropStrategy';
import { Rupee } from './Rupee';
import { ZeldaGame } from '@/ZeldaGame';
import { Link } from '@/Link';
import { Octorok } from '@/enemy/Octorok';
import { Lynel } from '@/enemy/Lynel';
import { Tektite } from '@/enemy/Tektite';

const mockImage = {
    draw: vi.fn(),
};

describe('ItemDropStrategy', () => {
    let game: ZeldaGame;
    let strategy: ItemDropStrategy;

    beforeEach(() => {
        game = new ZeldaGame();
        game.assets.set('treasures.yellowRupee', mockImage);
        game.assets.set('treasures.blueRupee', mockImage);
        game.assets.set('treasures.redRupee', mockImage);
        game.link = new Link(game);
        strategy = new ItemDropStrategy();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('itemDropped()', () => {
        it('returns a Rupee for a known enemy class and cycles drop table', () => {
            const enemy = new Octorok(game, 'red');
            enemy.x = 10;
            enemy.y = 20;
            const item1 = strategy.itemDropped(enemy);
            expect(item1).toBeInstanceOf(Rupee);
            expect(item1?.x).toEqual(10);
            expect(item1?.y).toEqual(20);

            const item2 = strategy.itemDropped(enemy);
            expect(item2).toBeInstanceOf(Heart);
            expect(item2?.x).toEqual(10);
            expect(item2?.y).toEqual(20);
        });

        it('returns a Rupee for unknown enemy class (falls back to class A)', () => {
            const enemy = new Octorok(game);
            vi.spyOn(enemy, 'enemyName', 'get').mockReturnValue('unknownEnemy');
            enemy.x = 1;
            enemy.y = 2;
            const item = strategy.itemDropped(enemy);
            expect(item).toBeInstanceOf(Rupee);
            expect(item?.x).toEqual(1);
            expect(item?.y).toEqual(2);
        });

        it('returns null if drop table entry is null', () => {
            // Class B, first entry is null
            const enemy = new Lynel(game, 'blue');
            enemy.x = 5;
            enemy.y = 6;
            const item = strategy.itemDropped(enemy);
            expect(item).toEqual(null);
        });

        it('returns blue Rupee for blueRupee drop', () => {
            const enemy = new Tektite(game, 'blue'); // Class C
            enemy.x = 7;
            enemy.y = 8;
            // Advance counter to 3, which is 'blueRupee' in class C
            for (let i = 0; i < 3; i++) {
                strategy.itemDropped(enemy);
            }
            const item = strategy.itemDropped(enemy);
            expect(item).toBeInstanceOf(Rupee);
            if (item instanceof Rupee) {
                expect(item.getRupeeCount()).toEqual(5);
            }
        });

        it('cycles the drop table after 10 calls', () => {
            const enemy = new Octorok(game, 'red');
            enemy.x = 2;
            enemy.y = 3;
            for (let i = 0; i < 10; i++) {
                strategy.itemDropped(enemy);
            }
            const item = strategy.itemDropped(enemy);
            expect(item).toBeInstanceOf(Rupee);
            expect(item?.x).toEqual(2);
            expect(item?.y).toEqual(3);
        });
    });
});
