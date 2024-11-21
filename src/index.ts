interface Constraint {
    readonly key: string;
    matches(word: string): boolean;
}

class ExactLengthConstraint implements Constraint {
    constructor(private length: number) {}

    get key() { return `exact-length-${this.length}`; }

    matches(word: string): boolean {
        return word.length === this.length;
    }
}

class MaxLengthConstraint implements Constraint {

    constructor(private readonly length: number) {}

    get key() { return `max-length-${this.length}`; }

    matches(word: string): boolean {
        return word.length <= this.length;
    }
}

class ContainsCharacterConstraint implements Constraint {
    constructor(private character: string, readonly position: number) {

    }

    get key() { return `contains-character-${this.character}-${this.position}`; }

    matches(word: string): boolean {
        return word.charAt(this.position) === this.character;
    }
}

class Dictionary {
    readonly words = new Set<string>();

    findWord(constraints: Constraint[]): string[] {
        const res: string[] = [];
        for (const word of this.words) {
            if (!constraints.every(constraint => constraint.matches(word))) {
                continue;
            }
            res.push(word);
        }
        return res;
    }
}

const BOUNDARY = '#';

type WordBounds = [
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
]

class Grid {
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
        fromRow: number,
        fromCol: number,
        toRow: number,
        toCol: number,
    ) {
        if (fromRow !== toRow && fromCol !== toCol) {
            throw new Error('Only horizontal or vertical constraints are supported');
        }

        const length = Math.max(toRow - fromRow, toCol - fromCol) + 1;
        if (word.length !== length) {
            throw new Error('Word length does not match the placement');
        }

        if (fromRow === toRow) {
            this.setCell(fromRow, fromCol - 1, BOUNDARY);
            this.setCell(fromRow, toCol + 1, BOUNDARY);
        } else {
            this.setCell(fromRow - 1, fromCol, BOUNDARY);
            this.setCell(toRow + 1, fromCol, BOUNDARY);
        }

        for (const [row, col, charIndex] of this.iterateCells(fromRow, fromCol, toRow, toCol)) {
            this.setCell(row, col, word.charAt(charIndex));
        }
    }

    maxWordLength(fromRow: number, fromCol: number, toRow: number, toCol: number) {
        let charIndex = 0;
        for (const [row, col, index] of this.iterateCells(fromRow, fromCol, toRow, toCol)) {
            const existingChar = this.cells[row][col];
            if (existingChar === BOUNDARY)  {
                break;
            }
            charIndex++;
        }

        return charIndex;
    }

    * iterateCells(
        fromRow: number,
        fromCol: number,
        toRow: number,
        toCol: number,
    ) {
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

    constraints(
        fromRow: number,
        fromCol: number,
        toRow: number,
        toCol: number,
    ) {
        const constraints: Constraint[] = [];

        let maxLength = 0;
        for (const [row, col, charIndex] of this.iterateCells(fromRow, fromCol, toRow, toCol)) {
            const existingChar = this.cells[row][col];
            if (existingChar !== null)  {
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

class GridBuilder {

    constructor(
        readonly grid: Grid,
        readonly dictionary: Dictionary,
    ) {
    }

    createNewWord(vertical: boolean) {
        const openings: WordBounds[] = [];
        for (let row = 0 ; row < this.grid.rows ; row += 2) {
            for (let col = 0 ; col < this.grid.cols ; col += 2) {
                const maxWordLength = this.grid.maxWordLength(
                    row,
                    col,
                    vertical ? row + 999 : row,
                    vertical ? col : col + 999,
                );
                if (maxWordLength >= 2) {
                    openings.push([
                        row,
                        col,
                        vertical ? row + maxWordLength - 1 : row,
                        vertical ? col : col + maxWordLength - 1,
                    ]);
                }
            }
        }

        for (const opening of openings) {
            const constraints = this.grid.constraints(
                opening[0],
                opening[1],
                opening[2],
                opening[3],
            );

            const possibleWords = this.dictionary.findWord(constraints);
            if (!possibleWords.length) continue;

            const pickedWord = possibleWords[0]; // TODO improve pick

            this.grid.placeWord(
                pickedWord,
                opening[0],
                opening[1],
                vertical ? opening[0] + pickedWord.length - 1 : opening[0],
                vertical ? opening[1] : opening[1] + pickedWord.length - 1,
            );
            this.dictionary.words.delete(pickedWord);

            return;
        }
    }

    build() {
        let vertical = false;
        for (let i = 0 ; i < 100 && this.dictionary.words.size > 0 ; i++) {
            this.createNewWord(vertical);
            vertical = !vertical;
        }
    }
}

const dictionary = new Dictionary();
dictionary.words.add('hello');
dictionary.words.add('there');
dictionary.words.add('eligible');
dictionary.words.add('entertain');
dictionary.words.add('my');
dictionary.words.add('name');
dictionary.words.add('is');
dictionary.words.add('remi');
dictionary.words.add('and');
dictionary.words.add('fun');
dictionary.words.add('boomer');
dictionary.words.add('zoomer');
dictionary.words.add('bike');
dictionary.words.add('bicycle');
dictionary.words.add('skateboard');
dictionary.words.add('board');
dictionary.words.add('boat');
dictionary.words.add('ball');
dictionary.words.add('bowl');
dictionary.words.add('bone');
dictionary.words.add('bile');
dictionary.words.add('rib');
dictionary.words.add('break');
dictionary.words.add('build');
dictionary.words.add('beast');
dictionary.words.add('power');
dictionary.words.add('broken');
dictionary.words.add('cripple');
dictionary.words.add('table');
dictionary.words.add('door');
dictionary.words.add('fantasy');
dictionary.words.add('fantastic');
dictionary.words.add('under');
dictionary.words.add('crab');
dictionary.words.add('trash');

const builder = new GridBuilder(new Grid(20, 20), dictionary);
builder.build();
console.log(builder.grid.toPrettyString());

// console.log('yuppie', words);
