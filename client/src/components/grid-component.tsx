import { Grid } from "@remvst/crossword";
import React from "react";
import './grid-component.css';

function Cell(props: {
    character: string,
    onClick: () => void,
}) {
    return <td onClick={props.onClick}>{props.character}</td>;
}

function BlackCell(props: {}) {
    return <td className="black"></td>;
}

export function GridComponent(props: {
    grid: Grid,
}) {
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
                                onClick={() => {}} />;
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
