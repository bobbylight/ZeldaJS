import { Utils } from 'gtp';

export type Direction = 'DOWN' | 'LEFT' | 'UP' | 'RIGHT';

const DIRECTIONS: Direction[] = [ 'DOWN', 'LEFT', 'UP', 'RIGHT' ];

export const isHorizontal = (dir?: Direction | null): boolean => {
    return dir === 'LEFT' || dir === 'RIGHT';
};

export const isVertical = (dir?: Direction | null): boolean => {
    return dir === 'UP' || dir === 'DOWN';
};

export const opposite = (dir: Direction): Direction => {
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
};

export const ordinal = (dir: Direction): number => {
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
};

export const randomDir = (): Direction => {
    return DIRECTIONS[Utils.randomInt(4)];
};
