import { Button, Col, Row, ToastContainer } from 'react-bootstrap';
import { Error, NotificationContext } from '../../common/context/NotificationContextProvider';
import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import dashboardService, { Dashboard } from '../../common/services/DashboardService';
import { filter, findIndex, get, isEmpty, trim } from 'lodash';

import CreateSprintModal from './CreateSprintModal';
import { Sprint as ISprint } from '../../common/services/SprintService';
import { LoaderContext } from '../../common/context/LoaderContextProvider';
import { ModalContext } from '../../common/context/ModalContextProvider';
import Sprint from './Sprint';
import redirectToHomePage from '../../common/utils/redirectToHomePage';
import { useRouteMatch } from 'react-router-dom';

const calculateHeight = () => {
	const navHeight = get(document.querySelector('nav'), 'clientHeight', 0);

	return window.innerHeight - navHeight;
};

const SprintList: FC = () => {
	const [dashboard, setDashboard] = useState<Dashboard>({
		id: '',
		title: '',
		description: '',
		createdDate: '',
		updatedDate: '',
		members: [],
		sprints: [],
	});
	const { handleError } = useContext(NotificationContext);
	const { showLoader, isLoading } = useContext(LoaderContext);
	const { setState: setModalState } = useContext(ModalContext);
	const { params }: { params: { id: string } } = useRouteMatch();

	const fetchDashboard = useCallback(async () => {
		try {
			redirectToHomePage(Number.isNaN(params.id));
			showLoader(true);
			const dashboard = await dashboardService.getDashboard(params.id);
			setDashboard(dashboard);
		} catch (e) {
			handleError(e as Error);
		} finally {
			showLoader(false);
		}
	}, [params]);

	useEffect(() => {
		fetchDashboard();
	}, [params]);

	const updateSprintInGrid = useCallback(
		(sprint: ISprint, removeFromGrid?: boolean) => {
			const newDashboard: Dashboard = { ...dashboard };

			if (removeFromGrid) {
				newDashboard.sprints = filter(dashboard.sprints, ({ id }: ISprint) => id !== sprint.id);
			} else {
				const index = findIndex(dashboard.sprints, ({ id }: ISprint) => id === sprint.id);
				const updatedSprint = sprint;

				if (!trim(updatedSprint.title)) {
					updatedSprint.title = dashboard.sprints[index].title;
				}

				newDashboard.sprints[index] = updatedSprint;
			}

			setDashboard(newDashboard);
		},
		[dashboard],
	);

	const openCreateSprintModal = useCallback(() => {
		setModalState({
			show: true,
			ModalContentComponent: (props) => (
				<CreateSprintModal {...props} refreshGrid={fetchDashboard} dashboardId={dashboard.id} />
			),
		});
	}, [dashboard, fetchDashboard]);

	const renderSprints = () =>
		useMemo(() => {
			if (isEmpty(dashboard.sprints)) {
				return 'No Sprints';
			}

			return dashboard.sprints.map((sprint: ISprint) => (
				<Sprint key={sprint.id} sprint={sprint} updateSprintInGrid={updateSprintInGrid} />
			));
		}, [dashboard, updateSprintInGrid]);

	const renderSidebar = () =>
		useMemo(
			() => (
				<Col sm="2" className="border border-bottom-0 border-top-0">
					<Row className="p-3">
						<Button size="lg" disabled={isLoading} onClick={openCreateSprintModal}>
							Create Sprint
						</Button>
					</Row>
				</Col>
			),
			[isLoading, openCreateSprintModal],
		);

	return (
		<Row style={{ height: calculateHeight() }}>
			{renderSidebar()}
			<Col sm="10" className="pb-5">
				<ToastContainer>{renderSprints()}</ToastContainer>
			</Col>
		</Row>
	);
};

export default SprintList;
