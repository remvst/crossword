import React from 'react';
import { DictionaryPage } from "./pages/dictionary-page";
import { createDictionaryContext, DictionaryContext } from "./use-dictionary";
import {
    createHashRouter,
    RouterProvider,
} from "react-router-dom";
import { GridPage } from './pages/grid-page';
import { Root } from './root';

const router = createHashRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "/",
                element: <DictionaryPage />,
            },
            {
                path: "/grid",
                element: <GridPage />,
            },
        ],
    },
]);

export function App() {
    return (
        <DictionaryContext.Provider value={createDictionaryContext()}>
            <RouterProvider router={router} />
        </DictionaryContext.Provider>
    )
}
