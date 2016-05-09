module zelda {
    'use strict';

    const STEP_TIMER_MAX: number = 10;

    export abstract class Enemy extends Character {

        protected _health: number;

        private _step: number;
        private _stepTimer: number;

        constructor(health: number = 1) {
            super();
            this._health = health;

            this._step = 0;
            this._stepTimer = STEP_TIMER_MAX;
        }

        collidedWith(other: Actor): boolean {

            if (this.takingDamage) {
                return;
            }

            if (other instanceof Sword) {
                if (--this._health === 0) {
                    this.done = true;
                    game.audio.playSound('enemyDie');
                    game.addEnemyDiesAnimation(this.x, this.y);
                }
                else {
                    game.audio.playSound('enemyHit');
                    this.takingDamage = true;
                    this._slideTick = 30;
                    this._slidingDir = other.dir;
                }
            }
        }

        get health(): number {
            return this._health;
        }

        get step(): number {
            return this._step;
        }

        set health(health: number) {
            this._health = health;
        }

        protected _touchStepTimer() {
            this._stepTimer--;
            if (this._stepTimer === 0) {
                this._step = (this._step + 1) % 2;
                this._stepTimer = STEP_TIMER_MAX;
            }
        }
    }
}