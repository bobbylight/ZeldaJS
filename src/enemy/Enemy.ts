import { Character } from '@/Character';
import { Actor } from '@/Actor';
import { SCREEN_COL_COUNT, SCREEN_ROW_COUNT } from '@/Constants';
import { ordinal } from '@/Direction';
import { Sword } from '@/Sword';
import { Screen } from '@/Screen';
import { ZeldaGame } from '@/ZeldaGame';
import { SpriteSheet } from 'gtp';
import { AbstractItem } from '@/item/AbstractItem';
declare let game: ZeldaGame;

const STEP_TIMER_MAX: number = 10;

export type EnemyStrength = 'red' | 'blue';

export abstract class Enemy extends Character {
    private readonly maxHealth: number;
    protected damage: number;

    private _step: number;
    private stepTimer: number;

    protected constructor(public strength: EnemyStrength = 'red',
                          protected health: number = 1,
                          private readonly alwaysFacesForward: boolean = false) {
        super();
        this.strength = strength;
        this.maxHealth = this.health;
        this.damage = strength === 'red' ? 1 : 2; // Sensible default damage

        this._step = 0;
        this.stepTimer = STEP_TIMER_MAX;

        this.alwaysFacesForward = alwaysFacesForward;
    }

    collidedWith(other: Actor): boolean {
        if (this.takingDamage) {
            return false;
        }

        if (other instanceof Sword) {
            if (--this.health === 0) {
                this.done = true;
                game.audio.playSound('enemyDie');
                game.addEnemyDiesAnimation(this.x, this.y);
                const item: AbstractItem | null = game.itemDropStrategy.itemDropped(this);
                if (item) {
                    game.map.currentScreen.addActor(item);
                }
                return true;
            }
            game.audio.playSound('enemyHit');
            this.takingDamage = true;
            this._slideTick = Character.MAX_SLIDE_TICK;
            this._slidingDir = other.dir;
        }

        return false;
    }

    getDamage(): number {
        return this.damage;
    }

    get enemyName(): string {
        return this.strength + this.constructor.name;
    }

    get step(): number {
        return this._step;
    }

    protected paintImpl(ctx: CanvasRenderingContext2D, row: number, colOffset: number) {
        this.possiblyPaintHitBox(ctx);

        let col: number = colOffset;
        if (!this.alwaysFacesForward) {
            col += ordinal(this.dir);
        }

        if (this._slideTick > 0) {
            switch (this._slideTick % 5) {
                case 0:
                    col %= 4;
                    break;
                case 1:
                    col = (col % 4) + 4;
                    break;
                case 2:
                    row += 2;
                    col %= 4;
                    break;
                case 3:
                    row += 2;
                    col = (col % 4) + 4;
                    break;
                case 4:
                    row += 2;
                    col = (col % 4) + 8;
                    break;
            }
        }

        const index: number = row * 15 + col;
        const ss: SpriteSheet = game.assets.get('enemies');
        ss.drawByIndex(ctx, this.x, this.y, index);
    }

    resetHealth() {
        this.health = this.maxHealth;
    }

    setLocationToSpawnPoint(screen: Screen) {
        while (true) {
            const x: number = game.randomInt(SCREEN_ROW_COUNT) * 16;
            const y: number = game.randomInt(SCREEN_COL_COUNT) * 16;
            if (screen.isWalkable(this, x, y)) {
                this.setLocation(x, y);
                return;
            }
        }
    }

    protected _touchStepTimer() {
        this.stepTimer--;
        if (this.stepTimer === 0) {
            this._step = (this._step + 1) % 2;
            this.stepTimer = STEP_TIMER_MAX;
        }
    }
}
