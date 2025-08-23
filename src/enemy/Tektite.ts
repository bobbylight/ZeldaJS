import { SCREEN_COL_COUNT, SCREEN_HEIGHT, SCREEN_ROW_COUNT } from '../Constants';
import { Enemy, EnemyStrength } from './Enemy';
import { Screen } from '../Screen';
import { ZeldaGame } from '../ZeldaGame';
import { Rectangle } from 'gtp';
declare let game: ZeldaGame;

const TOP_MARGIN_ROWS = 2;
const MAX_PAUSE_TIME = 60;

/**
 * A spider-like enemy that jumps around.
 */
export class Tektite extends Enemy {
    private paused: boolean;
    private pauseOrJumpTime: number;
    private curJumpXInc: number;
    private curJumpAscentTime: number;
    private curJumpDescentTime: number;

    constructor(strength: EnemyStrength = 'red') {
        super(strength, strength === 'blue' ? 2 : 1, true);
        this.hitBox = new Rectangle();

        this.paused = true;
        this.pauseOrJumpTime = 0;
    }

    paint(ctx: CanvasRenderingContext2D) {
        this.paintImpl(ctx, this.getStep() + 8, this.strength === 'blue' ? 4 : 0);
    }

    private calculateJumpParameters() {
        const xSpeed = 0.5;
        const ySpeed = 1;
        const thisWidth = 16;
        const thisHeight = 16;

        let success = false;
        while (!success) {
            if (this.x < 32) { // Too close to left-hand side
                this.curJumpXInc = xSpeed;
            }
            else if (this.x > game.getWidth() - 32) { // Too close to right-hand side
                this.curJumpXInc = -xSpeed;
            }
            else {
                this.curJumpXInc = game.randomInt(2) === 0 ? xSpeed : -xSpeed;
            }
            this.curJumpAscentTime = 20 + game.randomInt(10);
            this.curJumpDescentTime = 10 + game.randomInt(30);

            const afterJumpX: number = this.x +
                this.curJumpXInc * (this.curJumpAscentTime + 3 + this.curJumpDescentTime);
            const afterJumpY: number = this.y - ySpeed * (this.curJumpAscentTime - this.curJumpDescentTime);

            success = afterJumpX >= 0 && afterJumpX < (game.getWidth() - thisWidth) &&
                    afterJumpY >= TOP_MARGIN_ROWS * 16 && afterJumpY < (SCREEN_HEIGHT - thisHeight);
            console.log(`... ${afterJumpX}, ${afterJumpY}`);
        }

        this.pauseOrJumpTime = 0;
    }

    override setLocationToSpawnPoint(screen: Screen) {
        while (true) {
            const x: number = game.randomInt(SCREEN_COL_COUNT) * 16;
            const y: number = (TOP_MARGIN_ROWS + game.randomInt(SCREEN_ROW_COUNT - TOP_MARGIN_ROWS)) * 16;
            if (screen.isWalkable(this, x, y)) {
                this.setLocation(x, y);
                return;
            }
        }
    }

    update() {
        if (this.slidingDir) {
            if (--this.slideTick === 0) {
                this.takingDamage = false;
                this.slidingDir = null;
            }
            return;
        }

        this.touchStepTimer();

        if (this.paused) {
            this.pauseOrJumpTime++;
            if (this.pauseOrJumpTime === MAX_PAUSE_TIME) {
                this.paused = false;
                this.calculateJumpParameters();
            }
        }
        else {
            this.pauseOrJumpTime++;

            this.x += this.curJumpXInc;
            if (this.pauseOrJumpTime < this.curJumpAscentTime) {
                this.y -= 1;
            }
            // eslint-disable-next-line no-empty
            else if (this.pauseOrJumpTime < this.curJumpAscentTime + 3) {
            }
            else if (this.pauseOrJumpTime < this.curJumpAscentTime + 3 + this.curJumpDescentTime) {
                this.y += 1;
            }
            else {
                this.paused = true;
                this.pauseOrJumpTime = 0;
            }

            this.hitBox.set(this.x, this.y, this.w, this.h);
        }
    }
}
