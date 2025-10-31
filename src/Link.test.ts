import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { AudioSystem, InputManager, Keys, SpriteSheet } from 'gtp';
import { Link } from './Link';
import { Map } from '@/Map';
import { Octorok } from '@/enemy/Octorok';
import { ZeldaGame } from '@/ZeldaGame';
import { Projectile } from '@/Projectile';
import { opposite } from '@/Direction';
import { AnimationListener } from '@/AnimationListener';
import { HERO_HITBOX_STYLE, SCREEN_COL_COUNT, SCREEN_ROW_COUNT, TILE_HEIGHT, TILE_WIDTH } from '@/Constants';
import { MainGameState } from '@/MainGameState';
import { Animation } from '@/Animation';
import { createAnimation } from '@/test-utils';

const mockPlayMusic = vi.fn();
const mockPlaySound = vi.fn();
const mockAudio = {
    playMusic: mockPlayMusic,
    playSound: mockPlaySound,
};

const mockMainGameState = {
    changeScreenHorizontally: vi.fn(),
    changeScreenVertically: vi.fn(),
};

const screen = {
    addActor: vi.fn(),
    removeLinksSwordActor: vi.fn(),
};

const mockMap = {
    currentScreen: screen,
};

const mockSpriteSheet = {
    drawByIndex: vi.fn(),
};

const mockIsWalkable = vi.fn(() => true);

describe('Link', () => {
    let link: Link;
    let game: ZeldaGame;

    beforeEach(() => {
        game = new ZeldaGame();
        game.isWalkable = mockIsWalkable;
        game.map = mockMap as unknown as Map;
        game.audio = mockAudio as unknown as AudioSystem;
        game.assets.set('enemyDies', mockSpriteSheet);
        game.assets.set('enemies', mockSpriteSheet);
        game.assets.set('link', mockSpriteSheet);
        game.state = mockMainGameState as unknown as MainGameState;
        link = new Link(game);
        game.link = link;
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    it('constructor initializes Link properly', () => {
        expect(link.getHealth()).toStrictEqual(6);
        expect(link.getMaxHealth()).toStrictEqual(6);
        expect(link.getBombCount()).toStrictEqual(99);
        expect(link.getRupeeCount()).toStrictEqual(0);
    });

    describe('collidedWith()', () => {
        describe('the other entity is an Enemy', () => {
            let enemy: Octorok;

            beforeEach(() => {
                enemy = new Octorok(game);
            });

            it('returns false and does nothing if Link is taking damage', () => {
                link.takingDamage = true;
                expect(link.collidedWith(enemy)).toEqual(false);
            });

            it('removes the sword from the screen', () => {
                const returnValue = link.collidedWith(enemy);
                expect(screen.removeLinksSwordActor).toHaveBeenCalledOnce();
                expect(returnValue).toEqual(false);
            });

            it('unfreezes Link and makes him still', () => {
                link.frozen = true;
                link.step = Link.FRAME_ACTION;
                const returnValue = link.collidedWith(enemy);
                expect(link.frozen).toEqual(false);
                expect(link.step).toEqual(Link.FRAME_STILL);
                expect(returnValue).toEqual(false);
            });

            describe('if Link is still alive', () => {
                it('he takes the appropriate damage', () => {
                    const origHealth = link.getHealth();
                    link.collidedWith(enemy);
                    expect(link.getHealth()).toEqual(origHealth - enemy.getDamage());
                });

                it('plays a sound', () => {
                    link.collidedWith(enemy);
                    expect(mockPlaySound).toHaveBeenCalledExactlyOnceWith('linkHurt');
                });

                // it('makes Link slide in the direction the enemy is moving', () => {
                //     enemy.dir = 'LEFT';
                //     link.collidedWith(enemy);
                //     expect(link.slidingDir).toEqual(enemy.dir);
                // });

                it('returns false', () => {
                    expect(link.collidedWith(enemy)).toEqual(false);
                });
            });

            describe('if Link dies', () => {
                beforeEach(() => {
                    // TODO: Simplify when link "max health" APIs are added
                    link.incHealth(-link.getHealth() + enemy.getDamage());
                });

                it('he takes the appropriate damage', () => {
                    link.collidedWith(enemy);
                    expect(link.getHealth()).toEqual(0);
                });

                it('plays a sound for link getting hurt', () => {
                    link.collidedWith(enemy);
                    expect(mockPlaySound).toHaveBeenCalledWith('linkHurt');
                });

                it('plays the music for link dying', () => {
                    link.collidedWith(enemy);
                    expect(mockPlayMusic).toHaveBeenCalledExactlyOnceWith('linkDies', false);
                });

                it('returns false', () => {
                    expect(link.collidedWith(enemy)).toEqual(false);
                });
            });
        });

        describe('the other entity is a Projectile', () => {
            let projectile: Projectile;

            beforeEach(() => {
                projectile = Projectile.create(game, null, 'enemies', 0, 0, 0, 0, 'DOWN');
            });

            it('returns false and does nothing if Link is taking damage', () => {
                link.takingDamage = true;
                expect(link.collidedWith(projectile)).toEqual(false);
            });

            it('removes the sword from the screen', () => {
                const returnValue = link.collidedWith(projectile);
                expect(screen.removeLinksSwordActor).toHaveBeenCalledOnce();
                expect(returnValue).toEqual(false);
            });

            it('unfreezes Link and makes him still', () => {
                link.frozen = true;
                link.step = Link.FRAME_ACTION;
                const returnValue = link.collidedWith(projectile);
                expect(link.frozen).toEqual(false);
                expect(link.step).toEqual(Link.FRAME_STILL);
                expect(returnValue).toEqual(false);
            });

            describe('when going the other direction of Link', () => {
                beforeEach(() => {
                    projectile.dir = opposite(link.dir);
                });

                it('plays the shield sound effect', () => {
                    link.collidedWith(projectile);
                    expect(mockPlaySound).toHaveBeenCalledExactlyOnceWith('shield');
                });

                it('adds an animation of the reflected projectile', () => {
                    const addAnimationSpy = vi.spyOn(game, 'addAnimation').mockImplementation(() => {})
                    link.collidedWith(projectile);
                    expect(addAnimationSpy).toHaveBeenCalledOnce();
                });

                it('does not damage Link', () => {
                    const origHealth = link.getHealth();
                    link.collidedWith(projectile);
                    expect(link.getHealth()).toEqual(origHealth);
                });

                it('returns false', () => {
                    expect(link.collidedWith(projectile)).toEqual(false);
                });
            });

            describe('if Link is still alive', () => {
                it('he takes the appropriate damage', () => {
                    const origHealth = link.getHealth();
                    link.collidedWith(projectile);
                    expect(link.getHealth()).toEqual(origHealth - projectile.getDamage());
                });

                it('plays a sound', () => {
                    link.collidedWith(projectile);
                    expect(mockPlaySound).toHaveBeenCalledExactlyOnceWith('linkHurt');
                });

                // it('makes Link slide in the direction the enemy is moving', () => {
                //     enemy.dir = 'LEFT';
                //     link.collidedWith(enemy);
                //     expect(link.slidingDir).toEqual(enemy.dir);
                // });

                it('returns false', () => {
                    expect(link.collidedWith(projectile)).toEqual(false);
                });
            });

            describe('if Link dies', () => {
                beforeEach(() => {
                    // TODO: Simplify when link "max health" APIs are added
                    link.incHealth(-link.getHealth() + projectile.getDamage());
                });

                it('he takes the appropriate damage', () => {
                    link.collidedWith(projectile);
                    expect(link.getHealth()).toEqual(0);
                });

                it('plays a sound for link getting hurt', () => {
                    link.collidedWith(projectile);
                    expect(mockPlaySound).toHaveBeenCalledWith('linkHurt');
                });

                it('plays the music for link dying', () => {
                    link.collidedWith(projectile);
                    expect(mockPlayMusic).toHaveBeenCalledExactlyOnceWith('linkDies', false);
                });

                it('returns false', () => {
                    expect(link.collidedWith(projectile)).toEqual(false);
                });
            });
        });
    });

    describe('enterCave()', () => {
        let listener: AnimationListener;

        beforeEach(() => {
            listener = { animationCompleted: vi.fn() };
        });

        it('plays a sound', () => {
            link.enterCave(listener);
            expect(mockPlaySound).toHaveBeenCalledExactlyOnceWith('stairs', false, expect.anything())
        });

        it('starts an animation', () => {
            expect(link.anim).toBeFalsy();
            link.enterCave(listener);
            expect(link.anim).toBeDefined();
        });
    });

    describe('exitCave()', () => {
        let listener: AnimationListener;

        beforeEach(() => {
            listener = { animationCompleted: vi.fn() };
        });

        it('plays a sound', () => {
            link.exitCave(listener);
            expect(mockPlaySound).toHaveBeenCalledExactlyOnceWith('stairs', false, expect.anything())
        });

        it('starts an animation', () => {
            expect(link.anim).toBeFalsy();
            link.exitCave(listener);
            expect(link.anim).toBeDefined();
        });
    });

    describe('sword throwing decisioning', () => {
        it('works for "maxHearts', () => {
            link.setSwordThrowingStrategy('maxHearts');
            expect(link.getShouldThrowSword()).toEqual(true);
            link.incHealth(-1);
            expect(link.getShouldThrowSword()).toEqual(false);
        });

        it('works for "always"', () => {
            link.setSwordThrowingStrategy('always');
            expect(link.getShouldThrowSword()).toEqual(true);
            link.incHealth(-1);
            expect(link.getShouldThrowSword()).toEqual(true);
        });
    });

    describe('getHitBoxStyle()', () => {
        it('returns the expected string', () => {
            expect(link.getHitBoxStyle()).toEqual(HERO_HITBOX_STYLE);
        });
    });

    describe('handleInput()', () => {
        let im: InputManager;

        beforeEach(() => {
            im = new InputManager();
        });

        it('returns false if frozen', () => {
            link.frozen = true;
            expect(link.handleInput(im)).toEqual(false);
        });

        it('returns false if sliding', () => {
            link.collidedWith(new Octorok(game));
            expect(link.handleInput(im)).toEqual(false);
        });

        describe('when Z is pressed', () => {
            beforeEach(() => {
                vi.spyOn(im, 'isKeyDown').mockImplementation((key: Keys) => {
                    return key === Keys.KEY_Z;
                });
                link.handleInput(im);
            });

            it('plays a sound', () => {
                expect(mockPlaySound).toHaveBeenCalledExactlyOnceWith('sword');
            });

            it('adds a sword to the screen', () => {
                expect(screen.addActor).toHaveBeenCalledOnce();
            });

            it('freezes Link', () => {
                expect(link.frozen).toEqual(true);
                expect(link.step).toEqual(Link.FRAME_ACTION);
            });
        });

        describe('when X is pressed', () => {
            beforeEach(() => {
                vi.spyOn(im, 'isKeyDown').mockImplementation((key: Keys) => {
                    return key === Keys.KEY_X;
                });
                link.handleInput(im);
            });

            it('plays a sound', () => {
                expect(mockPlaySound).toHaveBeenCalledExactlyOnceWith('bombDrop');
            });

            it('adds a bomb to the screen', () => {
                expect(screen.addActor).toHaveBeenCalledOnce();
            });

            it('freezes Link', () => {
                expect(link.frozen).toEqual(true);
                expect(link.step).toEqual(Link.FRAME_ACTION);
            });
        });

        describe('when the up arrow is pressed', () => {
            beforeEach(() => {
                vi.spyOn(im, 'isKeyDown').mockImplementation((key: Keys) => {
                    return key === Keys.KEY_UP_ARROW;
                });
            });

            it("Link's y-coordinate is updated", () => {
                const origY = link.y;
                link.handleInput(im);
                expect(link.y).toBeLessThan(origY);
            });

            it("sets Link's direction to up", () => {
                expect(link.dir).not.toEqual('UP');
                link.handleInput(im);
                expect(link.dir).toEqual('UP');
            });

            it('returns true', () => {
                expect(link.handleInput(im)).toEqual(true);
            });

            describe('and Link is already facing up', () => {
                beforeEach(() => {
                    link.dir = 'UP';
                });

                it("Link's step timer is advanced", () => {
                    const origStep = link.step;
                    const origStepTimer = link.stepTimer;
                    link.handleInput(im);
                    expect(link.step).toEqual(origStep);
                    expect(link.stepTimer).not.toEqual(origStepTimer);
                });

                describe('and it is time to switch frames', () => {
                    beforeEach(() => {
                        link.stepTimer = 1;
                    });

                    it("updates Link's step frame", () => {
                        const origStep = link.step;
                        const origStepTimer = link.stepTimer;
                        link.handleInput(im);
                        expect(link.step).not.toEqual(origStep);
                        expect(link.stepTimer).not.toEqual(origStepTimer);
                    });
                });
            });
        });

        describe('when the down arrow is pressed', () => {
            beforeEach(() => {
                vi.spyOn(im, 'isKeyDown').mockImplementation((key: Keys) => {
                    return key === Keys.KEY_DOWN_ARROW;
                });
            });

            it("Link's y-coordinate is updated", () => {
                const origY = link.y;
                link.handleInput(im);
                expect(link.y).toBeGreaterThan(origY);
            });

            it("sets Link's direction to down", () => {
                link.dir = 'UP';
                link.handleInput(im);
                expect(link.dir).toEqual('DOWN');
            });

            it('returns true', () => {
                expect(link.handleInput(im)).toEqual(true);
            });

            describe('and Link is already facing down', () => {
                beforeEach(() => {
                    link.dir = 'DOWN';
                });

                it("Link's step timer is advanced", () => {
                    const origStep = link.step;
                    const origStepTimer = link.stepTimer;
                    link.handleInput(im);
                    expect(link.step).toEqual(origStep);
                    expect(link.stepTimer).not.toEqual(origStepTimer);
                });

                describe('and it is time to switch frames', () => {
                    beforeEach(() => {
                        link.stepTimer = 1;
                    });

                    it("updates Link's step frame", () => {
                        const origStep = link.step;
                        const origStepTimer = link.stepTimer;
                        link.handleInput(im);
                        expect(link.step).not.toEqual(origStep);
                        expect(link.stepTimer).not.toEqual(origStepTimer);
                    });
                });
            });
        });

        describe('when the left arrow is pressed', () => {
            beforeEach(() => {
                vi.spyOn(im, 'isKeyDown').mockImplementation((key: Keys) => {
                    return key === Keys.KEY_LEFT_ARROW;
                });
            });

            it("Link's x-coordinate is updated", () => {
                const origX = link.x;
                link.handleInput(im);
                expect(link.x).toBeLessThan(origX);
            });

            it("sets Link's direction to LEFT", () => {
                link.dir = 'UP';
                link.handleInput(im);
                expect(link.dir).toEqual('LEFT');
            });

            it('returns true', () => {
                expect(link.handleInput(im)).toEqual(true);
            });

            describe('and Link is already facing left', () => {
                beforeEach(() => {
                    link.dir = 'LEFT';
                });

                it("Link's step timer is advanced", () => {
                    const origStep = link.step;
                    const origStepTimer = link.stepTimer;
                    link.handleInput(im);
                    expect(link.step).toEqual(origStep);
                    expect(link.stepTimer).not.toEqual(origStepTimer);
                });

                describe('and it is time to switch frames', () => {
                    beforeEach(() => {
                        link.stepTimer = 1;
                    });

                    it("updates Link's step frame", () => {
                        const origStep = link.step;
                        const origStepTimer = link.stepTimer;
                        link.handleInput(im);
                        expect(link.step).not.toEqual(origStep);
                        expect(link.stepTimer).not.toEqual(origStepTimer);
                    });
                });
            });
        });

        describe('when the right arrow is pressed', () => {
            beforeEach(() => {
                vi.spyOn(im, 'isKeyDown').mockImplementation((key: Keys) => {
                    return key === Keys.KEY_RIGHT_ARROW;
                });
            });

            it("Link's x-coordinate is updated", () => {
                const origX = link.x;
                link.handleInput(im);
                expect(link.x).toBeGreaterThan(origX);
            });

            it("sets Link's direction to RIGHT", () => {
                link.dir = 'UP';
                link.handleInput(im);
                expect(link.dir).toEqual('RIGHT');
            });

            it('returns true', () => {
                expect(link.handleInput(im)).toEqual(true);
            });

            describe('and Link is already facing right', () => {
                beforeEach(() => {
                    link.dir = 'RIGHT';
                });

                it("Link's step timer is advanced", () => {
                    const origStep = link.step;
                    const origStepTimer = link.stepTimer;
                    link.handleInput(im);
                    expect(link.step).toEqual(origStep);
                    expect(link.stepTimer).not.toEqual(origStepTimer);
                });

                describe('and it is time to switch frames', () => {
                    beforeEach(() => {
                        link.stepTimer = 1;
                    });

                    it("updates Link's step frame", () => {
                        const origStep = link.step;
                        const origStepTimer = link.stepTimer;
                        link.handleInput(im);
                        expect(link.step).not.toEqual(origStep);
                        expect(link.stepTimer).not.toEqual(origStepTimer);
                    });
                });
            });
        });
    });

    describe('incBombCount()', () => {
        it('plays a sound', () => {
            link.incBombCount(1);
            expect(mockPlaySound).toHaveBeenCalledExactlyOnceWith('getItem');
        });

        it('increments bomb count', () => {
            link.incBombCount(-link.getBombCount() + 5);
            link.incBombCount(1);
            expect(link.getBombCount()).toEqual(6);
        });

        it("won't go over the max bomb count", () => {
            link.setMaxBombCount(9999);
            link.incBombCount(10000);
            expect(link.getBombCount()).toEqual(9999);
        });
    });

    describe('incHealth()', () => {
        it('plays a sound when health is increased', () => {
            link.incHealth(-link.getHealth() + 1);
            link.incHealth(1);
            expect(mockPlaySound).toHaveBeenCalledWith('heart');
        });

        it('increments health', () => {
            link.incHealth(-link.getHealth() + 3);
            link.incHealth(2);
            expect(link.getHealth()).toEqual(5);
        });

        it("won't go over the max health", () => {
            link.incHealth(100);
            expect(link.getHealth()).toEqual(link.getMaxHealth());
        });
    });

    describe('incRupeeCount()', () => {
        it('increments rupee count', () => {
            link.incRupeeCount(5);
            expect(link.getRupeeCount()).toEqual(5);
        });

        it.skip("won't go over the max rupee count", () => {
            link.incRupeeCount(1000);
            expect(link.getRupeeCount()).toEqual(999);
        });
    });

    describe('isAnimationRunning()', () => {
        it('returns false if anim is not defined', () => {
            expect(link.isAnimationRunning()).toEqual(false);
        });

        it('returns true if anim is defined', () => {
            link.enterCave({ animationCompleted: vi.fn() });
            expect(link.isAnimationRunning()).toEqual(true);
        });
    });

    describe('moveX()', () => {
        describe('when Link is not moving into a new screen', () => {
            beforeEach(() => {
                link.setLocation(100, 100);
            });

            it("moves Link's x-coordinate", () => {
                const origX = link.x;
                link.moveX(5);
                expect(link.x).toEqual(origX + 5);
            });

            it("moves Link's hitbox", () => {
                const origHitBox = { x: link.hitBox.x, y: link.hitBox.y };
                link.moveX(5);
                expect(link.hitBox.x).toEqual(origHitBox.x + 5);
                expect(link.hitBox.y).toEqual(origHitBox.y);
            });

            // TODO: Tests for snapping to grid
        });

        describe('when Link is moving into a new screen on the right', () => {
            beforeEach(() => {
                link.setLocation(TILE_WIDTH * SCREEN_COL_COUNT - 1, 100);
            });

            it('updates the main game state', () => {
                link.moveX(5);
                expect(mockMainGameState.changeScreenHorizontally).toHaveBeenCalledExactlyOnceWith(1);
            });
        });

        describe('when Link is moving into a new screen on the left', () => {
            beforeEach(() => {
                link.setLocation(0, 100);
            });

            it('updates the main game state', () => {
                link.moveX(-5);
                expect(mockMainGameState.changeScreenHorizontally).toHaveBeenCalledExactlyOnceWith(-1);
            });
        });
    });

    describe('moveY()', () => {
        describe('when Link is not moving into a new screen', () => {
            beforeEach(() => {
                link.setLocation(100, 100);
            });

            it("moves Link's y-coordinate", () => {
                const origY = link.y;
                link.moveY(5);
                expect(link.y).toEqual(origY + 5);
            });

            it("moves Link's hitbox", () => {
                const origHitBox = { x: link.hitBox.x, y: link.hitBox.y };
                link.moveY(5);
                expect(link.hitBox.x).toEqual(origHitBox.x);
                expect(link.hitBox.y).toEqual(origHitBox.y + 5);
            });

            // TODO: Tests for snapping to grid
        });

        describe('when Link is moving into a new screen lower', () => {
            beforeEach(() => {
                link.setLocation(100, TILE_HEIGHT * SCREEN_ROW_COUNT - 1);
            });

            it('updates the main game state', () => {
                link.moveY(5);
                expect(mockMainGameState.changeScreenVertically).toHaveBeenCalledExactlyOnceWith(1);
            });
        });

        describe('when Link is moving into a new screen above', () => {
            beforeEach(() => {
                link.setLocation(100, -9);
            });

            it('updates the main game state', () => {
                link.moveY(-5);
                expect(mockMainGameState.changeScreenVertically).toHaveBeenCalledExactlyOnceWith(-1);
            });
        });
    });

    describe('paint()', () => {
        let ctx: CanvasRenderingContext2D;
        let fillRectSpy: MockInstance<typeof ctx.fillRect>;
        let assetsGetSpy: MockInstance<typeof game.assets.get>;

        beforeEach(() => {
            ctx = game.getRenderingContext();
            fillRectSpy = vi.spyOn(ctx, 'fillRect').mockImplementation(() => {});
            assetsGetSpy = vi.spyOn(game.assets, 'get');
        });

        describe('when link is done', () => {
            beforeEach(() => {
                link.done = true;
            });

            describe('and has no animation', () => {
                beforeEach(() => {
                    link.anim = null;
                    link.paint(ctx);
                });

                it('does not draw a hitbox', () => {
                    expect(fillRectSpy).not.toHaveBeenCalled();
                });

                it('does not fetch a sprite sheet to draw Link', () => {
                    expect(assetsGetSpy).not.toHaveBeenCalled();
                });
            });

            describe('and has an animation', () => {
                beforeEach(() => {
                    link.enterCave({ animationCompleted: vi.fn() });
                    link.paint(ctx);
                });

                it('does not draw a hitbox', () => {
                    expect(fillRectSpy).not.toHaveBeenCalled();
                });

                it('fetches a sprite sheet to draw the animation', () => {
                    expect(assetsGetSpy).toHaveBeenCalledExactlyOnceWith('link');
                });

                it('renders a frame from the animation sprite sheet', () => {
                    expect(mockSpriteSheet.drawByIndex).toHaveBeenCalledOnce();
                });
            });
        });

        describe('when Link is not done', () => {
            beforeEach(() => {
                link.paint(ctx);
            });

            it('does not draw a hitbox', () => {
                expect(fillRectSpy).not.toHaveBeenCalled();
            });

            it('fetches a sprite sheet to draw the animation', () => {
                expect(assetsGetSpy).toHaveBeenCalledExactlyOnceWith('link');
            });

            it('renders a frame from the animation sprite sheet', () => {
                expect(mockSpriteSheet.drawByIndex).toHaveBeenCalledOnce();
            });
        });
    });

    describe('setAnimation()', () => {
        let anim: Animation;

        beforeEach(() => {
            anim = createAnimation(game, mockSpriteSheet as unknown as SpriteSheet);
            link.setAnimation(anim);
        });

        it('sets the animation', () => {
            expect(link.anim).toBeDefined();
        });

        it('freezes Link', () => {
            expect(link.frozen).toEqual(true);
        });

        it('unfreezes Link when the animation is done', () => {
            vi.spyOn(game, 'playTime', 'get').mockReturnValue(1000);
            anim.update();
            vi.spyOn(game, 'playTime', 'get').mockReturnValue(1020);
            anim.update();
            expect(link.frozen).toEqual(false);
        });
    });

    describe('toggleSwordThrowingStrategy()', () => {
        it('works', () => {
            expect(link.toggleSwordThrowingStrategy()).toEqual('always');
            expect(link.toggleSwordThrowingStrategy()).toEqual('maxHearts');
            expect(link.toggleSwordThrowingStrategy()).toEqual('always');
        });
    });

    describe('update()', () => {
        describe('when Link is taking damage', () => {
            beforeEach(() => {
                link.collidedWith(new Octorok(game));
            });

            it('continues to be in a "taking damage" state for the expected length of time', () => {
                for (let i = 0; i < Link.MAX_TAKING_DAMAGE_TICK - 1; i++) {
                    link.update();
                    expect(link.takingDamage).toEqual(true);
                }
                link.update();
                expect(link.takingDamage).toEqual(false);
            });
        });

        describe('if Link has an animation', () => {
            beforeEach(() => {
                link.enterCave({ animationCompleted: vi.fn() });
                vi.spyOn(game, 'playTime', 'get').mockReturnValue(1000);
                link.update();
                vi.spyOn(game, 'playTime', 'get').mockReturnValue(10121);
                link.update();
            });

            it('updates the animation', () => {
                expect(link.anim?.frame).toEqual(1);
            });
        });

        describe('updateWalkingStep()', () => {
            it('does not throw an exception', () => {
                expect(() => {
                    link.updateWalkingStep();
                }).not.toThrow();
            })
        });
    });
});
