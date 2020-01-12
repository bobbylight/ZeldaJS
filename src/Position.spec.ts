import { Position, PositionData } from './Position';

describe('Position', () => {

    it('empty constructor works', () => {
        const pos: Position = new Position();
        expect(pos.row).toStrictEqual(0);
        expect(pos.col).toStrictEqual(0);
    });

    it('constructor taking object works', () => {
        const pos: Position = new Position({ row: 2, col: 3 });
        expect(pos.row).toStrictEqual(2);
        expect(pos.col).toStrictEqual(3);
    });

    it('constructor taking row and col works', () => {
        const pos: Position = new Position(2, 3);
        expect(pos.row).toStrictEqual(2);
        expect(pos.col).toStrictEqual(3);
    });

    it('constructor taking just row works', () => {
        const pos: Position = new Position(2);
        expect(pos.row).toStrictEqual(2);
        expect(pos.col).toStrictEqual(0);
    });

    it('clone() works', () => {
        const pos: Position = new Position(2, 3).clone();
        expect(pos.row).toStrictEqual(2);
        expect(pos.col).toStrictEqual(3);
    });

    it('distanceSquared() works', () => {
        const p1: Position = new Position();
        const p2: Position = new Position(2, 2);
        expect(p2.distanceSquared(p1)).toStrictEqual(8);
    });

    it('equals() works', () => {
        expect(new Position(2, 3).equals(2, 3)).toBeTruthy();
        expect(new Position().equals(2, 3)).toBeFalsy();
    });

    it('fromJson() works', () => {
        const pos: Position = new Position();
        pos.fromJson({ row: 2, col: 3 });
        expect(pos.row).toStrictEqual(2);
        expect(pos.col).toStrictEqual(3);
    });

    it('set(Position) works', () => {
        const pos: Position = new Position();
        pos.set(new Position(2, 3));
        expect(pos.row).toStrictEqual(2);
        expect(pos.col).toStrictEqual(3);
    });

    it('set(row, col) works', () => {
        const pos: Position = new Position();
        pos.set(2, 3);
        expect(pos.row).toStrictEqual(2);
        expect(pos.col).toStrictEqual(3);
    });

    it('toJson() works', () => {
        const json: PositionData = new Position(2, 3).toJson();
        expect(json.row).toStrictEqual(2);
        expect(json.col).toStrictEqual(3);
    });

    it('toString() works', () => {
        const str: string = new Position(2, 3).toString();
        expect(str).toStrictEqual('[Position: row=2, col=3]');
    });
});
