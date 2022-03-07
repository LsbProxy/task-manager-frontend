import { Button, Col, Row, ToastContainer } from 'react-bootstrap';
import { Error, NotificationContext } from '../../common/context/NotificationContextProvider';
import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import dashboardService, { Dashboard as IDashboard } from '../../common/services/DashboardService';
import { filter, findIndex, get, isEmpty, trim } from 'lodash';

import CreateDashboardModal from './CreateDashboardModal';
import Dashboard from './Dashboard';
import { LoaderContext } from '../../common/context/LoaderContextProvider';
import { ModalContext } from '../../common/context/ModalContextProvider';

const calculateHeight = () => {
	const navHeight = get(document.querySelector('nav'), 'clientHeight', 0);

	return window.innerHeight - navHeight;
};

const DashboardList: FC = () => {
	const [dashboards, setDashboards] = useState<IDashboard[]>([]);
	const { handleError, addNotification } = useContext(NotificationContext);
	const { isLoading, showLoader } = useContext(LoaderContext);
	const { setState: setModalState } = useContext(ModalContext);

	const fetchDashboards = useCallback(async () => {
		try {
			showLoader(true);
			const dashboards = await dashboardService.listDashboards();
			setDashboards(dashboards);
		} catch (e) {
			handleError(e as Error);
		} finally {
			showLoader(false);
		}
	}, []);

	useEffect(() => {
		fetchDashboards();
	}, []);

	const updateDashboardInGrid = useCallback(
		(dashboard: IDashboard, removeFromGrid?: boolean) => {
			let newDashboards = [...dashboards];

			if (removeFromGrid) {
				newDashboards = filter(dashboards, ({ id }: IDashboard) => id !== dashboard.id);
			} else {
				const index = findIndex(dashboards, ({ id }: IDashboard) => id === dashboard.id);
				const updatedDashboard = dashboard;

				if (!trim(updatedDashboard.title)) {
					updatedDashboard.title = dashboards[index].title;
				}

				newDashboards[index] = updatedDashboard;
			}

			setDashboards(newDashboards);
		},
		[dashboards],
	);

	const openCreateDashboardModal = useCallback(() => {
		setModalState({
			show: true,
			ModalContentComponent: (props) => (
				<CreateDashboardModal
					refreshGrid={fetchDashboards}
					handleError={handleError}
					addNotification={addNotification}
					{...props}
				/>
			),
		});
	}, []);

	const renderDashboards = () =>
		useMemo(() => {
			if (isEmpty(dashboards)) {
				return 'No Dashboards';
			}

			return dashboards.map((dashboard) => (
				<Dashboard
					key={dashboard.id}
					dashboard={dashboard}
					updateDashboardInGrid={updateDashboardInGrid}
				/>
			));
		}, [dashboards, updateDashboardInGrid]);

	const renderSidebar = () =>
		useMemo(
			() => (
				<Col sm="2" className="border border-bottom-0 border-top-0">
					<Row className="p-3">
						<Button size="lg" disabled={isLoading} onClick={openCreateDashboardModal}>
							Create Dashboard
						</Button>
					</Row>
				</Col>
			),
			[isLoading],
		);

	return (
		<Row style={{ height: calculateHeight() }}>
			{renderSidebar()}
			<Col sm="10" className="pb-5">
				<ToastContainer>{renderDashboards()}</ToastContainer>
			</Col>
		</Row>
	);
};

export default DashboardList;
