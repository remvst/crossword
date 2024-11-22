import { AnswerGrid, Grid, WordBounds } from "@remvst/crossword";
import React, { useEffect, useMemo, useRef, useState } from "react";
import './grid-component.css';
import { useAnswerGrid } from "../context/use-answer-grid";

function Cell(props: {
    character: string,
    selected: boolean,
    highlighted: boolean,
    incorrect: boolean,
    onClick: () => void,
}) {
    return <td
        onClick={props.onClick}
        className={[
            props.selected ? 'selected' : '',
            props.highlighted ? 'highlighted' : '',
            props.incorrect ? 'incorrect' : '',
        ].join(' ')}
    >
        <div>{props.character}</div>
    </td>;
}

function BlackCell() {
    return <td className="black"></td>;
}

export function GridComponent(props: {
    grid: Grid,
    answerGrid: AnswerGrid,
    setAnswerGrid: (grid: AnswerGrid) => void,
}) {
    const [selectedRow, setSelectedRow] = useState(0);
    const [selectedCol, setSelectedCol] = useState(0);
    const [vertical, setVertical] = useState(false);

    // Reset selection when the grid changes
    useEffect(() => {
        setSelectedRow(0);
        setSelectedCol(0);
        setVertical(false);
    }, [props.grid]);

    const highlight = useMemo<WordBounds>(() => {
        let fromRow = selectedRow;
        let fromCol = selectedCol;

        let toRow = selectedRow;
        let toCol = selectedCol;

        if (vertical) {
            while (fromRow > 0 && props.grid.cells[fromRow - 1][fromCol].dictionaryItems.vertical) {
                fromRow--;
            }
            while (toRow < props.grid.rows - 1 && props.grid.cells[toRow + 1][fromCol].dictionaryItems.vertical) {
                toRow++;
            }
        } else {
            while (fromCol > 0 && props.grid.cells[fromRow][fromCol - 1].dictionaryItems.horizontal) {
                fromCol--;
            }
            while (toCol < props.grid.cols - 1 && props.grid.cells[fromRow][toCol + 1].dictionaryItems.horizontal) {
                toCol++;
            }
        }

        return [fromRow, fromCol, toRow, toCol];
    }, [selectedRow, selectedCol, vertical, props.grid]);

    function onClick(row: number, col: number) {
        let newVertical = vertical;
        if (selectedRow === row && selectedCol === col) {
            newVertical = !vertical;
        }
        if (newVertical && !props.grid.cells[row][col].dictionaryItems.vertical) {
            newVertical = false;
        }
        if (!newVertical && !props.grid.cells[row][col].dictionaryItems.horizontal) {
            newVertical = true;
        }
        setVertical(newVertical);

        setSelectedRow(row);
        setSelectedCol(col);

        inputRef.current.focus();
    }

    function onCharacterTyped(input: string) {
        const trimmed = input.trim();
        const character = trimmed.toLowerCase();
        if (character >= 'a' && character <= 'z') {
            const newAnswerGrid = props.answerGrid.clone();
            newAnswerGrid.setCell(selectedRow, selectedCol, character);
            props.setAnswerGrid(newAnswerGrid);

            let newSelectedRow = selectedRow;
            let newSelectedCol = selectedCol;
            if (vertical) {
                newSelectedRow++;
            } else {
                newSelectedCol++;
            }

            if (props.grid.isFillable(newSelectedRow, newSelectedCol)) {
                setSelectedRow(newSelectedRow);
                setSelectedCol(newSelectedCol);
            }

            return;
        }

        if (input === '') {
            const newAnswerGrid = props.answerGrid.clone();
            newAnswerGrid.setCell(selectedRow, selectedCol, null);
            props.setAnswerGrid(newAnswerGrid);

            let newSelectedRow = selectedRow;
            let newSelectedCol = selectedCol;
            if (vertical) {
                newSelectedRow--;
            } else {
                newSelectedCol--;
            }

            if (props.grid.isFillable(newSelectedRow, newSelectedCol)) {
                setSelectedRow(newSelectedRow);
                setSelectedCol(newSelectedCol);
            }

            return;
        }
    }

	const inputRef = useRef(null);

    useEffect(() => inputRef.current.focus());

    const definition = useMemo(() => {
        const { dictionaryItems } = props.grid.cells[selectedRow][selectedCol];
        return (vertical ? dictionaryItems.vertical : dictionaryItems.horizontal)?.definition;
    }, [selectedRow, selectedCol, vertical]);

    return (
        <div>
            <div className="grid-definition">
                <p>{definition}&nbsp;</p>
            </div>

            <input
                type="text"
                onChange={(e) => onCharacterTyped(e.target.value)}
                value={' '}
                style={{opacity: 0, position: 'absolute', width: 0, height: 0}}
                ref={inputRef} />
            <table className="grid">
                <tbody>
                    {Array(props.grid.rows).fill(0).map((_, row) => (
                        <tr key={`row-${row}`}>
                            {Array(props.grid.cols).fill(0).map((_, col) => {
                                const definition = props.grid.cells[row][col].dictionaryItems;
                                const isBlack = definition.horizontal === null && definition.vertical === null;
                                if (isBlack) {
                                    return <BlackCell key={`col-${col}`} />
                                }

                                return <Cell
                                    key={`col-${col}`}
                                    character={props.answerGrid.cells[row][col]}
                                    selected={selectedRow === row && selectedCol === col}
                                    incorrect={props.answerGrid.cells[row][col] !== props.grid.cells[row][col].character}
                                    highlighted={row >= highlight[0] && row <= highlight[2] && col >= highlight[1] && col <= highlight[3]}
                                    onClick={() => onClick(row, col)} />;
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
