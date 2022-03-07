import {
	Button,
	Col,
	Dropdown,
	DropdownButton,
	FloatingLabel,
	Form,
	InputGroup,
	Modal,
	Row,
} from 'react-bootstrap';
import { Error, NotificationContext } from '../../common/context/NotificationContextProvider';
import ErrorAlertList, { Errors } from '../ErrorAlertList';
import React, {
	ChangeEvent,
	FC,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { isEmpty, map } from 'lodash';
import taskService, { CreateTask } from '../../common/services/TaskService';
import taskStatus, { TaskStatus } from '../../common/utils/taskStatus';

import Loader from '../Loader';
import { User } from '../../common/services/AuthService';
import dashboardService from '../../common/services/DashboardService';

const user: User = JSON.parse(window.localStorage.getItem('user') || '{}');

interface Props {
	dashboardId: string;
	sprintId: string;
	hideModal: () => void;
	refreshGrid: () => void;
}

const CreateTaskModal: FC<Props> = ({ dashboardId, sprintId, hideModal, refreshGrid }) => {
	const [task, setTask] = useState<CreateTask>({
		title: '',
		description: '',
		status: 'TODO',
		author: user.username,
		assignedTo: '',
		sprint: sprintId,
		dashboard: dashboardId,
	});
	const [members, setMembers] = useState<string[]>([]);
	const [errors, setErrors] = useState<Errors>([]);
	const [isSubmit, setSubmit] = useState(false);
	const [isLoading, showLoader] = useState(false);
	const { handleError, addNotification } = useContext(NotificationContext);

	const fetchMembers = useCallback(async () => {
		try {
			showLoader(true);

			const { members } = await dashboardService.getDashboard(dashboardId);

			setTask({ ...task, assignedTo: members[0] });
			setMembers(members);
		} catch (e) {
			handleError(e as Error);
		} finally {
			showLoader(false);
		}
	}, [dashboardId]);

	useEffect(() => {
		fetchMembers();
	}, [fetchMembers]);

	const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) =>
		setTask((currentTask) => ({ ...currentTask, [name]: value }));

	const handleSelectChange = ({ target: { name, value } }: ChangeEvent<HTMLSelectElement>) =>
		setTask((currentTask) => ({ ...currentTask, [name]: value }));

	const handleDropdownItemClick = (name: string, value: string) => () =>
		handleChange({ target: { name, value } } as ChangeEvent<HTMLInputElement>);

	const validateTask = useCallback(() => {
		const newErrors = [];

		if (!task.title) {
			newErrors.push('Title');
		}

		setErrors(newErrors);
		setSubmit(true);
		return isEmpty(newErrors);
	}, [task.title]);

	const handleCreateTask = useCallback(async () => {
		if (!validateTask()) {
			return;
		}

		try {
			showLoader(true);
			await taskService.createTask(task);
			hideModal();
			refreshGrid();
			addNotification(`Successfully created ${task.title}`);
		} catch (e) {
			handleError(e as Error);
		} finally {
			showLoader(false);
		}
	}, [task, handleError, validateTask, hideModal, refreshGrid]);

	const renderModalBody = () =>
		useMemo(
			() => (
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
								value={task.title}
								onChange={handleChange}
							/>
							<FloatingLabel className="pt-1" controlId="floatingTextarea2" label="Description">
								<Form.Control
									as="textarea"
									style={{ height: '300px' }}
									placeholder="Description"
									name="description"
									value={task.description}
									onChange={handleChange}
								/>
							</FloatingLabel>
							<Row className="pt-1">
								<Col sm="3">
									<FloatingLabel controlId="floatingSelect" label="Assigned to:">
										<Form.Select
											onChange={handleSelectChange}
											name="assignedTo"
											value={task.assignedTo}
										>
											{map(members, (member: string) => (
												<option key={member} value={member}>
													{member}
												</option>
											))}
										</Form.Select>
									</FloatingLabel>
								</Col>
								<Col sm="3" className="my-auto pt-1">
									<InputGroup>
										<InputGroup.Text>Status:</InputGroup.Text>
										<DropdownButton
											id="dropdown-basic-button"
											title={<strong>{task.status}</strong>}
										>
											{map(taskStatus, ({ label }: TaskStatus) => (
												<Dropdown.Item
													key={label}
													onClick={handleDropdownItemClick('status', label)}
												>
													{label}
												</Dropdown.Item>
											))}
										</DropdownButton>
									</InputGroup>
								</Col>
							</Row>
						</Form>
					)}
				</Modal.Body>
			),
			[handleDropdownItemClick, isLoading, handleChange, errors, task, members, taskStatus],
		);

	return (
		<>
			<Modal.Header closeButton>
				<strong>Create Task</strong>
			</Modal.Header>
			{renderModalBody()}
			<Modal.Footer>
				<Button
					className="mt-2"
					variant="primary"
					onClick={handleCreateTask}
					disabled={isSubmit && !task.title}
				>
					Create
				</Button>
			</Modal.Footer>
		</>
	);
};

export default CreateTaskModal;
