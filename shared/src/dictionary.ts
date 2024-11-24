import { Constraint } from "./constraint";

export class DictionaryItem {
    constructor(
        readonly word: string,
        readonly definition: string,
        readonly category: string,
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

    reversed() {
        const dictionary = new Dictionary();
        for (const { word, definition, category } of this.words) {
            if (definition.indexOf(' ') >= 0) continue;
            dictionary.words.add(new DictionaryItem(definition, word, category));
        }
        return dictionary;
    }
}
