import Button, { ButtonGroup } from '../Button';
import { Error, useNotification } from '../../common/context/NotificationContextProvider';
import React, { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import dashboardService, { Dashboard } from '../../common/services/DashboardService';
import { filter, map } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import Container from '../Container';
import Description from '../Description';
import Input from '../Input';
import Loader from '../Loader';
import { RootState } from '../../app/store';
import Row from '../Row';
import Select from '../Select';
import { User } from '../../common/services/AuthService';
import styled from 'styled-components';
import { updateDashboard } from '../../features/dashboardSlice';

const user: User = JSON.parse(window.localStorage.getItem('user') || '{}');

const SelectContainer = styled.div`
	width: 30%;
	@media (max-width: 768px) {
		width: 100%;
	}
`;

interface Props {
	dashboardId: string;
	hideModal: () => void;
}

const EditDashboardModal: FC<Props> = ({ dashboardId, hideModal }) => {
	const [dashboard, setDashboard] = useState<Dashboard>({
		id: '',
		title: '',
		description: '',
		members: [],
		createdDate: '',
		updatedDate: '',
		sprints: [],
	});
	const { users } = useSelector((state: RootState) => state.users);
	const [isLoading, showLoader] = useState(false);
	const { handleError, addNotification } = useNotification();
	const dispatch = useDispatch();

	const fetchData = useCallback(async () => {
		try {
			showLoader(true);
			const dashboard = await dashboardService.getDashboard(dashboardId);
			setDashboard(dashboard);
		} catch (e) {
			handleError(e as Error);
		} finally {
			showLoader(false);
		}
	}, [dashboardId]);

	useEffect(() => {
		fetchData();
	}, []);

	const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) =>
		setDashboard((currentDashboard) => ({ ...currentDashboard, [name]: value }));

	const handleDescriptionChange = ({ target: { name, value } }: ChangeEvent<HTMLTextAreaElement>) =>
		setDashboard((currentDashboard) => ({ ...currentDashboard, [name]: value }));

	const handleMembersChange = useCallback(
		(value: string) => {
			const { members } = dashboard;
			let newValue = [...members];

			if (members.indexOf(value) > -1 && value !== user.username) {
				newValue = filter(members, (member: string) => member !== value);
			} else {
				newValue.push(value);
			}

			setDashboard((currentDashboard) => ({ ...currentDashboard, members: newValue }));
		},
		[dashboard, user],
	);

	const handleSubmit = useCallback(async () => {
		try {
			showLoader(true);

			const updatedDashboard = await dashboardService.updateDashboard(dashboard);

			setDashboard(updatedDashboard);
			dispatch(updateDashboard({ dashboard }));
			hideModal();
			addNotification(`Successfully updated ${updatedDashboard.title}`);
		} catch (e) {
			handleError(e as Error);
		} finally {
			showLoader(false);
		}
	}, [dashboard]);

	return (
		<Container style={{ minHeight: '400px' }}>
			{isLoading ? (
				<Loader />
			) : (
				<>
					<Container>
						<Input
							type="text"
							placeholder="Title"
							name="title"
							value={dashboard.title}
							onChange={handleChange}
						/>
					</Container>

					<Container>
						<Description
							placeholder="Description"
							name="description"
							value={dashboard.description}
							onChange={handleDescriptionChange}
						/>
						<SelectContainer>
							<Select
								multiple
								name="members"
								value={dashboard.members}
								label="Members:"
								onChange={({ target: { value } }) => handleMembersChange(value)}
								options={map(users, ({ username: value }: User) => ({
									value,
									label: value,
								}))}
							/>
						</SelectContainer>
						<Row align="flex-end">
							<ButtonGroup gap="0.5rem">
								<Button variant="outline-primary" onClick={hideModal}>
									Cancel
								</Button>
								<Button onClick={handleSubmit}>Save</Button>
							</ButtonGroup>
						</Row>
					</Container>
				</>
			)}
		</Container>
	);
};

export default EditDashboardModal;
