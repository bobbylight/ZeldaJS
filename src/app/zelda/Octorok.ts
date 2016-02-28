module zelda {
    'use strict';

    const STEP_TIMER_MAX: number = 10;
    const CHANGE_DIR_TIMER_MAX: number = 120; // 2 seconds

    export class Octorok extends Actor {

        private _step: number;
        private _blue: boolean;
        private _stepTimer: number;
        private _changeDirTimer: number;

        constructor(blue: boolean = false) {
            super();
            this._step = 0;
            this._blue = blue;
            this.hitBox = new gtp.Rectangle();
            this._stepTimer = STEP_TIMER_MAX;
            this._changeDirTimer = CHANGE_DIR_TIMER_MAX;
        }

        private _changeDirection() {
            this.dir = DirectionUtil.randomDir();
        }

        collidedWith(other: Actor): boolean {

            if (this.takingDamage) {
                return;
            }

            if (other instanceof Sword) {
                this.takingDamage = true;
                this.done = true;
                game.audio.playSound('enemyDie');
                game.addEnemyDiesAnimation(this.x, this.y);
            }
        }

        get step(): number {
            return this._step;
        }

        get blue(): boolean {
            return this._blue;
        }

        moveX(inc: number) {

            if ((this.x % 16) === 0 && this._changeDirTimer <= 0 && game.randomInt(8) === 0) {
                this._changeDirection();
                return;
            }

            const tempX: number = this.x + inc;
            this.hitBox.set(tempX, this.y, 16, 16);

            if (this.hitBox.x < 0 || (this.hitBox.x + this.hitBox.w) >= Constants.SCREEN_WIDTH) {
                this.dir = DirectionUtil.randomDir();
            }
            else if (this.isHitBoxWalkable()) {
                this.x = tempX;
            }
            else {
                this.dir = DirectionUtil.randomDir();
            }
        }

        moveY(inc: number) {

            if ((this.x % 16) === 0 && (this.y % 16) === 0 && this._changeDirTimer <= 0 &&
                    game.randomInt(8) === 0) {
                this._changeDirection();
                return;
            }

            const tempY: number = this.y + inc;
            this.hitBox.set(this.x, tempY, 16, 16);

            if (this.hitBox.y < 0 || (this.hitBox.y + this.hitBox.h) >= Constants.SCREEN_HEIGHT) {
                this._changeDirection();
            }
            else if (this.isHitBoxWalkable()) {
                this.y = tempY;
            }
            else {
                this._changeDirection();
            }
        }

        paint(ctx: CanvasRenderingContext2D) {

            if (game.paintHitBoxes) {
                ctx.fillStyle = 'pink';
                const hitBox: gtp.Rectangle = this.hitBox;
                ctx.fillRect(hitBox.x, hitBox.y, hitBox.w, hitBox.h);
            }

            const row: number = this._step + (this._blue ? 2 : 0);
            const col: number = DirectionUtil.ordinal(this.dir);
            const index: number = row * 15 + col;
            const ss: gtp.SpriteSheet = <gtp.SpriteSheet>game.assets.get('enemies');
            ss.drawByIndex(ctx, this.x, this.y, index);
        }

        private _touchStepTimer() {
            this._stepTimer--;
            if (this._stepTimer === 0) {
                this._step = (this._step + 1) % 2;
                this._stepTimer = STEP_TIMER_MAX;
            }
        }

        update() {

            this._touchStepTimer();

            const speed: number = this.blue ? 2 : 1;
            switch (this.dir) {
                case Direction.UP:
                    this.moveY(-speed);
                    break;
                case Direction.LEFT:
                    this.moveX(-speed);
                    break;
                case Direction.DOWN:
                    this.moveY(speed);
                    break;
                case Direction.RIGHT:
                    this.moveX(speed);
                    break;
            }

            this._changeDirTimer--;
        }
    }
}