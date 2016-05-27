module zelda {
    'use strict';

    /**
     * Base class for enemies that wander around a screen and cannot pass over physical objects.  Their speed and
     * change-direction behavior can be customized.
     */
    export abstract class AbstractWalkingEnemy extends Enemy {

        private _blue: boolean;
        private _changeDirTimer: number;
        private _ssRowOffset: number;

        constructor(ssRowOffset: number, blue: boolean = false, health: number = 1) {
            super(health);
            this._ssRowOffset = ssRowOffset;
            this._blue = blue;
            this.hitBox = new gtp.Rectangle();
            this._changeDirTimer = this.getChangeDirTimerMax();
        }

        protected _changeDirection() {
            this.dir = DirectionUtil.randomDir();
        }

        get blue(): boolean {
            return this._blue;
        }

        protected abstract getChangeDirTimerMax(): number;

        protected abstract getSpeed(): number;

        moveX(inc: number) {

            if ((this.x % 16) === 0 && this._changeDirTimer <= 0 && game.randomInt(8) === 0) {
                this._changeDirection();
                return;
            }

            const tempX: number = this.x + inc;
            this.hitBox.set(tempX, this.y, 16, 16);

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

            if ((this.x % 16) === 0 && (this.y % 16) === 0 && this._changeDirTimer <= 0 &&
                game.randomInt(8) === 0) {
                this._changeDirection();
                return;
            }

            const tempY: number = this.y + inc;
            this.hitBox.set(this.x, tempY, 16, 16);

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
            this.paintImpl(ctx, this.step + this._ssRowOffset, this._blue ? 4 : 0);
        }

        update() {

            if (this._slidingDir) {

                const speed: number = 4;
                switch (this._slidingDir) {
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

                if (--this._slideTick === 0) {
                    this.takingDamage = false;
                    this._slidingDir = null;
                }

                return;
            }

            this._touchStepTimer();

            const speed: number = this.getSpeed();
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