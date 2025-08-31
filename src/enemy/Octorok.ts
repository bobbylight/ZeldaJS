import { Projectile } from '@/Projectile';
import { AbstractWalkingEnemy } from './AbstractWalkingEnemy';
import { ZeldaGame } from '@/ZeldaGame';
import { EnemyStrength } from './Enemy';
declare let game: ZeldaGame;

const CHANGE_DIR_TIMER_MAX = 120; // 2 seconds

/**
 * An octopus-like creature that can shoot rocks.
 */
export class Octorok extends AbstractWalkingEnemy {
    private static readonly PROJECTILE_THROWING_ODDS: readonly number[] = Object.freeze([ 240, 120 ]);

    constructor(strength: EnemyStrength = 'red') {
        super(0, strength, strength === 'blue' ? 2 : 1);
    }

    protected override createProjectile(): Projectile {
        return new Projectile(0, 12, this.x, this.y, this.dir);
    }

    protected getChangeDirTimerMax(): number {
        return CHANGE_DIR_TIMER_MAX;
    }

    protected getSpeed(): number {
        return this.strength === 'blue' ? 1 : 0.5;
    }

    /**
     * Returns whether this enemy "should" throw a projectile.  This method is for things like making sure a
     * certain number of ticks occur before re-throwing a projectile; whether the enemy is in a state to even
     * consider throwing a projectile should be handled by callers.
     *
     * @returns Whether this enemy should start throwing a projectile.
     */
    private shouldThrowProjectile(): boolean {
        return game.randomInt(Octorok.PROJECTILE_THROWING_ODDS[this.strength === 'blue' ? 1 : 0]) === 0;
    }

    override update() {
        if (!this.slidingDir && this.shouldThrowProjectile()) {
            this.pausedBeforeThrowingProjectile = 30;
        }

        super.update();
    }
}
