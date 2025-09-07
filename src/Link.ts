import { Character } from './Character';
import { Actor, MOVE_AMT } from './Actor';
import { Animation } from './Animation';
import { Enemy } from './enemy/Enemy';
import { AnimationListener } from './AnimationListener';
import { opposite, ordinal } from './Direction';
import { SCREEN_COL_COUNT, SCREEN_ROW_COUNT, TILE_HEIGHT, TILE_WIDTH } from './Constants';
import { Sword } from './Sword';
import { MainGameState } from './MainGameState';
import { ZeldaGame } from './ZeldaGame';
import { InputManager, Keys, Rectangle, SpriteSheet } from 'gtp';
import FadeOutInState from 'gtp/lib/gtp/FadeOutInState';
import { TitleState } from './TitleState';
import { Projectile } from './Projectile';
import { Bomb } from './Bomb';

const STEP_TIMER_MAX = 8;

/**
 * The hero of the game.
 */
export class Link extends Character {
    private rupeeCount: number;

    private bombCount: number;
    private maxBombCount: number;

    private readonly maxHealth: number;
    private health: number;
    private takingDamageTick: number;

    anim: Animation | null;
    step: number;
    stepTimer: number;
    adjustToGridCounter: number;

    static readonly FRAME_STILL: number = 0;
    static readonly FRAME_STEP: number = 1;
    static readonly FRAME_ACTION: number = 2;

    static readonly MAX_TAKING_DAMAGE_TICK: number = 60;

    constructor(game: ZeldaGame) {
        super(game);
        this.rupeeCount = 0;
        this.bombCount = 99;
        this.maxBombCount = 99;
        this.stepTimer = STEP_TIMER_MAX;
        this.hitBox = new Rectangle();
        this.step = 0;
        this.adjustToGridCounter = 0;
        this.maxHealth = 6;
        this.health = 6;
    }

    collidedWith(other: Actor): boolean {
        if (this.takingDamage) {
            return false;
        }

        if (other instanceof Enemy || other instanceof Projectile) {
            // Projectiles reflect off of Link's shield
            if (!this.frozen && other instanceof Projectile) {
                if (opposite(other.dir) === this.dir) {
                    this.game.audio.playSound('shield');
                    return false;
                }
            }

            this.game.map.currentScreen.removeLinksSwordActor();
            this.frozen = false;
            this.step = Link.FRAME_STILL;

            const damage: number = other.getDamage();
            this.health = Math.max(0, this.health - damage);

            if (this.health === 0) {
                this.game.audio.playSound('linkHurt');
                this.done = true;
                this.setAnimation(this.createDyingAnimation());
                this.game.linkDied();
            }
            else {
                console.log(`Link's health is now ${this.health}`);
                this.game.audio.playSound('linkHurt');
                this.takingDamage = true;
                this.takingDamageTick = Link.MAX_TAKING_DAMAGE_TICK;
                console.log(`Taking damage at: ${new Date().getTime()}`);
                this.slideTick = Character.MAX_SLIDE_TICK / 2; // Link isn't knocked back as much
                this.slidingDir = other.dir;
            }
        }

        return false;
    }

    private createDyingAnimation(): Animation {
        const sheet: SpriteSheet = this.game.assets.get('link');
        const anim: Animation = new Animation(this.game, this.x, this.y);

        const SPIN_FRAME_TIME = 90;
        let preChirpPlayFrames = 0;

        let spinTime = 1500;
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
        const enemyDiesSheet: SpriteSheet = this.game.assets.get('enemyDies');
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

        let dieChirpPlayed = false;

        anim.addListener({

            animationFrameUpdate: (anim: Animation) => {
                if (anim.frame >= preChirpPlayFrames && !dieChirpPlayed) {
                    this.game.audio.playSound('text');
                    dieChirpPlayed = true;
                }
            },

            animationCompleted: (anim: Animation) => {
                this.game.setState(new FadeOutInState(this.game.state, new TitleState(this.game)));
            },
        });

        return anim;
    }

    private createStairsDownAnimation(completedCallback: AnimationListener): Animation {
        const animation: Animation = new Animation(this.game, this.x, this.y);
        const linkSheet: SpriteSheet = this.game.assets.get('link');
        const frameMillis = 120;

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

    private createStairsUpAnimation(completedCallback: AnimationListener): Animation {
        const animation: Animation = new Animation(this.game, this.x, this.y);
        const linkSheet: SpriteSheet = this.game.assets.get('link');
        const frameMillis = 120;

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
        this.game.audio.playSound('stairs', false, () => {
            console.log('sound done');
        });
        this.setAnimation(this.createStairsDownAnimation(completedCallback));
    }

    exitCave(completedCallback: AnimationListener) {
        this.game.audio.playSound('stairs', false, () => {
            console.log('sound done');
            this.game.resumeMusic();
        });
        this.setAnimation(this.createStairsUpAnimation(completedCallback));
    }

    getBombCount(): number {
        return this.bombCount;
    }

    getRupeeCount(): number {
        return this.rupeeCount;
    }

    getHealth(): number {
        return this.health;
    }

    getMaxHealth(): number {
        return this.maxHealth;
    }

    handleInput(input: InputManager): boolean {
        if (this.frozen || this.slidingDir) {
            return false;
        }

        // Action buttons should take priority over moving
        else if (input.isKeyDown(Keys.KEY_Z)) {
            this.swingSword();
        }
        else if (input.isKeyDown(Keys.KEY_X)) {
            this.useItem();
        }
        else if (input.up()) {
            this.moveY(-MOVE_AMT);
            if (this.dir !== 'UP') {
                this.dir = 'UP';
            }
            else {
                this.touchStepTimer();
            }
            return true;
        }
        else if (input.down()) {
            this.moveY(MOVE_AMT);
            if (this.dir !== 'DOWN') {
                this.dir = 'DOWN';
            }
            else {
                this.touchStepTimer();
            }
            return true;
        }
        else if (input.left()) {
            this.moveX(-MOVE_AMT);
            if (this.dir !== 'LEFT') {
                this.dir = 'LEFT';
            }
            else {
                this.touchStepTimer();
            }
            return true;
        }
        else if (input.right()) {
            this.moveX(MOVE_AMT);
            if (this.dir !== 'RIGHT') {
                this.dir = 'RIGHT';
            }
            else {
                this.touchStepTimer();
            }
            return true;
        }

        return false;
    }

    incBombCount(count = 4) {
        this.bombCount = Math.min(this.bombCount + count, this.maxBombCount);
        this.game.audio.playSound('getItem');
    }

    incHealth(count = 2) {
        this.health = Math.min(this.health + count, this.maxHealth);
        this.game.audio.playSound('heart');
    }

    incRupeeCount(count: number) {
        this.rupeeCount += count;
        this.game.audio.playSound('rupee');
    }

    isAnimationRunning(): boolean {
        return !!this.anim;
    }

    private isMovingHorizontally(hitBox: Rectangle): number {
        if (hitBox.x < 0) {
            return -1;
        }
        if ((hitBox.x + hitBox.w) >= TILE_WIDTH * SCREEN_COL_COUNT) {
            return 1;
        }
        return 0;
    }

    private isMovingVertically(hitBox: Rectangle): number {
        if (hitBox.y < 0) {
            return -1;
        }
        if ((hitBox.y + hitBox.h) >= TILE_HEIGHT * SCREEN_ROW_COUNT) {
            return 1;
        }
        return 0;
    }

    moveX(inc: number) {
        const tempX: number = this.x + inc;
        this.hitBox.set(tempX + 2, this.y + 8, this.w - 2 * 2, 8);

        const movingHorizontally: number = this.isMovingHorizontally(this.hitBox);
        if (movingHorizontally !== 0) {
            this.x = tempX;
            const mgs: MainGameState = this.game.state as MainGameState;
            mgs.changeScreenHorizontally(movingHorizontally);
        }
        else if (this.isHitBoxWalkable()) {
            this.x = tempX;
        }

        // Snapping to grid
        // TODO: This isn't right...
        const tileH: number = TILE_HEIGHT;
        const offset: number = this.y % tileH;
        // console.log(this.x + ', ' + offset);
        if (offset !== 0) {
            const AMT = 3;

            if (offset <= AMT) {
                if (this.isHitBoxWalkable(0, -1) && ++this.adjustToGridCounter === 1) {
                    console.log(`Adjusting up: ${offset}`);
                    this.y -= 1;
                    this.adjustToGridCounter = 0;
                }
            }
            else if (this.isHitBoxWalkable(0, 1) && offset >= tileH - AMT) {
                if (++this.adjustToGridCounter === 1) {
                    console.log(`Adjusting down: ${offset}`);
                    this.y += 1;
                    this.adjustToGridCounter = 0;
                }
            }
        }

        this.refreshHitBox();
    }

    moveY(inc: number) {
        const tempY: number = this.y + inc;
        this.hitBox.set(this.x + 2, tempY + 8, this.w - 2 * 2, 8);

        const movingVertically: number = this.isMovingVertically(this.hitBox);
        if (movingVertically !== 0) {
            this.y = tempY;
            const mgs: MainGameState = this.game.state as MainGameState;
            mgs.changeScreenVertically(movingVertically);
        }
        else if (this.isHitBoxWalkable()) {
            this.y = tempY;
        }

        // Snapping to grid
        // TODO: This isn't right...
        const tileW: number = TILE_WIDTH;
        const offset: number = this.x % tileW;
        // console.log(offset);
        if (offset !== 0) {
            const AMT = 3;

            if (offset <= AMT) {
                if (this.isHitBoxWalkable(-1, 0) && ++this.adjustToGridCounter === 1) {
                    this.x -= 1;
                    this.adjustToGridCounter = 0;
                }
            }
            else if (offset >= tileW - AMT) {
                if (this.isHitBoxWalkable(1, 0) && ++this.adjustToGridCounter === 1) {
                    this.x += 1;
                    this.adjustToGridCounter = 0;
                }
            }
        }

        this.refreshHitBox();
    }

    paint(ctx: CanvasRenderingContext2D) {
        // Cheap hack since Game always paints Link, even when he's dead
        if (this.done && !this.anim) {
            return;
        }

        this.possiblyPaintHitBox(ctx);

        if (this.anim) {
            this.anim.paint(ctx);
        }
        else {
            const ss: SpriteSheet = this.game.assets.get('link');
            const row: number = this.step;
            const col: number = ordinal(this.dir);
            const index: number = row * 15 + col;
            ss.drawByIndex(ctx, this.x, this.y, index);
        }
    }

    private refreshHitBox() {
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
                // @ts-expect-error - scope is defined in "scope" arg
                this.anim = null;
                // @ts-expect-error - scope is defined in "scope" arg
                this.frozen = false;
            },
        });
    }

    override setLocation(x: number, y: number) {
        super.setLocation(x, y);
        this.refreshHitBox();
    }

    setMaxBombCount(count: number) {
        // Link's bombs are always refilled when the max bomb count is increased.
        this.bombCount = this.maxBombCount = count;
    }

    private swingSword() {
        this.game.audio.playSound('sword');

        const sword: Sword = new Sword(this.game);
        this.game.map.currentScreen.addActor(sword);
        this.frozen = true;
        this.step = Link.FRAME_ACTION;
    }

    private touchStepTimer() {
        this.stepTimer--;
        if (this.stepTimer === 0) {
            this.step = (this.step + 1) % 2;
            this.stepTimer = STEP_TIMER_MAX;
        }
    }

    update() {
        if (this.takingDamage && --this.takingDamageTick === 0) {
            this.takingDamage = false;
        }

        if (this.slidingDir) {
            this.updateSlide();
            return;
        }

        if (this.anim) {
            this.anim.update();
        }
    }

    // TODO: Share with AbstractWalkingEnemy?
    protected updateSlide() {
        const speed = 4;
        switch (this.slidingDir) {
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

        if (--this.slideTick === 0) {
            this.slidingDir = null;
        }
    }

    updateWalkingStep() {
        this.touchStepTimer();
    }

    private useItem() {
        if (this.bombCount > 0) {
            this.bombCount--;
            this.game.audio.playSound('bombDrop');

            const bomb: Bomb = new Bomb(this.game);
            this.game.map.currentScreen.addActor(bomb);
            this.frozen = true;
            this.step = Link.FRAME_ACTION;
        }
    }
}
