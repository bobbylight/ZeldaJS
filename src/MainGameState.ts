import { Direction, isHorizontal, isVertical } from './Direction';
import { SCREEN_HEIGHT, SCREEN_WIDTH, TILE_HEIGHT, TILE_WIDTH } from './Constants';
import { BaseState } from './BaseState';
import { Screen } from './Screen';
import { Map } from './Map';
import { ZeldaGame } from './ZeldaGame';
import { BaseStateArgs } from 'gtp';
import { Hud } from './Hud';
import { ChangeScreenWarpEvent } from './event/ChangeScreenWarpEvent';
import { Event, EventData } from './event/Event';
import { InventoryState } from '@/InventoryState';
import { InventorySlideState } from '@/InventorySlideState';
declare let game: ZeldaGame;

const SCREEN_SLIDING_INC = 4;

export class MainGameState extends BaseState {
    private readonly hud: Hud;
    private lastScreen: Screen | undefined | null;
    private screenSlidingDir: Direction | null;
    private screenSlidingAmount: number;

    constructor(args?: ZeldaGame | BaseStateArgs<ZeldaGame>) {
        super(args);
        this.hud = new Hud();
    }

    changeScreenHorizontally(inc: number) {
        const map: Map = game.map;
        this.lastScreen = map.currentScreen;
        map.changeScreensHorizontally(inc);

        this.screenSlidingDir = inc > 0 ? 'LEFT' : 'RIGHT';
        this.screenSlidingAmount = SCREEN_SLIDING_INC;
    }

    changeScreenVertically(inc: number) {
        const map: Map = game.map;
        const screen: Screen = map.currentScreen;

        const changeScreenWarpEvents: Event<EventData>[] = screen.events.filter((e: Event<EventData>) => {
            return e instanceof ChangeScreenWarpEvent;
        });
        if (changeScreenWarpEvents.length) {
            if (changeScreenWarpEvents.length > 1) {
                console.error(`More than one ChangeScreenWarpEvent for screen ${screen.toString()}!`);
            }
            changeScreenWarpEvents[0].execute();
            return;
        }

        this.lastScreen = screen;
        map.changeScreensVertically(inc);

        this.screenSlidingDir = inc > 0 ? 'UP' : 'DOWN';
        this.screenSlidingAmount = SCREEN_SLIDING_INC;
    }

    override enter(game: ZeldaGame) {
        super.enter(game);
        // game.inputManager.setResetKeyStateOnPoll(false);

        const music: string | null | undefined = this.game.map.currentScreenMusic;
        if (music && music !== 'none') {
            game.audio.playMusic(music, true);
        }
        this.screenSlidingAmount = 0;
    }

    override render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(0, 64);

        const currentScreen: Screen = game.map.currentScreen;

        if (this.screenSlidingDir) {
            switch (this.screenSlidingDir) {
                case 'LEFT': // Scrolling "left" so Link goes right
                    ctx.translate(-this.screenSlidingAmount, 0);
                    this.lastScreen?.paint(ctx);
                    ctx.save();
                    ctx.translate(SCREEN_WIDTH, 0);
                    currentScreen.paint(ctx);
                    break;
                case 'RIGHT': // Scrolling "right" so Link goes left
                    ctx.translate(this.screenSlidingAmount, 0);
                    this.lastScreen?.paint(ctx);
                    ctx.save();
                    ctx.translate(-SCREEN_WIDTH, 0);
                    currentScreen.paint(ctx);
                    break;
                case 'UP':
                    ctx.translate(0, -this.screenSlidingAmount);
                    this.lastScreen?.paint(ctx);
                    ctx.save();
                    ctx.translate(0, SCREEN_HEIGHT);
                    currentScreen.paint(ctx);
                    break;
                case 'DOWN':
                    ctx.translate(0, this.screenSlidingAmount);
                    this.lastScreen?.paint(ctx);
                    ctx.save();
                    ctx.translate(0, -SCREEN_HEIGHT);
                    currentScreen.paint(ctx);
                    break;
            }

            ctx.restore();

            game.link.paint(ctx);

            switch (this.screenSlidingDir) {
                case 'LEFT': // Scrolling "left" so Link goes right
                    this.lastScreen?.paintTopLayer(ctx);
                    ctx.translate(SCREEN_WIDTH, 0);
                    currentScreen.paintTopLayer(ctx);
                    break;
                case 'RIGHT': // Scrolling "right" so Link goes left
                    this.lastScreen?.paintTopLayer(ctx);
                    ctx.translate(-SCREEN_WIDTH, 0);
                    currentScreen.paintTopLayer(ctx);
                    break;
                case 'UP':
                    this.lastScreen?.paintTopLayer(ctx);
                    ctx.translate(0, SCREEN_HEIGHT);
                    currentScreen.paintTopLayer(ctx);
                    break;
                case 'DOWN':
                    this.lastScreen?.paintTopLayer(ctx);
                    ctx.translate(0, -SCREEN_HEIGHT);
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

        this.hud.render(ctx);
    }

    override update(delta: number) {
        this.handleDefaultKeys();

        // If Link's in his dying animation, don't update anything
        if (game.link.done) {
            game.link.update();
            return;
        }

        if (this.screenSlidingAmount > 0) {
            this.updateScreenSlidingImpl();
        }

        // Only update enemies, etc. if Link isn't going down a stairwell
        else if (!game.link.isAnimationRunning()) {
            game.map.currentScreen.update();
            game.updateAnimations();
        }

        super.update(delta);

        if (this.screenSlidingAmount === 0) {
            game.link.handleInput(game.inputManager);
        }

        if (this.game.inputManager.enter(true)) {
            game.setState(new InventorySlideState(new InventoryState(), this));
        }
        else {
            game.link.update();
        }
    }

    private updateScreenSlidingImpl() {
        game.link.updateWalkingStep();
        this.screenSlidingAmount += SCREEN_SLIDING_INC;

        const labyrinth: boolean = game.map.isLabyrinth();
        const linkMoveAmt: number = labyrinth ? 2 : 1;

        if (this.screenSlidingAmount % 16 === 0) {
            switch (this.screenSlidingDir) {
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

        if (isHorizontal(this.screenSlidingDir) &&
            this.screenSlidingAmount === SCREEN_WIDTH) {
            switch (this.screenSlidingDir) {
                case 'LEFT':
                    game.link.x = labyrinth ? TILE_WIDTH : 0;
                    break;
                case 'RIGHT':
                    game.link.x = SCREEN_WIDTH - TILE_WIDTH;
                    if (labyrinth) {
                        game.link.x -= TILE_WIDTH;
                    }
                    break;
            }
            this.screenSlidingAmount = 0;
            this.lastScreen = null;
            this.screenSlidingDir = null;
        }
        else if (isVertical(this.screenSlidingDir) &&
            this.screenSlidingAmount === SCREEN_HEIGHT) {
            switch (this.screenSlidingDir) {
                case 'UP':
                    game.link.y = labyrinth ? TILE_HEIGHT : 0;
                    break;
                case 'DOWN':
                    game.link.y = SCREEN_HEIGHT - TILE_HEIGHT;
                    if (labyrinth) {
                        game.link.y -= TILE_HEIGHT;
                    }
                    break;
            }
            this.screenSlidingAmount = 0;
            this.lastScreen = null;
            this.screenSlidingDir = null;
        }
    }
}
