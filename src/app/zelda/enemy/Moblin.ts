import { AbstractWalkingEnemy } from './AbstractWalkingEnemy';
import { Projectile } from '../Projectile';
import { ZeldaGame } from '../ZeldaGame';
import { EnemyStrength } from './Enemy';
declare let game: ZeldaGame;

const CHANGE_DIR_TIMER_MAX: number = 120; // 2 seconds

/**
 * A dog/pig-like enemy, commonly found in wooded areas.
 */
export class Moblin extends AbstractWalkingEnemy {

    private static readonly _PROJECTILE_THROWING_ODDS: number[] = [ 240, 120 ];

    constructor(strength: EnemyStrength = 'red') {
        super(4, strength, strength === 'blue' ? 3 : 2);
    }

    protected getChangeDirTimerMax(): number {
        return CHANGE_DIR_TIMER_MAX;
    }

    protected getSpeed(): number {
        return 0.5; //this.strength === 'blue' ? 1 : 0.5;
    }

    /**
     * Returns whether this enemy "should" throw a projectile.  This method is for things like making sure a
     * certain number of ticks occur before re-throwing a projectile; whether the enemy is in a state to even
     * consider throwing a projectile should be handled by callers.
     *
     * @returns {boolean} Whether this enemy should start throwing a projectile.
     */
    private shouldThrowProjectile(): boolean {
        return game.randomInt(Moblin._PROJECTILE_THROWING_ODDS[this.strength === 'blue' ? 1 : 0]) === 0;
    }

    protected throwProjectile() {
        // TODO: Make more abstract?  A createProjectile() method?
        const rock: Projectile = new Projectile(0, 12, this.x, this.y, this.dir);
        game.map.currentScreen.addActor(rock);
        console.log('adding rock');
    }

    update() {

        if (!this._slidingDir && this.shouldThrowProjectile()) {
            this.pausedBeforeThrowingProjectile = 30;
        }

        super.update();
    }
}
