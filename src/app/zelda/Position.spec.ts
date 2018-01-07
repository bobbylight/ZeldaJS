import { Position, PositionData } from './Position';
import * as chai from 'chai';

describe('Position', () => {

    it('empty constructor works', () => {
        const pos: Position = new Position();
        chai.assert.equal(pos.row, 0);
        chai.assert.equal(pos.col, 0);
    });

    it('constructor taking object works', () => {
        const pos: Position = new Position({ row: 2, col: 3 });
        chai.assert.equal(pos.row, 2);
        chai.assert.equal(pos.col, 3);
    });

    it('constructor taking row and col works', () => {
        const pos: Position = new Position(2, 3);
        chai.assert.equal(pos.row, 2);
        chai.assert.equal(pos.col, 3);
    });

    it('constructor taking just row works', () => {
        const pos: Position = new Position(2);
        chai.assert.equal(pos.row, 2);
        chai.assert.equal(pos.col, 0);
    });

    it('clone() works', () => {
        const pos: Position = new Position(2, 3).clone();
        chai.assert.equal(pos.row, 2);
        chai.assert.equal(pos.col, 3);
    });

    it('distanceSquared() works', () => {
        const p1: Position = new Position();
        const p2: Position = new Position(2, 2);
        chai.assert.equal(p2.distanceSquared(p1), 8);
    });

    it('equals() works', () => {
        chai.assert.isOk(new Position(2, 3).equals(2, 3));
        chai.assert.isNotOk(new Position().equals(2, 3));
    });

    it('fromJson() works', () => {
        const pos: Position = new Position();
        pos.fromJson({ row: 2, col: 3 });
        chai.assert.equal(pos.row, 2);
        chai.assert.equal(pos.col, 3);
    });

    it('set(Position) works', () => {
        const pos: Position = new Position();
        pos.set(new Position(2, 3));
        chai.assert.equal(pos.row, 2);
        chai.assert.equal(pos.col, 3);
    });

    it('set(row, col) works', () => {
        const pos: Position = new Position();
        pos.set(2, 3);
        chai.assert.equal(pos.row, 2);
        chai.assert.equal(pos.col, 3);
    });

    it('toJson() works', () => {
        const json: PositionData = new Position(2, 3).toJson();
        chai.assert.equal(json.row, 2);
        chai.assert.equal(json.col, 3);
    });

    it('toString() works', () => {
        const str: string = new Position(2, 3).toString();
        chai.assert.equal(str, '[Position: row=2, col=3]');
    });
});
