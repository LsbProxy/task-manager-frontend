import { Error, useNotification } from '../../common/context/NotificationContextProvider';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../Button';
import CreateDashboardModal from './CreateDashboardModal';
import Dashboard from './Dashboard';
import { RootState } from '../../app/store';
import Row from '../Row';
import Sidebar from '../Sidebar';
import { getUsers } from '../../features/userSlice';
import { isEmpty } from 'lodash';
import { listDashboards } from '../../features/dashboardSlice';
import { useLoader } from '../../common/context/LoaderContextProvider';
import { useModal } from '../../common/context/ModalContextProvider';

const DashboardList: FC = () => {
	const { dashboards, loading: dashboardsLoading } = useSelector(
		(state: RootState) => state.dashboards,
	);
	const { loading: usersLoading } = useSelector((state: RootState) => state.users);
	const { handleError } = useNotification();
	const { isLoading, showLoader } = useLoader();
	const { setState: setModalState } = useModal();
	const dispatch = useDispatch();

	const fetchData = useCallback(async () => {
		try {
			dispatch(getUsers());
			dispatch(listDashboards());
		} catch (e) {
			handleError(e as Error);
		}
	}, []);

	useEffect(() => {
		showLoader(usersLoading || dashboardsLoading);
	}, [usersLoading, dashboardsLoading]);

	useEffect(() => {
		fetchData();
	}, []);

	const openCreateDashboardModal = useCallback(() => {
		setModalState({
			show: true,
			ModalContentComponent: (props) => <CreateDashboardModal refreshGrid={fetchData} {...props} />,
		});
	}, [fetchData]);

	const renderDashboards = () =>
		useMemo(() => {
			if (isEmpty(dashboards)) {
				return 'No Dashboards';
			}

			return dashboards.map((dashboard) => (
				<Dashboard setModalState={setModalState} key={dashboard.id} dashboard={dashboard} />
			));
		}, [dashboards]);

	const renderSidebar = () =>
		useMemo(
			() => (
				<Sidebar>
					<Button size="lg" disabled={isLoading} onClick={openCreateDashboardModal}>
						Create Dashboard
					</Button>
				</Sidebar>
			),
			[isLoading],
		);

	return (
		<Row>
			{renderSidebar()}
			<Row align="flex-start" wrap="wrap" margin={{ bottom: 1 }}>
				{renderDashboards()}
			</Row>
		</Row>
	);
};

export default DashboardList;
