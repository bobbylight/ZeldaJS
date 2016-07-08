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

        protected throwProjectile() {
            if (this.blue) {
                // TODO: This sould be abstracted better somehow, just for testing for now.
                // For example, perhaps a canThrowProjectile() method with a createProjectile()
                // method
                const arrow: Arrow = new Arrow(this.x, this.y, this.dir);
                game.map.currentScreen.addActor(arrow);
                console.log('adding arrow');
            }
        }

        update() {

            if (this.blue && !this._slidingDir && game.randomInt(100) === 0) {
                this.pausedBeforeThrowingProjectile = 30;
            }

            super.update();
        }
    }
}