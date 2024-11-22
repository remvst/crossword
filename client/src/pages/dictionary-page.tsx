import { DictionaryItem } from "@remvst/crossword";
import React from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Stack from 'react-bootstrap/stack';
import { useDictionary } from "../context/use-dictionary";

function DictionaryItemComponent(props: {
    word: string,
    definition: string,
    onWordChanged: (word: string) => void,
    onDefinitionChanged: (definitionChanged: string) => void,
    onDelete?: () => void,
}) {
    return (
        <Form>
            <InputGroup>
                <Form.Control
                    type="text"
                    placeholder="Word"
                    value={props.word}
                    onChange={(e) => props.onWordChanged(e.target.value.trim().toLowerCase())} />

                <InputGroup.Text>:</InputGroup.Text>

                <Form.Control
                    type="text"
                    className="w-50"
                    placeholder="Definition"
                    value={props.definition}
                    onChange={(e) => props.onDefinitionChanged(e.target.value)} />

                <Button variant="danger" onClick={props.onDelete}>
                    X
                </Button>
            </InputGroup>
        </Form>
    );
}

export function DictionaryPage() {
    const { dictionary, deleteItem, updateItem } = useDictionary();
    const visibleItems = Array.from(dictionary.words).concat([new DictionaryItem('', '')]);

    return (
        <>
            <p>{dictionary.words.size} words</p>

            <Stack gap={3}>
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
            </Stack>
        </>
    );
}
