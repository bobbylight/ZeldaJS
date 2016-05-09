module zelda {
    'use strict';

    export enum Direction {
        DOWN = 1,
        LEFT = 2,
        UP = 3,
        RIGHT = 4
    }

    export class DirectionUtil {

        static isHorizontal(dir: Direction): boolean {
            return dir === Direction.LEFT || dir === Direction.RIGHT;
        }

        static isVertical(dir: Direction): boolean {
            return dir === Direction.UP || dir === Direction.DOWN;
        }

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

        static randomDir(): Direction {
            return gtp.Utils.randomInt(1, 5);
        }
    }
}