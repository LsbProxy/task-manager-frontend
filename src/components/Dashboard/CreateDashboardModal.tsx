import { Error, useNotification } from '../../common/context/NotificationContextProvider';
import React, { ChangeEvent, FC, useCallback, useState } from 'react';
import dashboardService, { CreateDashboard } from '../../common/services/DashboardService';
import { filter, isEmpty, map } from 'lodash';

import Button from '../Button';
import Container from '../Container';
import Description from '../Description';
import ErrorAlertList from '../ErrorAlertList';
import Input from '../Input';
import Loader from '../Loader';
import { RootState } from '../../app/store';
import Row from '../Row';
import Select from '../Select';
import Text from '../Text';
import { User } from '../../common/services/AuthService';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const SelectContainer = styled.div`
	width: 30%;
	@media (max-width: 768px) {
		width: 100%;
	}
`;

interface Props {
	hideModal: () => void;
	refreshGrid: () => void;
}

const user: User = JSON.parse(window.localStorage.getItem('user') || '{}');

const CreateDashboardModal: FC<Props> = ({ hideModal, refreshGrid }) => {
	const [dashboard, setDashboard] = useState<CreateDashboard>({
		title: '',
		description: '',
		members: [user.username],
	});
	const { users } = useSelector((state: RootState) => state.users);
	const [errors, setErrors] = useState<string[]>([]);
	const [isSubmit, setIsSubmit] = useState(false);
	const [isLoading, showLoader] = useState(false);
	const { addNotification, handleError } = useNotification();

	const validateDashboard = useCallback(() => {
		const { title, members } = dashboard;
		const errors: string[] = [];

		if (!title) {
			errors.push('Title');
		}

		if (isEmpty(members)) {
			errors.push('Members');
		}

		setErrors(errors);

		if (!isSubmit) {
			setIsSubmit(true);
		}

		return isEmpty(errors);
	}, [dashboard, isSubmit]);

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

	const handleCreateDashboard = useCallback(async () => {
		if (!validateDashboard()) {
			return;
		}

		try {
			const { title, description, members } = dashboard;

			showLoader(true);

			await dashboardService.createDashboard({
				title,
				description,
				members,
			});

			addNotification(`Successfully created ${title}`);
			refreshGrid();
		} catch (e) {
			handleError(e as Error);
		} finally {
			showLoader(false);
			hideModal();
		}
	}, [dashboard]);

	const renderModalBody = useCallback(() => {
		const { title, description, members } = dashboard;

		return (
			<Container style={{ minHeight: '300px' }}>
				{isLoading ? (
					<Loader />
				) : (
					<form>
						<ErrorAlertList errors={errors} />
						<Input
							type="text"
							placeholder="Title"
							name="title"
							value={title}
							onChange={handleChange}
						/>
						<Description
							placeholder="Description"
							name="description"
							value={description}
							onChange={handleDescriptionChange}
						/>
						<SelectContainer>
							<Select
								multiple
								name="members"
								value={members}
								label="Members:"
								onChange={({ target: { value } }) => handleMembersChange(value)}
								options={map(users, ({ username: value }: User) => ({ value, label: value }))}
							/>
						</SelectContainer>
					</form>
				)}
			</Container>
		);
	}, [dashboard, isLoading, errors, users]);

	const renderModalFooter = useCallback(
		() => (
			<Row align="flex-end">
				<Button
					disabled={isSubmit && (!dashboard.title || isEmpty(dashboard.members))}
					onClick={handleCreateDashboard}
				>
					Create
				</Button>
			</Row>
		),
		[dashboard.title, dashboard.members, isSubmit],
	);

	return (
		<Container>
			<Text>
				<strong>Create Dashboard</strong>
			</Text>
			{renderModalBody()}
			{renderModalFooter()}
		</Container>
	);
};

export default CreateDashboardModal;
