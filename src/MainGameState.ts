import { Direction, isHorizontal, isVertical } from './Direction';
import { HUD_HEIGHT, SCREEN_HEIGHT, SCREEN_WIDTH, TILE_HEIGHT, TILE_WIDTH } from './Constants';
import { BaseState } from './BaseState';
import { Screen } from './Screen';
import { Map } from './Map';
import { ZeldaGame } from './ZeldaGame';
import { Hud } from './Hud';
import { ChangeScreenWarpEvent } from './event/ChangeScreenWarpEvent';
import { Event, EventData } from './event/Event';
import { InventoryState } from '@/InventoryState';
import { InventorySlideState } from '@/InventorySlideState';
import { Keys } from 'gtp';
import { Position } from '@/Position';

const SCREEN_SLIDING_INC = 4;

export class MainGameState extends BaseState {
    private readonly hud: Hud;
    private lastScreen: Screen | undefined | null;
    private screenSlidingDir: Direction | null;
    private screenSlidingAmount: number;

    constructor(game: ZeldaGame) {
        super(game);
        this.hud = new Hud(game);
    }

    changeScreenHorizontally(inc: number) {
        const map: Map = this.game.map;
        this.lastScreen = map.currentScreen;
        map.changeScreensHorizontally(inc);

        this.screenSlidingDir = inc > 0 ? 'LEFT' : 'RIGHT';
        this.screenSlidingAmount = SCREEN_SLIDING_INC;
    }

    changeScreenVertically(inc: number) {
        const map: Map = this.game.map;
        const screen: Screen = map.currentScreen;

        const changeScreenWarpEvents: Event<EventData>[] = screen.events.filter((e: Event<EventData>) => {
            return e instanceof ChangeScreenWarpEvent;
        });
        if (changeScreenWarpEvents.length) {
            if (changeScreenWarpEvents.length > 1) {
                console.error(`More than one ChangeScreenWarpEvent for screen ${screen.toString()}!`);
            }
            changeScreenWarpEvents[0].execute(this.game);
            return;
        }

        this.lastScreen = screen;
        map.changeScreensVertically(inc);

        this.screenSlidingDir = inc > 0 ? 'UP' : 'DOWN';
        this.screenSlidingAmount = SCREEN_SLIDING_INC;
    }

    override enter(game: ZeldaGame) {
        super.enter(game);
        // this.game.inputManager.setResetKeyStateOnPoll(false);

        const music: string | null | undefined = this.game.map.currentScreenMusic;
        if (music && music !== 'none' && music !== this.game.audio.getCurrentMusic()) {
            this.game.audio.playMusic(music, true);
        }
        this.screenSlidingAmount = 0;
    }

    private handleCheatKeys() {
        const im = this.game.inputManager;

        // Warp to the "real" game start screen
        if (im.isKeyDown(Keys.KEY_S, true)) {
            this.game.setMap('overworld', new Position(7, 6), new Position(4, 4), false);
            this.game.setStatusMessage('Warped to: start screen');
        }
        // Warp to Level 1 entrance
        else if (im.isKeyDown(Keys.KEY_1, true)) {
            this.game.setMap('overworld', new Position(3, 6), new Position(5, 7), false);
            this.game.setStatusMessage('Warped to: Level 1');
        }
        // Always shoot swords
        else if (im.isKeyDown(Keys.KEY_W, true)) {
            const newStrategy = this.game.link.toggleSwordThrowingStrategy();
            this.game.setStatusMessage(`Set sword throwing strategy to ${newStrategy}`);
        }
    }

    override render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(0, HUD_HEIGHT);

        const currentScreen: Screen = this.game.map.currentScreen;
        const game = this.game;

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
        const game = this.game;

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
            game.map.currentScreen.update(game);
            game.updateAnimations();
            game.updateRupees(delta);
        }

        super.update(delta);

        if (this.screenSlidingAmount === 0) {
            game.link.handleInput(game.inputManager);
        }

        if (this.game.inputManager.enter(true)) {
            game.setState(new InventorySlideState(this.game, new InventoryState(this.game), this));
        }
        else if (this.game.inputManager.isKeyDown(Keys.KEY_SHIFT)) {
            this.handleCheatKeys();
        }
        else {
            game.link.update();
        }
    }

    private updateScreenSlidingImpl() {
        const game = this.game;
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
                        this.game.link.x -= TILE_WIDTH;
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
                        this.game.link.y -= TILE_HEIGHT;
                    }
                    break;
            }
            this.screenSlidingAmount = 0;
            this.lastScreen = null;
            this.screenSlidingDir = null;
        }
    }
}
