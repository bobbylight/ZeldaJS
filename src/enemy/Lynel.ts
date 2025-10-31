import { AbstractWalkingEnemy } from './AbstractWalkingEnemy';
import { EnemyStrength } from './Enemy';
import { Projectile } from '@/Projectile';
import { ZeldaGame } from '@/ZeldaGame';
import { isVertical } from '@/Direction';

const CHANGE_DIR_TIMER_MAX = 120; // 2 seconds

/**
 * Sword-wielding centaur enemies that live on Death Mountain.
 */
export class Lynel extends AbstractWalkingEnemy {
    private static readonly PROJECTILE_THROWING_ODDS: number[] = [ 240, 120 ];

    constructor(game: ZeldaGame, strength: EnemyStrength = 'red') {
        super(game, 12, strength, strength === 'blue' ? 4 : 3);
        this.damage = strength === 'blue' ? 4 : 2;
    }

    /**
     * Overridden to throw a sword.
     */
    protected override createProjectile(): Projectile {
        const row: number = isVertical(this.dir) ? 5 : 4;
        const col: number = this.dir === 'LEFT' || this.dir === 'UP' ? 12 : 13;
        const projectile = Projectile.create(this.game, this, 'enemies', row, col, this.x, this.y, this.dir);
        projectile.setDamage(2);
        return projectile;
    }

    protected getChangeDirTimerMax(): number {
        return CHANGE_DIR_TIMER_MAX;
    }

    protected getSpeed(): number {
        return 0.5; // this.strength === 'blue' ? 1 : 0.5;
    }

    /**
     * Returns whether this enemy "should" throw a projectile.  This method is for things like making sure a
     * certain number of ticks occur before re-throwing a projectile; whether the enemy is in a state to even
     * consider throwing a projectile should be handled by callers.
     *
     * @returns Whether this enemy should start throwing a projectile.
     */
    private shouldThrowProjectile(): boolean {
        return this.game.randomInt(Lynel.PROJECTILE_THROWING_ODDS[this.strength === 'blue' ? 1 : 0]) === 0;
    }

    override update() {
        if (!this.slidingDir && this.shouldThrowProjectile()) {
            this.pausedBeforeThrowingProjectile = 30;
        }

        super.update();
    }
}
