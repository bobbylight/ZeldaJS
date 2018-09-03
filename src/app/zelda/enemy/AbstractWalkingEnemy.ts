import { DirectionUtil } from '../Direction';
import { Constants } from '../Constants';
import { Actor } from '../Actor';
import { Enemy, EnemyStrength } from './Enemy';
import { ZeldaGame } from '../ZeldaGame';
import { Rectangle } from 'gtp';
import { Projectile } from '../Projectile';
declare let game: ZeldaGame;

/**
 * Base class for enemies that wander around a screen and cannot pass over physical objects.  Their speed and
 * change-direction behavior can be customized.
 */
export abstract class AbstractWalkingEnemy extends Enemy {

    private _changeDirTimer: number;
    private readonly _ssRowOffset: number;
    protected pausedBeforeThrowingProjectile: number;

    protected constructor(ssRowOffset: number, strength: EnemyStrength = 'red', health: number = 1) {
        super(strength, health);
        this._ssRowOffset = ssRowOffset;
        this.hitBox = new Rectangle();
        this._changeDirTimer = this.getChangeDirTimerMax();
        this.pausedBeforeThrowingProjectile = -1;
    }

    protected _changeDirection() {
        this.dir = DirectionUtil.randomDir();
    }

    collidedWith(other: Actor): boolean {

        // An enemy hit when pausing before throwing a projectile won't throw it
        if (this.pausedBeforeThrowingProjectile > -1) {
            this.pausedBeforeThrowingProjectile = -1;
        }

        return super.collidedWith(other);
    }

    /**
     * Creates a projectile thrown by this enemy.  The default implementation returns <code>null</code>, denoting
     * that this enemy does not throw projectiles.
     */
    protected createProjectile(): Projectile | null {
        return null;
    }

    protected abstract getChangeDirTimerMax(): number;

    protected abstract getSpeed(): number;

    moveX(inc: number) {

        if (this.x % 16 === 0 && this._changeDirTimer <= 0 && game.randomInt(8) === 0) {
            this._changeDirection();
            return;
        }

        const tempX: number = this.x + inc;
        this.hitBox.set(tempX, this.y, this.w, this.h);

        if (this.hitBox.x < 0 || (this.hitBox.x + this.hitBox.w) >= Constants.SCREEN_WIDTH &&
            !this._slidingDir) {
            this._changeDirection();
        }
        else if (this.isHitBoxWalkable()) {
            this.x = tempX;
        }
        else if (!this._slidingDir) { // Not sliding, just walked into a wall
            this._changeDirection();
        }
    }

    moveY(inc: number) {

        if (this.x % 16 === 0 && this.y % 16 === 0 && this._changeDirTimer <= 0 &&
            game.randomInt(8) === 0) {
            this._changeDirection();
            return;
        }

        const tempY: number = this.y + inc;
        this.hitBox.set(this.x, tempY, this.w, this.h);

        if (this.hitBox.y < 0 || (this.hitBox.y + this.hitBox.h) >= Constants.SCREEN_HEIGHT &&
            !this._slidingDir) {
            this._changeDirection();
        }
        else if (this.isHitBoxWalkable()) {
            this.y = tempY;
        }
        else if (!this._slidingDir) { // Not sliding, just walked into a wall
            this._changeDirection();
        }
    }

    paint(ctx: CanvasRenderingContext2D) {
        this.paintImpl(ctx, this.step + this._ssRowOffset, this.strength === 'blue' ? 4 : 0);
    }

    /**
     * Throws a projectile, if an enemy is capable of doing so.  This method can be
     * called directly, or it will be implicitly called after a specific number of
     * frames of the enemy being "paused" if pausedBeforeThrowingProjectile is set
     * to something greater than 0.<p>
     *
     * The default implementation does nothing.  Subclasses should override if an
     * enemy type can throw a projectile.
     */
    protected throwProjectile() {
        const projectile: Projectile | null = this.createProjectile();
        if (projectile) {
            game.map.currentScreen.addActor(projectile);
        }
    }

    update() {

        if (this._slidingDir) {
            this.updateSlide();
            return;
        }

        this._touchStepTimer();

        if (this.pausedBeforeThrowingProjectile > -1) {
            this.pausedBeforeThrowingProjectile--;
            // Projectile is thrown at frame 0, enemy is unfrozen on frame -1
            if (this.pausedBeforeThrowingProjectile === 0) {
                this.throwProjectile();
            }
            return;
        }

        const speed: number = this.getSpeed();
        switch (this.dir) {
            case 'UP':
                this.moveY(-speed);
                break;
            case 'LEFT':
                this.moveX(-speed);
                break;
            case 'DOWN':
                this.moveY(speed);
                break;
            case 'RIGHT':
                this.moveX(speed);
                break;
        }

        this._changeDirTimer--;
    }

    // TODO: Share with Link?
    protected updateSlide() {

        const speed: number = 4;
        switch (this._slidingDir) {
            case 'UP':
                this.moveY(-speed);
                break;
            case 'LEFT':
                this.moveX(-speed);
                break;
            case 'DOWN':
                this.moveY(speed);
                break;
            case 'RIGHT':
                this.moveX(speed);
                break;
        }

        if (--this._slideTick === 0) {
            this.takingDamage = false;
            this._slidingDir = null;
        }
    }
}
