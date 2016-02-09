module zelda {
    'use strict';

    export class CurtainOpeningState extends gtp.State {

        private _mainState: MainGameState;
        private _delay: gtp.Delay;
        private _openAmount: number;

        /**
         * A transition into the main game state that mimics that in LoZ for the NES.  The screen is revealed
         * as if a curtain is being opened, 1/2 tile width on each side at a time.
         *
         * @param mainState The state to transition to when the animation is complete.
         */
        constructor(mainState: MainGameState) {
            super();
            this._mainState = mainState;
            this._openAmount = 0;
            const self: CurtainOpeningState = this;
            this._delay = new gtp.Delay({ millis: 70, loop: true, loopCount: 16,
                    callback: function() { self._delayCallback.call(self); } });
        }

        private _delayCallback() {
            this._openAmount++;
        }

        render(ctx: CanvasRenderingContext2D) {

            this._mainState.render(ctx);

            const displayedPixelCount: number = this._openAmount * Constants.TILE_WIDTH;
            const coveredPixelCount: number = Constants.SCREEN_WIDTH - displayedPixelCount;

            ctx.fillStyle = 'black';
            const y: number = Constants.HUD_HEIGHT;
            const h: number = Constants.SCREEN_HEIGHT;

            ctx.fillRect(0, y, coveredPixelCount / 2, h);
            ctx.fillRect(Constants.SCREEN_WIDTH - coveredPixelCount / 2, y, coveredPixelCount / 2, h);
        }

        update(delta: number) {

            super.update(delta);

            this._delay.update(delta);
            if (this._delay.isDone()) {
                game.setState(this._mainState);
            }
        }

    }
}