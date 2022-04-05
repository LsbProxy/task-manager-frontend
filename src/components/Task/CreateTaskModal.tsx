import { Error, useNotification } from '../../common/context/NotificationContextProvider';
import ErrorAlertList, { Errors } from '../ErrorAlertList';
import React, { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from 'react';
import { isEmpty, map } from 'lodash';
import taskService, { CreateTask } from '../../common/services/TaskService';
import taskStatus, { TaskStatus } from '../../common/utils/taskStatus';

import Button from '../Button';
import Container from '../Container';
import Description from '../Description';
import Input from '../Input';
import Loader from '../Loader';
import Row from '../Row';
import Select from '../Select';
import Text from '../Text';
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
	const { handleError, addNotification } = useNotification();

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

	const handleDescriptionChange = ({ target: { name, value } }: ChangeEvent<HTMLTextAreaElement>) =>
		setTask((currentTask) => ({ ...currentTask, [name]: value }));

	const handleSelectChange = ({ target: { name, value } }: ChangeEvent<HTMLSelectElement>) =>
		setTask((currentTask) => ({ ...currentTask, [name]: value }));

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
				<Container style={{ minHeight: '300px' }}>
					{isLoading ? (
						<Loader />
					) : (
						<form>
							<ErrorAlertList errors={errors} />
							<Input
								type="text"
								placeholder="Title"
								name="title"
								value={task.title}
								onChange={handleChange}
							/>
							<Description
								placeholder="Description"
								name="description"
								value={task.description}
								onChange={handleDescriptionChange}
							/>
							<Row align="flex-start" gap="1rem">
								<Select
									onChange={handleSelectChange}
									name="assignedTo"
									value={task.assignedTo}
									label="Assigned to:"
									options={map(members, (value: string) => ({ value, label: value }))}
								/>
								<Select
									onChange={handleSelectChange}
									name="status"
									value={task.status}
									label="Status:"
									options={map(taskStatus, ({ label }: TaskStatus) => ({ value: label, label }))}
								/>
							</Row>
						</form>
					)}
				</Container>
			),
			[isLoading, handleChange, errors, task, members, taskStatus],
		);

	return (
		<Container>
			<Text>
				<strong>Create Task</strong>
			</Text>
			{renderModalBody()}
			<Row align="flex-end">
				<Button onClick={handleCreateTask} disabled={(isSubmit && !task.title) || isLoading}>
					Create
				</Button>
			</Row>
		</Container>
	);
};

export default CreateTaskModal;
