import { AbstractWalkingEnemy } from './AbstractWalkingEnemy';
import { Projectile } from '../Projectile';
import { ZeldaGame } from '../ZeldaGame';
import { EnemyStrength } from './Enemy';
import { isVertical } from '../Direction';
declare let game: ZeldaGame;

const CHANGE_DIR_TIMER_MAX: number = 120; // 2 seconds

/**
 * A dog/pig-like enemy, commonly found in wooded areas.
 */
export class Moblin extends AbstractWalkingEnemy {
    private static readonly _PROJECTILE_THROWING_ODDS: number[] = [240, 120];

    constructor(strength: EnemyStrength = 'red') {
        super(4, strength, strength === 'blue' ? 3 : 2);
    }

    /**
     * Overridden to throw an arrow.
     */
    protected override createProjectile(): Projectile {
        const row: number = isVertical(this.dir) ? 5 : 4;
        const col: number = this.dir === 'LEFT' || this.dir === 'UP' ? 12 : 13;
        return new Projectile(row, col, this.x, this.y, this.dir);
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
        return game.randomInt(Moblin._PROJECTILE_THROWING_ODDS[this.strength === 'blue' ? 1 : 0]) === 0;
    }

    override update() {
        if (!this._slidingDir && this.shouldThrowProjectile()) {
            this.pausedBeforeThrowingProjectile = 30;
        }

        super.update();
    }
}
