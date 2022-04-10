import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../Button';
import CreateSprintModal from './CreateSprintModal';
import { Sprint as ISprint } from '../../common/services/SprintService';
import { RootState } from '../../app/store';
import Row from '../Row';
import Sidebar from '../Sidebar';
import Sprint from './Sprint';
import { isEmpty } from 'lodash';
import { listSprints } from '../../features/sprintSlice';
import redirectToHomePage from '../../common/utils/redirectToHomePage';
import { useLoader } from '../../common/context/LoaderContextProvider';
import { useModal } from '../../common/context/ModalContextProvider';
import { useNotification } from '../../common/context/NotificationContextProvider';
import { useRouteMatch } from 'react-router-dom';

const SprintList: FC = () => {
	const { sprints, loading, error } = useSelector((state: RootState) => state.sprints);
	const { handleError } = useNotification();
	const { showLoader, isLoading } = useLoader();
	const { setState: setModalState } = useModal();
	const { params }: { params: { id: string } } = useRouteMatch();
	const dispatch = useDispatch();

	useEffect(() => {
		if (error) {
			handleError(error);
		}
	}, [error]);

	const fetchSprints = useCallback(async () => {
		if (!parseInt(params.id)) {
			return redirectToHomePage();
		}
		dispatch(listSprints(params.id));
	}, [params, sprints]);

	useEffect(() => {
		showLoader(loading);
	}, [loading]);

	useEffect(() => {
		fetchSprints();
	}, [params]);

	const openCreateSprintModal = useCallback(() => {
		setModalState({
			show: true,
			ModalContentComponent: (props) => (
				<CreateSprintModal {...props} refreshGrid={fetchSprints} dashboardId={params.id} />
			),
		});
	}, [params]);

	const renderSprints = () =>
		useMemo(() => {
			if (isEmpty(sprints)) {
				return 'No Sprints';
			}

			return sprints.map((sprint: ISprint) => (
				<Sprint setModalState={setModalState} key={sprint.id} sprint={sprint} />
			));
		}, [sprints]);

	const renderSidebar = () =>
		useMemo(
			() => (
				<Sidebar>
					<Button size="lg" disabled={isLoading} onClick={openCreateSprintModal}>
						Create Sprint
					</Button>
				</Sidebar>
			),
			[isLoading, openCreateSprintModal],
		);

	return (
		<Row>
			{renderSidebar()}
			<Row align="flex-start" wrap="wrap" margin={{ bottom: 1 }}>
				{renderSprints()}
			</Row>
		</Row>
	);
};

export default SprintList;
