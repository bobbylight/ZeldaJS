import { BaseState } from './BaseState';
import { MainGameState } from './MainGameState';
import { InputManager } from 'gtp';
import { InventorySlideState } from '@/InventorySlideState';
import { CurtainOpeningState } from '@/CurtainOpeningState';

/**
 * State that renders the inventory state.
 */
export class InventoryState extends BaseState {
    override render(ctx: CanvasRenderingContext2D) {
        this.game.clearScreen();

        this.game.drawString(40, 40, 'INVENTORY GOES HERE', ctx);
    }

    startGame() {
        this.game.startNewGame();
        this.game.setState(new CurtainOpeningState(this.game, new MainGameState(this.game)));
    }

    override update(delta: number) {
        this.handleDefaultKeys();

        const im: InputManager = this.game.inputManager;

        if (im.enter(true)) {
            this.game.setState(new InventorySlideState(new MainGameState(this.game), this, false));
        }
    }
}
