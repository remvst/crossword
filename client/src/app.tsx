import React from 'react';
import { DictionaryPage } from "./pages/dictionary-page";
import { createDictionaryContext, DictionaryContext } from "./use-dictionary";

export function App() {
    return (
        <DictionaryContext.Provider value={createDictionaryContext()}>
            <DictionaryPage />
        </DictionaryContext.Provider>
    )
}
