import React from 'react';
import { createRoot } from 'react-dom/client';
import { Grid } from '@remvst/crossword';
import { App } from './app';

window.addEventListener('load', () => {
    const container = document.querySelector('#root');
    const root = createRoot(container);
    root.render(<App />);

    console.log(new Grid(10, 10));
}, false);
