module zelda {
    'use strict';

    export class MainGameState extends BaseState {

        private _lastScreen: Screen | undefined | null;
        private _screenSlidingDir: Direction | null;
        private _screenSlidingAmount: number;

        private static SCREEN_SLIDING_INC(): number {
            return 4;
        }

        changeScreenHorizontally(inc: number) {

            const map: Map = game.map;
            this._lastScreen = map.currentScreen;
            map.changeScreensHorizontally(inc);

            this._screenSlidingDir = inc > 0 ? Direction.LEFT : Direction.RIGHT;
            this._screenSlidingAmount = MainGameState.SCREEN_SLIDING_INC();
        }

        changeScreenVertically(inc: number) {

            const map: Map = game.map;
            this._lastScreen = map.currentScreen;
            map.changeScreensVertically(inc);

            this._screenSlidingDir = inc > 0 ? Direction.UP : Direction.DOWN;
            this._screenSlidingAmount = MainGameState.SCREEN_SLIDING_INC();
        }

        enter(game: gtp.Game) {
            super.enter(game);
            //game.inputManager.setResetKeyStateOnPoll(false);
            game.audio.playMusic(this.getGame().map.music, true);
            this._screenSlidingAmount = 0;
        }

        render(ctx: CanvasRenderingContext2D) {

            ctx.save();
            ctx.translate(0, 64);

            const currentScreen: Screen = game.map.currentScreen;

            if (this._screenSlidingDir) {

                switch (this._screenSlidingDir) {

                    case Direction.LEFT: // Scrolling "left" so Link goes right
                        ctx.translate(-this._screenSlidingAmount, 0);
                        this._lastScreen!.paint(ctx);
                        ctx.save();
                        ctx.translate(Constants.SCREEN_WIDTH, 0);
                        currentScreen.paint(ctx);
                        break;
                    case Direction.RIGHT: // Scrolling "right" so Link goes left
                        ctx.translate(this._screenSlidingAmount, 0);
                        this._lastScreen!.paint(ctx);
                        ctx.save();
                        ctx.translate(-Constants.SCREEN_WIDTH, 0);
                        currentScreen.paint(ctx);
                        break;
                    case Direction.UP:
                        ctx.translate(0, -this._screenSlidingAmount);
                        this._lastScreen!.paint(ctx);
                        ctx.save();
                        ctx.translate(0, Constants.SCREEN_HEIGHT);
                        currentScreen.paint(ctx);
                        break;
                    case Direction.DOWN:
                        ctx.translate(0, this._screenSlidingAmount);
                        this._lastScreen!.paint(ctx);
                        ctx.save();
                        ctx.translate(0, -Constants.SCREEN_HEIGHT);
                        currentScreen.paint(ctx);
                        break;
                }

                ctx.restore();

                game.link.paint(ctx);
            }

            else {
                // Not moving between screens
                currentScreen.paint(ctx);
                currentScreen.paintActors(ctx);
                game.link.paint(ctx);

                game.paintAnimations(ctx);
            }

            ctx.restore();

            const hudMockup: gtp.Image = <gtp.Image>game.assets.get('hud');
            hudMockup.draw(ctx, 0, 0);
        }

        update(delta: number) {

            if (this._screenSlidingAmount > 0) {

                game.link.updateWalkingStep();
                this._screenSlidingAmount += MainGameState.SCREEN_SLIDING_INC();

                if (this._screenSlidingAmount % 16 === 0) {
                    switch (this._screenSlidingDir) {
                        case Direction.LEFT: // Scrolling "left" so Link goes right
                            game.link.x += 1;
                            break;
                        case Direction.RIGHT: // Scrolling "right" so Link goes left
                            game.link.x -= 1;
                            break;
                        case Direction.UP: // Scrolling "up" so Link goes down
                            game.link.y += 1;
                            break;
                        case Direction.DOWN: // Scrolling "down" so Link goes up
                            game.link.y -= 1;
                            break;
                    }
                }

                if (DirectionUtil.isHorizontal(this._screenSlidingDir) && this._screenSlidingAmount === Constants.SCREEN_WIDTH) {
                    switch (this._screenSlidingDir) {
                        case Direction.LEFT:
                            game.link.x = 0;
                            break;
                        case Direction.RIGHT:
                            game.link.x = Constants.SCREEN_WIDTH - Constants.TILE_WIDTH;
                            break;
                    }
                    this._screenSlidingAmount = 0;
                    this._lastScreen = null;
                    this._screenSlidingDir = null;
                }

                else if (DirectionUtil.isVertical(this._screenSlidingDir) && this._screenSlidingAmount === Constants.SCREEN_HEIGHT) {
                    switch (this._screenSlidingDir) {
                        case Direction.UP:
                            game.link.y = 0;
                            break;
                        case Direction.DOWN:
                            game.link.y = Constants.SCREEN_HEIGHT - Constants.TILE_HEIGHT;
                            break;
                    }
                    this._screenSlidingAmount = 0;
                    this._lastScreen = null;
                    this._screenSlidingDir = null;
                }
            }

            // Only update enemies, etc. if Link isn't going down a stairwell
            else if (!game.link.isAnimationRunning()) {
                game.map.currentScreen.update();
                game.updateAnimations();
            }

            super.update(delta);

            if (this._screenSlidingAmount === 0) {
                game.link.handleInput(game.inputManager);
            }
            game.link.update();
        }
    }
}
