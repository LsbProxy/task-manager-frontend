import { Button, Col, FloatingLabel, Form, Modal, Row } from 'react-bootstrap';
import React, { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import authService, { User } from '../../common/services/AuthService';
import dashboardService, { CreateDashboard } from '../../common/services/DashboardService';
import { filter, isEmpty, map } from 'lodash';

import { Error } from '../../common/context/NotificationContextProvider';
import ErrorAlertList from '../ErrorAlertList';
import Loader from '../Loader';

interface Props {
	hideModal: () => void;
	refreshGrid: () => void;
	handleError: (error: Error) => void;
	addNotification: (notification: string) => void;
}

const user: User = JSON.parse(window.localStorage.getItem('user') || '{}');

const CreateDashboardModal: FC<Props> = ({
	hideModal,
	refreshGrid,
	handleError,
	addNotification,
}) => {
	const [dashboard, setDashboard] = useState<CreateDashboard>({
		title: '',
		description: '',
		members: [],
	});
	const [users, setUsers] = useState<string[]>([]);
	const [errors, setErrors] = useState<string[]>([]);
	const [isSubmit, setIsSubmit] = useState(false);
	const [isLoading, showLoader] = useState(false);

	const fetchMembers = useCallback(async () => {
		try {
			showLoader(true);
			const userList = await authService.getUsers();

			setUsers(map(userList, ({ username }: User) => username));
			setDashboard((currentDashboard) => ({ ...currentDashboard, members: [user.username] }));
		} catch (e) {
			hideModal();
			handleError(e as Error);
		} finally {
			showLoader(false);
		}
	}, [user]);

	useEffect(() => {
		fetchMembers();
	}, []);

	const validateDashboard = useCallback(() => {
		const { title, members } = dashboard;
		const errors: string[] = [];

		if (!title) {
			errors.push('Title');
		}

		if (isEmpty(members)) {
			errors.push('Members');
		}

		setErrors(errors);

		if (!isSubmit) {
			setIsSubmit(true);
		}

		return isEmpty(errors);
	}, [dashboard, isSubmit]);

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

	const handleCreateDashboard = useCallback(async () => {
		if (!validateDashboard()) {
			return;
		}

		try {
			const { title, description, members } = dashboard;

			showLoader(true);

			await dashboardService.createDashboard({
				title,
				description,
				members,
			});

			addNotification(`Successfully created ${title}`);
			refreshGrid();
		} catch (e) {
			handleError(e as Error);
		} finally {
			showLoader(false);
			hideModal();
		}
	}, [dashboard]);

	const renderModalBody = useCallback(() => {
		const { title, description, members } = dashboard;

		return (
			<Modal.Body style={{ minHeight: '300px' }}>
				{isLoading ? (
					<Loader />
				) : (
					<Form>
						<ErrorAlertList errors={errors} />
						<Form.Control
							type="text"
							placeholder="Title"
							name="title"
							value={title}
							onChange={handleChange}
						/>
						<FloatingLabel className="pt-1" controlId="floatingTextarea2" label="Description">
							<Form.Control
								as="textarea"
								style={{ height: '300px' }}
								placeholder="Description"
								name="description"
								value={description}
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
									value={members}
									onChange={({ target: { value } }) => handleMembersChange(value)}
								>
									{map(users, (member: string) => (
										<option key={member} value={member}>
											{member}
										</option>
									))}
								</Form.Control>
							</Col>
						</Row>
					</Form>
				)}
			</Modal.Body>
		);
	}, [dashboard, isLoading, errors, users]);

	const renderModalFooter = useCallback(
		() => (
			<Modal.Footer>
				<Button
					className="mt-2"
					variant="primary"
					disabled={isSubmit && (!dashboard.title || isEmpty(dashboard.members))}
					onClick={handleCreateDashboard}
				>
					Create
				</Button>
			</Modal.Footer>
		),
		[dashboard.title, dashboard.members, isSubmit],
	);

	return (
		<>
			<Modal.Header closeButton>
				<strong>Create Dashboard</strong>
			</Modal.Header>
			{renderModalBody()}
			{renderModalFooter()}
		</>
	);
};

export default CreateDashboardModal;
