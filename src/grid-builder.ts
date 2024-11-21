import { Dictionary } from "./dictionary";
import { Grid, WordBounds } from "./grid";

export class GridBuilder {

    constructor(
        readonly grid: Grid,
        readonly dictionary: Dictionary,
    ) {
    }

    createNewWord(vertical: boolean) {
        const openings: WordBounds[] = [];
        for (let row = 0 ; row < this.grid.rows ; row += 2) {
            for (let col = 0 ; col < this.grid.cols ; col += 2) {
                const maxWordLength = this.grid.maxWordLength([
                    row,
                    col,
                    vertical ? row + 999 : row,
                    vertical ? col : col + 999,
                ]);
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
            const constraints = this.grid.constraints(opening);

            const possibleWords = this.dictionary.findWord(constraints);
            if (!possibleWords.length) continue;

            const pickedWord = possibleWords[0]; // TODO improve pick

            this.grid.placeWord(
                pickedWord,
                [
                    opening[0],
                    opening[1],
                    vertical ? opening[0] + pickedWord.length - 1 : opening[0],
                    vertical ? opening[1] : opening[1] + pickedWord.length - 1,
                ],
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
