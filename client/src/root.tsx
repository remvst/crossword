import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Outlet, useHref } from "react-router-dom";

export function Root() {
    return (<div>
        <Navbar className="bg-body-tertiary">
            <Container>
                <Navbar.Brand>Rémi's Cool Crossword app</Navbar.Brand>

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href={useHref('/')}>Dictionary</Nav.Link>
                        <Nav.Link href={useHref('/grid')}>Grid</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

        <Container>
            <Outlet />
        </Container>
    </div>)
}
