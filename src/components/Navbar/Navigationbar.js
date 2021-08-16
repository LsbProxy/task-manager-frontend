import React, { Component } from 'react';
import { Navbar, Nav, Form, NavDropdown, FormControl, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import dashboardService from '../../common/services/DashboardService/DashboardService';

class Navigationbar extends Component {
    constructor() {
        super();

        this.state = {
            user: JSON.parse(window.localStorage.getItem('user')) || {},
            dashboards: [],
        };
    }

    componentDidMount() {
        this.fetchDashboards();
    }

    fetchDashboards = async () => {
        const { user } = this.state;

        if (!user.email) {
            return;
        }

        const dashboards = await dashboardService.listDashboards();
        this.setState({ dashboards });
    };

    logout = () => {
        const { history } = this.props;
        history.push('/logout');
    };

    openDashboard = (id) => () => this.props.history.push(`/dashboard/${id}`);

    renderDashboardDropdown = () => {
        const { dashboards } = this.state;

        return (
            <NavDropdown title="Dashboards" id="navbarScrollingDropdown">
                {dashboards.map(({ title, id }) => (
                    <NavDropdown.Item key={id} onClick={this.openDashboard(id)}>
                        {title}
                    </NavDropdown.Item>
                ))}
            </NavDropdown>
        );
    };

    redirectToHomePage = () => this.props.history.push('/');

    render() {
        const {
            user: { email },
        } = this.state;

        return (
            <>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand onClick={this.redirectToHomePage}>Task Manager</Navbar.Brand>
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
                        <Nav
                            className="mr-auto my-2 my-lg-0"
                            style={{ maxHeight: '300px' }}
                            navbarScroll
                        >
                            {this.renderDashboardDropdown()}
                            <NavDropdown title={email} id="navbarScrollingDropdown">
                                <NavDropdown.Item onClick={this.logout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </>
        );
    }
}

export default withRouter(Navigationbar);
