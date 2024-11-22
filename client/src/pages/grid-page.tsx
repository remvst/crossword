import React from "react";
import { GridComponent } from "../components/grid-component";
import { useAnswerGrid } from "../context/use-answer-grid";
import { useGrid } from "../context/use-grid";

export function GridPage() {
    const { grid, reseed } = useGrid();
    const { answerGrid, setAnswerGrid } = useAnswerGrid();

    return (<div>
        <h1>Grid</h1>

        <button onClick={reseed}>New grid</button>

        <GridComponent
            grid={grid}
            answerGrid={answerGrid}
            setAnswerGrid={setAnswerGrid}
            />
    </div>)
}
