import { Dictionary, DictionaryItem } from "@remvst/crossword";
import { createContext, useContext, useMemo, useState } from "react";

export const DictionaryContext = createContext<ReturnType<typeof createDictionaryContext>>(null);

export function useDictionary() {
    return useContext(DictionaryContext);
}

export function createDictionaryContext() {
    const [items, setItems] = useState<DictionaryItem[]>([
        new DictionaryItem('hello', 'a greeting'),
        new DictionaryItem('baby', 'a tiny human'),
    ]);

    // TODO load from localStorage

    const dictionary = useMemo(() => {
        const dict = new Dictionary();
        for (const item of items) {
            dict.words.add(item);
        }
        return dict;
    }, [items]);

    function deleteItem(index: number) {
        const newItems = items.slice();
        newItems.splice(index, 1);
        setItems(newItems);
    }

    function updateItem(index: number, update: (item: DictionaryItem) => void) {
        const newItems = items.slice();
        if (index >= items.length) {
            newItems.push(new DictionaryItem('', ''));
        }

        const existing = newItems[index];

        const copy = new DictionaryItem(existing.word, existing.definition);
        update(copy);
        newItems[index] = copy;

        setItems(newItems);
    }

    return {
        dictionary,
        updateItem,
        deleteItem,
    };
}
