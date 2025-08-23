import { describe, expect, it } from 'vitest';
import { isHorizontal, isVertical, opposite, ordinal, randomDir } from './Direction';

describe('Direction', () => {
    it('isHorizontal() should work', () => {
        expect(isHorizontal('LEFT')).toBeTruthy();
        expect(isHorizontal('RIGHT')).toBeTruthy();
        expect(isHorizontal('UP')).toBeFalsy();
        expect(isHorizontal('DOWN')).toBeFalsy();
        expect(isHorizontal(null)).toBeFalsy();
        expect(isHorizontal(undefined)).toBeFalsy();
    });

    it('isVertical() should work', () => {
        expect(isVertical('LEFT')).toBeFalsy();
        expect(isVertical('RIGHT')).toBeFalsy();
        expect(isVertical('UP')).toBeTruthy();
        expect(isVertical('DOWN')).toBeTruthy();
        expect(isVertical(null)).toBeFalsy();
        expect(isVertical(undefined)).toBeFalsy();
    });

    it('opposite() should work', () => {
        expect(opposite('LEFT')).toStrictEqual('RIGHT');
        expect(opposite('RIGHT')).toStrictEqual('LEFT');
        expect(opposite('UP')).toStrictEqual('DOWN');
        expect(opposite('DOWN')).toStrictEqual('UP');
    });

    it('ordinal() should work', () => {
        expect(ordinal('LEFT')).toStrictEqual(1);
        expect(ordinal('RIGHT')).toStrictEqual(3);
        expect(ordinal('UP')).toStrictEqual(2);
        expect(ordinal('DOWN')).toStrictEqual(0);
    });

    it('randomDir() should work', () => {
        expect(randomDir()).toBeDefined();
    });
});
