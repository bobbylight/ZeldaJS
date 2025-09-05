import { AnimationListener } from './AnimationListener';
import { ZeldaGame } from './ZeldaGame';
import { SpriteSheet } from 'gtp';

/**
 * Structure representing a single frame in an <code>Animation</code>.
 */
export interface SpriteSheetAndIndex {

    sheet: SpriteSheet;
    index: number;
}

/**
 * A frame in an animation.
 */
class Frame {
    sheetAndIndex: SpriteSheetAndIndex;
    time: number;

    constructor(sheetAndIndex: SpriteSheetAndIndex, time: number) {
        this.sheetAndIndex = sheetAndIndex;
        this.time = time;
    }
}

export class Animation {
    private x: number;
    private y: number;
    private readonly frames: Frame[];
    private loopingStartFrame: number;
    private curFrame: number;
    private lastTime: number;
    private totalTime: number;
    private done: boolean;
    private listeners: AnimationListener[];

    constructor(private readonly game: ZeldaGame, x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.frames = [];
        this.loopingStartFrame = -1;
        this.totalTime = -1;
        this.lastTime = 0;
        this.done = false;
        this.listeners = [];
        this.curFrame = 0;
    }

    addFrame(sheetAndIndex: SpriteSheetAndIndex, frameTime: number) {
        this.frames.push(new Frame(sheetAndIndex, frameTime));
    }

    addListener(listener: AnimationListener) {
        this.listeners.push(listener);
    }

    private fireFrameUpdate() {
        this.listeners.forEach((listener: AnimationListener) => {
            if (listener.animationFrameUpdate) {
                listener.animationFrameUpdate.call(listener.scope ?? listener, this);
            }
        });
    }

    get frame(): number {
        return this.curFrame;
    }

    get frameCount(): number {
        return this.frames.length;
    }

    get height(): number {
        return this.done ? 0 : this.frames[this.curFrame].sheetAndIndex.sheet.cellH;
    }

    get width(): number {
        return this.done ? 0 : this.frames[this.curFrame].sheetAndIndex.sheet.cellW;
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }

    get looping(): boolean {
        return this.loopingStartFrame > -1;
    }

    isDone(): boolean {
        return this.done;
    }

    paint(ctx: CanvasRenderingContext2D) {
        const sheetAndIndex: SpriteSheetAndIndex = this.frames[this.curFrame].sheetAndIndex;
        sheetAndIndex.sheet.drawByIndex(ctx, this.x, this.y, sheetAndIndex.index);
    }

    private setDone() {
        this.done = true;
        this.listeners.forEach((listener: AnimationListener) => {
            listener.animationCompleted.call(listener.scope ?? listener, this);
        });
        this.listeners = [];
    }

    /**
     * Toggles whether this animation should "loop" when it reaches its
     * final frame.
     *
     * @param loop Whether the animation should loop.  If this is
     *        <code>true</code>, then after rendering the final frame, the
     *        first frame will be rendered and the animation will continue.
     *        If this is <code>false</code>, this animation will be done after
     *        the final frame is rendered.
     * @see looping
     * @see setLoopingFromFrame
     */
    set looping(loop: boolean) {
        this.loopingStartFrame = loop ? 0 : -1;
    }

    /**
     * Starts this animation looping, but instead of looping back to frame
     * 0, it loops back to frame <code>frame</code>.
     *
     * @param frame The frame to loop "back" to.
     * @see looping
     */
    set loopingFromFrame(frame: number) {
        this.loopingStartFrame = frame;
    }

    setX(x: number) {
        this.x = x;
    }

    setY(y: number) {
        this.y = y;
    }

    update() {
        if (this.done) {
            return;
        }

        const curTime: number = this.game.playTime;
        if (this.totalTime === -1) {
            this.totalTime = 0;
        }
        else {
            this.totalTime += (curTime - this.lastTime);
        }
        this.lastTime = curTime;

        if (this.totalTime > this.frames[this.curFrame].time) {
            this.totalTime = 0;
            this.curFrame++;

            if (this.curFrame === this.frames.length) {
                if (this.loopingStartFrame > -1) {
                    this.curFrame = this.loopingStartFrame;
                    this.fireFrameUpdate();
                }
                else {
                    this.setDone();
                }
            }
            else {
                this.fireFrameUpdate();
            }
        }
    }
}
