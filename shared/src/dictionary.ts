import { Constraint } from "./constraint";

export class DictionaryItem {
    constructor(
        public word: string,
        public definition: string,
    ) {
    }
}

export class Dictionary {
    readonly words = new Set<DictionaryItem>();

    findWord(constraints: Constraint[]): DictionaryItem[] {
        const res: DictionaryItem[] = [];
        for (const word of this.words) {
            if (!constraints.every(constraint => constraint.matches(word.word))) {
                continue;
            }
            res.push(word);
        }
        return res;
    }

    clone() {
        return new Dictionary();
    }
}
