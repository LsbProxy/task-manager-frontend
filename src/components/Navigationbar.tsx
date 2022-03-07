import { Button, Form, FormControl, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import dashboardService, { Dashboard } from '../common/services/DashboardService';

import { User } from '../common/services/AuthService';
import { useHistory } from 'react-router-dom';

const user: User = JSON.parse(window.localStorage.getItem('user') || '{}');

const Navigationbar: FC = () => {
	const [dashboards, setDashboards] = useState<Dashboard[]>([]);
	const history = useHistory();

	const fetchDashboards = useCallback(async () => {
		if (!user.email) {
			return;
		}
		const dashboards = await dashboardService.listDashboards();
		setDashboards(dashboards);
	}, [user]);

	useEffect(() => {
		fetchDashboards();
	}, []);

	const renderDashboardDropdown = () =>
		useMemo(
			() =>
				dashboards.length ? (
					<NavDropdown title="Dashboards" id="navbarScrollingDropdown">
						{dashboards.map(({ title, id }) => (
							<NavDropdown.Item key={id} onClick={() => history.push(`/dashboard/${id}`)}>
								{title}
							</NavDropdown.Item>
						))}
					</NavDropdown>
				) : null,
			[dashboards],
		);

	return (
		<Navbar bg="light" expand="lg">
			<Navbar.Brand onClick={() => history.push('/')}>Task Manager</Navbar.Brand>
			<Form className="d-flex">
				<FormControl type="search" placeholder="Search" className="mr-2" aria-label="Search" />
				<Button variant="outline-success">Search</Button>
			</Form>
			<Navbar.Toggle aria-controls="navbarScroll" />
			<Navbar.Collapse id="navbarScroll" className="justify-content-end">
				<Nav className="mr-auto my-2 my-lg-0" style={{ maxHeight: '300px' }} navbarScroll>
					{renderDashboardDropdown()}
					<NavDropdown title={user.email} id="navbarScrollingDropdown">
						<NavDropdown.Item onClick={() => history.push('/logout')}>Logout</NavDropdown.Item>
					</NavDropdown>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default Navigationbar;
