import { BaseState } from './BaseState';
import { MainGameState } from './MainGameState';
import { InputManager } from 'gtp';
import { InventorySlideState } from '@/InventorySlideState';

/**
 * State that renders the inventory state.
 */
export class InventoryState extends BaseState {
    override render(ctx: CanvasRenderingContext2D) {
        this.game.clearScreen();

        this.game.drawString(40, 40, 'INVENTORY GOES HERE', ctx);
    }

    override update() {
        this.handleDefaultKeys();

        const im: InputManager = this.game.inputManager;

        if (im.enter(true)) {
            this.game.setState(new InventorySlideState(this.game, new MainGameState(this.game), this, false));
        }
    }
}
