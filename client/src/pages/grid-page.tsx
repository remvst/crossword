import { AnswerGrid, Dictionary, Grid, GridBuilder } from "@remvst/crossword";
import React, { useEffect, useMemo, useState } from "react";
import { Highlighter, Token, Typeahead } from "react-bootstrap-typeahead";
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { GridComponent } from "../components/grid-component";
import { useDictionary } from "../context/use-dictionary";

export function GridPage() {
    const { categories } = useDictionary();

    const [selectedCategories, setSelectedCategories] = useState<string[]>(categories);
    const [seed, setSeed] = useState<number>(0);
    const [answerGrid, setAnswerGrid] = useState<AnswerGrid>(new AnswerGrid(20, 20));
    const [reversed, setReversed] = useState(false);

    const { dictionary } = useDictionary();

    const grid = useMemo(() => {
        let subDictionary = dictionary.clone();
        for (const item of Array.from(dictionary.words)) {
            if (!selectedCategories.includes(item.category)) {
                subDictionary.words.delete(item);
            }
        }

        if (reversed) {
            subDictionary = subDictionary.reversed();
        }

        const builder = new GridBuilder(new Grid(20, 20), subDictionary, seed);
        builder.build();
        return builder.grid;
    }, [dictionary, seed, selectedCategories, reversed]);

    useEffect(() => {
        setAnswerGrid(new AnswerGrid(grid.rows, grid.cols));
    }, [grid]);

    return (<>
        <GridComponent
            grid={grid}
            answerGrid={answerGrid}
            setAnswerGrid={setAnswerGrid}
        />

        <div className="my-2" style={{ textAlign: 'center' }}>
            <Button variant="primary" onClick={() => setSeed(seed + 1)}>New grid</Button>
            {' '}
            <Button variant="primary" onClick={() => setReversed(!reversed)}>Reverse dictionary</Button>
        </div>

        <Form>
            <InputGroup>
                <Typeahead
                    id="basic-typeahead-single"
                    options={categories}
                    placeholder="Categories"
                    selected={selectedCategories}
                    flip={true}
                    multiple={true}
                    renderMenuItemChildren={(option, { text }) => (
                        <Highlighter search={text}>{option as string || '(none)'}</Highlighter>
                    )}
                    renderToken={(option, { onRemove }, index) => (
                        <Token key={index} onRemove={onRemove} option={option}>
                          {option as string || '(none)'}
                        </Token>
                      )}
                    onChange={(selected) => {
                        setSelectedCategories(selected as string[]);
                    }} />

            </InputGroup>
        </Form>
    </>);
}
