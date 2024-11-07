import { Constants } from '../Constants';
import { Enemy, EnemyStrength } from './Enemy';
import { Screen } from '../Screen';
import { ZeldaGame } from '../ZeldaGame';
import { Rectangle } from 'gtp';
declare let game: ZeldaGame;

const TOP_MARGIN_ROWS: number = 2;

/**
 * A spider-like enemy that jumps around.
 */
export class Tektite extends Enemy {
    private _paused: boolean;
    private _pauseOrJumpTime: number;
    private readonly _maxPauseTime: number = 60;
    private _curJumpXInc: number;
    private _curJumpAscentTime: number;
    private _curJumpDescentTime: number;

    constructor(strength: EnemyStrength = 'red') {
        super(strength, strength === 'blue' ? 2 : 1, true);
        this.hitBox = new Rectangle();

        this._paused = true;
        this._pauseOrJumpTime = 0;
    }

    paint(ctx: CanvasRenderingContext2D) {
        this.paintImpl(ctx, this.step + 8, this.strength === 'blue' ? 4 : 0);
    }

    private _calculateJumpParameters() {
        const xSpeed: number = 0.5;
        const ySpeed: number = 1;
        const thisWidth: number = 16;
        const thisHeight: number = 16;

        let success: boolean = false;
        while (!success) {
            if (this.x < 32) { // Too close to left-hand side
                this._curJumpXInc = xSpeed;
            }
            else if (this.x > game.getWidth() - 32) { // Too close to right-hand side
                this._curJumpXInc = -xSpeed;
            }
            else {
                this._curJumpXInc = game.randomInt(2) === 0 ? xSpeed : -xSpeed;
            }
            this._curJumpAscentTime = 20 + game.randomInt(10);
            this._curJumpDescentTime = 10 + game.randomInt(30);

            const afterJumpX: number = this.x +
                this._curJumpXInc * (this._curJumpAscentTime + 3 + this._curJumpDescentTime);
            const afterJumpY: number = this.y - ySpeed * (this._curJumpAscentTime - this._curJumpDescentTime);

            success = afterJumpX >= 0 && afterJumpX < (game.getWidth() - thisWidth) &&
                    afterJumpY >= TOP_MARGIN_ROWS * 16 && afterJumpY < (Constants.SCREEN_HEIGHT - thisHeight);
            console.log('... ' + afterJumpX + ', ' + afterJumpY);
        }

        this._pauseOrJumpTime = 0;
    }

    override setLocationToSpawnPoint(screen: Screen) {
        while (true) {
            const x: number = game.randomInt(Constants.SCREEN_COL_COUNT) * 16;
            const y: number = (TOP_MARGIN_ROWS + game.randomInt(Constants.SCREEN_ROW_COUNT - TOP_MARGIN_ROWS)) * 16;
            if (screen.isWalkable(this, x, y)) {
                this.setLocation(x, y);
                return;
            }
        }
    }

    update() {
        if (this._slidingDir) {
            if (--this._slideTick === 0) {
                this.takingDamage = false;
                this._slidingDir = null;
            }
            return;
        }

        this._touchStepTimer();

        if (this._paused) {
            this._pauseOrJumpTime++;
            if (this._pauseOrJumpTime === this._maxPauseTime) {
                this._paused = false;
                this._calculateJumpParameters();
            }
        }
        else {
            this._pauseOrJumpTime++;

            this.x += this._curJumpXInc;
            if (this._pauseOrJumpTime < this._curJumpAscentTime) {
                this.y -= 1;
            }
            // eslint-disable-next-line no-empty
            else if (this._pauseOrJumpTime < this._curJumpAscentTime + 3) {
            }
            else if (this._pauseOrJumpTime < this._curJumpAscentTime + 3 + this._curJumpDescentTime) {
                this.y += 1;
            }
            else {
                this._paused = true;
                this._pauseOrJumpTime = 0;
            }

            this.hitBox.set(this.x, this.y, this.w, this.h);
        }
    }
}
