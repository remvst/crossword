import { Dictionary, DictionaryItem } from "@remvst/crossword";
import { createContext, useContext, useMemo, useState } from "react";

const DICTIONARY_KEY = 'dictionary';

export const DictionaryContext = createContext<ReturnType<typeof createDictionaryContext>>(null);

export function useDictionary() {
    return useContext(DictionaryContext);
}

export function createDictionaryContext() {
    const initialItems: DictionaryItem[] = [];
    try {
        const parsed = JSON.parse(localStorage.getItem(DICTIONARY_KEY));
        for (const { word, definition } of parsed) {
            initialItems.push(new DictionaryItem(word, definition));
        }
    } catch (err) {
        console.error(err);
    }

    const [items, setItems] = useState<DictionaryItem[]>(initialItems);

    function save(items: DictionaryItem[]) {
        localStorage.setItem(DICTIONARY_KEY, JSON.stringify(items.map(item => ({
            word: item.word,
            definition: item.definition,
        }))));
    }

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
        save(newItems);
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
        save(newItems);
    }

    return {
        dictionary,
        updateItem,
        deleteItem,
    };
}
