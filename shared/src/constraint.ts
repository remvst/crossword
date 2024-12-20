export interface Constraint {
    readonly key: string;
    matches(word: string): boolean;
}

export class ExactLengthConstraint implements Constraint {
    constructor(private length: number) {}

    get key() { return `exact-length-${this.length}`; }

    matches(word: string): boolean {
        return word.length === this.length;
    }
}

export class MaxLengthConstraint implements Constraint {

    constructor(private readonly length: number) {}

    get key() { return `max-length-${this.length}`; }

    matches(word: string): boolean {
        return word.length <= this.length;
    }
}

export class MinLengthConstraint implements Constraint {

    constructor(private readonly length: number) {}

    get key() { return `min-length-${this.length}`; }

    matches(word: string): boolean {
        return word.length >= this.length;
    }
}

export class ContainsCharacterConstraint implements Constraint {
    constructor(private character: string, readonly position: number) {}

    get key() { return `contains-character-${this.character}-${this.position}`; }

    matches(word: string): boolean {
        if (this.position >= word.length + 1) return true;
        if (this.position >= word.length) return false;
        return word.charAt(this.position) === this.character;
    }
}
