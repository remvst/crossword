import { Dictionary, DictionaryItem } from "@remvst/crossword";
import React, { createContext, useContext, useMemo, useState } from "react";

const DICTIONARY_KEY = 'dictionary';

export const DictionaryContext = createContext<ReturnType<typeof createDictionaryContext>>(null);

export function useDictionary() {
    return useContext(DictionaryContext);
}

export function DictionaryProvider(props: React.PropsWithChildren<{}>) {
    return (
        <DictionaryContext.Provider value={createDictionaryContext()}>
            {props.children}
        </DictionaryContext.Provider>
    );
};

function createDictionaryContext() {
    const initialItems: DictionaryItem[] = [];
    try {
        const parsed = JSON.parse(localStorage.getItem(DICTIONARY_KEY));
        for (const { word, definition, category } of parsed) {
            initialItems.push(new DictionaryItem(word, definition, category));
        }
    } catch (err) {
        console.error(err);
    }

    const [items, setItems] = useState<DictionaryItem[]>(initialItems);

    function save(items: DictionaryItem[]) {
        localStorage.setItem(DICTIONARY_KEY, JSON.stringify(items.map(item => ({
            word: item.word || '',
            definition: item.definition || '',
            category: item.category || '',
        }))));
    }

    const categories = useMemo(() => {
        return Array.from(new Set(items.map(item => item.category || '').filter(cat => !!cat))).sort();
    }, [items]);

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

    function updateItem(index: number, update: (item: DictionaryItem) => DictionaryItem) {
        const newItems = items.slice();
        const existing = newItems[index] || new DictionaryItem('', '', '');
        newItems[index] = update(existing);

        // Avoid firing unnecessary updates
        if (
            newItems[index].category === existing.category &&
            newItems[index].word === existing.word &&
            newItems[index].definition === existing.definition
        ) {
            return;
        }

        setItems(newItems);
        save(newItems);
    }

    return {
        dictionary,
        categories,
        updateItem,
        deleteItem,
    };
}
