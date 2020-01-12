import { DirectionUtil } from './Direction';

describe('Direction', () => {

    it('DirectionUtil.isHorizontal() should work', () => {
        expect(DirectionUtil.isHorizontal('LEFT')).toBeTruthy();
        expect(DirectionUtil.isHorizontal('RIGHT')).toBeTruthy();
        expect(DirectionUtil.isHorizontal('UP')).toBeFalsy();
        expect(DirectionUtil.isHorizontal('DOWN')).toBeFalsy();
        expect(DirectionUtil.isHorizontal(null)).toBeFalsy();
        expect(DirectionUtil.isHorizontal(undefined)).toBeFalsy();
    });

    it('DirectionUtil.isVertical() should work', () => {
        expect(DirectionUtil.isVertical('LEFT')).toBeFalsy();
        expect(DirectionUtil.isVertical('RIGHT')).toBeFalsy();
        expect(DirectionUtil.isVertical('UP')).toBeTruthy();
        expect(DirectionUtil.isVertical('DOWN')).toBeTruthy();
        expect(DirectionUtil.isVertical(null)).toBeFalsy();
        expect(DirectionUtil.isVertical(undefined)).toBeFalsy();
    });

    it('DirectionUtil.opposite() should work', () => {
        expect(DirectionUtil.opposite('LEFT')).toStrictEqual('RIGHT');
        expect(DirectionUtil.opposite('RIGHT')).toStrictEqual('LEFT');
        expect(DirectionUtil.opposite('UP')).toStrictEqual('DOWN');
        expect(DirectionUtil.opposite('DOWN')).toStrictEqual('UP');
    });

    it('DirectionUtil.ordinal() should work', () => {
        expect(DirectionUtil.ordinal('LEFT')).toStrictEqual(1);
        expect(DirectionUtil.ordinal('RIGHT')).toStrictEqual(3);
        expect(DirectionUtil.ordinal('UP')).toStrictEqual(2);
        expect(DirectionUtil.ordinal('DOWN')).toStrictEqual(0);
    });

    it('DirectionUtil.randomDir() should work', () => {
        expect(DirectionUtil.randomDir()).toBeDefined();
    });
});
