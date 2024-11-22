import { Grid, GridBuilder } from "@remvst/crossword";
import React, { useMemo, useState } from "react";
import { GridComponent } from "../components/grid-component";
import { useDictionary } from "../use-dictionary";

export function GridPage() {
    const { dictionary } = useDictionary();

    const [seed, setSeed] = useState(1);

    const grid = useMemo(() => {
        const builder = new GridBuilder(new Grid(20, 20), dictionary.clone(), seed);
        builder.build();
        return builder.grid;
    }, [dictionary, seed]);

    return (<div>
        <h1>Grid</h1>

        <button onClick={() => setSeed(seed + 1)}>New grid</button>

        <GridComponent grid={grid} />
    </div>)
}
