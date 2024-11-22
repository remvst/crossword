import React from 'react';
import {
    createHashRouter,
    RouterProvider,
} from "react-router-dom";
import { AnswerGridProvider } from './context/use-answer-grid';
import { DictionaryProvider } from "./context/use-dictionary";
import { GridProvider } from './context/use-grid';
import { DictionaryPage } from "./pages/dictionary-page";
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
        <DictionaryProvider>
            <GridProvider>
                <AnswerGridProvider>
                    <RouterProvider router={router} />
                </AnswerGridProvider>
            </GridProvider>
        </DictionaryProvider>
    )
}
