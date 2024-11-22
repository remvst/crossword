import { AnswerGrid, Grid } from "@remvst/crossword";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useGrid } from "./use-grid";

const GRID_HASH_KEY = 'answers-hash';
const ANSWERS_KEY = 'answers';

export const AnswerGridContext = createContext<ReturnType<typeof createAnswerGridContext>>(null);

export function useAnswerGrid() {
    return useContext(AnswerGridContext);
}
export function AnswerGridProvider(props: React.PropsWithChildren<{}>) {
    return (
        <AnswerGridContext.Provider value={createAnswerGridContext()}>
            {props.children}
        </AnswerGridContext.Provider>
    );
};

function createAnswerGridContext() {
    const { grid } = useGrid();

    const gridHash = useMemo(() => JSON.stringify(grid), [grid]);

    const loaded = useMemo(() => {
        const loadedGridHash = localStorage.getItem(GRID_HASH_KEY);
        const answerGrid = new AnswerGrid(grid.rows, grid.cols);

        if (loadedGridHash === gridHash) {
            try {
                const parsed = JSON.parse(localStorage.getItem(ANSWERS_KEY));
                for (let row = 0; row < grid.rows; row++) {
                    for (let col = 0; col < grid.cols; col++) {
                        answerGrid.cells[row][col] = parsed[row][col] || null;
                    }
                }
            } catch (err) {}
        }

        return {
            gridHash: loadedGridHash,
            answerGrid
        };
    }, []);

    const [answerGrid, setAnswerGrid] = useState<AnswerGrid>(loaded.answerGrid);
    const [savedGridHash, setSavedGridHash] = useState<string>(loaded.gridHash);

    useEffect(() => {
        if (savedGridHash !== gridHash) {
            setAnswerGrid(new AnswerGrid(grid.rows, grid.cols));
        }
    }, [gridHash, savedGridHash]);

    useEffect(() => {
        localStorage.setItem(GRID_HASH_KEY, gridHash);
        localStorage.setItem(ANSWERS_KEY, JSON.stringify(answerGrid.cells));

        setSavedGridHash(gridHash);
    }, [gridHash, answerGrid]);

    return {
        answerGrid,
        setAnswerGrid,
    };
}
