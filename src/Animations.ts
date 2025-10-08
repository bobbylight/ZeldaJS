import { Animation } from '@/Animation';
import { ZeldaGame } from '@/ZeldaGame';
import { SpriteSheet } from 'gtp';

export type AnimationGenerator = (game: ZeldaGame, x: number, y: number) => Animation;

const createBombSmokeAnimation: AnimationGenerator = (game: ZeldaGame, x: number, y: number) => {
    const sheet: SpriteSheet = game.assets.get('link')

    const anim = new Animation(game, x, y);
    anim.addFrame({ sheet, index: 34 }, 350);
    anim.addFrame({ sheet, index: 35 }, 150);
    anim.addFrame({ sheet, index: 36 }, 50);
    return anim;
};

export { createBombSmokeAnimation };
