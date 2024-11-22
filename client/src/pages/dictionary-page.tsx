import { DictionaryItem } from "@remvst/crossword";
import React, { useMemo, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Stack from 'react-bootstrap/stack';
import { useDictionary } from "../context/use-dictionary";
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015

function DictionaryItemComponent(props: {
    word: string,
    definition: string,
    category: string,
    categories: string[],
    onWordChanged: (word: string) => void,
    onDefinitionChanged: (definition: string) => void,
    onCategoryChanged: (category: string) => void,
    onDelete: () => void,
}) {
    const [inputWord, setInputWord] = useState(props.word);
    const [inputDefinition, setInputDefinition] = useState(props.definition);

    return (
        <Form>
            <InputGroup>
                <Typeahead
                    id="basic-typeahead-single"
                    options={props.categories}
                    placeholder="Category"
                    selected={props.category ? [props.category] : []}
                    onInputChange={(text) => {
                        props.onCategoryChanged(text);
                    }}
                    onChange={(selected) => {
                        props.onCategoryChanged(selected[0] as string || '');
                    }} />

                <Form.Control
                    type="text"
                    placeholder="Word"
                    value={inputWord}
                    onChange={(e) => setInputWord(e.target.value.trim().toLowerCase())}
                    onBlur={() => props.onWordChanged(inputWord)} />

                <InputGroup.Text>:</InputGroup.Text>

                <Form.Control
                    type="text"
                    className="w-50"
                    placeholder="Definition"
                    value={inputDefinition}
                    onChange={(e) => setInputDefinition(e.target.value)}
                    onBlur={() => props.onDefinitionChanged(inputDefinition)} />

                <Button variant="danger" onClick={props.onDelete}>
                    X
                </Button>
            </InputGroup>
        </Form>
    );
}

export function DictionaryPage() {
    const { dictionary, deleteItem, updateItem, categories } = useDictionary();
    const visibleItems = Array.from(dictionary.words).concat([new DictionaryItem('', '', '')]);

    return (
        <>
            <p>{dictionary.words.size} words</p>

            <Stack gap={3}>
                {visibleItems.map((word, index) => (
                    <DictionaryItemComponent
                        key={index}
                        word={word.word}
                        definition={word.definition}
                        category={word.category}
                        categories={categories}
                        onWordChanged={(word) => {
                            updateItem(index, (item) => new DictionaryItem(word, item.definition, item.category));
                        }}
                        onDefinitionChanged={(definition) => {
                            updateItem(index, (item) => new DictionaryItem(item.word, definition, item.category));
                        }}
                        onCategoryChanged={(category) => {
                            updateItem(index, (item) => new DictionaryItem(item.word, item.definition, category));
                        }}
                        onDelete={() => deleteItem(index)}
                    />
                ))}
            </Stack>
        </>
    );
}
