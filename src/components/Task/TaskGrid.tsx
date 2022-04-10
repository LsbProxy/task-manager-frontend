import { Error, useNotification } from '../../common/context/NotificationContextProvider';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { filter, findIndex, isEmpty, map, startCase } from 'lodash';
import { listTasks, updateTask } from '../../features/taskSlice';
import taskService, { Task as ITask } from '../../common/services/TaskService';
import taskStatus, { TaskStatus } from '../../common/utils/taskStatus';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../Button';
import Container from '../Container';
import CreateTaskModal from './CreateTaskModal';
import DraggableContainer from '../Draggable/DraggableContainer';
import DraggableProvider from '../Draggable/DraggableProvider';
import { RootState } from '../../app/store';
import Row from '../Row';
import Sidebar from '../Sidebar';
import Task from './Task';
import Text from '../Text';
import redirectToHomePage from '../../common/utils/redirectToHomePage';
import styled from 'styled-components';
import { useLoader } from '../../common/context/LoaderContextProvider';
import { useModal } from '../../common/context/ModalContextProvider';
import { useRouteMatch } from 'react-router-dom';

const ColumnHeader = styled.div`
	border: 1px solid #dee2e6;
	padding: 0.5rem;
`;

const ColumnContent = styled.div`
	flex: 1;
	border: 1px solid #dee2e6;
	min-width: 250px;
	min-height: 150px;
`;

const TaskGrid: FC = () => {
	const { sprint, loading, error } = useSelector((state: RootState) => state.tasks);
	const { showLoader, isLoading } = useLoader();
	const { handleError, addNotification } = useNotification();
	const { setState: setModalState } = useModal();
	const { params }: { params: { id: string } } = useRouteMatch();
	const dispatch = useDispatch();

	useEffect(() => {
		if (error) {
			handleError(error);
		}
	}, [error]);

	const fetchSprint = useCallback(async () => {
		if (!parseInt(params.id)) {
			return redirectToHomePage();
		}
		dispatch(listTasks(params.id));
	}, [params]);

	useEffect(() => {
		showLoader(loading);
	}, [loading]);

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
				const updatedTask = { ...item, status: newStatus };
				const taskIndex = findIndex(sprint.tasks, ({ id }: ITask) => id === updatedTask.id);

				if (taskIndex === -1) {
					return;
				}

				showLoader(true);
				await taskService.updateTask(updatedTask);
				await dispatch(updateTask({ task: updatedTask }));
			} catch (e) {
				handleError(e as Error);
			} finally {
				showLoader(false);
			}
		},
		[sprint],
	);

	const renderDraggableColumnContainer = (column: string) => (
		<Container key={column}>
			<ColumnHeader id="draggableRowLabel">
				<Text>
					<strong>{startCase(column)}</strong>
				</Text>
			</ColumnHeader>
			<ColumnContent>
				<DraggableContainer
					id={column}
					items={filter(sprint.tasks, (task: ITask) => task.status === column)}
					itemProps={{
						addNotification,
						handleError,
					}}
					ItemComponent={Task}
					updateItem={updateTaskStatus}
					handleChange={(task: ITask, removeFromGrid?: boolean) =>
						dispatch(updateTask({ task, removeFromGrid }))
					}
				/>
			</ColumnContent>
		</Container>
	);

	const renderDraggableContainers = () => {
		if (isEmpty(sprint.tasks)) {
			return `No Tasks in ${sprint.title || 'Sprint'}.`;
		}

		return (
			<Row align="flex-start" wrap="wrap" flex={1} height="100%">
				<DraggableProvider>
					{map(taskStatus, ({ label }: TaskStatus) => renderDraggableColumnContainer(label))}
				</DraggableProvider>
			</Row>
		);
	};

	const renderSidebar = () =>
		useMemo(
			() => (
				<Sidebar>
					<Button size="lg" disabled={isLoading} onClick={openCreateTaskModal}>
						Create Task
					</Button>
				</Sidebar>
			),
			[openCreateTaskModal, isLoading],
		);

	return (
		<Row flex={1} height="100%" align="flex-start">
			{renderSidebar()}
			{renderDraggableContainers()}
		</Row>
	);
};

export default TaskGrid;
