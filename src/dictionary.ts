import { Constraint } from "./constraint";

export class Dictionary {
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
