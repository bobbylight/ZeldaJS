import { BaseState } from './BaseState';
import { CurtainOpeningState } from './CurtainOpeningState';
import { MainGameState } from './MainGameState';
import { ZeldaGame } from './ZeldaGame';
import { Image, InputManager } from 'gtp';

export class TitleState extends BaseState {
    private lastKeypressTime: number;
    private boundHandleStart: () => void;

    override enter(game: ZeldaGame) {
        super.enter(game);
        this.boundHandleStart = this.handleStart.bind(this);
        game.canvas.addEventListener('touchstart', this.boundHandleStart, false);
        this.lastKeypressTime = game.playTime;
    }

    override leaving(game: ZeldaGame) {
        game.canvas.removeEventListener('touchstart', this.boundHandleStart, false);
    }

    handleStart() {
        console.log('Yee, touch detected!');
        this.startGame();
    }

    override render(ctx: CanvasRenderingContext2D) {
        this.game.clearScreen();

        // Title banner
        const title: Image = this.game.assets.get('title');
        title.draw(ctx, 0, 0);

        if (!this.game.audio.isInitialized()) {
            this.renderNoSoundMessage();
        }
    }

    private renderNoSoundMessage() {
        const game = this.game;
        const w: number = game.getWidth();

        let text = 'SOUND IS DISABLED AS';
        let x: number = (w - this.stringWidth(text)) / 2;
        let y: number = game.getHeight() - 20 - 9 * 3;
        this.game.drawString(x, y, text);
        text = 'YOUR BROWSER DOES NOT';
        x = (w - this.stringWidth(text)) / 2;
        y += 9;
        this.game.drawString(x, y, text);
        text = 'SUPPORT WEB AUDIO';
        x = (w - this.stringWidth(text)) / 2;
        y += 9;
        this.game.drawString(x, y, text);
    }

    startGame() {
        this.game.startNewGame();
        this.game.setState(new CurtainOpeningState(this.game, new MainGameState(this.game)));
    }

    override update(delta: number) {
        this.handleDefaultKeys();
        const game = this.game;

        const playTime: number = game.playTime;
        if (playTime > this.lastKeypressTime + BaseState.INPUT_REPEAT_MILLIS + 100) {
            const im: InputManager = game.inputManager;

            if (im.enter(true)) {
                this.startGame();
            }
        }
    }
}
