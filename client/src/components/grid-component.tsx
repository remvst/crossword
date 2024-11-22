import { Grid, WordBounds } from "@remvst/crossword";
import React, { useMemo, useState } from "react";
import './grid-component.css';

function Cell(props: {
    character: string,
    selected: boolean,
    highlighted: boolean,
    onClick: () => void,
}) {
    return <td
        onClick={props.onClick}
        className={[
            props.selected ? 'selected' : '',
            props.highlighted ? 'highlighted' : '',
        ].join(' ')}
    >
        {props.character}
    </td>;
}

function BlackCell(props: {}) {
    return <td className="black"></td>;
}

export function GridComponent(props: {
    grid: Grid,
}) {
    const [selectedRow, setSelectedRow] = useState(0);
    const [selectedCol, setSelectedCol] = useState(0);
    const [vertical, setVertical] = useState(false);

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
    }, [selectedRow, selectedCol, vertical]);

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
    }

    return (
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
                                character={props.grid.cells[row][col].character}
                                selected={selectedRow === row && selectedCol === col}
                                highlighted={row >= highlight[0] && row <= highlight[2] && col >= highlight[1] && col <= highlight[3]}
                                onClick={() => onClick(row, col)} />;
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
