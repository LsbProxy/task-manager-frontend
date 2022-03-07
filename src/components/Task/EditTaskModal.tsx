import {
	Button,
	Card,
	Col,
	Container,
	Dropdown,
	DropdownButton,
	FloatingLabel,
	Form,
	Modal,
	Row,
} from 'react-bootstrap';
import { Error, NotificationContext } from '../../common/context/NotificationContextProvider';
import React, { ChangeEvent, FC, useCallback, useContext, useEffect, useState } from 'react';
import taskService, { Task } from '../../common/services/TaskService';
import taskStatus, { TaskStatus, TaskStatusLabel } from '../../common/utils/taskStatus';

import CommentSection from './Comments/CommentSection';
import Loader from '../Loader';
import OutsideClickHandler from 'react-outside-click-handler';
import { map } from 'lodash';

interface ModalProps {
	isOpen: boolean;
	id: string;
	openCloseModal: (isOpen: boolean) => void;
	updateTaskInGrid: (task: Task, removeTaskFromGrid?: boolean) => void;
}

const EditTaskModal: FC<ModalProps> = ({ isOpen, id, openCloseModal, updateTaskInGrid }) => {
	const [task, setTask] = useState<Task>({
		id: '',
		title: '',
		description: '',
		status: '',
		createdDate: '',
		updatedDate: '',
		author: '',
		assignedTo: '',
		sprint: '',
		comments: [],
		dashboard: '',
	});
	const [isLoading, showLoader] = useState(false);
	const [wasSubmitted, setWasSubmitted] = useState(false);
	const [focusTitle, setFocusTitle] = useState(false);
	const [focusDescription, setFocusDescription] = useState(false);
	const { addNotification, handleError } = useContext(NotificationContext);

	const fetchData = useCallback(async () => {
		if (!isOpen) {
			return;
		}
		try {
			showLoader(true);
			const task = await taskService.getTask(id);
			setTask(task);
		} catch (e) {
			handleError(e as Error);
		} finally {
			showLoader(false);
		}
	}, [id, isOpen]);

	useEffect(() => {
		fetchData();
	}, [isOpen]);

	const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) =>
		setTask((currentTask) => ({ ...currentTask, [name]: value }));

	const updateStatus = useCallback(
		(status: TaskStatusLabel) => async () => {
			try {
				showLoader(true);

				const updatedTask = await taskService.updateTask({ ...task, status });

				setTask(updatedTask);
				setWasSubmitted(true);
				addNotification(`Successfully updated ${updatedTask.title}`);
			} catch (e) {
				handleError(e as Error);
			} finally {
				showLoader(false);
			}
		},
		[task],
	);

	const deleteTask = useCallback(async () => {
		try {
			showLoader(true);
			await taskService.deleteTask(task.id);
			updateTaskInGrid(task, true);
			addNotification(`Successfully deleted ${task.title}`);
		} catch (e) {
			handleError(e as Error);
		} finally {
			showLoader(false);
		}
	}, [task]);

	const handleSubmit = useCallback(async () => {
		try {
			showLoader(true);
			const updatedTask = await taskService.updateTask(task);

			setTask(updatedTask);
			setFocusTitle(false);
			setFocusDescription(false);
			setWasSubmitted(true);
			addNotification(`Successfully updated ${updatedTask.title}`);
		} catch (e) {
			handleError(e as Error);
		} finally {
			showLoader(false);
		}
	}, [task]);

	const hideModal = () => {
		if (wasSubmitted) {
			updateTaskInGrid(task);
		}
		openCloseModal(false);
	};

	const renderModalHeader = () => (
		<Container style={{ paddingLeft: 0 }}>
			<Row>
				<Col>
					<OutsideClickHandler onOutsideClick={() => setFocusTitle(false)}>
						<Form onSubmit={handleSubmit}>
							<Form.Control
								size="lg"
								type="text"
								placeholder="Title"
								name="title"
								value={task.title}
								onChange={handleChange}
								onFocus={() => setFocusTitle(true)}
							/>
							{focusTitle && (
								<Button
									disabled={isLoading || !focusTitle}
									className="mt-2"
									variant="primary"
									type="submit"
								>
									Save
								</Button>
							)}
						</Form>
					</OutsideClickHandler>
				</Col>
			</Row>
		</Container>
	);

	const renderDescription = () => (
		<Row>
			<Col>
				<OutsideClickHandler onOutsideClick={() => setFocusDescription(false)}>
					<Form onSubmit={handleSubmit}>
						<FloatingLabel controlId="floatingTextarea1" label="Description">
							<Form.Control
								as="textarea"
								style={{ height: '300px' }}
								placeholder="Description"
								name="description"
								value={task.description}
								onChange={handleChange}
								onFocus={() => setFocusDescription(true)}
							/>
						</FloatingLabel>
						{focusDescription && (
							<Button
								disabled={isLoading || !focusDescription}
								className="mt-2"
								variant="primary"
								type="submit"
							>
								Save
							</Button>
						)}
					</Form>
				</OutsideClickHandler>
			</Col>
		</Row>
	);

	const renderLeftPanel = () => (
		<Col md={{ span: 8 }}>
			{renderDescription()}
			<CommentSection task={task} updateTask={setTask} />
		</Col>
	);

	const renderRightPanel = useCallback(() => {
		const { status, createdDate, updatedDate, author, assignedTo } = task;
		const created = new Date(createdDate).toLocaleString();
		const updated = new Date(updatedDate).toLocaleString();

		return (
			<Col md={{ span: 4 }}>
				<Card style={{ height: '100%' }}>
					<Card.Body>
						<Row>
							<DropdownButton id="dropdown-basic-button" title={<strong>{status}</strong>}>
								{map(taskStatus, ({ label }: TaskStatus) => (
									<Dropdown.Item key={label} onClick={updateStatus(label as TaskStatusLabel)}>
										{label}
									</Dropdown.Item>
								))}
							</DropdownButton>
						</Row>
						<Row className="p-1">
							<small>Assigned to: {assignedTo}</small>
						</Row>
						<Row className="p-1">
							<small>Author: {author}</small>
						</Row>
						<Row className="p-1">
							<small>Last updated: {updated}</small>
						</Row>
						<Row className="p-1">
							<small>Created: {created}</small>
						</Row>
						<Row className="p-1">
							<Button variant="danger" onClick={deleteTask}>
								<strong>Delete Task</strong>
							</Button>
						</Row>
					</Card.Body>
				</Card>
			</Col>
		);
	}, [deleteTask, task, updateStatus]);

	return (
		<Modal show={isOpen} onHide={hideModal} keyboard={false} size="xl">
			{isLoading ? (
				<Modal.Body style={{ minHeight: '400px' }}>
					<Loader />
				</Modal.Body>
			) : (
				<>
					<Modal.Header closeButton>{renderModalHeader()}</Modal.Header>
					<Modal.Body>
						<Row>
							{renderLeftPanel()}
							{renderRightPanel()}
						</Row>
					</Modal.Body>
				</>
			)}
		</Modal>
	);
};

export default EditTaskModal;
