import React from "react";
import Button from 'react-bootstrap/Button';
import { GridComponent } from "../components/grid-component";
import { useAnswerGrid } from "../context/use-answer-grid";
import { useGrid } from "../context/use-grid";

export function GridPage() {
    const { grid, reseed } = useGrid();
    const { answerGrid, setAnswerGrid } = useAnswerGrid();

    return (<>
        <GridComponent
            grid={grid}
            answerGrid={answerGrid}
            setAnswerGrid={setAnswerGrid}
        />

        <div className="my-2" style={{ textAlign: 'center' }}>
            <Button variant="primary" onClick={reseed}>New grid</Button>
        </div>
    </>);
}
