import { Character } from './Character';
import { Actor, MOVE_AMT } from './Actor';
import { Animation } from './Animation';
import { Enemy } from './Enemy';
import { AnimationListener } from './AnimationListener';
import { DirectionUtil } from './Direction';
import { Constants } from './Constants';
import { Sword } from './Sword';
import { MainGameState } from './MainGameState';
import { ZeldaGame } from './ZeldaGame';
import { InputManager, Keys, Rectangle, SpriteSheet } from 'gtp';
import FadeOutInState from 'gtp/lib/gtp/FadeOutInState';
import { TitleState } from './TitleState';
import { Projectile } from './Projectile';
declare let game: ZeldaGame;

const STEP_TIMER_MAX: number = 8;

/**
 * The hero of the game.
 */
export class Link extends Character {

    private _maxHealth: number;
    private _health: number;

    anim: Animation | null;
    step: number;
    _stepTimer: number;
    _adjustToGridCounter: number;

    static FRAME_STILL: number = 0;
    static FRAME_STEP: number = 1;
    static FRAME_ACTION: number = 2;

    constructor() {
        super();
        this._stepTimer = STEP_TIMER_MAX;
        this.hitBox = new Rectangle();
        this.step = 0;
        this._adjustToGridCounter = 0;
        this._maxHealth = 6;
        this._health = 6;
    }

    collidedWith(other: Actor): boolean {

        if (this.takingDamage) {
            return false;
        }

        if (other instanceof Enemy || other instanceof Projectile) {

            // Projectiles reflect off of Link's shield
            if (!this.frozen && other instanceof Projectile) {
                if (DirectionUtil.opposite(other.dir) === this.dir) {
                    game.audio.playSound('shield');
                    return false;
                }
            }

            game.map.currentScreen.removeLinksSwordActor();
            this.frozen = false;
            this.step = Link.FRAME_STILL;

            if (--this._health === 0) {
                game.audio.playSound('linkHurt');
                this.done = true;
                this.setAnimation(this._createDyingAnimation());
                game.linkDied();
            }
            else {
                console.log(`Link's health is now ${this._health}`);
                game.audio.playSound('linkHurt');
                this.takingDamage = true;
                this._slideTick = Character.MAX_SLIDE_TICK / 2; // Link isn't knocked back as much
                this._slidingDir = other.dir;
            }
        }

        return false;
    }

    private _createDyingAnimation(): Animation {

        const sheet: SpriteSheet = game.assets.get('link') as SpriteSheet;
        const anim: Animation = new Animation(this.x, this.y);

        const SPIN_FRAME_TIME: number = 90;
        let preChirpPlayFrames: number = 0;

        let spinTime: number = 1500;
        while (spinTime > 0) {
            anim.addFrame({ sheet: sheet, index: 0 }, SPIN_FRAME_TIME);
            anim.addFrame({ sheet: sheet, index: 1 }, SPIN_FRAME_TIME);
            anim.addFrame({ sheet: sheet, index: 2 }, SPIN_FRAME_TIME);
            anim.addFrame({ sheet: sheet, index: 3 }, SPIN_FRAME_TIME);
            spinTime -= 4 * SPIN_FRAME_TIME;
            preChirpPlayFrames += 4;
        }

        anim.addFrame({ sheet: sheet, index: 0 }, 1000);
        preChirpPlayFrames++;

        // TODO: Share with ZeldaGame.createEnemyDiesAnimation()
        const enemyDiesSheet: SpriteSheet = game.assets.get('enemyDies') as SpriteSheet;
        anim.addFrame({ sheet: enemyDiesSheet, index: 0 }, 30);
        anim.addFrame({ sheet: enemyDiesSheet, index: 1 }, 30);
        anim.addFrame({ sheet: enemyDiesSheet, index: 2 }, 30);
        anim.addFrame({ sheet: enemyDiesSheet, index: 3 }, 30);
        anim.addFrame({ sheet: enemyDiesSheet, index: 16 }, 30);
        anim.addFrame({ sheet: enemyDiesSheet, index: 17 }, 30);
        anim.addFrame({ sheet: enemyDiesSheet, index: 18 }, 30);
        anim.addFrame({ sheet: enemyDiesSheet, index: 19 }, 30);
        anim.addFrame({ sheet: enemyDiesSheet, index: 0 }, 30);
        anim.addFrame({ sheet: enemyDiesSheet, index: 1 }, 30);
        anim.addFrame({ sheet: enemyDiesSheet, index: 2 }, 30);
        anim.addFrame({ sheet: enemyDiesSheet, index: 3 }, 30);

        let dieChirpPlayed: boolean = false;

        anim.addListener({

            animationFrameUpdate: (anim: Animation) => {
                if (anim.frame >= preChirpPlayFrames && !dieChirpPlayed) {
                    game.audio.playSound('text');
                    dieChirpPlayed = true;
                }
            },

            animationCompleted: (anim: Animation) => {
                game.setState(new FadeOutInState(game.state, new TitleState()));
            }
        });

        return anim;
    }

    private _createStairsDownAnimation(completedCallback: AnimationListener): Animation {

        const animation: Animation = new Animation(this.x, this.y);
        const linkSheet: SpriteSheet = game.assets.get('link') as SpriteSheet;
        const frameMillis: number = 120;

        animation.addFrame({ sheet: linkSheet, index: 17 }, frameMillis);
        animation.addFrame({ sheet: linkSheet, index: 4 }, frameMillis);
        animation.addFrame({ sheet: linkSheet, index: 5 }, frameMillis);
        animation.addFrame({ sheet: linkSheet, index: 6 }, frameMillis);
        animation.addFrame({ sheet: linkSheet, index: 7 }, frameMillis);
        animation.addFrame({ sheet: linkSheet, index: 8 }, frameMillis);
        animation.addFrame({ sheet: linkSheet, index: 9 }, frameMillis);
        animation.addFrame({ sheet: linkSheet, index: 10 }, frameMillis);

        animation.addListener(completedCallback);
        return animation;
    }

    private _createStairsUpAnimation(completedCallback: AnimationListener): Animation {

        const animation: Animation = new Animation(this.x, this.y);
        const linkSheet: SpriteSheet = game.assets.get('link') as SpriteSheet;
        const frameMillis: number = 120;

        animation.addFrame({ sheet: linkSheet, index: 19 }, frameMillis);
        animation.addFrame({ sheet: linkSheet, index: 20 }, frameMillis);
        animation.addFrame({ sheet: linkSheet, index: 21 }, frameMillis);
        animation.addFrame({ sheet: linkSheet, index: 22 }, frameMillis);
        animation.addFrame({ sheet: linkSheet, index: 23 }, frameMillis);
        animation.addFrame({ sheet: linkSheet, index: 24 }, frameMillis);
        animation.addFrame({ sheet: linkSheet, index: 25 }, frameMillis);
        animation.addFrame({ sheet: linkSheet, index: 15 }, frameMillis);

        animation.addListener(completedCallback);
        return animation;
    }

    enterCave(completedCallback: AnimationListener) {
        game.audio.playSound('stairs', false, () => { console.log('sound done'); });
        this.setAnimation(this._createStairsDownAnimation(completedCallback));
    }

    exitCave(completedCallback: AnimationListener) {
        game.audio.playSound('stairs', false, () => { console.log('sound done'); });
        this.setAnimation(this._createStairsUpAnimation(completedCallback));
    }

    getHealth(): number {
        return this._health;
    }

    getMaxHealth(): number {
        return this._maxHealth;
    }

    handleInput(input: InputManager): boolean {

        if (this.frozen || this.takingDamage) {
            return false;
        }

        // Action buttons should take priority over moving
        else if (input.isKeyDown(Keys.KEY_Z)) {
            this._swingSword();
        }

        else if (input.up()) {
            this.moveY(-MOVE_AMT);
            if (this.dir !== 'UP') {
                this.dir = 'UP';
            }
            else {
                this._touchStepTimer();
            }
            return true;
        }

        else if (input.down()) {
            this.moveY(MOVE_AMT);
            if (this.dir !== 'DOWN') {
                this.dir = 'DOWN';
            }
            else {
                this._touchStepTimer();
            }
            return true;
        }

        else if (input.left()) {
            this.moveX(-MOVE_AMT);
            if (this.dir !== 'LEFT') {
                this.dir = 'LEFT';
            }
            else {
                this._touchStepTimer();
            }
            return true;
        }

        else if (input.right()) {
            this.moveX(MOVE_AMT);
            if (this.dir !== 'RIGHT') {
                this.dir = 'RIGHT';
            }
            else {
                this._touchStepTimer();
            }
            return true;
        }

        return false;
    }

    isAnimationRunning(): boolean {
        return !!this.anim;
    }

    private _isMovingHorizontally(hitBox: Rectangle): number {
        if (hitBox.x < 0) {
            return -1;
        }
        if ((hitBox.x + hitBox.w) >= Constants.TILE_WIDTH * Constants.SCREEN_COL_COUNT) {
            return 1;
        }
        return 0;
    }

    private _isMovingVertically(hitBox: Rectangle): number {
        if (hitBox.y < 0) {
            return -1;
        }
        if ((hitBox.y + hitBox.h) >= Constants.TILE_HEIGHT * Constants.SCREEN_ROW_COUNT) {
            return 1;
        }
        return 0;
    }

    moveX(inc: number) {

        const tempX: number = this.x + inc;
        this.hitBox.set(tempX + 2, this.y + 8, this.w - 2 * 2, 8);

        const movingHorizontally: number = this._isMovingHorizontally(this.hitBox);
        if (movingHorizontally !== 0) {
            this.x = tempX;
            const mgs: MainGameState = game.state as MainGameState;
            mgs.changeScreenHorizontally(movingHorizontally);
        }
        else if (this.isHitBoxWalkable()) {
            this.x = tempX;
        }

        // Snapping to grid
        // TODO: This isn't right...
        const tileH: number = Constants.TILE_HEIGHT;
        const offset: number = this.y % tileH;
        //console.log(this.x + ', ' + offset);
        if (offset !== 0) {

            const AMT: number = 3;

            if (offset <= AMT) {
                if (this.isHitBoxWalkable(0, -1) && ++this._adjustToGridCounter === 1) {
                    console.log('Adjusting up: ' + offset);
                    this.y -= 1;
                    this._adjustToGridCounter = 0;
                }
            }
            else if (this.isHitBoxWalkable(0, 1) && offset >= tileH - AMT) {
                if (++this._adjustToGridCounter === 1) {
                    console.log('Adjusting down: ' + offset);
                    this.y += 1;
                    this._adjustToGridCounter = 0;
                }
            }
        }

        this._refreshHitBox();
    }

    moveY(inc: number) {

        const tempY: number = this.y + inc;
        this.hitBox.set(this.x + 2, tempY + 8, this.w - 2 * 2, 8);

        const movingVertically: number = this._isMovingVertically(this.hitBox);
        if (movingVertically !== 0) {
            this.y = tempY;
            const mgs: MainGameState = game.state as MainGameState;
            mgs.changeScreenVertically(movingVertically);
        }
        else if (this.isHitBoxWalkable()) {
            this.y = tempY;
        }

        // Snapping to grid
        // TODO: This isn't right...
        const tileW: number = Constants.TILE_WIDTH;
        const offset: number = this.x % tileW;
        //console.log(offset);
        if (offset !== 0) {

            const AMT: number = 3;

            if (offset <= AMT) {
                if (this.isHitBoxWalkable(-1, 0) && ++this._adjustToGridCounter === 1) {
                    this.x -= 1;
                    this._adjustToGridCounter = 0;
                }
            }
            else if (offset >= tileW - AMT) {
                if (this.isHitBoxWalkable(1, 0) && ++this._adjustToGridCounter === 1) {
                    this.x += 1;
                    this._adjustToGridCounter = 0;
                }
            }
        }

        this._refreshHitBox();
    }

    paint(ctx: CanvasRenderingContext2D) {

        // Cheap hack since Game always paints Link, even when he's dead
        if (this.done && !this.anim ) {
            return;
        }

        this.possiblyPaintHitBox(ctx);

        if (this.anim) {
            this.anim.paint(ctx);
        }
        else {
            const ss: SpriteSheet = game.assets.get('link') as SpriteSheet;
            const row: number = this.step;
            const col: number = DirectionUtil.ordinal(this.dir);
            const index: number = row * 15 + col;
            ss.drawByIndex(ctx, this.x, this.y, index);
        }
    }

    private _refreshHitBox() {
        this.hitBox.set(this.x + 2, this.y + 8, this.w - 2 * 2, 8);
    }

    setAnimation(anim: Animation) {
        this.anim = anim;
        this.frozen = true;
        this.anim.addListener({
            scope: this,
            animationFrameUpdate(animation: Animation) {
            },
            animationCompleted(animation: Animation) {
                this.anim = null;
                this.frozen = false;
            }
        });
    }

    setLocation(x: number, y: number) {
        super.setLocation(x, y);
        this._refreshHitBox();
    }

    private _swingSword() {

        game.audio.playSound('sword');

        const sword: Sword = new Sword();
        game.map.currentScreen.addActor(sword);
        this.frozen = true;
        this.step = Link.FRAME_ACTION;
    }

    private _touchStepTimer() {
        this._stepTimer--;
        if (this._stepTimer === 0) {
            this.step = (this.step + 1) % 2;
            this._stepTimer = STEP_TIMER_MAX;
        }
    }

    update() {

        if (this._slidingDir) {
            this.updateSlide();
            return;
        }

        if (this.anim) {
            this.anim.update();
        }
    }

    // TODO: Share with AbstractWalkingEnemy?
    protected updateSlide() {

        const speed: number = 4;
        switch (this._slidingDir) {
            case 'UP':
                this.moveY(-speed);
                break;
            case 'LEFT':
                this.moveX(-speed);
                break;
            case 'DOWN':
                this.moveY(speed);
                break;
            case 'RIGHT':
                this.moveX(speed);
                break;
        }

        if (--this._slideTick === 0) {
            this.takingDamage = false;
            this._slidingDir = null;
        }
    }

    updateWalkingStep() {
        this._touchStepTimer();
    }
}
