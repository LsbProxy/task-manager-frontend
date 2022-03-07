import { Button, Col, Container, FloatingLabel, Form, Modal, Row } from 'react-bootstrap';
import { Error, NotificationContext } from '../../common/context/NotificationContextProvider';
import React, { ChangeEvent, FC, useCallback, useContext, useEffect, useState } from 'react';
import dashboardService, { Dashboard } from '../../common/services/DashboardService';
import { filter, map } from 'lodash';

import Loader from '../Loader';
import { User } from '../../common/services/AuthService';

const user: User = JSON.parse(window.localStorage.getItem('user') || '{}');

interface ModalProps {
	isOpen: boolean;
	memberList: string[];
	dashboardId: string;
	openCloseModal: (isOpen: boolean) => void;
	updateDashboardInGrid: (dashboard: Dashboard, removeFromGrid?: boolean) => void;
}

const EditDashboardModal: FC<ModalProps> = ({
	isOpen,
	memberList,
	dashboardId,
	openCloseModal,
	updateDashboardInGrid,
}) => {
	const [dashboard, setDashboard] = useState<Dashboard>({
		id: '',
		title: '',
		description: '',
		members: [],
		createdDate: '',
		updatedDate: '',
		sprints: [],
	});
	const [isLoading, showLoader] = useState(false);
	const { handleError, addNotification } = useContext(NotificationContext);

	const fetchData = useCallback(async () => {
		if (!isOpen) {
			return;
		}

		try {
			showLoader(true);
			const dashboard = await dashboardService.getDashboard(dashboardId);
			setDashboard(dashboard);
		} catch (e) {
			handleError(e as Error);
		} finally {
			showLoader(false);
		}
	}, [isOpen]);

	useEffect(() => {
		fetchData();
	}, [isOpen]);

	const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) =>
		setDashboard((currentDashboard) => ({ ...currentDashboard, [name]: value }));

	const handleMembersChange = useCallback(
		(value: string) => {
			const { members } = dashboard;
			let newValue = [...members];

			if (members.indexOf(value) > -1 && value !== user.username) {
				newValue = filter(members, (member: string) => member !== value);
			} else {
				newValue.push(value);
			}

			setDashboard((currentDashboard) => ({ ...currentDashboard, members: newValue }));
		},
		[dashboard, user],
	);

	const handleSubmit = useCallback(async () => {
		try {
			showLoader(true);

			const updatedDashboard = await dashboardService.updateDashboard(dashboard);

			setDashboard(updatedDashboard);
			updateDashboardInGrid(dashboard);
			openCloseModal(false);
			addNotification(`Successfully updated ${updatedDashboard.title}`);
		} catch (e) {
			handleError(e as Error);
		} finally {
			showLoader(false);
		}
	}, [dashboard]);

	const hideModal = () => openCloseModal(false);

	return (
		<Modal show={isOpen} onHide={hideModal} keyboard={false} size="xl">
			{isLoading ? (
				<Modal.Body style={{ minHeight: '400px' }}>
					<Loader />
				</Modal.Body>
			) : (
				<>
					<Modal.Header closeButton>
						<Container style={{ paddingLeft: 0 }}>
							<Row>
								<Col>
									<Form.Control
										size="lg"
										type="text"
										placeholder="Title"
										name="title"
										value={dashboard.title}
										onChange={handleChange}
									/>
								</Col>
							</Row>
						</Container>
					</Modal.Header>

					<Modal.Body>
						<Row>
							<Col>
								<FloatingLabel controlId="floatingTextarea2" label="Description">
									<Form.Control
										as="textarea"
										style={{ height: '200px' }}
										placeholder="Description"
										name="description"
										value={dashboard.description}
										onChange={handleChange}
									/>
								</FloatingLabel>
								<Row className="pt-1">
									<Col sm="3">
										<Form.Label>Members:</Form.Label>
										<Form.Control
											multiple
											as="select"
											name="members"
											value={dashboard.members}
											onChange={({ target: { value } }) => handleMembersChange(value)}
										>
											{map(memberList, (member: string) => (
												<option key={member} value={member}>
													{member}
												</option>
											))}
										</Form.Control>
									</Col>
								</Row>
							</Col>
						</Row>
					</Modal.Body>

					<Modal.Footer>
						<Button variant="outline-secondary" onClick={hideModal}>
							<strong>Cancel</strong>
						</Button>
						<Button onClick={handleSubmit}>
							<strong>Save</strong>
						</Button>
					</Modal.Footer>
				</>
			)}
		</Modal>
	);
};

export default EditDashboardModal;
