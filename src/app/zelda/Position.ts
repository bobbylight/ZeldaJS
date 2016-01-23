module zelda {
    'use strict';

    /**
     * A row/column pair.
     */
    export class Position {

        row: number;
        col: number;

        constructor(row: number = 0, col: number = 0) {
            this.row = row;
            this.col = col;
        }

        distanceSquared(p2: Position): number {
            return (p2.row - this.row) * (p2.row - this.row) +
                (p2.col - this.col) * (p2.col - this.col);
        }

        equals(row: number, col: number) {
            return this.row === row && this.col === col;
        }

        set(row: number|Position, col: number = 0) {

            if (row instanceof Position) {
                this.row = row.row;
                this.col = row.col;
            }
            else {
                this.row = <number>row;
                this.col = col;
            }
        }

        toString(): string {
            return '[Position: ' +
                    'row=' + this.row +
                    ', col=' + this.col +
                    ']';
        }
    }
}