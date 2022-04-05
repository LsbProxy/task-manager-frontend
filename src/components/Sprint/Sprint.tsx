import Button, { ButtonGroup } from '../Button';
import { Error, useNotification } from '../../common/context/NotificationContextProvider';
import React, { FC, MouseEvent, useCallback, useMemo } from 'react';
import sprintService, { Sprint as ISprint } from '../../common/services/SprintService';

import Container from '../Container';
import EditSprintModal from './EditSprintModal';
import { ModalState } from '../../common/context/ModalContextProvider';
import Row from '../Row';
import Text from '../Text';
import Toast from '../Toast';
import { updateSprint } from '../../features/sprintSlice';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useLoader } from '../../common/context/LoaderContextProvider';

interface Props {
	sprint: ISprint;
	setModalState: (state: ModalState) => void;
}

const Sprint: FC<Props> = ({ sprint, setModalState }) => {
	const { showLoader } = useLoader();
	const { handleError, addNotification } = useNotification();
	const history = useHistory();
	const dispatch = useDispatch();

	const deleteSprint = useCallback(
		async (e: MouseEvent<HTMLButtonElement>) => {
			try {
				e.stopPropagation();
				showLoader(true);
				await sprintService.deleteSprint(sprint.id);
				dispatch(updateSprint({ sprint, removeFromGrid: true }));
				addNotification(`Successfully deleted ${sprint.title}`);
			} catch (err) {
				handleError(err as Error);
			} finally {
				showLoader(false);
			}
		},
		[sprint],
	);

	const openEditSprintModal = async (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setModalState({
			show: true,
			ModalContentComponent: (props) => <EditSprintModal {...props} sprintId={sprint.id} />,
		});
	};

	const renderEditButton = () =>
		useMemo(
			() => (
				<Button onClick={openEditSprintModal} size="sm" variant="secondary">
					Edit
				</Button>
			),
			[openEditSprintModal],
		);

	const renderDeleteButton = () =>
		useMemo(
			() => (
				<Button variant="warning" size="sm" onClick={deleteSprint}>
					Delete Sprint
				</Button>
			),
			[deleteSprint],
		);

	return (
		<Toast
			width="350px"
			height="230px"
			margin={{ top: 1, left: 1 }}
			key={sprint.id}
			onClick={() => history.push(`/sprint/${sprint.id}`)}
			Header={() => (
				<Row align="space-between" width="100%">
					{' '}
					<Text>
						<strong>{sprint.title}</strong>
					</Text>
					<Text>
						<small>Created: {new Date(sprint.createdDate).toLocaleString()}</small>
					</Text>
				</Row>
			)}
			Body={() => (
				<Container align="flex-start">
					<ButtonGroup>
						{renderEditButton()}
						{renderDeleteButton()}
					</ButtonGroup>
					{sprint.description && (
						<Container align="flex-start" margin={{ top: 0.5 }}>
							Description:
							<Text>{sprint.description}</Text>
						</Container>
					)}
				</Container>
			)}
		/>
	);
};

export default Sprint;
