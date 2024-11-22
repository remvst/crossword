import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

export function Root() {
    const navigate = useNavigate();

    return (<div>
        <h1>Rémi's Cool Crossword app</h1>

        <button onClick={() => navigate('/')}>Dictionary</button>
        <button onClick={() => navigate('/grid')}>Grid</button>

        <div>
            <Outlet />
        </div>
    </div>)
}
