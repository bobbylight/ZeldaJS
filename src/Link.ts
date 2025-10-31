import { InputManager, Keys, Rectangle, SpriteSheet } from 'gtp';
import { Character } from './Character';
import { Actor, MOVE_AMT } from './Actor';
import { Animation } from './Animation';
import { Enemy } from './enemy/Enemy';
import { AnimationListener } from './AnimationListener';
import { opposite, ordinal } from './Direction';
import { HERO_HITBOX_STYLE, SCREEN_COL_COUNT, SCREEN_ROW_COUNT, TILE_HEIGHT, TILE_WIDTH } from './Constants';
import { Sword } from './Sword';
import { MainGameState } from './MainGameState';
import { ZeldaGame } from './ZeldaGame';
import { Projectile } from './Projectile';
import { Bomb } from './Bomb';
import {
    LinkSwordThrowingStrategy,
    SwordThrowingStrategyName,
    alwaysSwordThrowingStrategy,
    maxHeartsSwordThrowingStrategy,
    swordThrowingStrategyForName,
} from '@/LinkSwordThrowingStrategy';
import {
    createLinkDyingAnimation,
    createReflectedProjectileAnimation,
    createStairsDownAnimation,
    createStairsUpAnimation,
} from '@/Animations';

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
    private swordThrowingStrategy: LinkSwordThrowingStrategy;

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
        this.swordThrowingStrategy = maxHeartsSwordThrowingStrategy;
    }

    collidedWith(other: Actor): boolean {
        if (this.takingDamage) {
            return false;
        }

        if (other instanceof Enemy || other instanceof Projectile) {
            // Projectiles reflect off of Link's shield
            if (!this.frozen && other instanceof Projectile) {
                if (opposite(other.dir) === this.dir) {
                    this.knockbackProjectile(other);
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
                this.setAnimation(createLinkDyingAnimation(this.game, this, this.x, this.y));
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

    enterCave(completedCallback: AnimationListener) {
        this.game.audio.playSound('stairs', false, () => {
            console.log('sound done');
        });
        this.setAnimation(createStairsDownAnimation(this.game, this, this.x, this.y, completedCallback));
    }

    exitCave(completedCallback: AnimationListener) {
        this.game.audio.playSound('stairs', false, () => {
            console.log('sound done');
            this.game.resumeMusic();
        });
        this.setAnimation(createStairsUpAnimation(this.game, this, this.x, this.y, completedCallback));
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

    override getHitBoxStyle(): string {
        return HERO_HITBOX_STYLE;
    }

    getMaxHealth(): number {
        return this.maxHealth;
    }

    getShouldThrowSword(): boolean {
        return this.swordThrowingStrategy(this);
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
    }

    isAnimationRunning(): boolean {
        return !!this.anim;
    }

    private isMovingHorizontally(hitBox: Rectangle): number {
        if (hitBox.x < 0) {
            return -1;
        }
        if (hitBox.x + hitBox.w >= TILE_WIDTH * SCREEN_COL_COUNT) {
            return 1;
        }
        return 0;
    }

    private isMovingVertically(hitBox: Rectangle): number {
        if (hitBox.y < 0) {
            return -1;
        }
        if (hitBox.y + hitBox.h >= TILE_HEIGHT * SCREEN_ROW_COUNT) {
            return 1;
        }
        return 0;
    }

    private knockbackProjectile(projectile: Projectile) {
        this.game.audio.playSound('shield');
        this.game.addAnimation(createReflectedProjectileAnimation(this.game, projectile, projectile.x, projectile.y));
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

    setAnimation(anim: Animation | undefined) {
        if (anim) {
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
    }

    override setLocation(x: number, y: number) {
        super.setLocation(x, y);
        this.refreshHitBox();
    }

    setMaxBombCount(count: number) {
        // Link's bombs are always refilled when the max bomb count is increased.
        this.bombCount = this.maxBombCount = count;
    }

    setSwordThrowingStrategy(strategyName: SwordThrowingStrategyName) {
        this.swordThrowingStrategy = swordThrowingStrategyForName(strategyName);
    }

    private swingSword() {
        this.game.audio.playSound('sword');

        const sword: Sword = new Sword(this.game);
        this.game.map.currentScreen.addActor(sword);
        this.frozen = true;
        this.step = Link.FRAME_ACTION;
    }

    toggleSwordThrowingStrategy(): SwordThrowingStrategyName {
        if (this.swordThrowingStrategy === alwaysSwordThrowingStrategy) {
            this.swordThrowingStrategy = maxHeartsSwordThrowingStrategy;
            return 'maxHearts';
        }
        this.swordThrowingStrategy = alwaysSwordThrowingStrategy;
        return 'always';
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
