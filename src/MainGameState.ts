import { Direction, DirectionUtil } from './Direction';
import { Constants } from './Constants';
import { BaseState } from './BaseState';
import { Screen } from './Screen';
import { Map } from './Map';
import { ZeldaGame } from './ZeldaGame';
import { BaseStateArgs } from 'gtp';
import { Hud } from './Hud';
import { ChangeScreenWarpEvent } from './event/ChangeScreenWarpEvent';
import { Event } from './event/Event';
declare let game: ZeldaGame;

export class MainGameState extends BaseState {

    private readonly _hud: Hud;
    private _lastScreen: Screen | undefined | null;
    private _screenSlidingDir: Direction | null;
    private _screenSlidingAmount: number;

    private static SCREEN_SLIDING_INC(): number {
        return 4;
    }

    constructor(args?: ZeldaGame | BaseStateArgs<ZeldaGame>) {
        super(args);
        this._hud = new Hud();
    }

    changeScreenHorizontally(inc: number) {

        const map: Map = game.map;
        this._lastScreen = map.currentScreen;
        map.changeScreensHorizontally(inc);

        this._screenSlidingDir = inc > 0 ? 'LEFT' : 'RIGHT';
        this._screenSlidingAmount = MainGameState.SCREEN_SLIDING_INC();
    }

    changeScreenVertically(inc: number) {

        const map: Map = game.map;
        const screen: Screen = map.currentScreen;

        const changeScreenWarpEvents: Event<any>[] = screen.events.filter((e: Event<any>) => {
            return e instanceof ChangeScreenWarpEvent;
        });
        if (changeScreenWarpEvents.length) {
            if (changeScreenWarpEvents.length > 1) {
                console.error(`More than one ChangeScreenWarpEvent for screen ${screen}!`);
            }
            changeScreenWarpEvents[0].execute();
            return;
        }

        this._lastScreen = screen;
        map.changeScreensVertically(inc);

        this._screenSlidingDir = inc > 0 ? 'UP' : 'DOWN';
        this._screenSlidingAmount = MainGameState.SCREEN_SLIDING_INC();
    }

    enter(game: ZeldaGame) {

        super.enter(game);
        //game.inputManager.setResetKeyStateOnPoll(false);

        const music: string | null | undefined = this.game.map.currentScreenMusic;
        if (music && music !== 'none') {
            game.audio.playMusic(music, true);
        }
        this._screenSlidingAmount = 0;
    }

    render(ctx: CanvasRenderingContext2D) {

        ctx.save();
        ctx.translate(0, 64);

        const currentScreen: Screen = game.map.currentScreen;

        if (this._screenSlidingDir) {

            switch (this._screenSlidingDir) {

                case 'LEFT': // Scrolling "left" so Link goes right
                    ctx.translate(-this._screenSlidingAmount, 0);
                    this._lastScreen!.paint(ctx);
                    ctx.save();
                    ctx.translate(Constants.SCREEN_WIDTH, 0);
                    currentScreen.paint(ctx);
                    break;
                case 'RIGHT': // Scrolling "right" so Link goes left
                    ctx.translate(this._screenSlidingAmount, 0);
                    this._lastScreen!.paint(ctx);
                    ctx.save();
                    ctx.translate(-Constants.SCREEN_WIDTH, 0);
                    currentScreen.paint(ctx);
                    break;
                case 'UP':
                    ctx.translate(0, -this._screenSlidingAmount);
                    this._lastScreen!.paint(ctx);
                    ctx.save();
                    ctx.translate(0, Constants.SCREEN_HEIGHT);
                    currentScreen.paint(ctx);
                    break;
                case 'DOWN':
                    ctx.translate(0, this._screenSlidingAmount);
                    this._lastScreen!.paint(ctx);
                    ctx.save();
                    ctx.translate(0, -Constants.SCREEN_HEIGHT);
                    currentScreen.paint(ctx);
                    break;
            }

            ctx.restore();

            game.link.paint(ctx);

            switch (this._screenSlidingDir) {

                case 'LEFT': // Scrolling "left" so Link goes right
                    this._lastScreen!.paintTopLayer(ctx);
                    ctx.translate(Constants.SCREEN_WIDTH, 0);
                    currentScreen.paintTopLayer(ctx);
                    break;
                case 'RIGHT': // Scrolling "right" so Link goes left
                    this._lastScreen!.paintTopLayer(ctx);
                    ctx.translate(-Constants.SCREEN_WIDTH, 0);
                    currentScreen.paintTopLayer(ctx);
                    break;
                case 'UP':
                    this._lastScreen!.paintTopLayer(ctx);
                    ctx.translate(0, Constants.SCREEN_HEIGHT);
                    currentScreen.paintTopLayer(ctx);
                    break;
                case 'DOWN':
                    this._lastScreen!.paintTopLayer(ctx);
                    ctx.translate(0, -Constants.SCREEN_HEIGHT);
                    currentScreen.paintTopLayer(ctx);
                    break;
            }
        }

        else {
            // Not moving between maps
            currentScreen.paint(ctx);
            currentScreen.paintActors(ctx);
            game.link.paint(ctx);
            currentScreen.paintTopLayer(ctx);

            game.paintAnimations(ctx);
        }

        ctx.restore();

        this._hud.render(ctx);
    }

    update(delta: number) {

        this.handleDefaultKeys();

        // If Link's in his dying animation, don't update anything
        if (game.link.done) {
            game.link.update();
            return;
        }

        if (this._screenSlidingAmount > 0) {
            this.updateScreenSlidingImpl();
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

    private updateScreenSlidingImpl() {

        game.link.updateWalkingStep();
        this._screenSlidingAmount += MainGameState.SCREEN_SLIDING_INC();

        const labyrinth: boolean = game.map.isLabyrinth();
        const linkMoveAmt: number = labyrinth ? 2 : 1;

        if (this._screenSlidingAmount % 16 === 0) {
            switch (this._screenSlidingDir) {
                case 'LEFT': // Scrolling "left" so Link goes right
                    game.link.x += linkMoveAmt;
                    break;
                case 'RIGHT': // Scrolling "right" so Link goes left
                    game.link.x -= linkMoveAmt;
                    break;
                case 'UP': // Scrolling "up" so Link goes down
                    game.link.y += linkMoveAmt;
                    break;
                case 'DOWN': // Scrolling "down" so Link goes up
                    game.link.y -= linkMoveAmt;
                    break;
            }
        }

        if (DirectionUtil.isHorizontal(this._screenSlidingDir)
            && this._screenSlidingAmount === Constants.SCREEN_WIDTH) {
            switch (this._screenSlidingDir) {
                case 'LEFT':
                    game.link.x = labyrinth ? Constants.TILE_WIDTH : 0;
                    break;
                case 'RIGHT':
                    game.link.x = Constants.SCREEN_WIDTH - Constants.TILE_WIDTH;
                    if (labyrinth) {
                        game.link.x -= Constants.TILE_WIDTH;
                    }
                    break;
            }
            this._screenSlidingAmount = 0;
            this._lastScreen = null;
            this._screenSlidingDir = null;
        }

        else if (DirectionUtil.isVertical(this._screenSlidingDir)
            && this._screenSlidingAmount === Constants.SCREEN_HEIGHT) {
            switch (this._screenSlidingDir) {
                case 'UP':
                    game.link.y = labyrinth ? Constants.TILE_HEIGHT : 0;
                    break;
                case 'DOWN':
                    game.link.y = Constants.SCREEN_HEIGHT - Constants.TILE_HEIGHT;
                    if (labyrinth) {
                        game.link.y -= Constants.TILE_HEIGHT;
                    }
                    break;
            }
            this._screenSlidingAmount = 0;
            this._lastScreen = null;
            this._screenSlidingDir = null;
        }
    }
}
