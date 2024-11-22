import React from "react";
import { GridComponent } from "../components/grid-component";
import { useGrid } from "../context/use-grid";

export function GridPage() {
    const { grid, reseed } = useGrid();

    return (<div>
        <h1>Grid</h1>

        <button onClick={reseed}>New grid</button>

        <GridComponent grid={grid} />
    </div>)
}
