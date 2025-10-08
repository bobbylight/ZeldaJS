import { Animation } from '@/Animation';
import { ZeldaGame } from '@/ZeldaGame';
import { SpriteSheet } from 'gtp';
import FadeOutInState from 'gtp/lib/gtp/FadeOutInState';
import { TitleState } from '@/TitleState';
import { AnimationListener } from '@/AnimationListener';

export type AnimationGenerator = (game: ZeldaGame, x: number, y: number, completedCallback?: AnimationListener) => Animation;

const createEnemyDiesAnimation: AnimationGenerator = (game, x: number, y: number, completedCallback): Animation => {
    const sheet: SpriteSheet = game.assets.get('enemyDies');
    const anim: Animation = new Animation(game, x, y);

    anim.addFrame({ sheet: sheet, index: 0 }, 30);
    anim.addFrame({ sheet: sheet, index: 1 }, 30);
    anim.addFrame({ sheet: sheet, index: 2 }, 30);
    anim.addFrame({ sheet: sheet, index: 3 }, 30);
    anim.addFrame({ sheet: sheet, index: 16 }, 30);
    anim.addFrame({ sheet: sheet, index: 17 }, 30);
    anim.addFrame({ sheet: sheet, index: 18 }, 30);
    anim.addFrame({ sheet: sheet, index: 19 }, 30);
    anim.addFrame({ sheet: sheet, index: 0 }, 30);
    anim.addFrame({ sheet: sheet, index: 1 }, 30);
    anim.addFrame({ sheet: sheet, index: 2 }, 30);
    anim.addFrame({ sheet: sheet, index: 3 }, 30);

    if (completedCallback) {
        anim.addListener(completedCallback);
    }
    return anim;
}

const createLinkDyingAnimation: AnimationGenerator = (game, x, y, completedCallback): Animation => {
    const sheet: SpriteSheet = game.assets.get('link');
    const anim: Animation = new Animation(game, x, y);

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

    // TODO: Share with createEnemyDiesAnimation()
    const enemyDiesSheet: SpriteSheet = game.assets.get('enemyDies');
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
                game.audio.playSound('text');
                dieChirpPlayed = true;
            }
        },

        animationCompleted: (anim: Animation) => {
            game.setState(new FadeOutInState(game.state, new TitleState(game)));
        },
    });

    if (completedCallback) {
        anim.addListener(completedCallback);
    }
    return anim;
}

const createStairsDownAnimation: AnimationGenerator = (game, x, y, completedCallback): Animation => {
    const animation: Animation = new Animation(game, x, y);
    const linkSheet: SpriteSheet = game.assets.get('link');
    const frameMillis = 120;

    animation.addFrame({ sheet: linkSheet, index: 17 }, frameMillis);
    animation.addFrame({ sheet: linkSheet, index: 4 }, frameMillis);
    animation.addFrame({ sheet: linkSheet, index: 5 }, frameMillis);
    animation.addFrame({ sheet: linkSheet, index: 6 }, frameMillis);
    animation.addFrame({ sheet: linkSheet, index: 7 }, frameMillis);
    animation.addFrame({ sheet: linkSheet, index: 8 }, frameMillis);
    animation.addFrame({ sheet: linkSheet, index: 9 }, frameMillis);
    animation.addFrame({ sheet: linkSheet, index: 10 }, frameMillis);

    if (completedCallback) {
        animation.addListener(completedCallback);
    }
    return animation;
};

const createStairsUpAnimation: AnimationGenerator = (game, x, y, completedCallback): Animation => {
    const animation: Animation = new Animation(game, x, y);
    const linkSheet: SpriteSheet = game.assets.get('link');
    const frameMillis = 120;

    animation.addFrame({ sheet: linkSheet, index: 19 }, frameMillis);
    animation.addFrame({ sheet: linkSheet, index: 20 }, frameMillis);
    animation.addFrame({ sheet: linkSheet, index: 21 }, frameMillis);
    animation.addFrame({ sheet: linkSheet, index: 22 }, frameMillis);
    animation.addFrame({ sheet: linkSheet, index: 23 }, frameMillis);
    animation.addFrame({ sheet: linkSheet, index: 24 }, frameMillis);
    animation.addFrame({ sheet: linkSheet, index: 25 }, frameMillis);
    animation.addFrame({ sheet: linkSheet, index: 15 }, frameMillis);

    if (completedCallback) {
        animation.addListener(completedCallback);
    }
    return animation;
}

export { createEnemyDiesAnimation, createLinkDyingAnimation, createStairsDownAnimation, createStairsUpAnimation };
