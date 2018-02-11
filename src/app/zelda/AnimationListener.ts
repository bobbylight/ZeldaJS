import { Animation } from './Animation';

/**
 * Listens for an animation completing.
 */
export interface AnimationListener {

    /**
     * If defined, callbacks in this listener will be called with this value as the scope (<code>this</code>).
     */
    scope?: any | null | undefined;

    /**
     * If defined, called when an animation updates to a new frame.
     *
     * @param anim The animation that updated.
     */
    animationFrameUpdate?: (anim: Animation) => void;

    /**
     * Called when the animation completes.
     *
     * @param anim The animation that completed.
     */
    animationCompleted(anim: Animation): void;
}
