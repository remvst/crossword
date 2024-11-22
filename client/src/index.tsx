import React from 'react';
import { createRoot } from 'react-dom/client';
import { Grid } from '@remvst/crossword';

window.addEventListener('load', () => {
    const container = document.querySelector('#root');
    const root = createRoot(container);
    root.render(<div>Hello world</div>);

    console.log(new Grid(10, 10));
}, false);
