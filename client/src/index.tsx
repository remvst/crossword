import React from 'react';
import { createRoot } from 'react-dom/client';

window.addEventListener('load', () => {
    const container = document.querySelector('#root');
    const root = createRoot(container);
    root.render(<div>Hello world</div>);
}, false);
