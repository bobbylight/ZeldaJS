module zelda {
    'use strict';

    /**
     * A base class for entities that can attack and/or be attacked.
     */
    export abstract class Character extends Actor {

        static MAX_SLIDE_TICK: number = 30;

        protected _slideTick: number;
        protected _slidingDir: Direction;

        constructor() {
            super();
            this._slideTick = 0;
            this._slidingDir = null;
        }

    }
}