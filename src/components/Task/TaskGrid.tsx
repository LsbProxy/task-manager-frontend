import { Button, Col, Row } from 'react-bootstrap';
import { Error, NotificationContext } from '../../common/context/NotificationContextProvider';
import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { filter, findIndex, isEmpty, map, startCase, trim } from 'lodash';
import sprintService, { Sprint } from '../../common/services/SprintService';
import taskService, { Task as ITask } from '../../common/services/TaskService';
import taskStatus, { TaskStatus } from '../../common/utils/taskStatus';

import CreateTaskModal from './CreateTaskModal';
import DraggableContainer from '../Draggable/DraggableContainer';
import DraggableProvider from '../Draggable/DraggableProvider';
import { LoaderContext } from '../../common/context/LoaderContextProvider';
import { ModalContext } from '../../common/context/ModalContextProvider';
import Task from './Task';
import redirectToHomePage from '../../common/utils/redirectToHomePage';
import { useRouteMatch } from 'react-router-dom';

const TaskGrid: FC = () => {
	const [sprint, setSprint] = useState<Sprint>({
		id: '',
		title: '',
		description: '',
		createdDate: '',
		updatedDate: '',
		endDate: '',
		dashboard: '',
		tasks: [],
	});
	const { showLoader, isLoading } = useContext(LoaderContext);
	const { handleError, addNotification } = useContext(NotificationContext);
	const { setState: setModalState } = useContext(ModalContext);
	const { params }: { params: { id: string } } = useRouteMatch();

	const fetchSprint = useCallback(async () => {
		try {
			redirectToHomePage(Number.isNaN(params.id));
			showLoader(true);
			const sprint = await sprintService.getSprint(params.id);
			setSprint(sprint);
		} catch (e) {
			handleError(e as Error);
		} finally {
			showLoader(false);
		}
	}, [params]);

	useEffect(() => {
		fetchSprint();
	}, [params]);

	const openCreateTaskModal = useCallback(() => {
		setModalState({
			show: true,
			ModalContentComponent: (props) => (
				<CreateTaskModal
					dashboardId={sprint.dashboard}
					sprintId={sprint.id}
					refreshGrid={fetchSprint}
					{...props}
				/>
			),
		});
	}, [sprint, fetchSprint]);

	const updateTaskStatus = useCallback(
		async (newStatus, { item }) => {
			try {
				const newSprint = { ...sprint };
				const updatedTask = { ...item, status: newStatus };
				const taskIndex = findIndex(sprint.tasks, ({ id }: ITask) => id === updatedTask.id);

				if (taskIndex === -1) {
					return;
				}

				newSprint.tasks[taskIndex] = updatedTask;

				showLoader(true);
				await taskService.updateTask(updatedTask);

				setSprint(newSprint);
			} catch (e) {
				handleError(e as Error);
			} finally {
				showLoader(false);
			}
		},
		[sprint],
	);

	const updateTaskInGrid = useCallback(
		(task: ITask, removeTaskFromGrid?: boolean) => {
			if (!task) {
				return;
			}

			const newSprint = { ...sprint };

			if (removeTaskFromGrid) {
				newSprint.tasks = filter(sprint.tasks, ({ id }: ITask) => id !== task.id);
			} else {
				const taskIndex = findIndex(sprint.tasks, ({ id }: ITask) => id === task.id);
				const updatedTask = task;

				if (taskIndex === -1) {
					return;
				}

				if (!trim(updatedTask.title)) {
					updatedTask.title = sprint.tasks[taskIndex].title;
				}

				newSprint.tasks[taskIndex] = updatedTask;
			}

			setSprint(newSprint);
		},
		[sprint],
	);

	const renderDraggableColumnContainer = (column: string) => (
		<Col key={column} sm="2" className="border border-bottom-0 border-top-0">
			<Row id="draggableRowLabel">
				<div className="border-bottom border-top">
					<strong>{startCase(column)}</strong>
				</div>
			</Row>
			<Row>
				<DraggableContainer
					id={column}
					items={filter(sprint.tasks, (task: ITask) => task.status === column)}
					itemProps={{
						updateTaskInGrid,
						addNotification,
						handleError,
					}}
					ItemComponent={Task}
					updateItem={updateTaskStatus}
					handleChange={updateTaskInGrid}
				/>
			</Row>
		</Col>
	);

	const renderDraggableContainers = () => {
		if (isEmpty(sprint.tasks)) {
			return `No Tasks in ${sprint.title || 'Sprint'}.`;
		}

		return (
			<DraggableProvider>
				{map(taskStatus, ({ label }: TaskStatus) => renderDraggableColumnContainer(label))}
			</DraggableProvider>
		);
	};

	const renderSidebar = () =>
		useMemo(
			() => (
				<Col sm="2" className="border border-bottom-0 border-top-0">
					<Row className="p-3">
						<Button size="lg" disabled={isLoading} onClick={openCreateTaskModal}>
							Create Task
						</Button>
					</Row>
				</Col>
			),
			[openCreateTaskModal, isLoading],
		);

	return (
		<Row>
			{renderSidebar()}
			{renderDraggableContainers()}
		</Row>
	);
};

export default TaskGrid;
