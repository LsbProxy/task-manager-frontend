import React, { FC, useState } from 'react';

import ArrowDown from '../assets/arrow-down.png';
import OutsideClickHandler from 'react-outside-click-handler';
import { RootState } from '../app/store';
import { User } from '../common/services/AuthService';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

const user: User = JSON.parse(window.localStorage.getItem('user') || '{}');

const Button = styled.button`
	font-weight: bold;
	border-radius: 0.3rem;
	border: none;
	background-color: #f1f1f1;
	&:hover {
		background-color: #ddd;
	}
	padding: 0.6rem;
`;

const Navbar = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: sticky;
	top: 0;
	z-index: 1;
	width: 100%;
	padding: 0.2rem 1rem;
	background-color: #2478f2;
	color: #ffff;
`;

const Brand = styled.p`
	font-size: 1.5rem;
	text-align: center;
	user-select: none;
	cursor: pointer;
	margin: 0;
	&:hover {
		color: black;
	}
`;

const Dropdown = styled.div`
	position: absolute;
	background-color: #f1f1f1;
	box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
	z-index: 1;
	max-width: 135px;
	right: 1rem;
`;

const DropdownItem = styled.a`
	color: black;
	padding: 12px 16px;
	text-decoration: none;
	display: block;
	&:hover {
		background-color: #ddd;
	}
	cursor: pointer;
	user-select: none;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const Image = styled.img`
	width: 10px;
	height: 10px;
	margin-left: 5px;
`;

const Navigationbar: FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenDashboards, setIsOpenDashboards] = useState(false);
	const { dashboards } = useSelector((state: RootState) => state.dashboards);
	const history = useHistory();

	const renderDropdown = () =>
		isOpen && (
			<OutsideClickHandler
				onOutsideClick={() => {
					setIsOpen(false);
					setIsOpenDashboards(false);
				}}
				display="contents"
			>
				<Dropdown>
					{renderDashboardDropdown()}
					<DropdownItem onClick={() => history.push('/logout')}>Logout</DropdownItem>
				</Dropdown>
			</OutsideClickHandler>
		);

	const renderDashboardDropdown = () =>
		dashboards.length ? (
			<>
				<DropdownItem onClick={() => setIsOpenDashboards(!isOpenDashboards)}>
					Dashboards
					<Image src={ArrowDown} />
				</DropdownItem>
				{isOpenDashboards &&
					dashboards.map(({ title, id }) => (
						<DropdownItem
							key={id}
							onClick={() => {
								setIsOpenDashboards(false);
								setIsOpen(false);
								history.push(`/dashboard/${id}`);
							}}
						>
							{title}
						</DropdownItem>
					))}
			</>
		) : null;

	return (
		<Navbar id="nav">
			<Brand onClick={() => history.push('/')}>Task Manager</Brand>
			<div>
				<Button onClick={() => setIsOpen(!isOpen)}>
					{user.email}
					<Image src={ArrowDown} />
				</Button>
				{renderDropdown()}
			</div>
		</Navbar>
	);
};

export default Navigationbar;
