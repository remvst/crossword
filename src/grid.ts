import { Constraint, ContainsCharacterConstraint, MaxLengthConstraint } from "./constraint";

const BOUNDARY = '#';

export type WordBounds = [
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
]


export class Grid {
    readonly cells: string[][];

    constructor(readonly rows: number, readonly cols: number) {
        this.cells = [];
        for (let row = 0 ; row < rows ; row++) {
            this.cells.push([]);
            for (let col = 0 ; col < cols ; col++) {
                this.cells[row].push(null);
            }
        }
    }

    setCell(row: number, col: number, value: string) {
        if (row < 0 || row >= this.rows) return;
        if (col < 0 || col >= this.cols) return;
        this.cells[row][col] = value;
    }

    getRow(row: number): string[] {
        return this.cells[row];
    }

    getColumn(column: number): string[] {
        return this.cells.map(row => row[column]);
    }

    placeWord(
        word: string,
        bounds: WordBounds,
    ) {
        const [fromRow, fromCol, toRow, toCol] = bounds;

        const length = Math.max(toRow - fromRow, toCol - fromCol) + 1;
        if (word.length !== length) {
            throw new Error('Word length does not match the placement');
        }

        for (const [row, col, charIndex] of this.iterateCells(bounds)) {
            this.setCell(row, col, word.charAt(charIndex));
        }

        if (fromRow === toRow) {
            this.setCell(fromRow, fromCol - 1, BOUNDARY);
            this.setCell(fromRow, toCol + 1, BOUNDARY);
        } else {
            this.setCell(fromRow - 1, fromCol, BOUNDARY);
            this.setCell(toRow + 1, fromCol, BOUNDARY);
        }

    }

    maxWordLength(bounds: WordBounds) {
        let charIndex = 0;
        for (const [row, col, index] of this.iterateCells(bounds)) {
            const existingChar = this.cells[row][col];
            if (existingChar === BOUNDARY)  {
                break;
            }
            charIndex++;
        }

        return charIndex;
    }

    * iterateCells(bounds: WordBounds) {
        const [fromRow, fromCol, toRow, toCol] = bounds;

        if (fromRow !== toRow && fromCol !== toCol) {
            throw new Error('Only horizontal or vertical constraints are supported');
        }

        let charIndex = 0;
        for (let row = fromRow ; row <= Math.min(toRow, this.rows - 1) ; row++) {
            for (let col = fromCol ; col <= Math.min(toCol, this.cols - 1) ; col++) {
                yield [row, col, charIndex++];
            }
        }
    }

    constraints(bounds: WordBounds) {
        const constraints: Constraint[] = [];

        let maxLength = 0;
        for (const [row, col, charIndex] of this.iterateCells(bounds)) {
            const existingChar = this.cells[row][col];
            if (existingChar !== null) {
                constraints.push(new ContainsCharacterConstraint(existingChar, charIndex));
            }

            maxLength = charIndex + 1;
        }

        constraints.push(new MaxLengthConstraint(maxLength));

        return constraints;
    }

    toPrettyString() {
        return this.cells.map(row => row.map(c => c || '.').join('')).join('\n');
    }
}
