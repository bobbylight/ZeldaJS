module zelda {
    'use strict';

    const CHANGE_DIR_TIMER_MAX: number = 120; // 2 seconds

    export class Octorok extends AbstractWalkingEnemy {

        constructor(blue: boolean = false) {
            super(0, blue, blue ? 5 : 4); //2 : 1);
        }

        protected getChangeDirTimerMax(): number {
            return CHANGE_DIR_TIMER_MAX;
        }

        protected getSpeed(): number {
            return this.blue ? 1 : 0.5;
        }
    }
}