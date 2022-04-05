import { Error, useNotification } from '../../common/context/NotificationContextProvider';
import React, { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import taskService, { Task } from '../../common/services/TaskService';
import taskStatus, { TaskStatus, TaskStatusLabel } from '../../common/utils/taskStatus';

import Button from '../Button';
import CommentSection from './Comments/CommentSection';
import Container from '../Container';
import Description from '../Description';
import Input from '../Input';
import Loader from '../Loader';
import OutsideClickHandler from 'react-outside-click-handler';
import Row from '../Row';
import Select from '../Select';
import Text from '../Text';
import { map } from 'lodash';
import styled from 'styled-components';
import { updateTask } from '../../features/taskSlice';
import { useDispatch } from 'react-redux';

const ContentWrapper = styled(Row)`
	@media (max-width: 768px) {
		flex-direction: column-reverse;
	}
`;

const LeftPanel = styled(Container)`
	flex: 3;
`;

const RightPanel = styled(Container)`
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	border: 1px solid #d6d6d6;
	padding: 1rem;
	margin-left: 1rem;
	@media (max-width: 768px) {
		margin-left: 0;
		margin-bottom: 1rem;
	}
`;

interface ModalProps {
	id: string;
	hideModal: () => void;
}

const EditTaskModal: FC<ModalProps> = ({ id, hideModal }) => {
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
	const [submitCount, setSubmitCount] = useState(0);
	const [focusTitle, setFocusTitle] = useState(false);
	const [focusDescription, setFocusDescription] = useState(false);
	const { addNotification, handleError } = useNotification();
	const dispatch = useDispatch();

	useEffect(() => {
		if (submitCount) {
			dispatch(updateTask({ task }));
		}
	}, [submitCount]);

	const fetchData = useCallback(async () => {
		try {
			showLoader(true);
			const task = await taskService.getTask(id);
			setTask(task);
		} catch (e) {
			handleError(e as Error);
		} finally {
			showLoader(false);
		}
	}, [id]);

	useEffect(() => {
		fetchData();
	}, []);

	const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) =>
		setTask((currentTask) => ({ ...currentTask, [name]: value }));

	const handleDescriptionChange = ({ target: { name, value } }: ChangeEvent<HTMLTextAreaElement>) =>
		setTask((currentTask) => ({ ...currentTask, [name]: value }));

	const updateStatus = useCallback(
		async (status: TaskStatusLabel) => {
			try {
				showLoader(true);

				const updatedTask = await taskService.updateTask({ ...task, status });

				setTask(updatedTask);
				setSubmitCount(submitCount + 1);
				addNotification(`Successfully updated ${updatedTask.title}`);
			} catch (e) {
				handleError(e as Error);
			} finally {
				showLoader(false);
			}
		},
		[task, submitCount],
	);

	const deleteTask = useCallback(async () => {
		try {
			showLoader(true);
			await taskService.deleteTask(task.id);
			dispatch(updateTask({ task, removeFromGrid: true }));
			addNotification(`Successfully deleted ${task.title}`);
			hideModal();
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
			setSubmitCount(submitCount + 1);
			addNotification(`Successfully updated ${updatedTask.title}`);
		} catch (e) {
			handleError(e as Error);
		} finally {
			showLoader(false);
		}
	}, [task, submitCount]);

	const renderModalHeader = () => (
		<Container>
			<OutsideClickHandler onOutsideClick={() => setFocusTitle(false)} display="contents">
				<form onSubmit={handleSubmit}>
					<Input
						type="text"
						placeholder="Title"
						name="title"
						value={task.title}
						onChange={handleChange}
						onFocus={() => setFocusTitle(true)}
					/>
					{focusTitle && (
						<Button disabled={isLoading || !focusTitle} type="submit">
							Save
						</Button>
					)}
				</form>
			</OutsideClickHandler>
		</Container>
	);

	const renderDescription = () => (
		<Container>
			<OutsideClickHandler onOutsideClick={() => setFocusDescription(false)} display="contents">
				<form onSubmit={handleSubmit}>
					<Description
						placeholder="Description"
						name="description"
						value={task.description}
						onChange={handleDescriptionChange}
						onFocus={() => setFocusDescription(true)}
					/>
					{focusDescription && (
						<Button disabled={isLoading || !focusDescription} variant="primary" type="submit">
							Save
						</Button>
					)}
				</form>
			</OutsideClickHandler>
		</Container>
	);

	const renderLeftPanel = () => (
		<LeftPanel>
			{renderDescription()}
			<CommentSection task={task} updateTask={setTask} />
		</LeftPanel>
	);

	const renderRightPanel = useCallback(() => {
		const { status, createdDate, updatedDate, author, assignedTo } = task;
		const created = new Date(createdDate).toLocaleString();
		const updated = new Date(updatedDate).toLocaleString();

		return (
			<RightPanel>
				<Select
					onChange={({ target: { value } }) => updateStatus(value as TaskStatusLabel)}
					name="status"
					value={status}
					options={map(taskStatus, ({ label }: TaskStatus) => ({ value: label, label }))}
				/>
				<Text margin={{ bottom: 1, top: 1 }}>Assigned to: {assignedTo}</Text>
				<Text margin={{ bottom: 1 }}>Author: {author}</Text>
				<Text margin={{ bottom: 1 }}>Last updated: {updated}</Text>
				<Text margin={{ bottom: 1 }}>Created: {created}</Text>
				<Button variant="warning" onClick={deleteTask}>
					Delete Task
				</Button>
			</RightPanel>
		);
	}, [deleteTask, task, updateStatus]);

	return (
		<Container style={{ minHeight: '400px' }}>
			{isLoading ? (
				<Loader />
			) : (
				<>
					{renderModalHeader()}
					<ContentWrapper>
						{renderLeftPanel()}
						{renderRightPanel()}
					</ContentWrapper>
				</>
			)}
		</Container>
	);
};

export default EditTaskModal;
