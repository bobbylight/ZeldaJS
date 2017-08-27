/**
 * A row/column pair.
 */
export class Position {

    row: number;
    col: number;

    constructor(row: number | PositionData = 0, col: number = 0) {
        if (typeof row === 'number') {
            this.row = row;
            this.col = col;
        }
        else {
            this.row = row.row;
            this.col = row.col;
        }
    }

    clone(): Position {
        return new Position(this.row, this.col);
    }

    distanceSquared(p2: Position): number {
        return (p2.row - this.row) * (p2.row - this.row) +
            (p2.col - this.col) * (p2.col - this.col);
    }

    equals(row: number, col: number) {
        return this.row === row && this.col === col;
    }

    fromJson(data: PositionData) {
        this.set(data.row, data.col);
    }

    set(row: number | Position, col: number = 0) {

        if (row instanceof Position) {
            this.row = row.row;
            this.col = row.col;
        }
        else {
            this.row = row;
            this.col = col;
        }
    }

    toJson(): PositionData {
        return { row: this.row, col: this.col };
    }

    toString(): string {
        return '[Position: ' +
                'row=' + this.row +
                ', col=' + this.col +
                ']';
    }
}

export interface PositionData {
    row: number;
    col: number;
}
