import { Button, Col, Container, Row, Toast } from 'react-bootstrap';
import { Error, NotificationContext } from '../../common/context/NotificationContextProvider';
import React, { FC, MouseEvent, useCallback, useContext, useMemo, useState } from 'react';
import dashboardService, { Dashboard as IDashboard } from '../../common/services/DashboardService';

import EditDashboardModal from './EditDashboardModal';
import { LoaderContext } from '../../common/context/LoaderContextProvider';
import { join } from 'lodash';
import { useHistory } from 'react-router-dom';

interface Props {
	dashboard: IDashboard;
	updateDashboardInGrid: (dashboard: IDashboard, removeFromGrid?: boolean) => void;
}

const Dashboard: FC<Props> = (props) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const history = useHistory();
	const { handleError, addNotification } = useContext(NotificationContext);
	const { showLoader } = useContext(LoaderContext);

	const deleteDashboard = useCallback(
		async (e: MouseEvent<HTMLButtonElement>) => {
			const { updateDashboardInGrid, dashboard } = props;
			try {
				e.stopPropagation();
				showLoader(true);

				await dashboardService.deleteDashboard(dashboard.id);

				updateDashboardInGrid(dashboard, true);
				addNotification(`Successfully deleted ${dashboard.title}`);
			} catch (err) {
				handleError(err as Error);
			} finally {
				showLoader(false);
			}
		},
		[props],
	);

	const renderEditButton = () =>
		useMemo(
			() => (
				<Button
					className="m-1"
					onClick={(e: MouseEvent<HTMLButtonElement>) => {
						e.stopPropagation();
						setIsModalOpen(true);
					}}
					size="sm"
					variant="warning"
				>
					<strong>Edit</strong>
				</Button>
			),
			[],
		);

	const renderDeleteButton = () =>
		useMemo(
			() => (
				<Button className="m-1" variant="danger" size="sm" onClick={deleteDashboard}>
					<strong>Delete Dashboard</strong>
				</Button>
			),
			[deleteDashboard],
		);

	const {
		dashboard: { id, title, description, createdDate, members },
	} = props;
	return (
		<>
			<EditDashboardModal
				isOpen={isModalOpen}
				memberList={props.dashboard.members}
				dashboardId={props.dashboard.id}
				openCloseModal={setIsModalOpen}
				updateDashboardInGrid={props.updateDashboardInGrid}
			/>
			<Toast
				key={id}
				style={{ height: '230px' }}
				className="d-inline-block m-1"
				onClick={() => history.push(`/dashboard/${id}`)}
			>
				<Toast.Header closeButton={false}>
					<strong className="me-auto">{title}</strong>
					<small>Created: {new Date(createdDate).toLocaleString()}</small>
				</Toast.Header>
				<Toast.Body>
					<Container>
						<Row>
							<Col>
								{renderEditButton()}
								{renderDeleteButton()}
							</Col>
						</Row>
						<Row>
							<Col>
								<Row>Members:</Row>
								<Col className="text-truncate">{join(members, ', ')}</Col>
							</Col>
						</Row>
						<Row className="pt-4">
							<Col>
								<Row>Description:</Row>
								<Col className="text-truncate">{description}</Col>
							</Col>
						</Row>
					</Container>
				</Toast.Body>
			</Toast>
		</>
	);
};

export default Dashboard;
