import { Constraint } from "./constraint";

export class DictionaryItem {
    constructor(
        readonly word: string,
        readonly definition: string,
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
        const dictionary = new Dictionary();
        for (const word of this.words) {
            dictionary.words.add(word);
        }
        return dictionary;
    }
}
