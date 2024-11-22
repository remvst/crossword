import { Grid, GridBuilder } from "@remvst/crossword";
import React, { useMemo } from "react";
import { GridComponent } from "../components/grid-component";
import { useDictionary } from "../use-dictionary";

export function GridPage() {
    const { dictionary } = useDictionary();

    console.log(dictionary);

    const grid = useMemo(() => {
        const builder = new GridBuilder(new Grid(20, 20), dictionary);
        builder.build();
        return builder.grid;
    }, [dictionary]);

    return (<div>
        <h1>Grid</h1>

        <GridComponent grid={grid} />
    </div>)
}
