module zelda {
    'use strict';

    const TOP_MARGIN_ROWS: number = 2;

    export class Tektite extends Enemy {

        private _blue: boolean;

        private _paused: boolean;
        private _pauseOrJumpTime: number;
        private _maxPauseTime: number = 60;
        private _curJumpXInc: number;
        private _curJumpAscentTime: number;
        private _curJumpDescentTime: number;

        constructor(blue: boolean = false) {
            super(blue ? 5 : 4, true); //2 : 1, true);
            this._blue = blue;
            this.hitBox = new gtp.Rectangle();

            this._paused = true;
            this._pauseOrJumpTime = 0;
        }

        get blue(): boolean {
            return this._blue;
        }

        paint(ctx: CanvasRenderingContext2D) {
            this.paintImpl(ctx, this.step + 8, this._blue ? 4 : 0);
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

                const afterJumpX: number = this.x + this._curJumpXInc * (this._curJumpAscentTime + 3 + this._curJumpDescentTime);
                const afterJumpY: number = this.y - ySpeed * (this._curJumpAscentTime - this._curJumpDescentTime);

                success = afterJumpX >= 0 && afterJumpX < (game.getWidth() - thisWidth) &&
                        afterJumpY >= TOP_MARGIN_ROWS * 16 && afterJumpY < (Constants.SCREEN_HEIGHT - thisHeight);
                console.log('... ' + afterJumpX + ', ' + afterJumpY);
            }

            this._pauseOrJumpTime = 0;
        }

        setLocationToSpawnPoint(screen: Screen) {
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

                const speed: number = 4;
                switch (this._slidingDir) {
                    // case Direction.UP:
                    //     this.moveY(-speed);
                    //     break;
                    // case Direction.LEFT:
                    //     this.moveX(-speed);
                    //     break;
                    // case Direction.DOWN:
                    //     this.moveY(speed);
                    //     break;
                    // case Direction.RIGHT:
                    //     this.moveX(speed);
                    //     break;
                }

                if (--this._slideTick === 0) {
                    this.takingDamage = false;
                    this._slidingDir = null;
                }

                return;
            }

            this._touchStepTimer();

            const speed: number = this.blue ? 1 : 0.5;
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
                else if (this._pauseOrJumpTime < this._curJumpAscentTime + 3) {
                }
                else if (this._pauseOrJumpTime < this._curJumpAscentTime + 3 + this._curJumpDescentTime) {
                    this.y += 1;
                }
                else {
                    this._paused = true;
                    this._pauseOrJumpTime = 0;
                }
            }
        }
    }
}