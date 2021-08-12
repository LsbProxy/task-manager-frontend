import React from 'react';
import { Navbar, Nav, Form, NavDropdown, FormControl, Button } from 'react-bootstrap';
// import { Link } from "react-router-dom";

export default function Navigationbar() {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#">Task Manager</Navbar.Brand>
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
            <Navbar.Collapse id="navbarScroll">
                <Nav className="mr-auto my-2 my-lg-0" style={{ maxHeight: '300px' }} navbarScroll>
                    <NavDropdown title="Dashboards" id="navbarScrollingDropdown">
                        {/* <Link to="/dashboard">Dashboard</Link> */}
                        <NavDropdown.Item>Dashboard 1</NavDropdown.Item>
                        <NavDropdown.Item>Dashboard 2</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="User" id="navbarScrollingDropdown">
                        <NavDropdown.Item>Settings</NavDropdown.Item>
                        <NavDropdown.Item>Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
