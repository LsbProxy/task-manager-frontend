import React from 'react';
import { Navbar, Nav, Form, NavDropdown, FormControl, Button } from 'react-bootstrap';

import logout from '../Router/logout';

export default function Navigationbar() {
    const { email } = JSON.parse(window.localStorage.getItem('user'));

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand>Task Manager</Navbar.Brand>
            <Form className="d-flex">
                <FormControl
                    type="search"
                    placeholder="Search"
                    className="mr-2"
                    aria-label="Search"
                />
                <Button variant="outline-success">Search</Button>
            </Form>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll" className="justify-content-end">
                <Nav className="mr-auto my-2 my-lg-0" style={{ maxHeight: '300px' }} navbarScroll>
                    <NavDropdown title="Dashboards" id="navbarScrollingDropdown">
                        {/* <Link to="/dashboard">Dashboard</Link> */}
                        <NavDropdown.Item>Dashboard 1</NavDropdown.Item>
                        <NavDropdown.Item>Dashboard 2</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title={email} id="navbarScrollingDropdown">
                        <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
