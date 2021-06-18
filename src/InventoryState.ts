import { BaseState } from './BaseState';
import { CurtainOpeningState } from './CurtainOpeningState';
import { MainGameState } from './MainGameState';
import { ZeldaGame } from './ZeldaGame';
import { BaseStateArgs, Game, InputManager } from 'gtp';
import { InventorySlideState } from '@/InventorySlideState';
declare let game: ZeldaGame;

export class InventoryState extends BaseState {

    /**
     * State that renders the title screen.
     */
    constructor(args?: ZeldaGame | BaseStateArgs<ZeldaGame>) {
        super(args);
    }

    enter() {

        super.enter(game);
    }

    leaving(game: Game) {
    }

    render(ctx: CanvasRenderingContext2D) {

        this.game.clearScreen();

        this.game.drawString(40, 40, 'INVENTORY GOES HERE', ctx);
    }

    _startGame() {
        game.startNewGame();
        game.setState(new CurtainOpeningState(new MainGameState()));
    }

    update(delta: number) {

        this.handleDefaultKeys();

        const im: InputManager = game.inputManager;

        if (im.enter(true)) {
            game.setState(new InventorySlideState(new MainGameState(this.game), this, false));
        }

    }
}
