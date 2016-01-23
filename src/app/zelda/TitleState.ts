module zelda {
    'use strict';

    export class TitleState extends _BaseState {

        private _lastKeypressTime: number;

        /**
         * State that renders the title screen.
         * @constructor
         */
        constructor(args?: zelda.ZeldaGame | gtp.BaseStateArgs) {
            super(args);
        }

        enter() {

            super.enter(game);

            game.canvas.addEventListener('touchstart', this.handleStart, false);
            this._lastKeypressTime = game.playTime;
        }

        leaving(game: gtp.Game) {
            game.canvas.removeEventListener('touchstart', this.handleStart, false);
        }

        private getGame(): ZeldaGame {
            return <ZeldaGame>this.game;
        }

        handleStart() {
            console.log('Yee, touch detected!');
            this._startGame();
        }

        render(ctx: CanvasRenderingContext2D) {

            this.game.clearScreen();
            const w: number = game.getWidth();
            const h: number = game.getHeight();

            // Title banner
            const title: gtp.Image = game.assets.get('title');
            title.draw(ctx, 0, 0);

            if (!game.audio.isInitialized()) {
                this._renderNoSoundMessage();
            }

            game.link.paint(ctx);
        }

        _stringWidth(str: string): number {
            return game.assets.get('font').cellW * str.length;
        }

        private _renderNoSoundMessage() {

            let w: number = game.getWidth();

            let text: string = 'SOUND IS DISABLED AS';
            let x: number = (w - this._stringWidth(text)) / 2;
            let y: number = game.getHeight() - 20 - 9 * 3;
            this.getGame().drawString(x, y, text);
            text = 'YOUR BROWSER DOES NOT';
            x = ( w - this._stringWidth(text)) / 2;
            y += 9;
            this.getGame().drawString(x, y, text);
            text = 'SUPPORT WEB AUDIO';
            x = (w - this._stringWidth(text)) / 2;
            y += 9;
            this.getGame().drawString(x, y, text);
        }

        _startGame() {
            //game.startGame(this._choice);
        }

        update(delta: number) {

            this.handleDefaultKeys();
            game.link.handleInput(game.inputManager);

            let playTime: number = game.playTime;
            if (playTime > this._lastKeypressTime + _BaseState.INPUT_REPEAT_MILLIS + 100) {

                let im: gtp.InputManager = game.inputManager;

                if (im.enter(true)) {
                    this._startGame();
                }
            }

        }
    }
}
