import { describe, expect, it } from 'vitest';
import { isHorizontal, isVertical, opposite, ordinal, randomDir } from './Direction';

describe('Direction', () => {
    it('isHorizontal() should work', () => {
        expect(isHorizontal('LEFT')).toEqual(true);
        expect(isHorizontal('RIGHT')).toEqual(true);
        expect(isHorizontal('UP')).toEqual(false);
        expect(isHorizontal('DOWN')).toEqual(false);
        expect(isHorizontal(null)).toEqual(false);
        expect(isHorizontal(undefined)).toEqual(false);
    });

    it('isVertical() should work', () => {
        expect(isVertical('LEFT')).toEqual(false);
        expect(isVertical('RIGHT')).toEqual(false);
        expect(isVertical('UP')).toEqual(true);
        expect(isVertical('DOWN')).toEqual(true);
        expect(isVertical(null)).toEqual(false);
        expect(isVertical(undefined)).toEqual(false);
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
