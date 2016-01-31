module zelda {
    'use strict';

    export enum Direction {
        DOWN,
        LEFT,
        UP,
        RIGHT
    }

    export class DirectionUtil {

        static ordinal(dir: Direction): number {
            switch (dir) {
                default:
                case Direction.DOWN:
                    return 0;
                case Direction.LEFT:
                    return 1;
                case Direction.UP:
                    return 2;
                case Direction.RIGHT:
                    return 3;
            }
        }
    }
}