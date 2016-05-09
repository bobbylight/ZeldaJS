module zelda {
    'use strict';

    const CHANGE_DIR_TIMER_MAX: number = 120; // 2 seconds

    export class Moblin extends Enemy {

        private _blue: boolean;
        private _changeDirTimer: number;

        constructor(blue: boolean = false) {
            super(blue ? 2 : 1);
            this._blue = blue;
            this.hitBox = new gtp.Rectangle();
            this._changeDirTimer = CHANGE_DIR_TIMER_MAX;
        }

        private _changeDirection() {
            this.dir = DirectionUtil.randomDir();
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

            this.possiblyPaintHitBox(ctx);

            const row: number = 4 + this.step + (this._blue ? 2 : 0);
            const col: number = DirectionUtil.ordinal(this.dir);
            const index: number = row * 15 + col;
            const ss: gtp.SpriteSheet = <gtp.SpriteSheet>game.assets.get('enemies');
            ss.drawByIndex(ctx, this.x, this.y, index);
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

            const speed: number = this.blue ? 1 : 0.5;
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