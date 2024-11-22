import { Grid, GridBuilder } from "@remvst/crossword";
import React, { createContext, useContext, useMemo, useState } from "react";
import { useDictionary } from "./use-dictionary";

const SEED_KEY = 'seed';

export const GridContext = createContext<ReturnType<typeof createGridContext>>(null);

export function useGrid() {
    return useContext(GridContext);
}
export function GridProvider(props: React.PropsWithChildren<{}>) {
    return (
        <GridContext.Provider value={createGridContext()}>
            {props.children}
        </GridContext.Provider>
    );
};

function createGridContext() {
    let initialSeed = 0;
    try {
        const parsed = JSON.parse(localStorage.getItem(SEED_KEY));
        initialSeed = parsed || 0;
    } catch (err) {
        console.error(err);
    }

    const [seed, setSeed] = useState<number>(initialSeed);

    function save(seed: number) {
        localStorage.setItem(SEED_KEY, JSON.stringify(seed));
    }

    const { dictionary } = useDictionary();

    const grid = useMemo(() => {
        const builder = new GridBuilder(new Grid(20, 20), dictionary.clone(), seed);
        builder.build();
        return builder.grid;
    }, [dictionary, seed]);

    return {
        grid,
        reseed() {
            setSeed(seed + 1);
            save(seed + 1);
        },
    };
}
