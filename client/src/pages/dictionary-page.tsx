import { DictionaryItem } from "@remvst/crossword";
import React from "react";
import { useDictionary } from "../context/use-dictionary";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function DictionaryItemComponent(props: {
    word: string,
    definition: string,
    onWordChanged: (word: string) => void,
    onDefinitionChanged: (definitionChanged: string) => void,
    onDelete?: () => void,
}) {
    return (
        <Row>
            <Col>
                <Form.Control
                    type="text"
                    value={props.word}
                    onChange={(e) => props.onWordChanged(e.target.value)} />
            </Col>

            <Col>
                <Form.Control
                    type="text"
                    value={props.definition}
                    onChange={(e) => props.onDefinitionChanged(e.target.value)} />
            </Col>

            <Col md="auto">
                {props.onDelete ? <Button variant="danger" onClick={props.onDelete}>
                    Delete
                </Button> : null}
            </Col>
        </Row>
    );
}

export function DictionaryPage() {
    const { dictionary, deleteItem, updateItem } = useDictionary();
    const visibleItems = Array.from(dictionary.words).concat([new DictionaryItem('', '')]);

    return (
        <>
            <h1>Dictionary</h1>

            <Container>
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
            </Container>
        </>
    );
}
