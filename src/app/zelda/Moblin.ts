module zelda {
    'use strict';

    const CHANGE_DIR_TIMER_MAX: number = 120; // 2 seconds

    export class Moblin extends AbstractWalkingEnemy {

        constructor(blue: boolean = true) {
            super(4, blue, blue ? 3 : 2);
        }

        protected getChangeDirTimerMax(): number {
            return CHANGE_DIR_TIMER_MAX;
        }

        protected getSpeed(): number {
            return 0.5; //this.blue ? 1 : 0.5;
        }
    }
}