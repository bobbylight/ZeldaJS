import {Utils} from 'gtp';

export type Direction = 'DOWN' | 'LEFT' | 'UP' | 'RIGHT';

export class DirectionUtil {

    private static DIRECTIONS: Direction[] = [ 'DOWN', 'LEFT', 'UP', 'RIGHT' ];

    static isHorizontal(dir?: Direction | null): boolean {
        return dir === 'LEFT' || dir === 'RIGHT';
    }

    static isVertical(dir?: Direction | null): boolean {
        return dir === 'UP' || dir === 'DOWN';
    }

    static opposite(dir: Direction): Direction {

        let opposite: Direction = 'UP';

        switch (dir) {
            case 'DOWN':
                opposite = 'UP';
                break;
            case 'LEFT':
                opposite = 'RIGHT';
                break;
            case 'UP':
                opposite = 'DOWN';
                break;
            case 'RIGHT':
                opposite = 'LEFT';
                break;
        }

        return opposite;
    }

    static ordinal(dir: Direction): number {
        switch (dir) {
            default:
            case 'DOWN':
                return 0;
            case 'LEFT':
                return 1;
            case 'UP':
                return 2;
            case 'RIGHT':
                return 3;
        }
    }

    static randomDir(): Direction {
        return DirectionUtil.DIRECTIONS[Utils.randomInt(4)];
    }
}
