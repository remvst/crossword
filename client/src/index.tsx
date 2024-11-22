import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { createRoot } from 'react-dom/client';
import { App } from './app';

window.addEventListener('load', () => {
    const container = document.querySelector('#root');
    const root = createRoot(container);
    root.render(<App />);
}, false);
