import { Button, Col, Container, Row, Toast } from 'react-bootstrap';
import { Error, NotificationContext } from '../../common/context/NotificationContextProvider';
import React, { FC, MouseEvent, useCallback, useContext, useMemo, useState } from 'react';
import sprintService, { Sprint as ISprint } from '../../common/services/SprintService';

import EditSprintModal from './EditSprintModal';
import { LoaderContext } from '../../common/context/LoaderContextProvider';
import { useHistory } from 'react-router-dom';

interface Props {
	sprint: ISprint;
	updateSprintInGrid: (sprint: ISprint, removeFromGrid?: boolean) => void;
}

const Sprint: FC<Props> = ({ updateSprintInGrid, sprint }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { showLoader } = useContext(LoaderContext);
	const { handleError, addNotification } = useContext(NotificationContext);
	const history = useHistory();

	const deleteSprint = useCallback(
		async (e: MouseEvent<HTMLButtonElement>) => {
			try {
				e.stopPropagation();
				showLoader(true);
				await sprintService.deleteSprint(sprint.id);
				updateSprintInGrid(sprint, true);
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
		setIsModalOpen(true);
	};

	const renderEditButton = () =>
		useMemo(
			() => (
				<Button className="m-1" onClick={openEditSprintModal} size="sm" variant="warning">
					<strong>Edit</strong>
				</Button>
			),
			[openEditSprintModal],
		);

	const renderDeleteButton = () =>
		useMemo(
			() => (
				<Button className="m-1" variant="danger" size="sm" onClick={deleteSprint}>
					<strong>Delete Sprint</strong>
				</Button>
			),
			[deleteSprint],
		);

	return (
		<>
			<EditSprintModal
				isOpen={isModalOpen}
				sprintId={sprint.id}
				openCloseModal={setIsModalOpen}
				updateSprintInGrid={updateSprintInGrid}
			/>
			<Toast
				key={sprint.id}
				style={{ height: '230px' }}
				className="d-inline-block m-1"
				onClick={() => history.push(`/sprint/${sprint.id}`)}
			>
				<Toast.Header closeButton={false}>
					<strong className="me-auto">{sprint.title}</strong>
					<small>Created: {new Date(sprint.createdDate).toLocaleString()}</small>
				</Toast.Header>
				<Toast.Body>
					<Container>
						<Row>
							<Col>
								{renderEditButton()}
								{renderDeleteButton()}
							</Col>
						</Row>
						<Row className="pt-4">
							<Col>
								<Row>Description:</Row>
								<Col className="text-truncate">{sprint.description}</Col>
							</Col>
						</Row>
					</Container>
				</Toast.Body>
			</Toast>
		</>
	);
};

export default Sprint;
