import { DictionaryItem } from "@remvst/crossword";
import React from "react";
import { useDictionary } from "../use-dictionary";

function DictionaryItemComponent(props: {
    word: string,
    definition: string,
    onWordChanged: (word: string) => void,
    onDefinitionChanged: (definitionChanged: string) => void,
    onDelete?: () => void,
}) {
    return (
        <tr>
            <td>
                <input
                    type="text"
                    value={props.word}
                    onChange={(e) => props.onWordChanged(e.target.value)} />
            </td>

            <td>
                <input
                    type="text"
                    value={props.definition}
                    onChange={(e) => props.onDefinitionChanged(e.target.value)} />
            </td>

            <td>
                {props.onDelete ? <button onClick={props.onDelete}>
                    Delete
                </button> : null}
            </td>
        </tr>
    );
}

export function DictionaryPage() {
    const { dictionary, deleteItem, updateItem } = useDictionary();
    const visibleItems = Array.from(dictionary.words).concat([new DictionaryItem('', '')]);

    return (
        <>
            <h1>Dictionary</h1>

            <h2>Words</h2>

            <table>
                <thead>
                    <tr>
                        <th>Word</th>
                        <th>Definition</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {visibleItems.map((word, index) => (
                        <DictionaryItemComponent
                            key={index}
                            word={word.word}
                            definition={word.definition}
                            onWordChanged={(word) => {
                                updateItem(index, (item) => new DictionaryItem(word, item.definition));
                            }}
                            onDefinitionChanged={(definition) => {
                                updateItem(index, (item) => new DictionaryItem(item.word, definition));
                            }}
                            onDelete={() => deleteItem(index)}
                            />
                    ))}
                </tbody>
            </table>
        </>
    );
}
