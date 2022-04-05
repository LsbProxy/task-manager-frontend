import Button, { ButtonGroup } from '../Button';
import { Error, useNotification } from '../../common/context/NotificationContextProvider';
import React, { FC, MouseEvent, useCallback, useMemo } from 'react';
import dashboardService, { Dashboard as IDashboard } from '../../common/services/DashboardService';

import Container from '../Container';
import EditDashboardModal from './EditDashboardModal';
import { ModalState } from '../../common/context/ModalContextProvider';
import Row from '../Row';
import Text from '../Text';
import Toast from '../Toast';
import { join } from 'lodash';
import { updateDashboard } from '../../features/dashboardSlice';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useLoader } from '../../common/context/LoaderContextProvider';

interface Props {
	dashboard: IDashboard;
	setModalState: (state: ModalState) => void;
}

const Dashboard: FC<Props> = (props) => {
	const history = useHistory();
	const { handleError, addNotification } = useNotification();
	const { showLoader } = useLoader();
	const dispatch = useDispatch();

	const deleteDashboard = useCallback(
		async (e: MouseEvent<HTMLButtonElement>) => {
			const { dashboard } = props;
			try {
				e.stopPropagation();
				showLoader(true);

				await dashboardService.deleteDashboard(dashboard.id);

				dispatch(updateDashboard({ dashboard, removeFromGrid: true }));
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
					onClick={(e: MouseEvent<HTMLButtonElement>) => {
						e.stopPropagation();
						props.setModalState({
							show: true,
							ModalContentComponent: (newProps) => (
								<EditDashboardModal {...newProps} dashboardId={props.dashboard.id} />
							),
						});
					}}
					size="sm"
					variant="secondary"
				>
					Edit
				</Button>
			),
			[],
		);

	const renderDeleteButton = () =>
		useMemo(
			() => (
				<Button variant="warning" size="sm" onClick={deleteDashboard}>
					Delete Dashboard
				</Button>
			),
			[deleteDashboard],
		);

	const {
		dashboard: { id, title, description, createdDate, members },
	} = props;
	return (
		<Toast
			width="350px"
			height="230px"
			margin={{ top: 1, left: 1 }}
			key={id}
			onClick={() => history.push(`/dashboard/${id}`)}
			Header={() => (
				<Row align="space-between" width={'100%'}>
					<Text>
						<strong>{title}</strong>
					</Text>
					<Text>
						<small>Created: {new Date(createdDate).toLocaleString()}</small>
					</Text>
				</Row>
			)}
			Body={() => (
				<Container align="flex-start">
					<ButtonGroup>
						{renderEditButton()}
						{renderDeleteButton()}
					</ButtonGroup>
					<Container align="flex-start" margin={{ top: 0.5 }}>
						Members:
						<Text>{join(members, ', ')}</Text>
					</Container>
					{description && (
						<Container align="flex-start">
							Description:
							<Text>{description}</Text>
						</Container>
					)}
				</Container>
			)}
		/>
	);
};

export default Dashboard;
