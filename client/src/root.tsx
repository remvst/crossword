import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Outlet, useHref, useLocation } from "react-router-dom";

export function Root() {
    const location = useLocation();

    return (<div>
        <Navbar className="bg-body-tertiary" sticky="top">
            <Container>
                <Navbar.Brand>Rémi's Cool Crossword app</Navbar.Brand>

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link active={location.pathname === '/'} href={useHref('/')}>Dictionary</Nav.Link>
                        <Nav.Link active={location.pathname === '/grid'} href={useHref('/grid')}>Grid</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

        <Container>
            <div className="my-2">
                <Outlet />
            </div>
        </Container>
    </div>)
}
