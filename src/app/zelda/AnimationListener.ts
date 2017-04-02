import {Animation} from './Animation';

/**
 * Listens for an animation completing.
 */
export interface AnimationListener {

    /**
     * If defined, called when an animation updates to a new frame.
     *
     * @param {Animation} anim The animation that updated.
     */
    animationFrameUpdate?: (anim: Animation) => void;

    /**
     * Called when the animation completes.
     *
     * @param {Animation} anim The animation that completed.
     */
    animationCompleted(anim: Animation): void;
}
