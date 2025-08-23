import { BaseState } from './BaseState';
import { CurtainOpeningState } from './CurtainOpeningState';
import { MainGameState } from './MainGameState';
import { ZeldaGame } from './ZeldaGame';
import { Game, Image, InputManager } from 'gtp';
declare let game: ZeldaGame;

export class TitleState extends BaseState {
    private lastKeypressTime: number;
    private boundHandleStart: () => void;

    override enter() {
        super.enter(game);
        this.boundHandleStart = this.handleStart.bind(this);
        game.canvas.addEventListener('touchstart', this.boundHandleStart, false);
        this.lastKeypressTime = game.playTime;
    }

    override leaving(game: Game) {
        game.canvas.removeEventListener('touchstart', this.boundHandleStart, false);
    }

    handleStart() {
        console.log('Yee, touch detected!');
        this.startGame();
    }

    override render(ctx: CanvasRenderingContext2D) {
        this.game.clearScreen();

        // Title banner
        const title: Image = game.assets.get('title');
        title.draw(ctx, 0, 0);

        if (!game.audio.isInitialized()) {
            this.renderNoSoundMessage();
        }
    }

    private renderNoSoundMessage() {
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
        game.startNewGame();
        game.setState(new CurtainOpeningState(new MainGameState()));
    }

    override update(delta: number) {
        this.handleDefaultKeys();

        const playTime: number = game.playTime;
        if (playTime > this.lastKeypressTime + BaseState.INPUT_REPEAT_MILLIS + 100) {
            const im: InputManager = game.inputManager;

            if (im.enter(true)) {
                this.startGame();
            }
        }
    }
}
