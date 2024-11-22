import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import { GridComponent } from "../components/grid-component";
import { useAnswerGrid } from "../context/use-answer-grid";
import { useGrid } from "../context/use-grid";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { Typeahead } from "react-bootstrap-typeahead";
import { useDictionary } from "../context/use-dictionary";

export function GridPage() {
    const { grid, reseed } = useGrid();
    const { categories } = useDictionary();
    const { answerGrid, setAnswerGrid } = useAnswerGrid();

    const [selectedCategories, setSelectedCategories] = useState(categories);

    return (<>
        <GridComponent
            grid={grid}
            answerGrid={answerGrid}
            setAnswerGrid={setAnswerGrid}
        />

        <div className="my-2" style={{ textAlign: 'center' }}>
            <Button variant="primary" onClick={reseed}>New grid</Button>
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
