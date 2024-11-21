import { Constraint, ContainsCharacterConstraint, MaxLengthConstraint } from "./constraint";
import { DictionaryItem } from "./dictionary";

const BOUNDARY = '#';

export class GridCell {
    character: string = null;
    dictionaryItems = {
        horizontal: null as DictionaryItem,
        vertical: null as DictionaryItem,
    };
}

export type WordBounds = [
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
];

function isVertical(bounds: WordBounds) {
    return bounds[0] !== bounds[2];
}

function isHorizontal(bounds: WordBounds) {
    return bounds[1] !== bounds[3];
}

export class Grid {
    readonly cells: GridCell[][];

    constructor(readonly rows: number, readonly cols: number) {
        this.cells = [];
        for (let row = 0 ; row < rows ; row++) {
            this.cells.push([]);
            for (let col = 0 ; col < cols ; col++) {
                this.cells[row].push(new GridCell());
            }
        }
    }

    setCell(row: number, col: number, value: string) {
        if (row < 0 || row >= this.rows) return;
        if (col < 0 || col >= this.cols) return;
        this.cells[row][col].character = value;
    }

    placeWord(
        word: DictionaryItem,
        bounds: WordBounds,
    ) {
        const [fromRow, fromCol, toRow, toCol] = bounds;

        const length = Math.max(toRow - fromRow, toCol - fromCol) + 1;
        if (word.word.length !== length) {
            throw new Error('Word length does not match the placement');
        }

        for (const [row, col, charIndex] of this.iterateCells(bounds)) {
            this.setCell(row, col, word.word.charAt(charIndex));

            if (isVertical(bounds)) {
                this.cells[row][col].dictionaryItems.vertical = word;
            } else {
                this.cells[row][col].dictionaryItems.horizontal = word;
            }
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
            const existingChar = this.cells[row][col].character;
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
            const existingChar = this.cells[row][col].character;
            if (existingChar !== null) {
                constraints.push(new ContainsCharacterConstraint(existingChar, charIndex));
            }

            maxLength = charIndex + 1;
        }

        constraints.push(new MaxLengthConstraint(maxLength));

        return constraints;
    }

    toPrettyString() {
        return this.cells.map(row => row.map(c => c.character || '.').join('')).join('\n');
    }
}
