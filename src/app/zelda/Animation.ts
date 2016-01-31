module zelda {
    'use strict';

    export class Animation {

        private _frames: Frame[];
        private _loopingStartFrame: number;
        private _curFrame: number;
        private _lastTime: number;
        private _totalTime: number;
        private _done: boolean;
        private _listeners: AnimationListener[];

        constructor() {
            this._frames = [];
            this._loopingStartFrame = -1;
            this._totalTime = -1;
            this._done = false;
            this._listeners = [];
        }

        addFrame(sheetAndIndex: SpriteSheetAndIndex, frameTime: number) {
            this._frames.push(new Frame(sheetAndIndex, frameTime));
        }

        addListener(listener: AnimationListener) {
            this._listeners.push(listener);
        }

        private _fireFrameUpdate() {
            this._listeners.forEach(function(listener: AnimationListener) {
                listener.animationFrameUpdate(this);
            });
        }

        get frame(): number {
            return this._curFrame;
        }

        get frameCount(): number {
            return this._frames.length;
        }

        get height(): number {
            return this.done ? 0 : this._frames[this._curFrame].sheetAndIndex.sheet.cellH;
        }

        get width(): number {
            return this.done ? 0 : this._frames[this._curFrame].sheetAndIndex.sheet.cellW;
        }

        get done(): boolean {
            return this._done;
        }

        get looping(): boolean {
            return this._loopingStartFrame > -1;
        }

        paint(ctx: CanvasRenderingContext2D, x: number, y: number) {
            const sheetAndIndex: SpriteSheetAndIndex = this._frames[this._curFrame].sheetAndIndex;
            sheetAndIndex.sheet.drawByIndex(ctx, x, y, sheetAndIndex.index);
        }

        private _setDone() {
            this._done = true;
            this._listeners.forEach(function(listener: AnimationListener) {
                listener.animationCompleted(this);
            });
            this._listeners = [];
        }

        /**
         * Toggles whether this animation should "loop" when it reaches its
         * final frame.
         *
         * @param {boolean} loop Whether the animation should loop.  If this is
         *        <code>true</code>, then after rendering the final frame, the
         *        first frame will be rendered and the animation will continue.
         *        If this is <code>false</code>, this animation will be done after
         *        the final frame is rendered.
         * @see looping
         * @see setLoopingFromFrame
         */
        set looping(loop: boolean) {
            this._loopingStartFrame = loop ? 0 : -1;
        }

        /**
         * Starts this animation looping, but instead of looping back to frame
         * 0, it loops back to frame <code>frame</code>.
         *
         * @param {number} frame The frame to loop "back" to.
         * @see looping
         */
        set loopingFromFrame(frame: number) {
            this._loopingStartFrame = frame;
        }

        update() {

            if (this.done) {
                return;
            }

            if (this._totalTime === -1) {
                this._totalTime = 0;
            }
            else {
                const curTime: number = game.playTime;
                if (this._lastTime === 0) {
                    this._lastTime = curTime;
                }
                else {
                    this._totalTime += (curTime - this._lastTime);
                    this._lastTime = curTime;
                }
            }

            if (this._totalTime > this._frames[this._curFrame].time && !this.done) {

                this._totalTime = 0;
                this._curFrame++;

                if (this._curFrame === this._frames.length) {
                    if (this._loopingStartFrame > -1) {
                        this._curFrame = this._loopingStartFrame;
                        this._fireFrameUpdate();
                    }
                    else {
                        this._setDone();
                        return;
                    }
                }
                else {
                    this._fireFrameUpdate();
                }
            }
        }
    }

    /**
     * Structure representing a single frame in an <code>Animation</code>.
     */
    export interface SpriteSheetAndIndex {

        sheet: gtp.SpriteSheet;
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
}