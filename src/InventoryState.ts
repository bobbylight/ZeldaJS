import { BaseState } from './BaseState';
import { CurtainOpeningState } from './CurtainOpeningState';
import { MainGameState } from './MainGameState';
import { ZeldaGame } from './ZeldaGame';
import { Game, InputManager } from 'gtp';
import { InventorySlideState } from '@/InventorySlideState';
declare let game: ZeldaGame;

/**
 * State that renders the inventory state.
 */
export class InventoryState extends BaseState {
    override enter() {
        super.enter(game);
    }

    override leaving(game: Game) {
    }

    override render(ctx: CanvasRenderingContext2D) {
        this.game.clearScreen();

        this.game.drawString(40, 40, 'INVENTORY GOES HERE', ctx);
    }

    startGame() {
        game.startNewGame();
        game.setState(new CurtainOpeningState(new MainGameState()));
    }

    override update(delta: number) {
        this.handleDefaultKeys();

        const im: InputManager = game.inputManager;

        if (im.enter(true)) {
            game.setState(new InventorySlideState(new MainGameState(this.game), this, false));
        }
    }
}
