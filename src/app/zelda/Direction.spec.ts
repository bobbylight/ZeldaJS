import { DirectionUtil } from './Direction';
import * as chai from 'chai';

describe('Direction', () => {

    it('DirectionUtil.isHorizontal() should work', () => {
        chai.assert.isOk(DirectionUtil.isHorizontal('LEFT'));
        chai.assert.isOk(DirectionUtil.isHorizontal('RIGHT'));
        chai.assert.isNotOk(DirectionUtil.isHorizontal('UP'));
        chai.assert.isNotOk(DirectionUtil.isHorizontal('DOWN'));
        chai.assert.isNotOk(DirectionUtil.isHorizontal(null));
        chai.assert.isNotOk(DirectionUtil.isHorizontal(undefined));
    });

    it('DirectionUtil.isVertical() should work', () => {
        chai.assert.isNotOk(DirectionUtil.isVertical('LEFT'));
        chai.assert.isNotOk(DirectionUtil.isVertical('RIGHT'));
        chai.assert.isOk(DirectionUtil.isVertical('UP'));
        chai.assert.isOk(DirectionUtil.isVertical('DOWN'));
        chai.assert.isNotOk(DirectionUtil.isVertical(null));
        chai.assert.isNotOk(DirectionUtil.isVertical(undefined));
    });

    it('DirectionUtil.opposite() should work', () => {
        chai.assert.equal(DirectionUtil.opposite('LEFT'), 'RIGHT');
        chai.assert.equal(DirectionUtil.opposite('RIGHT'), 'LEFT');
        chai.assert.equal(DirectionUtil.opposite('UP'), 'DOWN');
        chai.assert.equal(DirectionUtil.opposite('DOWN'), 'UP');
    });

    it('DirectionUtil.ordinal() should work', () => {
        chai.assert.equal(DirectionUtil.ordinal('LEFT'), 1);
        chai.assert.equal(DirectionUtil.ordinal('RIGHT'), 3);
        chai.assert.equal(DirectionUtil.ordinal('UP'), 2);
        chai.assert.equal(DirectionUtil.ordinal('DOWN'), 0);
    });

    it('DirectionUtil.randomDir() should work', () => {
        chai.assert.isDefined(DirectionUtil.randomDir());
    });
});
