import { InputManager } from 'gtp';
import { BaseState } from './BaseState';
import { MainGameState } from './MainGameState';
import { InventorySlideState } from '@/InventorySlideState';
import { CANVAS_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH } from '@/Constants';

/**
 * State that renders the inventory state.
 */
export class InventoryState extends BaseState {
    private drawBox(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
        ctx.fillStyle = '#4040ef';
        ctx.fillRect(x + 1, y, w - 2, 2);
        ctx.fillRect(x + w - 2, y + 1, 2, h - 2);
        ctx.fillRect(x + 1, y + h - 2, w - 2, 2);
        ctx.fillRect(x, y + 1, 2, h - 2);
    }

    private drawTriforceOutline(ctx: CanvasRenderingContext2D, y: number) {
        const midX = SCREEN_WIDTH / 2;

        ctx.strokeStyle = '#f0cac2';
        ctx.lineWidth = 1.5;
        y += 0.5

        const ratio1 = 115 / 141.0;
        ctx.beginPath();
        ctx.moveTo(midX, y);
        ctx.lineTo(midX + 60, y + 60 * ratio1);
        ctx.lineTo(midX - 60, y + 60 * ratio1);
        ctx.closePath();
        ctx.stroke();

        const ratio2 = 162 / 195.0;
        const inset = 8;
        ctx.beginPath();
        ctx.moveTo(midX, y + 8);
        ctx.lineTo(midX + 60 - 18, y + (60 - inset - 2) * ratio2);
        ctx.lineTo(midX - 60 + 18, y + (60 - inset - 2) * ratio2);
        ctx.closePath();
        ctx.stroke();
    }

    override render(ctx: CanvasRenderingContext2D) {
        this.game.clearScreen();

        this.game.drawStringRed(32, 30, 'INVENTORY', ctx);
        this.drawBox(ctx, 58, 52, 28, 24);

        this.game.drawString(14, 80, 'USE B BUTTON', ctx);
        this.game.drawString(30, 90, 'FOR THIS', ctx);

        this.drawBox(ctx, 126, 52, CANVAS_WIDTH - 126 - 32, 95 - 52);

        this.drawTriforceOutline(ctx, 108);
        this.game.drawStringRed(94, 165, 'TRIFORCE', ctx);

        ctx.save();
        ctx.translate(0, SCREEN_HEIGHT);
        this.game.getHud().render(ctx);
        ctx.restore();
    }

    override update() {
        this.handleDefaultKeys();

        const im: InputManager = this.game.inputManager;

        if (im.enter(true)) {
            this.game.setState(new InventorySlideState(this.game, new MainGameState(this.game), this, false));
        }
    }
}
