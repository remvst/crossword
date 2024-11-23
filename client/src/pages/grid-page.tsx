import { AnswerGrid, Dictionary, Grid, GridBuilder } from "@remvst/crossword";
import React, { useMemo, useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { GridComponent } from "../components/grid-component";
import { useDictionary } from "../context/use-dictionary";

export function GridPage() {
    const { categories } = useDictionary();

    const [selectedCategories, setSelectedCategories] = useState<string[]>(categories);
    const [seed, setSeed] = useState<number>(0);
    const [answerGrid, setAnswerGrid] = useState<AnswerGrid>();

    const { dictionary } = useDictionary();

    const grid = useMemo(() => {
        const subDictionary = dictionary.clone();
        for (const item of Array.from(dictionary.words)) {
            if (!selectedCategories.includes(item.category)) {
                subDictionary.words.delete(item);
            }
        }

        const builder = new GridBuilder(new Grid(20, 20), subDictionary, seed);
        builder.build();
        setAnswerGrid(new AnswerGrid(builder.grid.rows, builder.grid.cols));
        return builder.grid;
    }, [dictionary, seed, selectedCategories]);

    return (<>
        <GridComponent
            grid={grid}
            answerGrid={answerGrid}
            setAnswerGrid={setAnswerGrid}
        />

        <div className="my-2" style={{ textAlign: 'center' }}>
            <Button variant="primary" onClick={() => setSeed(seed + 1)}>New grid</Button>
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
                    onChange={(selected) => {
                        setSelectedCategories(selected as string[]);
                    }} />

            </InputGroup>
        </Form>
    </>);
}
