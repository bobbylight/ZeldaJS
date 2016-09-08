module zelda.event {
    'use strict';

    export abstract class Event {

        protected tile: Position;

        constructor(tile: Position) {
            this.tile = tile;
        }

        abstract execute(): boolean;

        abstract shouldOccur(): boolean;

        abstract update(): void;
    }
}