module zelda {
    'use strict';

    const STEP_TIMER_MAX: number = 10;

    export class Link extends Actor {

        anim: Animation;
        step: number;
        _stepTimer: number;
        _adjustToGridCounter: number;

        static FRAME_STILL: number = 0;
        static FRAME_STEP: number = 1;
        static FRAME_ACTION: number = 2;

        constructor() {
            super();
            this._stepTimer = STEP_TIMER_MAX;
            this.hitBox = new gtp.Rectangle();
            this.step = 0;
            this._adjustToGridCounter = 0;
        }

        collidedWith(other: Actor): boolean {
            // TODO: Take damage if it's an enemy
            return false;
        }

        handleInput(input: gtp.InputManager): boolean {

            if (this.frozen) {
                return false;
            }

            // Action buttons should take priority over moving
            else if (input.isKeyDown(gtp.Keys.KEY_Z)) {
                this._swingSword();
            }

            else if (input.up()) {
                this.moveY(-MOVE_AMT);
                if (this.dir !== Direction.UP) {
                    this.dir = Direction.UP;
                }
                else {
                    this._touchStepTimer();
                }
                return true;
            }

            else if (input.down()) {
                this.moveY(MOVE_AMT);
                if (this.dir !== Direction.DOWN) {
                    this.dir = Direction.DOWN;
                }
                else {
                    this._touchStepTimer();
                }
                return true;
            }

            else if (input.left()) {
                this.moveX(-MOVE_AMT);
                if (this.dir !== Direction.LEFT) {
                    this.dir = Direction.LEFT;
                }
                else {
                    this._touchStepTimer();
                }
                return true;
            }

            else if (input.right()) {
                this.moveX(MOVE_AMT);
                if (this.dir !== Direction.RIGHT) {
                    this.dir = Direction.RIGHT;
                }
                else {
                    this._touchStepTimer();
                }
                return true;
            }

            return false;
        }

        isAnimationRunning(): boolean {
            return this.anim != null;
        }

        private _isMovingHorizontally(hitBox: gtp.Rectangle): number {
            if (hitBox.x < 0) {
                return -1;
            }
            if ((hitBox.x + hitBox.w) >= Constants.TILE_WIDTH * Constants.SCREEN_COL_COUNT) {
                return 1;
            }
            return 0;
        }

        private _isMovingVertically(hitBox: gtp.Rectangle): number {
            if (hitBox.y < 0) {
                return -1;
            }
            if ((hitBox.y + hitBox.h) >= Constants.TILE_HEIGHT * Constants.SCREEN_ROW_COUNT) {
                return 1;
            }
            return 0;
        }

        moveX(inc: number) {

            const tempX: number = this.x + inc;
            this.hitBox.set(tempX + 2, this.y + 8, 16 - 2 * 2, 8);

            const movingHorizontally: number = this._isMovingHorizontally(this.hitBox);
            if (movingHorizontally !== 0) {
                this.x = tempX;
                const mgs: MainGameState = <MainGameState>game.state;
                mgs.changeScreenHorizontally(movingHorizontally);
            }
            else if (this.isHitBoxWalkable()) {
                this.x = tempX;
            }

            // Snapping to grid
            // TODO: This isn't right...
            const tileH: number = Constants.TILE_HEIGHT;
            const offset: number = this.y % tileH;
            console.log(this.x + ', ' + offset);
            if (offset !== 0) {

                const AMT: number = 3;

                if (offset <= AMT) {
                    if (this.isHitBoxWalkable(0, -1) && ++this._adjustToGridCounter === 1) {
                        console.log('Adjusting up: ' + offset);
                        this.y -= 1;
                        this._adjustToGridCounter = 0;
                    }
                }
                else if (this.isHitBoxWalkable(0, 1) && offset >= tileH - AMT) {
                    if (++this._adjustToGridCounter === 1) {
                        console.log('Adjusting down: ' + offset);
                        this.y += 1;
                        this._adjustToGridCounter = 0;
                    }
                }
            }

            this._refreshHitBox();
        }

        moveY(inc: number) {

            const tempY: number = this.y + inc;
            this.hitBox.set(this.x + 2, tempY + 8, 16 - 2 * 2, 8);

            const movingVertically: number = this._isMovingVertically(this.hitBox);
            if (movingVertically !== 0) {
                this.y = tempY;
                const mgs: MainGameState = <MainGameState>game.state;
                mgs.changeScreenVertically(movingVertically);
            }
            else if (this.isHitBoxWalkable()) {
                this.y = tempY;
            }

            // Snapping to grid
            // TODO: This isn't right...
            const tileW: number = Constants.TILE_WIDTH;
            const offset: number = this.x % tileW;
            //console.log(offset);
            if (offset !== 0) {

                const AMT: number = 3;

                if (offset <= AMT) {
                    if (this.isHitBoxWalkable(-1, 0) && ++this._adjustToGridCounter === 1) {
                        this.x -= 1;
                        this._adjustToGridCounter = 0;
                    }
                }
                else if (offset >= tileW - AMT) {
                    if (this.isHitBoxWalkable(1, 0) && ++this._adjustToGridCounter === 1) {
                        this.x += 1;
                        this._adjustToGridCounter = 0;
                    }
                }
            }

            this._refreshHitBox();
        }

        paint(ctx: CanvasRenderingContext2D) {

            this.possiblyPaintHitBox(ctx);

            if (this.anim) {
                this.anim.paint(ctx);
            }
            else {
                const ss: gtp.SpriteSheet = <gtp.SpriteSheet>game.assets.get('link');
                const row: number = this.step;
                const col: number = DirectionUtil.ordinal(this.dir);
                const index: number = row * 15 + col;
                ss.drawByIndex(ctx, this.x, this.y, index);
            }
        }

        private _refreshHitBox() {
            this.hitBox.set(this.x + 2, this.y + 8, 16 - 2 * 2, 8);
        }

        setAnimation(anim: Animation) {
            this.anim = anim;
            this.frozen = true;
            const self: Link = this;
            this.anim.addListener({
                animationFrameUpdate(animation: Animation) {
                },
                animationCompleted(animation: Animation) {
                    self.anim = null;
                    self.frozen = false;
                }
            });
        }

        setLocation(x: number, y: number) {
            super.setLocation(x, y);
            this._refreshHitBox();
        }

        private _swingSword() {

            game.audio.playSound('sword');

            const sword: Sword = new Sword();
            game.map.currentScreen.addActor(sword);
            this.frozen = true;
            this.step = Link.FRAME_ACTION;
        }

        private _touchStepTimer() {
            this._stepTimer--;
            if (this._stepTimer === 0) {
                this.step = (this.step + 1) % 2;
                this._stepTimer = STEP_TIMER_MAX;
            }
        }

        update() {
            if (this.anim) {
                this.anim.update();
            }
        }

        updateWalkingStep() {
            this._touchStepTimer();
        }
    }
}